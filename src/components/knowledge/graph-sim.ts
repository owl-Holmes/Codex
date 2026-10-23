/**
 * Tiny dependency-free force-directed layout + SVG renderer for the knowledge graph.
 * Client-side only; imported by KnowledgeGraph.astro. Respects prefers-reduced-motion
 * (layout is computed without animation).
 */
import type { GraphData } from '../../lib/graph';

interface SimNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Runs the force simulation for a fixed number of ticks; returns final positions. */
function layout(data: GraphData, width: number, height: number, ticks = 300): Map<string, SimNode> {
  const nodes = new Map<string, SimNode>(
    data.nodes.map((n, i) => {
      const angle = (i / data.nodes.length) * Math.PI * 2;
      return [n.id, { id: n.id, x: width / 2 + Math.cos(angle) * 120, y: height / 2 + Math.sin(angle) * 120, vx: 0, vy: 0 }];
    }),
  );
  const list = [...nodes.values()];
  for (let t = 0; t < ticks; t++) {
    const cooling = 1 - t / ticks;
    for (const a of list) {
      for (const b of list) {
        if (a === b) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = Math.max(dx * dx + dy * dy, 100);
        a.vx += (dx / d2) * 900;
        a.vy += (dy / d2) * 900;
      }
      // Gravity toward the center keeps isolated pages from drifting to the edges.
      a.vx += (width / 2 - a.x) * 0.04;
      a.vy += (height / 2 - a.y) * 0.04;
    }
    for (const e of data.edges) {
      const s = nodes.get(e.source);
      const g = nodes.get(e.target);
      if (!s || !g) continue;
      const strength = e.kind === 'tag' ? 0.01 : 0.04;
      const dx = (g.x - s.x) * strength;
      const dy = (g.y - s.y) * strength;
      s.vx += dx;
      s.vy += dy;
      g.vx -= dx;
      g.vy -= dy;
    }
    for (const n of list) {
      n.x = Math.min(width - 20, Math.max(20, n.x + n.vx * cooling));
      n.y = Math.min(height - 20, Math.max(20, n.y + n.vy * cooling));
      n.vx *= 0.5;
      n.vy *= 0.5;
    }
  }
  return nodes;
}

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, String(v)));
  return node;
}

/** Draws the graph into `svg`. Nodes are keyboard-focusable links; edges are styled by kind. */
export function renderGraph(svg: SVGSVGElement, data: GraphData): void {
  const { width, height } = svg.viewBox.baseVal;
  const pos = layout(data, width, height);
  const edges = el('g', { class: 'edges' });
  for (const e of data.edges) {
    const s = pos.get(e.source);
    const g = pos.get(e.target);
    if (s && g) edges.append(el('line', { x1: s.x, y1: s.y, x2: g.x, y2: g.y, class: `edge edge--${e.kind}` }));
  }
  const nodes = el('g', { class: 'nodes' });
  for (const n of data.nodes) {
    const p = pos.get(n.id)!;
    const link = el('a', { href: n.url, class: 'node', 'data-theme': n.theme });
    const title = el('title', {});
    title.textContent = `${n.title} — ${n.section}`;
    link.append(title, el('circle', { cx: p.x, cy: p.y, r: 9 }));
    const label = el('text', { x: p.x + 13, y: p.y + 4 });
    label.textContent = n.title;
    link.append(label);
    nodes.append(link);
  }
  svg.replaceChildren(edges, nodes);
}

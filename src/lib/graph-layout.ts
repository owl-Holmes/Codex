/**
 * Force-directed layout of the knowledge graph, run at build time (no browser cost).
 * Deterministic: nodes start on a circle, so the same data always gives the same picture.
 * Used by components/knowledge/GraphCanvas.astro.
 */
import type { GraphData } from './graph';

/** Position of a node inside the SVG viewBox. */
export interface Point {
  x: number;
  y: number;
}

/** Runs the simulation for `ticks` steps; returns rounded positions keyed by node id. */
export function layoutGraph(data: GraphData, width: number, height: number, ticks = 300): Map<string, Point> {
  const list = data.nodes.map((n, i) => {
    const angle = (i / Math.max(data.nodes.length, 1)) * Math.PI * 2;
    return { id: n.id, x: width / 2 + Math.cos(angle) * 120, y: height / 2 + Math.sin(angle) * 120, vx: 0, vy: 0 };
  });
  const byId = new Map(list.map((n) => [n.id, n]));
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
      const s = byId.get(e.source);
      const g = byId.get(e.target);
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
  return new Map(list.map((n) => [n.id, { x: Math.round(n.x * 10) / 10, y: Math.round(n.y * 10) / 10 }]));
}

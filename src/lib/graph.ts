/**
 * Knowledge graph data, computed at build time from FR pages:
 * nodes = pages, edges = frontmatter refs (strong) and shared tags (weak).
 * Consumed by the graph page (rendered client-side) and its accessible text list.
 */
import type { Locale } from '../config/site';
import { getPageMap, resolvePage } from './pages';
import { getTree, resolveTheme } from './tree';
import { pageUrl } from './urls';

export interface GraphNode {
  id: string;
  title: string;
  url: string;
  section: string;
  theme: string;
}
export interface GraphEdge {
  source: string;
  target: string;
  kind: 'prerequisite' | 'further' | 'related' | 'tag';
}
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/** Sub-graph of a page and its direct neighbors (depth 1), for the local graph on each page. */
export function neighborhood(data: GraphData, id: string): GraphData {
  const edges = data.edges.filter((e) => e.source === id || e.target === id);
  const keep = new Set([id, ...edges.flatMap((e) => [e.source, e.target])]);
  return { nodes: data.nodes.filter((n) => keep.has(n.id)), edges };
}

/** Builds nodes and deduplicated edges for a locale (titles translated when available). */
export async function getGraph(locale: Locale): Promise<GraphData> {
  const fr = [...(await getPageMap('fr')).values()].filter((p) => p.slug);
  const tree = await getTree(locale);
  const nodes = await Promise.all(
    fr.map(async (p): Promise<GraphNode> => {
      const shown = (await resolvePage(locale, p.slug))?.page ?? p;
      const top = p.slug.split('/')[0];
      return {
        id: p.slug,
        title: shown.entry.data.title,
        url: pageUrl(locale, p.slug),
        section: tree.children.find((c) => c.slug === top)?.title ?? top,
        theme: resolveTheme(tree, p.slug, p.entry.data.theme),
      };
    }),
  );
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  const add = (source: string, target: string, kind: GraphEdge['kind']) => {
    const key = [source, target].sort().join('|');
    if (source === target || seen.has(key)) return;
    seen.add(key);
    edges.push({ source, target, kind });
  };
  for (const p of fr) {
    p.entry.data.prerequisites.forEach((t) => add(t, p.slug, 'prerequisite'));
    p.entry.data.furtherReading.forEach((t) => add(p.slug, t, 'further'));
    p.entry.data.related.forEach((t) => add(p.slug, t, 'related'));
  }
  for (const a of fr) {
    for (const b of fr) {
      if (a.slug < b.slug && a.entry.data.tags.some((t) => b.entry.data.tags.includes(t))) add(a.slug, b.slug, 'tag');
    }
  }
  return { nodes, edges };
}

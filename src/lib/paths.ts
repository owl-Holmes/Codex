/**
 * Thematic paths: load them per locale (FR fallback), validate their steps,
 * and find the paths a page belongs to (for the in-page banner).
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../config/site';
import { getPageMap } from './pages';

export type PathEntry = CollectionEntry<'paths'>;
export interface ThematicPath {
  id: string;
  data: PathEntry['data'];
}

/** All paths for a locale; a missing translation falls back to the FR path. Throws on unknown step pages. */
export async function getPaths(locale: Locale): Promise<ThematicPath[]> {
  const all = await getCollection('paths');
  const idOf = (e: PathEntry) => e.id.split('/').slice(1).join('/');
  const byId = new Map(all.filter((e) => e.id.startsWith('fr/')).map((e) => [idOf(e), e]));
  all.filter((e) => e.id.startsWith(`${locale}/`)).forEach((e) => byId.set(idOf(e), e));
  const fr = await getPageMap('fr');
  for (const [id, e] of byId) {
    const unknown = e.data.steps.filter((s) => !fr.has(s.page)).map((s) => s.page);
    if (unknown.length) throw new Error(`Path "${id}": unknown step page(s): ${unknown.join(', ')}`);
  }
  return [...byId].map(([id, e]) => ({ id, data: e.data }));
}

/** Paths containing a page, with the page's position. */
export async function getPathsForPage(locale: Locale, slug: string) {
  return (await getPaths(locale)).flatMap((path) => {
    const index = path.data.steps.findIndex((s) => s.page === slug);
    return index < 0 ? [] : [{ path, index }];
  });
}

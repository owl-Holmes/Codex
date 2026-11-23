/**
 * Thematic paths: load them per locale (FR fallback), validate their steps,
 * and find the paths a page belongs to (for the in-page banner).
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../config/site';
import { localizedById } from './localized';
import { getPageMap, resolvePage } from './pages';
import { getTrail, getTree } from './tree';

/** Raw entry of the `paths` collection (`paths/<lang>/<id>.yml`). */
export type PathEntry = CollectionEntry<'paths'>;
/** A thematic path in a locale: its id (file name) and YAML data (title, description, steps). */
export interface ThematicPath {
  id: string;
  data: PathEntry['data'];
}

/** All paths for a locale; a missing translation falls back to the FR path. Throws on unknown step pages. */
export async function getPaths(locale: Locale): Promise<ThematicPath[]> {
  const byId = localizedById(await getCollection('paths'), locale);
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

/** A path step ready to display: page slug, page title, top-level section and optional note. */
export interface ResolvedStep {
  page: string;
  title: string;
  section?: string;
  note?: string;
}

/** Steps of a path with their page titles and top-level section names, in the locale (FR fallback). */
export async function resolveSteps(locale: Locale, path: ThematicPath): Promise<ResolvedStep[]> {
  const tree = await getTree(locale);
  return Promise.all(
    path.data.steps.map(async (s) => ({
      page: s.page,
      note: s.note,
      title: (await resolvePage(locale, s.page))?.page.entry.data.title ?? s.page,
      section: getTrail(tree, s.page)[0]?.title,
    })),
  );
}

/**
 * Tag index: groups pages across all categories by shared tag.
 * Tags are language-neutral (same tags in FR and EN frontmatter). Used by the tag routes and PageLayout.
 */
import { getPageMap, type Page } from './pages';

/** Normalizes a tag for URLs: lowercase kebab-case, accents removed. */
export function tagSlug(tag: string): string {
  return tag
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Map of tag slug → FR pages carrying that tag, sorted by tag. */
export async function getTagIndex(): Promise<Map<string, Page[]>> {
  const index = new Map<string, Page[]>();
  for (const page of (await getPageMap('fr')).values()) {
    for (const tag of page.entry.data.tags) {
      const key = tagSlug(tag);
      index.set(key, [...(index.get(key) ?? []), page]);
    }
  }
  return new Map([...index].sort(([a], [b]) => a.localeCompare(b)));
}

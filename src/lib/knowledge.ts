/**
 * Cross-category knowledge features computed at build time:
 * reference validation, backlinks and automatic related pages.
 */
import { getPageMap, type Page } from './pages';

const REF_FIELDS = ['prerequisites', 'furtherReading', 'related'] as const;

/** All slugs a page points to through its frontmatter refs. */
function outgoingRefs(page: Page): string[] {
  return REF_FIELDS.flatMap((field) => page.entry.data[field]);
}

/**
 * Throws if any frontmatter ref points to a page that does not exist in FR.
 * Called by the page route so a broken ref fails the build with a clear message.
 */
export async function assertRefsValid(): Promise<void> {
  const fr = await getPageMap('fr');
  const errors: string[] = [];
  for (const page of fr.values()) {
    for (const ref of outgoingRefs(page)) {
      if (!fr.has(ref)) errors.push(`"${page.slug}" → unknown ref "${ref}"`);
    }
  }
  if (errors.length) throw new Error(`Broken page references:\n  ${errors.join('\n  ')}`);
}

/** Pages whose frontmatter references the given slug. */
export async function getBacklinks(slug: string): Promise<string[]> {
  const fr = await getPageMap('fr');
  return [...fr.values()].filter((p) => outgoingRefs(p).includes(slug)).map((p) => p.slug);
}

export interface Related {
  slug: string;
  score: number;
  sharedTags: string[];
}

/**
 * Automatic related pages: shared tags weighted by rarity (rare tags count more),
 * plus manual `related` refs. Pages from other top-level sections get a discovery bonus.
 */
export async function getRelated(slug: string, limit = 5): Promise<Related[]> {
  const fr = [...(await getPageMap('fr')).values()];
  const current = fr.find((p) => p.slug === slug);
  if (!current) return [];
  const tagCount = new Map<string, number>();
  fr.forEach((p) => p.entry.data.tags.forEach((t) => tagCount.set(t, (tagCount.get(t) ?? 0) + 1)));
  const top = (s: string) => s.split('/')[0];
  return fr
    .filter((p) => p.slug !== slug && p.slug)
    .map((p) => {
      const sharedTags = p.entry.data.tags.filter((t) => current.entry.data.tags.includes(t));
      let score = sharedTags.reduce((sum, t) => sum + 1 / (tagCount.get(t) ?? 1), 0);
      if (current.entry.data.related.includes(p.slug)) score += 2;
      if (score > 0 && top(p.slug) !== top(slug)) score *= 1.5;
      return { slug: p.slug, score, sharedTags };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

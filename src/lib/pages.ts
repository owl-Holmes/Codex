/**
 * Page index: turns the `docs` collection into language-aware pages addressed by slug.
 * The FR tree is the reference; an EN page reuses the slug of its FR counterpart.
 * Used by routes, navigation and knowledge features.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { LOCALES, type Locale } from '../config/site';

export type DocEntry = CollectionEntry<'docs'>;

export interface Page {
  locale: Locale;
  /** Path relative to the language root, e.g. "sciences/chimie" ("" for none). */
  slug: string;
  entry: DocEntry;
}

/** Extracts locale and slug from a content file path (index files map to their folder). */
export function parseFilePath(filePath: string): { locale: Locale; slug: string } | null {
  const match = filePath.replace(/\\/g, '/').match(/docs\/([a-z]{2})\/(.+)\.mdx?$/);
  if (!match || !LOCALES.includes(match[1] as Locale)) return null;
  const slug = match[2].replace(/(^|\/)index$/, '');
  return { locale: match[1] as Locale, slug };
}

let cache: Page[] | undefined;

/** All pages of every locale. Drafts are excluded from production builds. */
export async function getAllPages(): Promise<Page[]> {
  if (cache) return cache;
  const entries = await getCollection('docs', (e) => import.meta.env.DEV || e.data.status !== 'draft');
  cache = entries.flatMap((entry) => {
    const parsed = entry.filePath ? parseFilePath(entry.filePath) : null;
    return parsed ? [{ ...parsed, entry }] : [];
  });
  return cache;
}

/** Pages of one locale, keyed by slug. */
export async function getPageMap(locale: Locale): Promise<Map<string, Page>> {
  const pages = await getAllPages();
  return new Map(pages.filter((p) => p.locale === locale).map((p) => [p.slug, p]));
}

/**
 * Page to display for a slug in a locale: the translation if it exists, else the FR source.
 * `fallback` is true when the FR source is shown in place of a missing translation.
 */
export async function resolvePage(
  locale: Locale,
  slug: string,
): Promise<{ page: Page; fallback: boolean } | undefined> {
  const own = (await getPageMap(locale)).get(slug);
  if (own) return { page: own, fallback: false };
  const source = (await getPageMap('fr')).get(slug);
  return source ? { page: source, fallback: locale !== 'fr' } : undefined;
}

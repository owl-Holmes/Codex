/**
 * Glossary terms for a locale (FR fallback), alphabetical. Used by the glossary page and the A–Z index.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../config/site';
import { isFallback, localizedById } from './localized';

/** A glossary term ready to display. */
export interface GlossaryTerm {
  /** Stable id = file name, also the anchor on the glossary page (`#id`). */
  id: string;
  entry: CollectionEntry<'glossary'>;
  /** True when the FR entry is shown because the locale has no translation. */
  fallback: boolean;
}

/** All glossary terms of a locale, sorted by term with the locale's collation. */
export async function getGlossary(locale: Locale): Promise<GlossaryTerm[]> {
  const byId = localizedById(await getCollection('glossary'), locale);
  return [...byId]
    .map(([id, entry]) => ({ id, entry, fallback: isFallback(entry, locale) }))
    .sort((a, b) => a.entry.data.term.localeCompare(b.entry.data.term, locale));
}

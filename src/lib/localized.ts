/**
 * FR-fallback merge for collections stored as `<lang>/<key>` (glossary terms, thematic paths):
 * every FR entry is available in every locale, replaced by its translation when one exists.
 * Pure functions, unit-tested in text.test.ts.
 */
import type { Locale } from '../config/site';

/** Key of a collection entry id without its locale folder: `'en/chromatographie'` → `'chromatographie'`. */
export function keyOf(entryId: string): string {
  return entryId.split('/').slice(1).join('/');
}

/** True when the entry is not written in `locale` (the FR source is shown instead). */
export function isFallback(entry: { id: string }, locale: Locale): boolean {
  return !entry.id.startsWith(`${locale}/`);
}

/**
 * Entries for a locale as `key → entry`: the FR entries first, then the locale's own entries
 * overriding them (or added, for a key that exists only in that locale).
 * @param entries All entries of the collection, every locale mixed.
 * @param locale Target locale.
 */
export function localizedById<T extends { id: string }>(entries: readonly T[], locale: Locale): Map<string, T> {
  const byKey = new Map(entries.filter((e) => e.id.startsWith('fr/')).map((e) => [keyOf(e.id), e]));
  for (const entry of entries) {
    if (entry.id.startsWith(`${locale}/`)) byKey.set(keyOf(entry.id), entry);
  }
  return byKey;
}

/**
 * Alphabetical grouping for index pages (A–Z index, glossary).
 * Pure functions, no content collections: unit-tested in text.test.ts.
 */

/** Leading articles skipped when picking the letter ("L’analyse" files under A, "The…" under the next word). */
const LEADING_ARTICLE = /^(l['’]|la |le |les |the )/i;

/** Letter used for labels that do not start with a Latin letter (digits, symbols). */
export const OTHER_LETTER = '#';

/**
 * First significant letter of a label: upper-case, accents removed, ligatures œ/æ expanded,
 * leading article skipped.
 * Returns {@link OTHER_LETTER} when the label does not start with a Latin letter.
 * @example firstLetter('L’analyse de traces') // 'A'
 * @example firstLetter('Énergie') // 'E'
 */
export function firstLetter(label: string): string {
  const letter = label
    .trim()
    .replace(LEADING_ARTICLE, '')
    .replace(/œ/gi, 'oe')
    .replace(/æ/gi, 'ae')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .charAt(0)
    .toUpperCase();
  return /^[A-Z]$/.test(letter) ? letter : OTHER_LETTER;
}

/**
 * Groups items by the first letter of their label.
 * Items are sorted with the locale's collation (case and accents ignored), letters A→Z,
 * and {@link OTHER_LETTER} comes last.
 * @param items Items to group (not mutated).
 * @param label Returns the text an item is sorted and grouped by.
 * @param locale BCP 47 locale used for sorting, e.g. 'fr'.
 * @returns Ordered `[letter, items]` pairs.
 */
export function groupByLetter<T>(items: readonly T[], label: (item: T) => string, locale: string): [string, T[]][] {
  const sorted = [...items].sort((a, b) => label(a).localeCompare(label(b), locale, { sensitivity: 'base' }));
  const groups = new Map<string, T[]>();
  for (const item of sorted) {
    const key = firstLetter(label(item));
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  const rank = (letter: string) => (letter === OTHER_LETTER ? '￿' : letter);
  return [...groups].sort(([a], [b]) => rank(a).localeCompare(rank(b)));
}

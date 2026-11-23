/**
 * Unit tests for the pure text / collection helpers: alphabetical grouping (alphabet.ts)
 * and the FR-fallback merge of per-locale collections (localized.ts).
 */
import { describe, expect, it } from 'vitest';
import { firstLetter, groupByLetter, OTHER_LETTER } from './alphabet';
import { isFallback, keyOf, localizedById } from './localized';

describe('firstLetter', () => {
  it('skips French and English leading articles', () => {
    expect(firstLetter('L’analyse de traces')).toBe('A');
    expect(firstLetter("l'atome")).toBe('A');
    expect(firstLetter('La chromatographie')).toBe('C');
    expect(firstLetter('Les isotopes')).toBe('I');
    expect(firstLetter('The method')).toBe('M');
  });
  it('removes accents, expands ligatures and upper-cases', () => {
    expect(firstLetter('énergie')).toBe('E');
    expect(firstLetter('Œil')).toBe('O');
    expect(firstLetter('æther')).toBe('A');
  });
  it('does not treat a word starting like an article as one', () => {
    expect(firstLetter('Lavoisier')).toBe('L');
    expect(firstLetter('Theorie')).toBe('T');
  });
  it('files digits, symbols and empty labels under the other letter', () => {
    expect(firstLetter('1910')).toBe(OTHER_LETTER);
    expect(firstLetter('')).toBe(OTHER_LETTER);
  });
});

describe('groupByLetter', () => {
  const label = (s: string) => s;
  it('groups, sorts within groups and orders letters A→Z with # last', () => {
    expect(groupByLetter(['Zinc', '42', 'azote', 'Acide', 'L’atome'], label, 'fr')).toEqual([
      ['A', ['Acide', 'azote', 'L’atome']],
      ['Z', ['Zinc']],
      [OTHER_LETTER, ['42']],
    ]);
  });
  it('does not mutate its input', () => {
    const items = ['b', 'a'];
    groupByLetter(items, label, 'fr');
    expect(items).toEqual(['b', 'a']);
  });
});

describe('localizedById', () => {
  const entries = [
    { id: 'fr/locard', v: 'fr' },
    { id: 'fr/chromatographie', v: 'fr' },
    { id: 'en/chromatographie', v: 'en' },
    { id: 'en/only-en', v: 'en' },
  ];
  it('falls back to FR and prefers the translation', () => {
    const en = localizedById(entries, 'en');
    expect(en.get('locard')?.v).toBe('fr');
    expect(en.get('chromatographie')?.v).toBe('en');
    expect(en.get('only-en')?.v).toBe('en');
  });
  it('ignores other locales', () => {
    expect([...localizedById(entries, 'fr').keys()]).toEqual(['locard', 'chromatographie']);
  });
  it('exposes key and fallback helpers', () => {
    expect(keyOf('en/sub/term')).toBe('sub/term');
    expect(isFallback({ id: 'fr/locard' }, 'en')).toBe(true);
    expect(isFallback({ id: 'en/locard' }, 'en')).toBe(false);
  });
});

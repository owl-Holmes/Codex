/**
 * Unit tests for the pure helpers of src/lib (no content collections needed).
 */
import { describe, expect, it } from 'vitest';
import { parseCsv, ticks } from './chart';
import { neighborhood, type GraphData } from './graph';
import { parseFilePath } from './pages';
import { tagSlug } from './tags';

describe('parseFilePath', () => {
  it('maps a page file to its locale and slug', () => {
    expect(parseFilePath('src/content/docs/fr/sciences/chimie/traces.mdx')).toEqual({
      locale: 'fr',
      slug: 'sciences/chimie/traces',
    });
  });
  it('maps index files to their folder', () => {
    expect(parseFilePath('src\\content\\docs\\en\\sciences\\index.md')).toEqual({ locale: 'en', slug: 'sciences' });
  });
  it('rejects unknown locales', () => {
    expect(parseFilePath('src/content/docs/de/x.mdx')).toBeNull();
  });
});

describe('tagSlug', () => {
  it('normalizes accents, case and spaces', () => {
    expect(tagSlug('Police Scientifique')).toBe('police-scientifique');
    expect(tagSlug('Énergie')).toBe('energie');
  });
});

describe('chart helpers', () => {
  it('parses CSV with numeric cells', () => {
    expect(parseCsv('a,b\nx,1\ny,2.5')).toEqual([
      { a: 'x', b: 1 },
      { a: 'y', b: 2.5 },
    ]);
  });
  it('produces nice ticks covering the maximum', () => {
    const t = ticks(93);
    expect(t[0]).toBe(0);
    expect(t[t.length - 1]).toBeGreaterThanOrEqual(93);
  });
});

describe('neighborhood', () => {
  const node = (id: string) => ({ id, title: id, url: `/${id}/`, section: '', theme: 'base' });
  const data: GraphData = {
    nodes: ['a', 'b', 'c', 'd'].map(node),
    edges: [
      { source: 'a', target: 'b', kind: 'related' },
      { source: 'c', target: 'd', kind: 'tag' },
    ],
  };
  it('keeps only the page and its direct neighbors', () => {
    const local = neighborhood(data, 'a');
    expect(local.nodes.map((n) => n.id)).toEqual(['a', 'b']);
    expect(local.edges).toHaveLength(1);
  });
});

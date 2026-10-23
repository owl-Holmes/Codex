// Remark plugin: links the FIRST occurrence of each glossary term (or alias) in a page to the
// glossary, by wrapping it in the <Term> MDX component. Opt-in per page: `autoGlossary: true`.
// Skips headings, links, code and existing components. Terms come from src/content/glossary/<lang>/.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const GLOSSARY = 'src/content/glossary';
const SKIP = new Set([
  'heading',
  'link',
  'linkReference',
  'inlineCode',
  'code',
  'mdxJsxTextElement',
  'mdxJsxFlowElement',
]);

/** Reads `term` and `aliases` of every glossary file of a language: [{ id, words[] }]. */
function loadTerms(lang) {
  const dir = join(GLOSSARY, lang);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const fm = readFileSync(join(dir, file), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
      const term = fm.match(/^term:\s*['"]?(.+?)['"]?\s*$/m)?.[1];
      const aliases =
        fm
          .match(/^aliases:\s*\[(.*)\]/m)?.[1]
          .split(',')
          .map((a) => a.trim().replace(/^['"]|['"]$/g, '')) ?? [];
      return { id: file.replace(/\.md$/, ''), words: [term, ...aliases].filter(Boolean) };
    });
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Replaces the first match of `re` in text nodes under `node` with a Term element. Returns true if done. */
function linkFirst(node, re, id) {
  if (SKIP.has(node.type) || !node.children) return false;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === 'text') {
      const m = re.exec(child.value);
      if (!m) continue;
      const before = { type: 'text', value: child.value.slice(0, m.index) };
      const after = { type: 'text', value: child.value.slice(m.index + m[0].length) };
      const term = {
        type: 'mdxJsxTextElement',
        name: 'Term',
        attributes: [{ type: 'mdxJsxAttribute', name: 'id', value: id }],
        children: [{ type: 'text', value: m[0] }],
      };
      node.children.splice(i, 1, before, term, after);
      return true;
    }
    if (linkFirst(child, re, id)) return true;
  }
  return false;
}

/** Collects ids already used by hand-written <Term id="…"> so they are not linked twice. */
function existingTerms(node, ids = new Set()) {
  if (node.type?.startsWith('mdxJsx') && node.name === 'Term') {
    const id = node.attributes?.find((a) => a.name === 'id')?.value;
    if (typeof id === 'string') ids.add(id);
  }
  node.children?.forEach((c) => existingTerms(c, ids));
  return ids;
}

export default function remarkGlossary() {
  const cache = new Map();
  return (tree, file) => {
    if (!file.data.astro?.frontmatter?.autoGlossary) return;
    const lang = String(file.path ?? file.history?.[0] ?? '')
      .replace(/\\/g, '/')
      .match(/docs\/([a-z]{2})\//)?.[1];
    if (!lang) return;
    if (!cache.has(lang)) cache.set(lang, loadTerms(lang));
    const used = existingTerms(tree);
    for (const { id, words } of cache.get(lang)) {
      if (used.has(id)) continue;
      const re = new RegExp(`(?<![\\p{L}])(${words.map(escape).join('|')})(?![\\p{L}])`, 'iu');
      linkFirst(tree, re, id);
    }
  };
}

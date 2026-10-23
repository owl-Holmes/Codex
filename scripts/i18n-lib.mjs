// Shared helpers for the i18n scripts: list content files and hash FR sources.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

export const DOCS = 'src/content/docs';

/** Recursively lists .md/.mdx files under a directory, as paths relative to it (forward slashes). */
export function listPages(dir) {
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.mdx?$/.test(e.name)) out.push(relative(dir, p).replace(/\\/g, '/'));
    }
  };
  walk(dir);
  return out.sort();
}

/** Short, line-ending independent hash of a file's content. */
export function hashFile(path) {
  const text = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
  return createHash('sha256').update(text).digest('hex').slice(0, 12);
}

/** Reads one frontmatter scalar (e.g. sourceHash) from a page. */
export function readField(path, field) {
  const fm = readFileSync(path, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return fm?.[1].match(new RegExp(`^${field}:\\s*(.+)$`, 'm'))?.[1].trim().replace(/^['"]|['"]$/g, '');
}

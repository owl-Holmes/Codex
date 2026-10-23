// Checks every internal link and asset reference (href/src) in the built site (dist/).
// External links are not checked (no network). Run after `npm run build`: npm run links
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
// Base path read from the single source of truth, src/config/site.ts.
const BASE = `${readFileSync('src/config/site.ts', 'utf8')
  .match(/base:\s*'([^']+)'/)[1]
  .replace(/\/$/, '')}/`;

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

/** All .html files under dist/. */
function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? htmlFiles(p) : e.name.endsWith('.html') ? [p] : [];
  });
}

/** True when a site path resolves to a built file (page folders resolve to index.html). */
function exists(pathname) {
  const rel = decodeURIComponent(pathname.slice(BASE.length));
  const target = join(DIST, rel);
  return existsSync(target) && !rel.endsWith('/') ? true : existsSync(join(target, 'index.html'));
}

const broken = [];
let checked = 0;
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="([^"#?]+)[^"]*"/g)) {
    if (!url.startsWith('/')) continue; // external, mailto:, relative data URIs
    checked++;
    if (!url.startsWith(BASE)) broken.push(`${relative(DIST, file)}: missing base path → ${url}`);
    else if (!exists(url)) broken.push(`${relative(DIST, file)}: not found → ${url}`);
  }
}

if (broken.length) {
  console.error(`✗ ${broken.length} broken internal link(s):\n  ${[...new Set(broken)].join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ ${checked} internal links checked, none broken.`);

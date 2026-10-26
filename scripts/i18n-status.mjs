// Reports EN translations that are missing, outdated (FR changed since translation) or orphaned.
// Usage: npm run i18n:status [-- --strict]   (--strict exits with code 1 when anything is reported)
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { DOCS, hashFile, listPages, readField } from './i18n-lib.mjs';

const fr = listPages(join(DOCS, 'fr'));
const en = new Set(listPages(join(DOCS, 'en')));
const missing = [];
const outdated = [];

// Drafts are never published, so they are not reported as missing translations.
for (const page of fr.filter((p) => readField(join(DOCS, 'fr', p), 'status') !== 'draft')) {
  if (!en.has(page)) {
    missing.push(page);
    continue;
  }
  const current = hashFile(join(DOCS, 'fr', page));
  if (readField(join(DOCS, 'en', page), 'sourceHash') !== current) outdated.push(page);
}
const orphans = [...en].filter((p) => !existsSync(join(DOCS, 'fr', p)));

const report = (label, list) => {
  console.log(`\n${label} (${list.length})`);
  list.forEach((p) => console.log(`  - ${p}`));
};
console.log(`i18n status — ${fr.length} FR pages, ${en.size} EN pages`);
report('Missing EN translations', missing);
report('Outdated EN translations (FR changed)', outdated);
report('Orphan EN pages (no FR source)', orphans);

if (process.argv.includes('--strict') && missing.length + outdated.length + orphans.length) process.exit(1);

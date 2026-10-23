// Marks an EN page as up to date with its FR source by writing the current `sourceHash`.
// Usage: npm run i18n:stamp -- sciences/chimie/chimie-analytique/chromatographie.mdx
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DOCS, hashFile } from './i18n-lib.mjs';

const page = process.argv[2];
if (!page) {
  console.error('Usage: npm run i18n:stamp -- <path relative to src/content/docs/en>');
  process.exit(1);
}
const enPath = join(DOCS, 'en', page);
const hash = hashFile(join(DOCS, 'fr', page));
const text = readFileSync(enPath, 'utf8');
const stamped = /^sourceHash:.*$/m.test(text)
  ? text.replace(/^sourceHash:.*$/m, `sourceHash: "${hash}"`)
  : text.replace(/^---\r?\n/, `---\nsourceHash: "${hash}"\n`);
writeFileSync(enPath, stamped);
console.log(`Stamped ${page} with sourceHash ${hash}`);

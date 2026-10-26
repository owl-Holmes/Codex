// Scaffolds a new section (folder) with its section.yml and the matching media folder.
// Usage: npm run new:section -- sciences/physique "Physique" "Physics"
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [slug, titleFr, titleEn] = process.argv.slice(2);
if (!slug || !/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(slug) || !titleFr) {
  console.error('Usage: npm run new:section -- <path/in-kebab-case> "Titre FR" ["Title EN"]');
  process.exit(1);
}
const dir = join('src/content/docs/fr', slug);
const file = join(dir, 'section.yml');
if (existsSync(file)) {
  console.error(`Already exists: ${file}`);
  process.exit(1);
}
const quote = (s) => JSON.stringify(s);
const yaml = `title: { fr: ${quote(titleFr)}, en: ${quote(titleEn ?? titleFr)} }
description: { fr: "TODO", en: "TODO" }
order: 100
# theme: alchemy   # optional: inherited by every page of this section
`;
mkdirSync(dir, { recursive: true });
mkdirSync(join('src/assets/images', slug), { recursive: true });
writeFileSync(file, yaml);
console.log(`Created ${file}. Add pages with: npm run new:page -- ${slug}/<page>`);

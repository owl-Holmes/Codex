// Scaffolds a new FR page (draft) with the full frontmatter template.
// Usage: npm run new:page -- sciences/physique/optique   → src/content/docs/fr/sciences/physique/optique.mdx
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(slug)) {
  console.error('Usage: npm run new:page -- <path/in-kebab-case>  (lowercase, no accents)');
  process.exit(1);
}
const file = join('src/content/docs/fr', `${slug}.mdx`);
if (existsSync(file)) {
  console.error(`Already exists: ${file}`);
  process.exit(1);
}
const today = new Date().toISOString().slice(0, 10);
const template = `---
title: TODO
description: TODO — une phrase de résumé (200 caractères max).
status: draft
created: ${today}
tags: []
prerequisites: []
furtherReading: []
related: []
sources: []
---

Introduction…

## Première partie
`;
mkdirSync(dirname(file), { recursive: true });
mkdirSync(join('src/assets/images', dirname(slug)), { recursive: true });
writeFileSync(file, template);
console.log(`Created ${file} (status: draft). Images go in src/assets/images/${dirname(slug)}/`);

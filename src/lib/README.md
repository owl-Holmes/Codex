# src/lib

Pure TypeScript logic, no markup. One module per domain:
- `pages.ts` — index of pages per locale, FR fallback for missing translations
- `tree.ts` — navigation tree (unlimited depth), breadcrumbs, theme inheritance
- `knowledge.ts` — ref validation, backlinks, automatic related pages
- `tags.ts` — tag index across categories
- `graph.ts` — knowledge graph nodes/edges (refs + shared tags)
- `paths.ts` — thematic paths, step validation, page membership
- `urls.ts` — base-path-aware URLs (always use these for internal links)

# src/lib

Pure TypeScript logic, no markup. One module per domain:
- `pages.ts` — index of pages per locale, FR fallback for missing translations
- `tree.ts` — navigation tree (unlimited depth), breadcrumbs, theme inheritance
- `knowledge.ts` — ref validation, backlinks, automatic related pages
- `urls.ts` — base-path-aware URLs (always use these for internal links)

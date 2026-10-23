# src/components

- `content/` — components usable in MDX (registered in `content/index.ts`, documented in docs/COMPONENTS.md)
- `knowledge/` — blocks built from page relations (lists, child cards, sources)
- `navigation/` — sidebar tree, breadcrumbs
- `layout/` — header and its tools

Rules: typed Props, header comment, tokens-only styles, no hardcoded UI text (use `useT`).

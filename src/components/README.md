# src/components

- `content/` — components usable in MDX (registered in `content/index.ts`, documented in docs/COMPONENTS.md)
- `knowledge/` — blocks built from page relations (lists, child cards, sources, path banner, knowledge graph)
- `navigation/` — sidebar tree, breadcrumbs
- `layout/` — header, mode toggle, Ctrl+K command palette

Rules: typed Props, header comment, tokens-only styles, no hardcoded UI text (use `useT`).

# src/components

- `content/` — components usable in MDX (registered in `content/index.ts`, documented in docs/COMPONENTS.md)
- `knowledge/` — blocks built from page relations (lists, child cards, sources, path banner, knowledge graph),
  index-page pieces (`LetterNav`, `LetterPanel`, `GlossarySheet`) and thematic paths (`PathCard`, `StepProgress`)
- `navigation/` — sidebar tree, breadcrumbs, table of contents, random page
- `home/` — home page blocks (recent pages, path cards)
- `layout/` — header, mode toggle, Ctrl+K command palette, link hover previews

Rules: typed Props, header comment, tokens-only styles, no hardcoded UI text (use `useT`).
Shared visual patterns live in `src/styles/components.css`; visual conventions in docs/STYLE.md.
Links inside an element with `data-no-preview` get no hover preview (use it on cards that already
show the title and description).

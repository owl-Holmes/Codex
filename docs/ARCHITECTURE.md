# Architecture

Codex is a fully static site: everything is computed at build time from files in `src/content/`,
then served by GitHub Pages. There is no server and no database.

## Build pipeline

```
src/content/**  ──► Content Collections (Zod validation) ──► src/lib (index, tree, relations)
                                                              │
src/pages/** routes ◄──────────────────────────────────────────┘
      │
      ▼
astro build ──► dist/ (HTML, optimized images, JSON indexes) ──► pagefind ──► dist/pagefind/
      │
      ▼
GitHub Actions (validate, build, links) ──► GitHub Pages
```

## Data flow

1. **Collections** (`src/content.config.ts`): `docs` (pages), `sections` (folder metadata), `glossary`, `paths`.
2. **`lib/pages.ts`** turns entries into `{ locale, slug, entry }` and resolves FR fallbacks.
3. **`lib/tree.ts`** builds the navigation tree from FR folders + `section.yml`, and resolves inherited themes.
4. **`lib/knowledge.ts`, `tags.ts`, `graph.ts`, `paths.ts`** compute relations (refs, backlinks, related
   pages, tags, graph, thematic paths). Broken references throw at build time.
5. **Routes** in `src/pages/` render layouts with that data; MDX bodies get components from
   `components/content/index.ts`.

## Client-side JavaScript (only where needed)

| Feature | File | Loaded |
|---|---|---|
| Light/dark bootstrap | `BaseLayout.astro` (inline) | every page, tiny |
| Mode toggle, palette, link previews | `components/layout/*` | every page, small |
| Search UI | `pages/[lang]/search.astro` | search page |
| Graph hover tooltip | `components/knowledge/graph-hover.ts` (layout is computed at build: `lib/graph-layout.ts`) | pages with a graph |
| Tabs, quiz, gallery, video facade, TOC scroll-spy | their components | only pages using them |
| Mermaid, Lottie | lazy `import()` | only pages using them |
| Service worker | `pages/sw.js.ts` | production only |

## Generated files

`/<lang>/previews.json` (link previews, random page), `manifest.webmanifest`, `sw.js`, `404.html`,
`sitemap-index.xml`, `pagefind/`.

See also: [THEMES.md](THEMES.md), [I18N.md](I18N.md), [COMPONENTS.md](COMPONENTS.md), [DEPENDENCIES.md](DEPENDENCIES.md).

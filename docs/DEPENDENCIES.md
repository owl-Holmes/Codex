# Dependencies

Every dependency is pinned to an exact version. Add one only when it is clearly needed, and add a line here.

## Runtime / build

| Package | Why |
|---|---|
| `astro` | Static site framework (routing, content collections, image optimization). |
| `@astrojs/mdx` | MDX pages: Markdown with components. |
| `@astrojs/markdown-remark` | remark/rehype pipeline needed for the math and glossary plugins. |
| `@astrojs/sitemap` | Generates `sitemap-index.xml` for search engines. |
| `remark-math` + `rehype-katex` + `katex` | LaTeX math rendered to HTML at build time. |
| `mermaid` | Text-defined diagrams; lazy-loaded only on pages using `<Mermaid>`. |
| `@fontsource/cinzel`, `@fontsource-variable/fraunces`, `@fontsource-variable/literata`, `@fontsource-variable/inter`, `@fontsource/courier-prime` | Self-hosted fonts, bundled at build — no external font request. |
| `lottie-web` | Lottie animations; light player lazy-loaded only on pages using `<Lottie>`. |

## Development

| Package | Why |
|---|---|
| `pagefind` | Static full-text search index, built after `astro build`. |
| `@astrojs/check` + `typescript` | Type checking of `.astro` and `.ts` files (`npm run check`). |
| `eslint` + `@eslint/js` + `typescript-eslint` + `eslint-plugin-astro` | Linting (`npm run lint`). |
| `prettier` + `prettier-plugin-astro` | Code formatting (`npm run format`). Content files are excluded. |
| `vitest` | Unit tests of `src/lib` (`npm run test`). |

## Written in-house on purpose (no dependency)

Knowledge graph layout (`graph-sim.ts`), charts (`Chart.astro`), service worker (`sw.js.ts`),
link checker, contrast checker, leak audit, i18n scripts.

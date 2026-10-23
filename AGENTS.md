# AGENTS.md — rules for AI agents working on Codex

Codex is a static personal encyclopedia (FR source, EN translation) deployed on GitHub Pages.
Read this whole file before any change. These rules are mandatory.

## 1. Stack

| Concern | Choice |
|---|---|
| Framework | Astro 7 (static output), MDX, TypeScript strict |
| Content | Content Collections + Zod schemas (`src/content.config.ts`) |
| Styling | Plain CSS, design tokens, cascade layers — no Tailwind |
| Search | Pagefind (index built after `astro build`) |
| CMS | Pages CMS (`.pages.yml`) |
| Hosting | GitHub Pages via GitHub Actions, base path `/Codex` |
| Quality | ESLint, Prettier, Vitest (`src/**/*.test.ts`), contrast + link + leak scripts |
| Runtime | Node 24 (`.nvmrc`), npm with committed lockfile |

## 2. Architecture map

```
src/
  config/site.ts          Site URL, base path, repo, locales — the ONLY place for these
  content.config.ts       Collections + frontmatter schemas (source of truth for metadata)
  content/docs/fr/**      FR pages, unlimited depth. index.mdx = folder page. section.yml = folder metadata
  content/docs/en/**      EN translations, SAME relative paths as FR
  content/glossary/{fr,en} Glossary terms (file name = term id)
  content/paths/{fr,en}   Thematic paths (YAML: title, description, ordered steps)
  assets/images/<section>/ Central media folder (mirrors the content tree)
  components/content/     MDX components, auto-registered in components/content/index.ts
  components/knowledge/   Page lists, child cards, sources
  components/navigation/  Sidebar tree, breadcrumbs
  components/layout/      Header, mode toggle
  layouts/                BaseLayout (shell), PageLayout (content pages)
  lib/                    Pure logic: pages, tree (nav + themes), knowledge (refs, related), tags, graph, paths, urls
  i18n/ui.ts              ALL interface strings, FR + EN (typed)
  styles/                 tokens.css (design tokens), global.css (base + layout)
  themes/                 One CSS file per theme, registered in themes.css
  pages/                  Routes: index (redirect), [lang]/index, [lang]/[...slug], [lang]/search, [lang]/tags, [lang]/glossary, [lang]/graph, [lang]/paths, [lang]/a-z, [lang]/previews.json, manifest.webmanifest, sw.js
scripts/                  i18n-status, i18n-stamp, new-page, audit-leaks, check-links, check-contrast
src/plugins/              remark-glossary.mjs (automatic glossary links, opt-in per page)
.github/workflows/        deploy.yml (main → Pages), ci.yml (pull requests)
```

## 3. Zones

- ✅ **Free to edit:** `src/content/**`, `src/assets/**`, `src/themes/*.css` (tokens only), `src/i18n/ui.ts` (add keys to BOTH languages).
- ⚠️ **Edit with care, then run the full checklist (§8):** `src/components/**`, `src/layouts/**`, `src/lib/**`, `src/pages/**`, `src/content.config.ts`, `src/styles/**`, `scripts/**`.
- ⛔ **Do not modify unless the owner explicitly asks:** `.github/workflows/**`, `astro.config.mjs`, `src/config/site.ts` (base path / URL), `.pages.yml` structure, `package-lock.json` (only via `npm install`), `.gitignore` rules (adding is OK), this file's rules.

## 4. Recipes

**Add a page:** `npm run new:page -- section/sub/slug` → edit the created `.mdx` → set `status` when ready.
Slugs: lowercase ASCII kebab-case, no accents (`chimie-analytique`), accents stay in titles.

**Add a section (folder):** create `src/content/docs/fr/<path>/section.yml`:
```yaml
title: { fr: Physique, en: Physics }
description: { fr: "…", en: "…" }
order: 20          # position among siblings
theme: alchemy     # optional, inherited by all descendants
```
A folder without `index.mdx` gets an auto-generated index (cards of its children).

**Move / rename a page:** move the FR file AND its EN mirror, then update every ref to the old path
(`grep -r "old/path" src/content`). The build fails on any broken ref.

**Add an image or SVG:** put it in `src/assets/images/<section>/`, then in MDX:
`<Figure src="<section>/file.svg" alt="What the image shows" caption="…" credit="…" />`.
`alt` is mandatory (use `decorative` only for purely decorative images).

**Add a glossary term:** `src/content/glossary/fr/<id>.md` (+ `en/<id>.md`) with `term`, `definition`;
use it in MDX with `<Term id="<id>">word</Term>`.

**Add a thematic path:** `src/content/paths/fr/<id>.yml` (+ `en/<id>.yml`):
```yaml
title: De la trace à la preuve
description: …
steps:
  - page: histoire/naissance-police-scientifique
    note: Optional short note.
  - page: enquete/analyse-de-traces
```
At least 2 steps; unknown pages fail the build. Pages in a path automatically show a step banner.

**Create a theme:** `src/themes/<name>.css` overriding tokens under `[data-theme='<name>']` AND
`:root[data-mode='dark'] [data-theme='<name>']`; import it in `src/themes/themes.css`; keep WCAG AA
contrast (≥ 4.5:1 for text) — `npm run contrast` checks it. Apply with `theme: <name>` in a `section.yml` or page frontmatter.

**Add an MDX component:** create `src/components/content/<Name>.astro` (header comment, typed Props,
tokens-only styles, a stable class name for overrides), register it in `src/components/content/index.ts`,
document it in `docs/COMPONENTS.md`. MDX files need no import lines.

**Translate a page FR → EN:**
1. Create/overwrite `src/content/docs/en/<same path>.mdx`.
2. Copy the FR frontmatter; translate only `title`, `description`, source `note`s. Keep `tags`, refs,
   dates, `status`, `theme` identical. Add `translationOf: <slug>`.
3. Translate the body and every `alt`/`caption`. Never translate slugs, refs, component names, props
   other than human text, or code.
4. Run `npm run i18n:stamp -- <path>.mdx` to record the FR source hash.
5. `npm run i18n:status` must no longer list the page.

**Fix an outdated translation:** `npm run i18n:status` → diff the FR file (`git log -p`) → update the EN
page → `npm run i18n:stamp -- <path>.mdx`.

## 5. Content rules

- Frontmatter fields and types: see `src/content.config.ts`. `title`, `description` (≤ 200 chars), `created` are required.
- `prerequisites` = needed to understand the page; `furtherReading` = helps go further; `related` = manual cross-links.
  Refs are paths relative to the language root (`sciences/chimie`), validated at build.
- Factual claims need `sources`. **Never invent a source**, an author, a date or a URL.
- French typography: non-breaking space before `: ; ! ?`, French quotes « ».
- Sample pages are examples; the owner may delete them (fix refs afterwards).

## 6. Editorial tone

A balance of **pedagogical** and **encyclopedic**:
- Do: start from intuition, then precise definitions; one idea per paragraph; concrete examples; neutral, factual wording; define jargon at first use (or `<Term>`).
- Don't: opinions, hype, filler, unexplained jargon, walls of text, unsourced figures.

> *Example:* « La chromatographie sépare les constituants d'un mélange. Imaginez une course où chaque
> coureur avance à sa vitesse : à l'arrivée, ils sont séparés. Formellement, chaque espèce se partage
> entre une phase mobile et une phase stationnaire… »

## 7. Code rules

1. Files < 200 lines, **hard limit 300**. Split by responsibility.
2. No duplication: shared logic in `src/lib`, shared UI in `src/components`, shared styles in tokens.
3. Every file starts with a header comment (purpose, users); every exported symbol has JSDoc.
4. No hardcoded UI strings (use `useT`), colors (use tokens), or URLs (use `pageUrl`/`withBase`).
5. TypeScript strict, no `any`. Zero JS by default; client JS only for real interactivity, wrapped in try/catch around storage.
6. Accessibility WCAG 2.2 AA: semantic HTML, keyboard access, visible focus, `alt` texts, `lang` attributes, reduced motion respected.
7. Naming: `kebab-case` files/folders, `PascalCase.astro` components.

## 8. Verification checklist (run before finishing ANY task, report results honestly)

```bash
npm run validate      # types, ESLint, Prettier check, Vitest, theme contrast, leak audit
npm run format        # auto-format code (content files are never reformatted)
npm run build         # site + Pagefind index
npm run links         # internal links in dist/
npm run i18n:status   # translation report
```

## 9. Privacy & secrets

- Never commit personal data (real names, personal emails, phone, address), absolute local paths, API keys, tokens, `.env` files.
- Never commit build output (`dist/`), `node_modules/`, caches — see `.gitignore`.
- `npm run audit:leaks` must pass before every commit.
- Commit authorship uses the owner's GitHub noreply email only.

## 10. Common pitfalls

- Links without the base path → always `pageUrl(locale, slug)`.
- Renaming a page without updating refs → build failure.
- Numeric-looking YAML values (hashes) must be quoted.
- JSX in Astro frontmatter (`---` block) is not allowed: build markup in the template.
- The Pagefind index exists only after `npm run build` (search is empty in `npm run dev`).
- The service worker (offline mode) only registers in production builds; after changing caching rules, bump `CACHE_VERSION` in `src/pages/sw.js.ts`.

## 11. Not built yet (planned, see PROMPT.md)

Audio component, page-specific `styles` frontmatter field, git-based `updated` dates,
Lighthouse audit in CI.

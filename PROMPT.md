# Build prompt — Codex knowledge site (base skeleton)

> Give this whole file to a coding agent. It describes the complete base skeleton to build.
> The site owner writes content in French only and is not necessarily a developer:
> everything must be easy to edit, and the structure must be self-explanatory.

---

## 0. Mission

Build the **base skeleton** of "Codex", a static personal encyclopedia website about *any* subject
(sciences, history, investigation techniques, arts, etc.), deployed on **GitHub Pages**.

The skeleton must be production-quality, fully working, and **demonstrate every feature with sample
content**, so the owner can copy existing examples to create new pages.

You are done only when every item of the **Definition of Done** (section 14) passes.

---

## 1. Hard constraints

- **Static site only.** No server, no database, no external paid service.
- **No API keys, no secrets, no third-party accounts** required for build, deploy, or any feature.
  (The only login involved is the owner's own GitHub account for Pages CMS.)
- **Hosting:** GitHub Pages, deployed by **GitHub Actions** on every push to `main`.
- **URL:** `https://<github-user>.github.io/Codex/` → the site lives under a **base path** (`/Codex`).
  Every internal link and asset URL must respect the base path. Never hardcode `/` root links.
  `site` and `base` are defined in **one single place**.
- **Public repository, single editor:** the repo is public; only the owner can write.
  Nothing in the code may assume other contributors.
- **Desktop-first** responsive design (must still be fully usable on mobile and tablet).
- **Accessibility: WCAG 2.2 level AA.**
- **Languages:** French (`fr`, default, source of truth) and English (`en`). The owner writes FR only;
  EN is produced later by AI agents (see section 7).
- **No analytics for now** (see section 9 for the reserved extension point).
- **Privacy & secrets (zero leaks):**
  - Nothing personal about the owner may appear in the repo: no real name, personal email, phone,
    address, or local machine paths (e.g. `C:\Users\...`, `/home/...`). Use relative paths everywhere.
  - No API keys, tokens, passwords, `.env` files, or credentials committed — ever.
  - A thorough `.gitignore` (dependencies, build output, caches, `.astro/`, Pagefind output, env files,
    OS/editor junk, logs, local tool settings) so files that shouldn't be committed never are.
  - Add a `npm run audit:leaks` script that scans tracked files for absolute local paths, email
    addresses (other than GitHub noreply), and common secret patterns; CI runs it.

---

## 2. Tech stack (decided — do not substitute without a strong documented reason)

| Concern | Choice |
|---|---|
| Framework | **Astro** (latest stable major, pinned exact versions), static output |
| Content | **MDX** + Markdown via Astro **Content Collections** with strict **Zod** schemas |
| Language | **TypeScript** in strict mode for all logic |
| Styling | Plain modern **CSS** with custom properties (design tokens), CSS cascade layers; no Tailwind |
| Interactivity | Astro islands; plain TS web components / small scripts by default. Add a UI framework only if strictly necessary |
| Search | **Pagefind** (static, offline, with filters) |
| Math | `remark-math` + `rehype-katex` (rendered at build time) |
| Diagrams | **Mermaid** (lazy-loaded on pages that use it, themed to the active theme, source kept as accessible fallback) |
| Charts | One lightweight charting library, lazy-loaded, data from CSV/JSON files |
| Lottie | `lottie-web` (or lighter equivalent), lazy-loaded |
| Graph view | Lightweight force-graph library, lazy-loaded only where the graph is displayed |
| PWA / offline | `@vite-pwa/astro` (or equivalent) |
| CMS | **Pages CMS** (`.pages.yml` at repo root) |
| Quality | ESLint, Prettier, `astro check`, **Vitest** for logic in `src/lib` |
| Runtime | Current **Node LTS**, pinned in `.nvmrc` and `package.json#engines`; `npm` with committed lockfile |

**Dependency policy:** minimal dependencies. Each runtime dependency must be justified by one line in
`docs/DEPENDENCIES.md`. Heavy libraries (Mermaid, charts, Lottie, graph) must **never** load on pages
that don't use them.

---

## 3. Code quality rules (mandatory)

1. **Small files.** Target < 200 lines per file. **Hard limit: 300 lines** (data/content files excepted).
   If a file grows, split it by responsibility.
2. **No duplication (DRY).** Shared logic lives in `src/lib/`, shared UI in `src/components/`,
   shared styles in tokens/utilities. Never copy-paste a block twice: extract it.
3. **Single responsibility.** One component = one job. One `lib` module = one domain
   (tree, graph, i18n, links, glossary…).
4. **Everything documented:**
   - Every file starts with a short header comment: purpose, and who uses it.
   - Every exported function/type/component has JSDoc/TSDoc (params, return, example when useful).
   - Each top-level folder in `src/` has a short `README.md` explaining what goes there.
   - Non-obvious decisions are explained in comments (*why*, not *what*).
5. **Configuration over code.** Anything the owner might change (site name, nav, themes, section
   order, labels, UI strings) lives in config/data files, not inside components.
6. **Strict typing.** No `any`. Content schemas are the single source of truth for page metadata types.
7. **Performance:** zero JS by default; ship JS only for interactive islands; images optimized with
   `astro:assets` (responsive sizes, modern formats, lazy-loading, explicit dimensions); fonts
   self-hosted, subset, `font-display: swap`.
8. **Progressive enhancement:** all text content readable without JavaScript.
9. **Naming:** files/folders in `kebab-case`; components in `PascalCase.astro`; content slugs in
   lowercase ASCII `kebab-case` (French accents removed from slugs, kept in titles).
10. **UI strings are never hardcoded** in components: they come from `src/i18n/ui/{fr,en}.ts`.

---

## 4. Project architecture

Propose and implement a clear structure close to this (adjust if you can justify a better one):

```
/
├─ AGENTS.md                  # Rules for AI agents (see section 13)
├─ README.md                  # Short human guide: run, edit, deploy, repo settings
├─ PROMPT.md                  # This file
├─ .pages.yml                 # Pages CMS configuration
├─ .github/workflows/         # deploy.yml (build+deploy), ci.yml (checks on PR/push)
├─ astro.config.mjs           # Thin: imports integrations/plugins from src/config & src/plugins
├─ docs/                      # Developer docs: architecture, components catalog, themes, i18n, dependencies
├─ public/                    # Static files copied as-is (favicon, robots.txt, manifest icons)
├─ scripts/                   # Node/TS maintenance scripts (new page, i18n status, link check…)
└─ src/
   ├─ config/                 # site.ts (name, base, locales), navigation, feature flags
   ├─ content/
   │  ├─ docs/fr/…            # FR pages — unlimited folder depth (source of truth)
   │  ├─ docs/en/…            # EN mirror (same relative paths)
   │  ├─ glossary/{fr,en}/    # Glossary terms
   │  ├─ paths/{fr,en}/       # Thematic learning paths
   │  └─ tags/                # Optional tag descriptions
   ├─ content.config.ts       # Collections + Zod schemas
   ├─ assets/                 # CENTRAL media folder, mirrors the content tree
   │  ├─ images/<section>/…   # raster images
   │  ├─ svg/<section>/…      # vector diagrams
   │  ├─ video/<section>/…    # short local videos + .vtt captions
   │  ├─ lottie/<section>/…   # Lottie JSON
   │  └─ data/<section>/…     # CSV/JSON for charts
   ├─ components/
   │  ├─ content/             # Components usable inside MDX (Callout, Timeline, Quiz…)
   │  ├─ media/               # Image, Figure, Video, Svg, Lottie, Mermaid, Chart, Gallery…
   │  ├─ navigation/          # Sidebar tree, breadcrumbs, prev/next, command palette, TOC
   │  ├─ knowledge/           # Related pages, backlinks, graph, prerequisites, paths
   │  └─ layout/              # Header, footer, theme switcher, language switcher
   ├─ layouts/                # BaseLayout, PageLayout, IndexLayout, HomeLayout
   ├─ themes/                 # base/ (grimoire), <theme-name>/ — tokens + optional ornaments
   ├─ styles/                 # Global: reset, tokens, layers, typography, print
   ├─ i18n/                   # ui/fr.ts, ui/en.ts, helpers
   ├─ lib/                    # Pure TS logic, unit tested (tree, graph, links, i18n, hashing…)
   ├─ plugins/                # Custom remark/rehype plugins
   └─ pages/                  # Routes: [lang]/[...slug].astro, home, tags, glossary, graph, A–Z…
```

Each folder with a `_meta.yml` (see section 5) is a **node of the tree**.

---

## 5. Content model

### 5.1 Pages (`docs` collection)

- One page = one `.mdx` (or `.md`) file. Folders = categories, **unlimited depth**.
- Each folder may contain a `_meta.yml`:
  ```yaml
  title: Sciences          # display title
  description: …
  order: 10                # sort order among siblings
  icon: flask              # optional icon name from the icon set
  theme: alchemy           # optional theme (inherited by all descendants)
  collapsed: false         # sidebar default state
  ```
- A folder without `index.mdx` gets an **auto-generated index page** (cards of children + description).
  If `index.mdx` exists, it is rendered and the auto-generated children list is appended.

### 5.2 Frontmatter schema (Zod, strict, with helpful error messages)

```yaml
title: string (required)
description: string (required, ≤ 200 chars, used for SEO/previews)
status: draft | in-progress | complete   # drafts hidden in production builds, visible in dev
created: date (required)
updated: date (optional; fallback = last git commit date of the file)
tags: string[]                # free tags, normalized (lowercase, kebab-case)
prerequisites: ref[]          # pages that are NECESSARY to understand this one
furtherReading: ref[]         # pages that HELP understand it better / go further
related: ref[]                # manual cross-category links (merged with automatic ones)
sources: [{ title, author?, url?, publisher?, year?, note? }]
theme: string (optional)      # override the inherited section theme
styles: string (optional)     # path to a page-specific CSS file (scoped to this page)
layout: default | wide | immersive  (optional)
cover: image (optional)
order: number (optional)
```

`ref` = path to another page, relative to the language root (e.g. `sciences/chimie/traces`).
**All refs must be validated at build time**: a broken ref fails the build with a clear message.

### 5.3 Other collections

- **glossary:** `term`, `aliases[]`, `definition` (short), body (long), `seeAlso: ref[]`.
- **paths (thematic learning paths):** `title`, `description`, ordered `steps: [{ page: ref, note? }]`,
  crossing any categories (example: investigation → trace chemistry → DNA biology).

---

## 6. Knowledge features ("smart" cross-category linking)

Compute everything **at build time** in `src/lib/` (pure, unit-tested functions) from the content
collections, then expose it to pages. No runtime server.

1. **Automatic related pages** — score = shared tags (weighted by tag rarity, TF-IDF style) +
   direct links + shared prerequisites + manual `related`. Prefer pages from **other** categories
   to encourage discovery. Show top N with the reason ("shared tag: toxicology").
2. **Backlinks** — "Pages that reference this one", from MDX links and frontmatter refs.
3. **Prerequisites & further reading** — shown at the top ("Read first") and bottom of pages.
   Detect prerequisite cycles at build time and warn.
4. **Interactive knowledge graph** — global graph page + local graph (neighbors at depth 1–2) on each
   page. Nodes colored by section theme, filterable by section/tag, clickable, keyboard accessible,
   with a text list alternative for screen readers. Graph data = one JSON file generated at build.
5. **Thematic paths** — path pages with progress through steps (progress stored in `localStorage`,
   wrapped in try/catch), and a "You are in path X — step 3/7 — next →" banner on pages in a path.
6. **Glossary with tooltips** — a `<Term>` component plus an **opt-in** remark plugin that links the
   first occurrence of glossary terms/aliases in a page. Accessible tooltip (focus + hover, Escape to
   close) linking to the glossary entry.
7. **Link hover previews** — hovering/focusing an internal link shows title + description + section
   (data from a build-time JSON index). Respect reduced motion; disabled on touch.
8. **Tag pages** — list of all tags (weighted) and one page per tag grouping pages across categories.
9. **A–Z index** — every page and glossary term alphabetically.
10. **Recently updated** — from `updated`/git dates.
11. **Random page** button (client-side pick from the index).

Research and add any other cross-linking mechanism you judge genuinely useful and cheap for a static
site; document each in `docs/`.

---

## 7. Internationalization (FR source → EN by AI, no API keys)

- Routes: `/Codex/fr/...` and `/Codex/en/...`; root `/Codex/` redirects to the preferred language
  (fallback `fr`). Language switcher keeps the current page when a translation exists.
- EN pages mirror FR paths exactly. Slugs stay identical across languages (simpler, robust mapping).
- Each EN page frontmatter contains `translationOf: <fr path>` and `sourceHash: <hash>`, where
  `sourceHash` is a hash of the FR source file content at translation time.
- `npm run i18n:status` script: lists **missing** EN pages, **outdated** EN pages (FR hash changed),
  and **orphan** EN pages. CI runs it and reports (warning, not failure, by default; configurable).
- `npm run i18n:stamp <path>` updates the `sourceHash` after an agent finishes a translation.
- Missing EN page → the EN route renders the FR content with a visible, accessible
  "Translation pending — showing the French original" banner and `lang="fr"` on the content.
- **Translation is done by AI agents editing files**, never by an API call during build.
  Document the exact translation procedure in `AGENTS.md` (keep frontmatter structure, translate
  `title`/`description`/body/alt texts, never translate slugs, refs, or code, update `sourceHash`).
- Glossary and paths follow the same scheme. UI strings live in `src/i18n/ui/{fr,en}.ts`, type-checked
  so a missing key fails `astro check`.

---

## 8. Design system & theming

### 8.1 Base identity: "ancient library / grimoire / codex"
- Warm parchment-like backgrounds, ink-colored text, elegant serif for headings, highly readable
  serif or humanist sans for body, discrete ornaments (dividers, drop caps optional, corner flourishes)
  done in **CSS/SVG**, never heavy images.
- Must still feel **modern, fast, and clean** — not a costume. Readability first.
- Light and dark modes ("daylight parchment" / "candlelight library"): follows system preference,
  manual toggle, choice persisted (try/catch around storage), no flash of wrong theme on load.

### 8.2 Section and page themes
- A **theme** = a folder in `src/themes/<name>/` with a `theme.css` that only overrides **design tokens**
  (colors, fonts, radii, ornament set, accent images) for both light and dark modes, plus an optional
  `README.md`.
- Applied via a `data-theme="<name>"` attribute on the page wrapper. Resolution order:
  page `theme` > nearest ancestor folder `theme` > `base`.
- Page-level escape hatch: frontmatter `styles` → a CSS file scoped to that page only.
- Every component consumes **tokens only** (never raw colors), so any theme restyles everything.
- Every content component exposes stable class names / CSS custom properties / `part`s so its style
  can be overridden by a theme or a page **without editing the component**.
- Every theme must keep **WCAG AA contrast**: add a script/test that checks token contrast pairs
  of every theme in light and dark mode.
- Ship 3 demo themes besides `base` (e.g. `alchemy` for sciences, `archive` for history,
  `noir` for investigation) to prove the system.

### 8.3 Layout
- Desktop: header (logo, search, language, theme toggle) / left collapsible tree sidebar /
  content column with comfortable measure (~70ch) / right sticky TOC + local knowledge panel.
- Below desktop widths: sidebar becomes an accessible drawer, TOC collapses.
- Print stylesheet: clean, no nav, links expanded, ornaments removed.

---

## 9. Pages

- **Home:** central search; visual overview of the site structure (top-level sections as themed cards
  with counts and sub-sections); global knowledge graph preview; recently updated pages; featured
  paths; random page. Reserve a **disabled "Most visited" slot** behind a feature flag in
  `src/config/features.ts` (analytics may be added later; do not implement any tracking now).
- **Content page:** breadcrumbs, title, metadata (status badge, dates, tags, reading time),
  "Read first" prerequisites, content, sources, further reading, related, backlinks, local graph,
  prev/next among siblings, "Edit this page" link (GitHub web editor), path banner when relevant.
- **Folder index pages** (auto-generated), **tags**, **tag/[tag]**, **glossary**, **glossary/[term]**,
  **paths**, **paths/[path]**, **graph**, **a-z**, **404** (helpful, with search), **search** page.

---

## 10. Navigation & search

- **Sidebar tree:** collapsible, unlimited depth, auto-expands the current branch, remembers state,
  keyboard navigable (WAI-ARIA tree or disclosure pattern), virtualized/lazy if large.
- **Breadcrumbs** with `BreadcrumbList` structured data.
- **Prev/next** among siblings.
- **Table of contents** with scroll-spy.
- **Command palette (Ctrl/Cmd + K)** powered by the Pagefind index: jump to pages, glossary terms, tags,
  paths; recent searches; fully keyboard accessible (combobox pattern).
- **Pagefind** with filters: language, section, tag, status. Exclude navigation chrome from indexing.
- Search Pagefind's FR/EN indexes separately (per-language results).

---

## 11. MDX component library

Build the **largest useful set** of content components, all documented in `docs/COMPONENTS.md` with a
usage snippet, and all demonstrated on a live **"Component showcase"** page (FR + EN). Every component:
accessible, themeable via tokens, overridable, no JS unless needed, works in both languages.

Minimum set:
- **Text & structure:** `Callout` (variants: definition, remember, warning, example, anecdote, tip,
  question, quote), `Aside`, `Details`/`Accordion`, `Tabs`, `Steps`, `Columns`, `Card` & `CardGrid`,
  `Badge`, `Kbd`, `Abbr`, `Footnotes` styling, `PullQuote`, `KeyFacts` (infobox, Wikipedia-style),
  `Comparison` table, `ProsCons`.
- **Knowledge:** `Term` (glossary tooltip), `PageLink` (validated internal link with preview),
  `Timeline`, `Flashcards`, `Quiz` (single/multiple choice, feedback, no backend), `Prerequisites`,
  `SourceRef` (cite an entry from `sources`).
- **Media:** `Figure` (image + caption + credit, required `alt`), `Gallery` (accessible lightbox),
  `Svg` (inline SVG that inherits theme colors through `currentColor`/tokens), `Video`
  (local file with `.vtt` captions, or YouTube/Vimeo **privacy-friendly facade**: loads the iframe only on
  click, `youtube-nocookie.com`), `Audio`, `Lottie`, `Gif` (with pause control), `Mermaid`,
  `Math` (inline/block, KaTeX), `Chart` (from CSV/JSON in `src/assets/data`), `Interactive`
  (wrapper to mount a custom JS/TS interactive island from `src/components/interactive/` with a
  fallback description), `Embed` (generic iframe with title + lazy loading), `Map` (optional, static
  image + link if no keyless solution).
- **Extensibility:** document, in `docs/COMPONENTS.md` and `AGENTS.md`, the exact recipe to add a new
  component or a new media type (file location, registration, docs, showcase entry).

MDX components must be **auto-available** in MDX files (global component mapping) so content files
need no import lines for standard components.

**Animations:** all animations (CSS, SVG, Lottie, GIF, interactive) respect
`prefers-reduced-motion` (paused or replaced by a static frame) and offer a pause control when longer
than 5 seconds (WCAG 2.2.2).

---

## 12. Accessibility (WCAG 2.2 AA) — required everywhere

- Semantic landmarks, skip link, one `h1` per page, logical heading order, visible focus styles,
  focus not obscured, target size ≥ 24×24 px, full keyboard operability, no keyboard traps.
- `lang` attribute per page and on any foreign-language fragment.
- Images: `alt` required by schema/component typing (empty `alt=""` allowed only with an explicit
  `decorative` prop). Diagrams, charts, graph, and interactives have a text alternative.
- Color contrast AA in every theme and mode (automated check from section 8.2).
- Tooltips, tabs, accordions, dialogs, combobox, tree follow WAI-ARIA Authoring Practices.
- Videos: captions supported (`.vtt`); facade buttons have accessible names.

---

## 13. Editing workflow, CMS, scripts, CI/CD, and AGENTS.md

### 13.1 Pages CMS
- `.pages.yml` exposing: FR pages (with all frontmatter fields as form fields, `status` as select,
  `tags` as list, refs as text with help), glossary, paths, folder `_meta.yml`, and the media folder
  `src/assets/` as media library.
- Only users with write access to the repo can save (that's only the owner) — explain in README.

### 13.2 npm scripts (each documented in README)
- `dev`, `build`, `preview`
- `check` (astro check + tsc), `lint`, `format`, `test` (Vitest)
- `validate` = check + lint + test + content/ref validation + theme contrast
- `links` = internal link checker over the built `dist/` (custom script, no external service)
- `i18n:status`, `i18n:stamp`
- `new:page <path>` — scaffolds a FR page with complete frontmatter template (dates prefilled,
  status draft) and creates matching media folders.
- `new:section <path>` — scaffolds a folder with `_meta.yml`.

### 13.3 GitHub Actions
- `ci.yml`: on push and pull requests → install (cached), `validate`, `build`, `links`, `i18n:status`
  (report as job summary).
- `deploy.yml`: on push to `main` → build → deploy with the official
  `actions/upload-pages-artifact` + `actions/deploy-pages` (Pages source = "GitHub Actions").
  Minimal `permissions`, concurrency group, pinned action major versions.
- `README.md` lists the **manual repo settings** the owner must do once: enable Pages with source
  "GitHub Actions", protect `main`, optionally limit interactions/disable issues.

### 13.4 Other files
- `.editorconfig`, `.gitignore`, `.nvmrc`, `.prettierrc`, ESLint config, `robots.txt`, sitemap,
  RSS is **not** required, web manifest + PWA (offline caching of visited pages and the search index),
  SEO meta + Open Graph + `hreflang` alternates + canonical URLs.

### 13.5 AGENTS.md (primary audience: AI coding agents — be strict and directive)
Write a complete `AGENTS.md` containing at least:
1. **Project summary** and the stack in one table.
2. **Architecture map**: every folder, what it contains, what may live there.
3. **Zones:**
   - ✅ *Free to edit:* content (`src/content/**`), media (`src/assets/**`), theme token files, UI strings.
   - ⚠️ *Edit with care (run full validation):* components, layouts, lib, plugins, schemas, config.
   - ⛔ *Do not modify without explicit owner request:* CI/CD workflows, `astro.config.mjs` integrations,
     `.pages.yml` structure, base path config, lockfile (except via install), `AGENTS.md` rules,
     `public/` PWA assets.
4. **Recipes** (step-by-step, with commands): add a page, add a section, move/rename a page
   (update refs), add an image/SVG/video/Lottie/chart, add a glossary term, add a thematic path,
   create a theme, add a component, add a media type, **translate a page FR→EN**, fix an outdated
   translation.
5. **Content rules:** frontmatter reference, naming/slug rules, mandatory `alt` texts, sources required
   for factual claims, editorial tone (see below), French typography rules (non-breaking spaces before
   `: ; ! ?`, French quotes « »), never invent sources.
6. **Editorial tone:** a balanced blend of **pedagogical** (clear progression, examples, intuition first)
   and **encyclopedic** (neutral, factual, precise, sourced). Define it concretely with a do/don't list
   and a short example paragraph.
7. **Code rules:** the full list from section 3.
8. **Verification checklist** an agent must run before finishing any task: `npm run validate`,
   `npm run build`, `npm run links`, `npm run i18n:status` — and report results honestly.
9. **Common pitfalls:** base path links, unoptimized images, heavy libs loaded globally,
   hardcoded strings/colors, breaking refs when renaming.
10. **Privacy & secrets rules:** never commit personal data, local absolute paths, secrets, or files
    covered by `.gitignore`; run `npm run audit:leaks` before every commit.

---

## 14. Sample content (to prove everything works)

Create realistic short FR pages (and their EN translations, with correct `sourceHash`) covering:
- 3 top-level sections with distinct themes, e.g. **Sciences** (`alchemy`), **Histoire** (`archive`),
  **Enquête** (`noir`).
- At least one branch **4+ levels deep** (e.g. `sciences/chimie/chimie-analytique/traces/...`).
- Cross-category links: an investigation page with a chemistry prerequisite, related history page, etc.
- One page with a page-level theme override and one with a page-specific `styles` file.
- One draft page (hidden in production).
- One FR page **without** EN translation (to demo the fallback banner) and one **outdated** translation
  (to demo `i18n:status`).
- 5+ glossary terms, 1 thematic path crossing the 3 sections.
- The **Component showcase** page using every component and media type, with small sample assets
  (a raster image, an SVG diagram, a Lottie JSON, a CSV for a chart, a short captioned video or a
  YouTube facade, a Mermaid diagram, KaTeX formulas, an interactive demo island).
- Keep sample content clearly marked as examples so the owner can delete it.

---

## 15. Definition of Done

All of the following must be true, and you must **run them and report the real output**:

- [ ] `npm ci` succeeds on a clean clone.
- [ ] `npm run validate` passes (types, lint, tests, refs, theme contrast).
- [ ] `npm run build` succeeds with **zero warnings** you introduced; Pagefind index generated.
- [ ] `npm run links` reports no broken internal links.
- [ ] `npm run i18n:status` runs and correctly reports the intentional missing/outdated demo pages.
- [ ] `npm run preview` serves the site under `/Codex/`; manually verify: home, a deep page, an
      auto-index page, tags, glossary tooltip, path banner, graph, Ctrl+K palette, search filters,
      language switch, theme toggle, section themes, fallback banner, 404.
- [ ] Lighthouse (or equivalent) on home + a content page: Accessibility ≥ 95, Performance ≥ 90,
      Best Practices ≥ 95, SEO ≥ 95 (desktop).
- [ ] No file in `src/`, `scripts/` exceeds 300 lines; no duplicated logic.
- [ ] Every exported symbol documented; every `src/*` folder has a README.
- [ ] `AGENTS.md`, `README.md`, `docs/*` are complete and accurate with respect to the final code.
- [ ] `npm run audit:leaks` passes: no personal data, local paths, or secrets in tracked files.
- [ ] GitHub Actions workflows are valid (lint them, e.g. with `actionlint` if available).

If something can't be achieved, **say so explicitly** with the reason and the best alternative —
never silently skip a requirement.

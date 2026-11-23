# Visual style guide

Visual conventions of the Codex. Read it (humans and AI agents) before any interface change.
The owner edits this file to record their taste; when it conflicts with an agent's own intuition,
this file wins. Theme mechanics (tokens, files, contrast check): [THEMES.md](THEMES.md).

## 1. Principles

1. **Readable first.** Text always sits on an opaque surface or a heavily veiled background, never
   directly on a busy illustration.
2. **Clean but designed.** No raw lists: every item has a hierarchy (badge, title, description,
   meta). "Basic" is a defect, and so is "cluttered".
3. **Use the available width.** No narrow cards lost in empty space; layouts adapt to the number of
   items (letter panels, full-width sheets).
4. **The page title dominates.** Automatic block headings ("In this section", "Sources"…) are small,
   discreet uppercase labels (`.block-heading`).
5. **No duplication on screen.** Show a piece of information once (e.g. no hover preview on a card
   that already shows the description: `data-no-preview`).
6. **Light AND dark** are checked on every change, and mobile too (375 px wide, no horizontal scroll).

**Reference page:** a course page of the `lab` theme (e.g. `sciences/chimie/chimie-analytique/chromatographie`),
judged by the owner "clean, complete, aesthetic, elegant and readable".

## 2. Layout

| Element | Rule |
|---|---|
| Grid | Symmetric: sidebar `--sidebar-width` · content `--content-max` · TOC `--toc-width`; equal side columns keep the text centred (`src/styles/layout.css`) |
| Reading sheet | Course pages only (`.content:has(> article)`), background `--sheet-bg` |
| Home and index pages (A–Z, glossary, paths, tags) | Open on the page background, no big wrapping box |
| ≤ 1200 px | TOC moves above the content; ≤ 960 px: single column |
| Page background | `--page-art`, blurred (`--page-art-blur`) and desaturated (`--page-art-saturation`) under `--page-veil` |

## 3. Typography

| Use | Font (token) |
|---|---|
| Body text, interface | IBM Plex Sans (`--font-body`, `--font-ui`) |
| Headings, base theme | Fraunces (`--font-display`): the library identity |
| Headings, `lab` theme | IBM Plex Sans |
| Code, `lab` labels | IBM Plex Mono (`--font-mono`, `--font-label`) |
| "CODEX" wordmark, eyebrows | Cinzel (`--font-brand`) |

Labels (counts, dates, categories): `.ui-label` (small spaced uppercase).

## 4. Colour and shape

- Tokens only (`var(--color-…)`), never a hard-coded colour in a component.
- WCAG AA contrast (≥ 4.5:1), checked by `npm run contrast`.
- Accent (`--color-accent`): links, step numbers, active items. Ornament (`--color-ornament`):
  decorative rules.
- Corners: `--radius` (small items), `--radius-lg` (cards); pills and bubbles: `999px` / `50%`.
- Elevation: `--shadow-sm` at rest, `--shadow-lg` or `--glow` on hover, with a small 2–3 px move.

## 5. Interface patterns

Shared classes (`src/styles/components.css`):

| Pattern | Use |
|---|---|
| `.page-intro` | Muted lead paragraph under an index page h1 |
| `.badge` / `.badge--accent` | Small pill: section, step count, "Glossary" |
| `.entry-card` | Rounded card, **entirely clickable** when it is a link |
| `.link-card` | Clickable row with a coloured edge (recent pages) |
| `.letter-heading` | Letter bubble followed by a hairline (glossary) |
| `.block-heading` | Heading of an automatic page block |

Components (`src/components/knowledge/`):

| Component | Use |
|---|---|
| `LetterNav` | Letter bubbles, sticky under the header |
| `LetterPanel` | One letter of the A–Z index: clickable rows |
| `GlossarySheet` | One glossary term: term and variants left, definition right |
| `PathCard`, `StepProgress` | Path card (sections, numbered route, segmented progress, start button) |

## 6. Section themes

| Theme | Section | Mood |
|---|---|---|
| `base` | Whole site | Old library: wood, brass, cream |
| `lab` | Sciences | White laboratory: graph paper, instrument blue, Plex |
| `noir` | Investigation | Case file: greys, typewriter headings |
| `archive` | History | Oxblood ink and gilt |
| `alchemy` | (unused) | Verdigris and copper |

## 7. How to ask for a precise style

A good request gives values, not impressions:

1. **Reference**: a screenshot or URL, and what you like in it.
2. **Scope**: whole site, one section, one page or one component.
3. **Colours**: hex codes (`#0b5cad`) or constraints ("pure white background, no gradient").
4. **Type**: font name, heading weight, text size.
5. **Shapes**: corner radius (px), shadows yes/no, density (compact / airy).
6. **Rules**: "definitions always in a blue callout", "numbered h2"…
7. **Do not touch**: "keep the wood header", "leave dark mode as it is".

> Example: "Chemistry section: background #ffffff, accent #0b5cad, Plex Sans 700 headings, 4 px
> corners, no shadow, numbered h2, formulas in a light grey box. Reference: attached screenshot."

## 8. Owner decisions (to be extended)

- **The Sciences version (`lab` theme) is approved: very good as it is.** Do not change it without an
  explicit request; use it as the model for other sections (readability, sobriety, finish).
- No "Previous / Next" block at the bottom of pages.
- No big box around the home page.
- The sidebar stays narrow; long titles wrap between words, never inside a word.

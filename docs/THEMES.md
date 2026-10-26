# Themes

## How it works

- `src/styles/tokens.css` defines the **base** identity (grimoire / ancient library) as CSS custom
  properties, for light (`:root`) and dark (`:root[data-mode='dark']`) modes.
- A **theme** is one file `src/themes/<name>.css` that overrides some tokens under
  `[data-theme='<name>']`, and again under `:root[data-mode='dark'] [data-theme='<name>']`.
- Every component uses tokens only, so a theme restyles everything without touching components.
- Resolution for a page: its own `theme` frontmatter > nearest ancestor folder `theme` (`section.yml`) > `base`.

## Main tokens

| Token | Role |
|---|---|
| `--font-brand`, `--font-display`, `--font-body`, `--font-ui`, `--font-mono` | Wordmark and eyebrows, headings, reading text, interface, code |
| `--color-bg`, `--color-surface` | Page background, cards and boxes |
| `--color-text`, `--color-muted` | Main and secondary text |
| `--color-accent`, `--color-accent-contrast` | Links, highlights; text on accent backgrounds |
| `--color-border`, `--color-ornament` | Lines; decorative accents |
| `--callout-*` | Callout colors (definition, remember, warning, example, tip) |
| `--color-wood`, `--color-wood-2`, `--color-on-wood`, `--color-on-wood-muted` | Dark "shelf" surfaces (header, home hero, tooltips) and their text — dark in both modes |
| `--color-brass`, `--color-lamp` | Gilded accents and warm highlights |
| `--page-art`, `--page-veil` | Page background (a `background` shorthand: library, celestial chart, damask, tiles — files in `src/assets/images/backgrounds/`) and the veil that keeps text readable |
| `--text-xs` … `--text-xl` | Font size scale |
| `--shadow-sm`, `--shadow-lg`, `--glow` | Elevation and hover glow |
| `--ease`, `--duration` | Animation curve and speed (disabled by `prefers-reduced-motion`) |
| `--radius`, `--radius-lg`, `--measure`, `--sidebar-width`, `--header-height` | Shape and layout |

## Fonts

Fonts are self-hosted from npm (`src/styles/fonts.css`, `font-display: swap`): Cinzel (wordmark),
Fraunces (headings), Literata (reading text), Inter (interface), Courier Prime (the `noir` theme).
To use another font in a theme: `npm install @fontsource/<name>`, import the weights in `fonts.css`,
then set `--font-display` (or `--font-body`) in the theme.

## Create a theme

```css
/* src/themes/ocean.css */
@layer themes {
  [data-theme='ocean'] { --color-accent: #0b5d7a; --color-ornament: #3a8fb7; }
  :root[data-mode='dark'] [data-theme='ocean'] { --color-accent: #7fd0ee; --color-ornament: #5fb3d9; }
}
```

Then `@import './ocean.css';` in `src/themes/themes.css`, set `theme: ocean` in a `section.yml`,
and run `npm run contrast` (WCAG AA, every theme and mode).

## Page-level styles

A single page can get its own CSS with `styles: <file>.css` (file in `src/styles/pages/`), inlined only on
that page. Write rules inside `@layer page { … }` and scope them to `.content`.

## Component-level overrides

Each component documents its override hooks in [COMPONENTS.md](COMPONENTS.md) (e.g. `--callout-color`,
`--timeline-color`, `--chart-1`). A theme may target them under its `[data-theme]` selector.

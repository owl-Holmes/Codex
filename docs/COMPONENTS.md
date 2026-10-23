# MDX components

Available in every `.mdx` page without import. Source: `src/components/content/`.
All styles use design tokens, so themes restyle them automatically.

## Callout

```mdx
<Callout type="definition" title="Titre optionnel">Texte…</Callout>
```
`type`: `definition` · `remember` (default) · `warning` · `example` · `tip`. The default title is translated.
Override: `--callout-color`, or `.callout--<type>` in a theme.

## Figure

```mdx
<Figure src="sciences/schema.svg" alt="Ce que montre l'image" caption="Légende" credit="Auteur" />
```
`src` is relative to `src/assets/images/`. Images are optimized at build. `alt` is required
(or pass `decorative` with `alt=""`). Override: `.figure`, `figcaption`.

## Term

```mdx
<Term id="chromatographie">chromatographie</Term>
```
Shows the glossary definition on hover and keyboard focus. `id` = file name in `src/content/glossary/<lang>/`
(falls back to FR). Override: `.term`, `.term-tip`.

## Details

```mdx
<Details summary="Question">Contenu caché…</Details>
```
Native `<details>`, no JS. Several in a row form an accordion. Prop `open` to start expanded.

## Timeline

```mdx
<Timeline items={[{ date: '1910', title: 'Laboratoire de Locard', text: 'Optionnel' }]} />
```
Override: `--timeline-color`, `.timeline-date`.

## Video

```mdx
<Video youtube="VIDEO_ID" title="Titre" />
<Video vimeo="VIDEO_ID" title="Titre" />
<Video src="sciences/demo.mp4" captions="sciences/demo.fr.vtt" title="Titre" />
```
YouTube/Vimeo stay behind a facade: nothing is loaded from the external site until the visitor clicks
(`youtube-nocookie.com`, Vimeo `dnt=1`). Local files live in `src/assets/video/` (keep them < 20 MB);
captions are WebVTT files.

## Mermaid

```mdx
<Mermaid title="Description du schéma" code={`graph LR
  A --> B`} />
```
Any [Mermaid](https://mermaid.js.org) diagram. Rendered in the browser; the library loads only on pages
that use it. `title` is the accessible description. Follows light/dark mode at load.

## Math (KaTeX)

Write LaTeX directly in MDX: `$E = mc^2$` inline, or a `$$ … $$` block. Rendered at build time,
no JavaScript. A literal dollar sign must be escaped: `\$`.

## Tabs / Tab

```mdx
<Tabs>
  <Tab label="Principe">…</Tab>
  <Tab label="Exemple">…</Tab>
</Tabs>
```
WAI-ARIA tabs (arrows, Home, End). Without JavaScript all panels are shown with their label.
Override: `.tabs-list [role=tab]`, `.tab-panel`.

## Quiz

```mdx
<Quiz question="…" options={['A', 'B', 'C']} answer={1} explanation="Optionnel" />
<Quiz question="…" options={['A', 'B', 'C']} answer={[0, 2]} />
```
`answer` = 0-based index, or an array for multiple choice (checkboxes). Immediate feedback, nothing stored.
Override: `.quiz--correct`, `.quiz--incorrect`.

## Flashcards

```mdx
<Flashcards cards={[{ front: 'Question ?', back: 'Réponse' }]} />
```
Click or Enter reveals the answer (native `<details>`, no JS). Override: `--flashcard-min`, `.flashcard`.

## Gallery

```mdx
<Gallery images={[{ src: 'sciences/a.svg', alt: 'Description', caption: 'Optionnel' }]} />
```
Optimized thumbnails + lightbox (Esc / click outside to close). Without JS, thumbnails link to the image.
`alt` is required. Override: `--gallery-min`, `.lightbox`.

## Chart

```mdx
<Chart data="histoire/methodes.csv" x="periode" y="empreintes" title="Titre" />
<Chart data="histoire/methodes.csv" x="periode" y={['a', 'b']} type="line" unit="%" title="Titre" />
```
Bar (default) or line chart rendered to **static SVG at build time** (no JavaScript), with the data table
in a collapsible block. `data` is relative to `src/assets/data/` (CSV with a header row, or a JSON array of
objects). Override: `--chart-1` … `--chart-4`.

## Lottie

```mdx
<Lottie src="sciences/molecule.json" title="Description de l'animation" loop={false} />
```
JSON animations from `src/assets/lottie/`. The player loads only on pages using it, a pause button is
always shown, and "reduce motion" starts it paused.

## Automatic glossary links

Add `autoGlossary: true` to a page's frontmatter: the first occurrence of each glossary term (or alias)
in the text becomes a `<Term>` link. Headings, links, code and terms already written by hand are skipped.
Plugin: `src/plugins/remark-glossary.mjs`.

## Adding a component

1. Create `src/components/content/<Name>.astro` (header comment, typed `Props`, tokens-only CSS, stable class).
2. Register it in `src/components/content/index.ts`.
3. Document it here with a usage snippet.

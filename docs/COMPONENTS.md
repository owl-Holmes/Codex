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

## Layout components

```mdx
<Steps>
1. Première étape
2. Deuxième étape
</Steps>

<Columns min="16rem"><div>…</div><div>…</div></Columns>

<CardGrid>
  <Card title="Titre" icon="⚗">Texte, avec <PageLink to="sciences/chimie" />.</Card>
</CardGrid>

<KeyFacts title="Edmond Locard" facts={{ Naissance: '1877', Domaine: 'Criminalistique' }} image="…" alt="…" />
<ProsCons pros={['Rapide']} cons={['Moins précis']} />
<PullQuote author="Auteur" source="Œuvre">Citation.</PullQuote>
```
Overrides: `--steps-color`, `--columns-min`, `--card-accent`, `--card-grid-min`, `.key-facts`, `.pros-cons`, `.pull-quote`.

## Inline elements

```mdx
<Badge>Nouveau</Badge> <Badge variant="warning">Controversé</Badge>
<Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
Une affirmation sourcée<SourceRef n={1} />.          (n = position in the page's `sources`)
<PageLink to="enquete/analyse-de-traces" />           (validated at build; text = page title by default)
```

## Svg (inline, themeable)

```mdx
<Svg src="sciences/atome.svg" title="Description" caption="Optionnel" />
```
The SVG markup is inserted in the page, so inside the file you can use `currentColor` and tokens such as
`var(--color-accent)`: the drawing follows the theme and light/dark mode. Use `<Figure>` for a plain image.

## Gif

```mdx
<Gif src="sciences/demo.gif" poster="sciences/demo-poster.png" alt="Description" />
```
Starts on the still poster; a button plays/pauses (WCAG 2.2.2).

## Audio

```mdx
<Audio src="histoire/discours.mp3" title="Titre">Transcription (optionnelle).</Audio>
```
Files in `src/assets/audio/`. The transcript is shown in a collapsible block.

## Embed

```mdx
<Embed src="https://…" title="Titre accessible" ratio="4 / 3" />
```
Generic lazy iframe (maps, simulations, documents). https only; `title` required.

## Page-level options (frontmatter)

| Field | Effect |
|---|---|
| `styles: ma-page.css` | Inlines `src/styles/pages/ma-page.css` on this page only (write rules in `@layer page`, scoped to `.content`). |
| `layout: wide` | Removes the reading-width limit. |
| `cover` + `coverAlt` | Cover image at the top (path in `src/assets/images/`). |
| `updated` | Optional: without it, the date of the file's last git commit is shown. |

## Adding a component

1. Create `src/components/content/<Name>.astro` (header comment, typed `Props`, tokens-only CSS, stable class).
2. Register it in `src/components/content/index.ts`.
3. Document it here with a usage snippet.

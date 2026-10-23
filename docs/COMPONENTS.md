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

## Adding a component

1. Create `src/components/content/<Name>.astro` (header comment, typed `Props`, tokens-only CSS, stable class).
2. Register it in `src/components/content/index.ts`.
3. Document it here with a usage snippet.

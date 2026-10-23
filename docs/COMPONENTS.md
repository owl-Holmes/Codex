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

## Adding a component

1. Create `src/components/content/<Name>.astro` (header comment, typed `Props`, tokens-only CSS, stable class).
2. Register it in `src/components/content/index.ts`.
3. Document it here with a usage snippet.

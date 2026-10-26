# src/pages

Routes. `index.astro` redirects to a language; `[lang]/index.astro` is the home;
`[lang]/[...slug].astro` renders every page and folder; `[lang]/search.astro` is the Pagefind search;
`tags/`, `glossary.astro`, `graph.astro`, `paths/` and `a-z.astro` are the cross-category discovery views.
`[lang]/previews.json.ts` feeds link hover previews; `manifest.webmanifest.ts` and `sw.js.ts` make the site installable and readable offline.

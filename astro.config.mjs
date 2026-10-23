// Astro configuration. Keep this file thin: site settings live in src/config/site.ts.
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGlossary from './src/plugins/remark-glossary.mjs';
import { SITE, LOCALES, DEFAULT_LOCALE } from './src/config/site.ts';

export default defineConfig({
  site: SITE.url,
  base: SITE.base,
  trailingSlash: 'ignore',
  // Locale-prefixed routes (/fr/…, /en/…); Astro.currentLocale is derived from the URL.
  i18n: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  // Math: $inline$ and $$block$$ LaTeX rendered at build time; glossary auto-links (opt-in per page).
  markdown: { processor: unified({ remarkPlugins: [remarkMath, remarkGlossary], rehypePlugins: [rehypeKatex] }) },
  integrations: [mdx(), sitemap()],
  // Mermaid ships a large chunk, but it is lazy-loaded only on pages using <Mermaid>.
  vite: { build: { chunkSizeWarningLimit: 3000 } },
});

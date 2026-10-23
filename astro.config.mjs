// Astro configuration. Keep this file thin: site settings live in src/config/site.ts.
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
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
  integrations: [mdx(), sitemap()],
});

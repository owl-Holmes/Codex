// Astro configuration. Keep this file thin: site settings live in src/config/site.ts.
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site.ts';

export default defineConfig({
  site: SITE.url,
  base: SITE.base,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
});

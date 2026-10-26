/**
 * Web app manifest (installable site). Generated so the base path comes from src/config/site.ts.
 */
import type { APIRoute } from 'astro';
import { DEFAULT_LOCALE, SITE } from '../config/site';
import { BRAND } from '../lib/brand';
import { pageUrl, withBase } from '../lib/urls';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: SITE.name,
      short_name: SITE.name,
      start_url: pageUrl(DEFAULT_LOCALE, ''),
      scope: withBase(''),
      display: 'standalone',
      background_color: BRAND.parchment,
      theme_color: BRAND.wood,
      icons: [{ src: withBase('favicon.svg').replace(/\/$/, ''), sizes: 'any', type: 'image/svg+xml' }],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );

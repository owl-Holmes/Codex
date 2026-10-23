/**
 * URL helpers. Every internal link MUST go through `pageUrl`/`withBase` so the
 * GitHub Pages base path (see src/config/site.ts) is always respected.
 */
import type { Locale } from '../config/site';

/** Prefixes a site-relative path with the configured base path. `withBase('fr/x')` → `/Codex/fr/x/`. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `${base}/${clean}/` : `${base}/`;
}

/** URL of a page from its locale and slug (slug "" = language home). */
export function pageUrl(locale: Locale, slug: string): string {
  return withBase(slug ? `${locale}/${slug}` : locale);
}

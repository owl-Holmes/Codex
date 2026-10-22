/**
 * Global site settings — the ONLY place where the URL, base path and locales are defined.
 * Used by astro.config.mjs, layouts and helpers in src/lib.
 */
export const SITE = {
  name: 'Codex',
  url: 'https://owl-holmes.github.io',
  /** GitHub Pages project path. Change it here only. */
  base: '/Codex',
  /** Repository used for "Edit this page" links. */
  repo: 'https://github.com/owl-Holmes/Codex',
  branch: 'main',
} as const;

/** Supported languages. The first one is the default and the source of truth. */
export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

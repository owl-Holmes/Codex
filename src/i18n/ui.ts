/**
 * Interface strings. Never hardcode UI text in components: add a key here.
 * `en` is typed against `fr`, so a missing key fails `astro check`.
 */
import type { Locale } from '../config/site';

const fr = {
  'site.tagline': 'Bibliothèque de connaissances',
  'nav.skip': 'Aller au contenu',
  'nav.sections': 'Sections',
  'nav.breadcrumb': "Fil d'Ariane",
  'nav.toggleMode': 'Basculer clair / sombre',
  'nav.language': 'Langue',
  'nav.search': 'Rechercher',
  'search.title': 'Recherche',
  'search.noscript': 'La recherche nécessite JavaScript.',
  'home.title': 'Le Codex',
  'home.intro': 'Une bibliothèque vivante sur tout et n’importe quoi.',
  'home.recent': 'Récemment mis à jour',
  'page.readFirst': 'À lire avant',
  'page.further': 'Pour aller plus loin',
  'page.related': 'Pages liées',
  'page.backlinks': 'Pages qui citent celle-ci',
  'page.sources': 'Sources',
  'page.updated': 'Mis à jour le',
  'page.edit': 'Modifier cette page',
  'page.children': 'Dans cette section',
  'page.sharedTag': 'tag commun',
  'page.fallback': 'Traduction en attente — version française affichée.',
  'status.draft': 'Brouillon',
  'status.in-progress': 'En cours',
  'status.complete': 'Complet',
  'callout.definition': 'Définition',
  'callout.remember': 'À retenir',
  'callout.warning': 'Attention',
  'callout.example': 'Exemple',
  'callout.tip': 'Astuce',
} as const;

export type UiKey = keyof typeof fr;

const en: Record<UiKey, string> = {
  'site.tagline': 'A library of knowledge',
  'nav.skip': 'Skip to content',
  'nav.sections': 'Sections',
  'nav.breadcrumb': 'Breadcrumb',
  'nav.toggleMode': 'Toggle light / dark',
  'nav.language': 'Language',
  'nav.search': 'Search',
  'search.title': 'Search',
  'search.noscript': 'Search requires JavaScript.',
  'home.title': 'The Codex',
  'home.intro': 'A living library about anything and everything.',
  'home.recent': 'Recently updated',
  'page.readFirst': 'Read first',
  'page.further': 'Further reading',
  'page.related': 'Related pages',
  'page.backlinks': 'Pages that cite this one',
  'page.sources': 'Sources',
  'page.updated': 'Updated on',
  'page.edit': 'Edit this page',
  'page.children': 'In this section',
  'page.sharedTag': 'shared tag',
  'page.fallback': 'Translation pending — showing the French original.',
  'status.draft': 'Draft',
  'status.in-progress': 'In progress',
  'status.complete': 'Complete',
  'callout.definition': 'Definition',
  'callout.remember': 'Remember',
  'callout.warning': 'Warning',
  'callout.example': 'Example',
  'callout.tip': 'Tip',
};

const STRINGS: Record<Locale, Record<UiKey, string>> = { fr, en };

/** Returns a translator bound to a locale. Example: `const t = useT('fr'); t('page.sources')`. */
export function useT(locale: Locale) {
  return (key: UiKey): string => STRINGS[locale][key];
}

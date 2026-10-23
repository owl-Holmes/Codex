/**
 * Build-time JSON index used by link hover previews: { [url]: { title, description, section } }.
 * One file per locale, fetched once by the browser on first hover.
 */
import type { APIRoute } from 'astro';
import { LOCALES, type Locale } from '../../config/site';
import { getPageMap, resolvePage } from '../../lib/pages';
import { getTrail, getTree } from '../../lib/tree';
import { pageUrl } from '../../lib/urls';

export function getStaticPaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = async ({ params }) => {
  const locale = params.lang as Locale;
  const tree = await getTree(locale);
  const entries = await Promise.all(
    [...(await getPageMap('fr')).keys()].filter(Boolean).map(async (slug) => {
      const page = (await resolvePage(locale, slug))!.page;
      const trail = getTrail(tree, slug);
      return [
        pageUrl(locale, slug),
        {
          title: page.entry.data.title,
          description: page.entry.data.description,
          section: trail.slice(0, -1).map((n) => n.title).join(' › '),
        },
      ];
    }),
  );
  return new Response(JSON.stringify(Object.fromEntries(entries)), {
    headers: { 'Content-Type': 'application/json' },
  });
};

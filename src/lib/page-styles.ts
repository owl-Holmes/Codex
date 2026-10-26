/**
 * Page-specific stylesheets (frontmatter `styles: <file>.css`, files in src/styles/pages/).
 * The CSS is inlined only on that page. Write rules under the `page` cascade layer and scope them
 * to `.content` so they never leak into the header or sidebar.
 */
const sheets = import.meta.glob<string>('/src/styles/pages/*.css', { query: '?raw', import: 'default' });

/** CSS text of a page stylesheet, or undefined; throws a clear build error for an unknown file. */
export async function pageStyles(file?: string): Promise<string | undefined> {
  if (!file) return undefined;
  const load = sheets[`/src/styles/pages/${file}`];
  if (!load) throw new Error(`styles: "${file}" not found in src/styles/pages/`);
  return load();
}

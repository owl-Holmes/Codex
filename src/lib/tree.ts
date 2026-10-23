/**
 * Navigation tree of unlimited depth, built from FR folders (section.yml) and pages.
 * Provides the sidebar tree, breadcrumbs, children lists and theme inheritance.
 */
import { getCollection } from 'astro:content';
import type { Locale } from '../config/site';
import { getPageMap } from './pages';

export interface TreeNode {
  slug: string;
  title: string;
  description?: string;
  order: number;
  theme?: string;
  /** True when the node is a folder (has children or a section.yml). */
  isSection: boolean;
  children: TreeNode[];
}

interface SectionMeta {
  title: Record<Locale, string>;
  description?: Record<Locale, string>;
  order: number;
  theme?: string;
}

/** Section metadata keyed by folder slug, e.g. "sciences/chimie". */
async function getSections(): Promise<Map<string, SectionMeta>> {
  const sections = await getCollection('sections');
  return new Map(
    sections.map((s) => {
      const slug = (s.filePath ?? '').replace(/\\/g, '/').replace(/^.*docs\/fr\/|\/?section\.yml$/g, '');
      return [slug, s.data];
    }),
  );
}

function parentOf(slug: string): string {
  return slug.includes('/') ? slug.slice(0, slug.lastIndexOf('/')) : '';
}

/** Builds the full tree for a locale. The root node has slug "". */
export async function getTree(locale: Locale): Promise<TreeNode> {
  const [sections, fr, own] = await Promise.all([getSections(), getPageMap('fr'), getPageMap(locale)]);
  const nodes = new Map<string, TreeNode>();
  const ensure = (slug: string): TreeNode => {
    const existing = nodes.get(slug);
    if (existing) return existing;
    const meta = sections.get(slug);
    const page = own.get(slug) ?? fr.get(slug);
    const node: TreeNode = {
      slug,
      title: meta?.title[locale] ?? page?.entry.data.title ?? slug.split('/').pop() ?? '',
      description: meta?.description?.[locale] ?? page?.entry.data.description,
      order: meta?.order ?? page?.entry.data.order ?? 100,
      theme: meta?.theme ?? page?.entry.data.theme,
      isSection: Boolean(meta),
      children: [],
    };
    nodes.set(slug, node);
    if (slug) {
      const parent = ensure(parentOf(slug));
      parent.isSection = true;
      parent.children.push(node);
    }
    return node;
  };
  ensure('');
  [...sections.keys(), ...fr.keys()].forEach(ensure);
  const sort = (n: TreeNode) => {
    n.children.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, locale));
    n.children.forEach(sort);
  };
  const root = nodes.get('')!;
  sort(root);
  return root;
}

/** Finds a node by slug. */
export function findNode(root: TreeNode, slug: string): TreeNode | undefined {
  if (root.slug === slug) return root;
  for (const child of root.children) {
    if (slug === child.slug || slug.startsWith(`${child.slug}/`)) return findNode(child, slug);
  }
  return undefined;
}

/** Ancestors from the top-level section down to the node itself (root excluded). */
export function getTrail(root: TreeNode, slug: string): TreeNode[] {
  const parts = slug ? slug.split('/') : [];
  return parts
    .map((_, i) => findNode(root, parts.slice(0, i + 1).join('/')))
    .filter((n): n is TreeNode => Boolean(n));
}

/** Theme resolution: page theme > nearest ancestor theme > "base". */
export function resolveTheme(root: TreeNode, slug: string, pageTheme?: string): string {
  if (pageTheme) return pageTheme;
  const themed = getTrail(root, slug).reverse().find((n) => n.theme);
  return themed?.theme ?? 'base';
}

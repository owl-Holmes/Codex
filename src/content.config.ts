/**
 * Content collections and their schemas — the single source of truth for page metadata.
 * - docs: pages, under docs/<lang>/<any/depth>/<slug>.mdx (index.mdx = folder page)
 * - sections: folder metadata, docs/fr/<path>/section.yml (the FR tree is the reference)
 * - glossary: terms, glossary/<lang>/<term>.md
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const source = z.object({
  title: z.string(),
  author: z.string().optional(),
  url: z.url().optional(),
  publisher: z.string().optional(),
  year: z.number().int().optional(),
  note: z.string().optional(),
});

/** A reference to another page: its path relative to the language root, e.g. "sciences/chimie". */
const ref = z.string().regex(/^[a-z0-9-]+(\/[a-z0-9-]+)*$/, 'Use a lowercase kebab-case page path');

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    status: z.enum(['draft', 'in-progress', 'complete']).default('in-progress'),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    prerequisites: z.array(ref).default([]),
    furtherReading: z.array(ref).default([]),
    related: z.array(ref).default([]),
    sources: z.array(source).default([]),
    theme: z.string().optional(),
    order: z.number().optional(),
    /** Page-specific stylesheet: file name in src/styles/pages/ (see src/lib/page-styles.ts). */
    styles: z.string().optional(),
    /** `wide` removes the reading-width limit (tables, galleries, timelines). */
    layout: z.enum(['default', 'wide']).default('default'),
    /** Cover image, relative to src/assets/images/, with its required alternative text. */
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    /** Link the first occurrence of each glossary term automatically (src/plugins/remark-glossary.mjs). */
    autoGlossary: z.boolean().default(false),
    /** EN pages only: FR source path and its hash at translation time (see scripts/i18n-*). */
    translationOf: z.string().optional(),
    sourceHash: z.coerce.string().optional(),
  }),
});

const sections = defineCollection({
  loader: glob({ pattern: '**/section.yml', base: './src/content/docs/fr' }),
  schema: z.object({
    title: z.object({ fr: z.string(), en: z.string() }),
    description: z.object({ fr: z.string(), en: z.string() }).optional(),
    order: z.number().default(100),
    theme: z.string().optional(),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/glossary' }),
  schema: z.object({
    term: z.string(),
    aliases: z.array(z.string()).default([]),
    definition: z.string(),
  }),
});

/** Thematic paths: ordered reading routes crossing categories. paths/<lang>/<id>.yml */
const paths = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/paths' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    steps: z.array(z.object({ page: ref, note: z.string().optional() })).min(2),
  }),
});

/** Optional tag descriptions: tags/<tag-slug>.yml, shown on the tag page. */
const tags = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/tags' }),
  schema: z.object({ description: z.object({ fr: z.string(), en: z.string() }) }),
});

export const collections = { docs, sections, glossary, paths, tags };

/**
 * Components available in every MDX page WITHOUT import lines.
 * To add one: create it in this folder, then register it below and document it in docs/COMPONENTS.md.
 */
import Callout from './Callout.astro';
import Figure from './Figure.astro';
import Term from './Term.astro';

export const mdxComponents = { Callout, Figure, Term };

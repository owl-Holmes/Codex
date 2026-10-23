/**
 * Components available in every MDX page WITHOUT import lines.
 * To add one: create it in this folder, then register it below and document it in docs/COMPONENTS.md.
 */
import Callout from './Callout.astro';
import Details from './Details.astro';
import Figure from './Figure.astro';
import Flashcards from './Flashcards.astro';
import Gallery from './Gallery.astro';
import Mermaid from './Mermaid.astro';
import Quiz from './Quiz.astro';
import Tab from './Tab.astro';
import Tabs from './Tabs.astro';
import Term from './Term.astro';
import Timeline from './Timeline.astro';
import Video from './Video.astro';

export const mdxComponents = {
  Callout,
  Details,
  Figure,
  Flashcards,
  Gallery,
  Mermaid,
  Quiz,
  Tab,
  Tabs,
  Term,
  Timeline,
  Video,
};

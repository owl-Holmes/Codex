/**
 * Resolves an image of the central media folder from its path relative to src/assets/images/.
 * Shared by the Figure and Gallery components so both validate paths the same way.
 */
import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/**/*.{png,jpg,jpeg,webp,avif,svg}');

/** Returns the image metadata, or throws a clear build error when the file does not exist. */
export async function resolveImage(src: string, component: string): Promise<ImageMetadata> {
  const load = images[`/src/assets/images/${src}`];
  if (!load) throw new Error(`${component}: image not found in src/assets/images/: "${src}"`);
  return (await load()).default;
}

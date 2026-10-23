// Vitest config: getViteConfig gives tests access to Astro virtual modules (astro:content…).
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: { include: ['src/**/*.test.ts'] },
});

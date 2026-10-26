// Tiny helpers shared by the background generators (scripts/art/*.mjs).

/** Seeded pseudo-random generator (Park–Miller): same seed → same sequence → same SVG. */
export function seeded(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Rounds to one decimal, to keep the SVG files small. */
export const r1 = (n) => Math.round(n * 10) / 10;

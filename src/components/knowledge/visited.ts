/**
 * Reading progress for thematic paths: remembers which pages this browser has visited
 * (localStorage only, never sent anywhere). Used by PathBanner (records) and path pages (displays).
 */
const KEY = 'codex-visited';

/** Slugs of visited pages; empty when storage is unavailable. */
export function getVisited(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]);
  } catch {
    return new Set();
  }
}

/** Records a visited page slug. */
export function markVisited(slug: string): void {
  try {
    const visited = getVisited();
    visited.add(slug);
    localStorage.setItem(KEY, JSON.stringify([...visited]));
  } catch {
    /* storage unavailable: progress is simply not remembered */
  }
}

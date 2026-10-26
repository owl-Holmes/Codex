/**
 * Last-modified dates read from git history at build time, used when a page has no `updated` field.
 * CI checks out the full history (fetch-depth: 0) so dates are correct in production.
 */
import { execFileSync } from 'node:child_process';

const cache = new Map<string, Date | undefined>();

/** Date of the last commit touching `filePath`, or undefined (untracked file, no git, shallow clone). */
export function lastCommitDate(filePath: string): Date | undefined {
  if (cache.has(filePath)) return cache.get(filePath);
  let date: Date | undefined;
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], { encoding: 'utf8' }).trim();
    date = iso ? new Date(iso) : undefined;
  } catch {
    date = undefined;
  }
  cache.set(filePath, date);
  return date;
}

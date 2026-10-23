/**
 * Service worker (offline reading), generated so the base path comes from src/config/site.ts.
 * - Pages: network first, cached copy when offline (every visited page becomes available offline).
 * - Hashed assets (/_astro/) and the search index (/pagefind/): cache first.
 * Bump CACHE_VERSION to drop old caches after a breaking change.
 */
import type { APIRoute } from 'astro';
import { DEFAULT_LOCALE } from '../config/site';
import { pageUrl, withBase } from '../lib/urls';

const CACHE_VERSION = 'v1';

const worker = (base: string, home: string) => `
const CACHE = 'codex-${CACHE_VERSION}';
const BASE = ${JSON.stringify(base)};
const HOME = ${JSON.stringify(home)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.add(HOME)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(CACHE)).put(request, response.clone());
  return response;
};

const networkFirst = async (request) => {
  try {
    const response = await fetch(request);
    if (response.ok) (await caches.open(CACHE)).put(request, response.clone());
    return response;
  } catch {
    return (await caches.match(request)) || (await caches.match(HOME)) || Response.error();
  }
};

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== location.origin || !url.pathname.startsWith(BASE)) return;
  const immutable = url.pathname.startsWith(BASE + '_astro/') || url.pathname.startsWith(BASE + 'pagefind/');
  event.respondWith(immutable ? cacheFirst(event.request) : networkFirst(event.request));
});
`;

export const GET: APIRoute = () =>
  new Response(worker(withBase(''), pageUrl(DEFAULT_LOCALE, '')), {
    headers: { 'Content-Type': 'text/javascript' },
  });

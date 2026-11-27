// Service worker: keeps the site readable offline. scripts/prerender.mjs writes it to dist/client/sw.js
// with VERSION (a hash of the built assets) and PRECACHE (assets, home pages, offline page, tables of contents) prepended.
/* global VERSION, PRECACHE */

// Pages live with the assets they reference, so a deploy drops both together.
const SHELL = `kt-shell-${VERSION}`;
// Chapter and mood data and fonts stay across deploys and refresh in the background.
const DATA = "kt-data";
const OFFLINE = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== SHELL && key !== DATA).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (request.mode === "navigate") return event.respondWith(page(request));
  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith("/assets/")) return event.respondWith(cacheFirst(request, SHELL));
    if (url.pathname.startsWith("/data/")) return event.respondWith(staleWhileRevalidate(request, event));
    return;
  }
  if (url.hostname === "fonts.googleapis.com") return event.respondWith(staleWhileRevalidate(request, event));
  if (url.hostname === "fonts.gstatic.com") return event.respondWith(cacheFirst(request, DATA));
});

/** Network first, so readers always get the latest page; the last copy, then the offline page, when there is no network. */
async function page(request) {
  const cache = await caches.open(SHELL);
  try {
    const res = await fetch(request);
    if (res.ok && res.headers.get("content-type")?.includes("text/html")) await cache.put(request, res.clone());
    return res;
  } catch {
    const hit = (await cache.match(request, { ignoreSearch: true })) ?? (await cache.match(OFFLINE));
    if (!hit) return Response.error();
    // A navigation refuses a redirected response, which a host with clean URLs gives /offline.html; copy it.
    return hit.redirected ? new Response(hit.body, hit) : hit;
  }
}

async function cacheFirst(request, name) {
  const cache = await caches.open(name);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) await cache.put(request, res.clone());
  return res;
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(DATA);
  const hit = await cache.match(request);
  const update = fetch(request).then(async (res) => {
    if (res.ok) await cache.put(request, res.clone());
    return res;
  });
  if (!hit) return update;
  event.waitUntil(update.catch(() => {}));
  return hit;
}

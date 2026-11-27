import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const SOURCE = readFileSync(new URL("./sw.js", import.meta.url), "utf8");
const ORIGIN = "https://moingaymotdoan.xyz";

type FakeRequest = { url: string; method: string; mode: string };
type Listener = (event: FakeEvent) => void;
type FakeEvent = {
  request?: FakeRequest;
  respondWith: (p: Promise<Response>) => void;
  waitUntil: (p: Promise<unknown>) => void;
  responded?: Promise<Response>;
  pending: Promise<unknown>[];
};

/** CacheStorage stand-in keyed by URL, enough for what sw.js calls. */
function fakeCaches() {
  const stores = new Map<string, Map<string, Response>>();
  const keyOf = (req: FakeRequest | string) => (typeof req === "string" ? new URL(req, ORIGIN).href : req.url);
  const open = async (name: string) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name)!;
    return {
      put: async (req: FakeRequest | string, res: Response) => void store.set(keyOf(req), res),
      match: async (req: FakeRequest | string, opts?: { ignoreSearch?: boolean }) => {
        const bare = (url: string) => (opts?.ignoreSearch ? url.split("?")[0] : url);
        const hit = [...store].find(([url]) => bare(url) === bare(keyOf(req)))?.[1];
        const copy = hit?.clone();
        // A real cache keeps the flag; clone() here drops it.
        if (copy && hit?.redirected) Object.defineProperty(copy, "redirected", { value: true });
        return copy;
      },
      addAll: async (urls: string[]) => {
        for (const url of urls) store.set(keyOf(url), new Response(`precached ${url}`, { headers: { "content-type": "text/html" } }));
      },
    };
  };
  return {
    stores,
    api: {
      open,
      keys: async () => [...stores.keys()],
      delete: async (name: string) => stores.delete(name),
    },
  };
}

/** Loads sw.js the way prerender ships it (VERSION and PRECACHE prepended) into a fake worker scope. */
function boot(network: (url: string) => Promise<Response>) {
  const listeners = new Map<string, Listener>();
  const caches = fakeCaches();
  const fetched: string[] = [];
  const self = {
    location: { origin: ORIGIN },
    clients: { claim: async () => {} },
    addEventListener: (type: string, fn: Listener) => listeners.set(type, fn),
  };
  runInNewContext(`const VERSION = "v1"; const PRECACHE = ["/", "/offline.html"];\n${SOURCE}`, {
    self,
    caches: caches.api,
    fetch: (req: FakeRequest | string) => {
      const url = typeof req === "string" ? req : req.url;
      fetched.push(url);
      return network(url);
    },
    Response,
    URL,
  });
  const dispatch = async (type: string, request?: FakeRequest) => {
    const event: FakeEvent = {
      request,
      pending: [],
      respondWith(p) {
        this.responded = p;
      },
      waitUntil(p) {
        this.pending.push(p);
      },
    };
    listeners.get(type)!(event);
    await Promise.all(event.pending);
    return event;
  };
  const get = (path: string, mode = "cors") => dispatch("fetch", { url: new URL(path, ORIGIN).href, method: "GET", mode });
  return { caches, fetched, dispatch, get };
}

const html = (body: string) => new Response(body, { headers: { "content-type": "text/html" } });
const offline = () => Promise.reject(new TypeError("Failed to fetch"));

describe("service worker", () => {
  it("precaches the shell on install and drops old shells on activate", async () => {
    const sw = boot(offline);
    await sw.caches.api.open("kt-shell-v0");
    await sw.caches.api.open("kt-data");
    await sw.dispatch("install");
    await sw.dispatch("activate");
    expect([...sw.caches.stores.keys()].sort()).toEqual(["kt-data", "kt-shell-v1"]);
    expect([...sw.caches.stores.get("kt-shell-v1")!.keys()]).toEqual([`${ORIGIN}/`, `${ORIGIN}/offline.html`]);
  });

  it("serves pages from the network and keeps a copy for offline", async () => {
    let online = true;
    const sw = boot((url) => (online ? Promise.resolve(html(`fresh ${url}`)) : offline()));
    const first = await sw.get("/sang-the-ky/1?tour", "navigate");
    expect(await (await first.responded!).text()).toBe(`fresh ${ORIGIN}/sang-the-ky/1?tour`);

    online = false;
    const again = await sw.get("/sang-the-ky/1", "navigate");
    expect(await (await again.responded!).text()).toBe(`fresh ${ORIGIN}/sang-the-ky/1?tour`);
  });

  it("falls back to the offline page for a page never opened", async () => {
    const sw = boot(offline);
    await sw.dispatch("install");
    const res = await (await sw.get("/xuat-ai-cap/3", "navigate")).responded!;
    expect(await res.text()).toBe("precached /offline.html");
  });

  it("serves a page the host redirected while precaching as a plain response", async () => {
    // Browsers refuse a redirected response for a navigation (static hosts with clean URLs send /offline.html to /offline).
    const sw = boot(offline);
    const redirected = new Response("offline page", { headers: { "content-type": "text/html" } });
    Object.defineProperty(redirected, "redirected", { value: true });
    await (await sw.caches.api.open("kt-shell-v1")).put("/offline.html", redirected);
    const res = await (await sw.get("/xuat-ai-cap/3", "navigate")).responded!;
    expect(res.redirected).toBe(false);
    expect(await res.text()).toBe("offline page");
  });

  it("does not keep downloads such as ebooks in the page cache", async () => {
    const sw = boot(() => Promise.resolve(new Response("epub", { headers: { "content-type": "application/epub+zip" } })));
    await (await sw.get("/ebook/kinh-thanh.epub", "navigate")).responded;
    expect(sw.caches.stores.get("kt-shell-v1")?.size ?? 0).toBe(0);
  });

  it("answers hashed assets from cache without the network", async () => {
    const sw = boot(() => Promise.resolve(new Response("js")));
    await (await sw.get("/assets/app-abc.js")).responded;
    sw.fetched.length = 0;
    const res = await (await sw.get("/assets/app-abc.js")).responded!;
    expect(await res.text()).toBe("js");
    expect(sw.fetched).toEqual([]);
  });

  it("answers chapter data from cache at once and refreshes it in the background", async () => {
    let version = "old";
    const sw = boot(() => Promise.resolve(new Response(version)));
    expect(await (await (await sw.get("/data/sang-the-ky/1.json")).responded!).text()).toBe("old");

    version = "new";
    expect(await (await (await sw.get("/data/sang-the-ky/1.json")).responded!).text()).toBe("old");
    expect(await (await (await sw.get("/data/sang-the-ky/1.json")).responded!).text()).toBe("new");
  });

  it("leaves other requests to the browser", async () => {
    const sw = boot(offline);
    expect((await sw.get("/k7q/e")).responded).toBeUndefined();
    expect((await sw.get("https://api.workos.com/user_management")).responded).toBeUndefined();
    const post = await sw.dispatch("fetch", { url: `${ORIGIN}/data/toc.json`, method: "POST", mode: "cors" });
    expect(post.responded).toBeUndefined();
  });
});

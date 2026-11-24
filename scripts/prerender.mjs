// Turns the server build into a static site: renders every page, data file and ebook through the
// built request handler and writes them into dist/client, which is what gets deployed.
//   node scripts/prerender.mjs   (run by `pnpm build`, after `vite build`, from the repo root)
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

// Công bố unless CONTENT_MODE=nhap; lib/content reads NODE_ENV to decide.
process.env.NODE_ENV = "production";
const { handleRequest } = await import("../dist/server/server.js");

const OUT = join(import.meta.dirname, "..", "dist", "client");
const fetchPath = (path) => handleRequest(new Request(`http://prerender${path}`));

/** Where a path's response is served from on a static host. */
const fileFor = (path, html) => (html ? join(OUT, path, "index.html") : join(OUT, path));

async function save(file, res) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
}

/** Built assets and public/ files; vite build already put them in dist/client. Anything else is rendered, even if a stale copy is there. */
const isStatic = (path) => path.startsWith("/assets/") || existsSync(join(import.meta.dirname, "..", "public", path));

/** Root-relative links in a page, minus the hash and query. */
const linksIn = (html) =>
  [...html.matchAll(/href="(\/(?!\/)[^"#?]*)/g)].map((m) => m[1]).filter((p) => p === "/" || !isStatic(p));

const toc = await (await fetchPath("/data/toc.json")).json();
const moodIndex = await (await fetchPath("/data/cam-xuc.json")).json();
// Pages read these in the browser; no page links to them, so they are listed here.
const data = [
  "/data/toc.json",
  "/data/cam-xuc.json",
  ...moodIndex.moods.map((m) => `/data/cam-xuc/${m.slug}.json`),
  ...toc.books.flatMap((b) => b.chapters.map((c) => `/data/${b.book.slug}/${c.number}.json`)),
];

const seen = new Set(["/", ...data]);
const queue = [...seen];
for (const path of queue) {
  const res = await fetchPath(path);
  if (!res.ok) throw new Error(`${path}: ${res.status} (linked from a prerendered page)`);
  const html = res.headers.get("content-type")?.includes("text/html") ?? false;
  if (html) {
    const text = await res.clone().text();
    for (const link of linksIn(text)) if (!seen.has(link)) (seen.add(link), queue.push(link));
  }
  await save(fileFor(path, html), res);
}

// A static host serves this for every path not written above.
const missing = await fetchPath("/khong-co-trang-nay");
if (missing.status !== 404) throw new Error(`/khong-co-trang-nay: expected 404, got ${missing.status}`);
await save(join(OUT, "404.html"), missing);

console.log(`Prerendered ${queue.length} files and 404.html into dist/client (${toc.mode}).`);

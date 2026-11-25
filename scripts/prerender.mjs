// Turns the server build into a static site: renders every page, data file and ebook (VI + EN)
// through the built request handler and writes them into dist/client, which is what gets deployed.
//   node scripts/prerender.mjs   (run by `pnpm build`, after `vite build`, from the repo root)
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

process.env.NODE_ENV = "production";
const { handleRequest } = await import("../dist/server/server.js");

const OUT = join(import.meta.dirname, "..", "dist", "client");
const fetchPath = (path) => handleRequest(new Request(`http://prerender${path}`));

/** Where a path's response is served from on a static host. */
const fileFor = (path, html) => (html ? join(OUT, path, "index.html") : join(OUT, path));

async function save(file, res, text) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, text !== undefined ? Buffer.from(text, "utf8") : Buffer.from(await res.arrayBuffer()));
}

/**
 * Moves Solid's deferred `[data-dh]` meta/link tags (description, canonical, hreflang, og:*, twitter:*)
 * from after the inline hydration script to the start of `<head>`, so Facebook/X/Zalo scrapers
 * read them within the first few KB. Matches Solid 2.0's hydrate() leading `[data-dh]` relocation.
 */
function hoistHeadMeta(html, path) {
  const withLang =
    path === "/en" || path.startsWith("/en/") ? html.replace(/<html\s+lang="vi"/, '<html lang="en"') : html;
  const headEnd = withLang.indexOf("</head>");
  if (headEnd === -1) return withLang;
  const head = withLang.slice(0, headEnd);
  const hoisted = [];
  const cleanedHead = head.replace(
    /<(?:meta|link)\b(?:[^>"']|"[^"]*"|'[^']*')*\bdata-dh="[^"]*"(?:[^>"']|"[^"]*"|'[^']*')*>/g,
    (tag) => {
      hoisted.push(tag);
      return "";
    },
  );
  if (hoisted.length === 0) return withLang;
  return cleanedHead.replace("<head>", `<head>${hoisted.join("")}`) + withLang.slice(headEnd);
}

/** Built assets and public/ files; vite build already put them in dist/client. Anything else is rendered, even if a stale copy is there. */
const isStatic = (path) => path.startsWith("/assets/") || existsSync(join(import.meta.dirname, "..", "public", path));

/** Root-relative links in a page, minus the hash and query. */
const linksIn = (html) =>
  [...html.matchAll(/href="(\/(?!\/)[^"#?]*)/g)].map((m) => m[1]).filter((p) => p === "/" || !isStatic(p));

const tocVi = await (await fetchPath("/data/toc.json")).json();
const moodIndexVi = await (await fetchPath("/data/cam-xuc.json")).json();
const tocEn = await (await fetchPath("/data/en/toc.json")).json();
const moodIndexEn = await (await fetchPath("/data/en/moods.json")).json();

// Pages read these in the browser; no page links to them, so they are listed here.
const data = [
  "/data/toc.json",
  "/data/cam-xuc.json",
  ...moodIndexVi.moods.map((m) => `/data/cam-xuc/${m.slug}.json`),
  ...tocVi.books.flatMap((b) => b.chapters.map((c) => `/data/${b.book.slug}/${c.number}.json`)),
  "/data/en/toc.json",
  "/data/en/moods.json",
  ...moodIndexEn.moods.map((m) => `/data/en/moods/${m.slug}.json`),
  ...tocEn.books.flatMap((b) => b.chapters.map((c) => `/data/en/${b.book.slug}/${c.number}.json`)),
];

// The home page renders only the open book's chapters, so no page links every chapter: list them.
const chapters = [
  ...tocVi.books.flatMap((b) => b.chapters.map((c) => `/${b.book.slug}/${c.number}`)),
  ...tocEn.books.flatMap((b) => b.chapters.map((c) => `/en/${b.book.slug}/${c.number}`)),
];

const seen = new Set(["/", "/en", ...chapters, ...data]);
const queue = [...seen];
/** Canonical URLs of the indexable pages, for sitemap.xml. */
const sitemap = [];
for (const path of queue) {
  const res = await fetchPath(path);
  if (!res.ok) throw new Error(`${path}: ${res.status} (linked from a prerendered page)`);
  const html = res.headers.get("content-type")?.includes("text/html") ?? false;
  if (html) {
    const text = await res.text();
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(text)?.[1];
    if (canonical && !text.includes('content="noindex')) sitemap.push(canonical);
    for (const link of linksIn(text)) if (!seen.has(link)) (seen.add(link), queue.push(link));
    await save(fileFor(path, html), res, hoistHeadMeta(text, path));
  } else {
    await save(fileFor(path, html), res);
  }
}

// A static host serves this for every path not written above.
const missing = await fetchPath("/khong-co-trang-nay");
if (missing.status !== 404) throw new Error(`/khong-co-trang-nay: expected 404, got ${missing.status}`);
await save(join(OUT, "404.html"), missing, hoistHeadMeta(await missing.text(), "/khong-co-trang-nay"));

// Search engines found every chapter through the home page's links; they now find them here (robots.txt points to it).
await save(
  join(OUT, "sitemap.xml"),
  null,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(sitemap)]
    .map((url) => `<url><loc>${url}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
);

console.log(`Prerendered ${queue.length} files and 404.html into dist/client.`);

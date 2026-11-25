import type { APIEvent } from "filesystem-routing/api";
import { getContent } from "../../../lib/content";
import { ebookFile } from "../../../lib/ebook/bundles";
import { buildEpub, bundles } from "../../../lib/ebook/epub";

/** Builds one ebook. The build writes each one the ebook page links to (scripts/prerender.mjs); any other file name is 404. */
export function GET(event: APIEvent) {
  const content = getContent();
  const edition = bundles(content.toc())
    .flatMap((bundle) => [false, true].map((fullText) => ({ bundle, fullText })))
    .find((e) => ebookFile({ slug: e.bundle.slug, fullText: e.fullText }) === event.params?.file);
  if (!edition) return new Response("Không có ebook này", { status: 404 });
  const bytes = buildEpub({
    bundle: edition.bundle,
    content,
    modified: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
    fullText: edition.fullText,
  });
  return new Response(bytes, { headers: { "Content-Type": "application/epub+zip" } });
}

import type { APIEvent } from "filesystem-routing/api";
import { getContent } from "../../../../lib/content";
import { ebookFile } from "../../../../lib/ebook/bundles";
import { buildEpub, bundles } from "../../../../lib/ebook/epub";

/** Builds one English EPUB. The build writes each one linked from /en/ebook; any other filename is 404. */
export function GET(event: APIEvent) {
  const content = getContent("en");
  const edition = bundles(content.toc(), "en")
    .flatMap((bundle) => [false, true].map((fullText) => ({ bundle, fullText })))
    .find((e) => ebookFile({ slug: e.bundle.slug, fullText: e.fullText, locale: "en" }) === event.params?.file);
  if (!edition) return new Response("Ebook not found", { status: 404 });
  const bytes = buildEpub({
    bundle: edition.bundle,
    content,
    modified: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
    fullText: edition.fullText,
    locale: "en",
  });
  return new Response(bytes, { headers: { "Content-Type": "application/epub+zip" } });
}

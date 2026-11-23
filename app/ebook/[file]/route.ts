import { getContent, MODE } from "@/lib/content";
import { buildEpub, bundles } from "@/lib/ebook/epub";

/** Every ebook is built once, at build time; any other file name is 404. */
export const dynamicParams = false;

/** `<slug>.epub` is the short edition; `<slug>-nguyen-van.epub` adds each đoạn's whole text. */
const editions = () =>
  bundles(getContent().toc(MODE)).flatMap((bundle) => [
    { file: `${bundle.slug}.epub`, bundle, fullText: false },
    { file: `${bundle.slug}-nguyen-van.epub`, bundle, fullText: true },
  ]);

export function generateStaticParams() {
  return editions().map((e) => ({ file: e.file }));
}

export async function GET(_req: Request, ctx: RouteContext<"/ebook/[file]">) {
  const { file } = await ctx.params;
  const edition = editions().find((e) => e.file === file);
  if (!edition) return new Response("Không có ebook này", { status: 404 });
  const bytes = buildEpub({
    bundle: edition.bundle,
    content: getContent(),
    mode: MODE,
    modified: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
    fullText: edition.fullText,
  });
  return new Response(bytes, {
    headers: {
      "Content-Type": "application/epub+zip",
      "Content-Disposition": `attachment; filename="kinh-thanh-${edition.file}"`,
    },
  });
}

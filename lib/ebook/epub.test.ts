import { cpSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { inflateRawSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { createContent } from "../content";
import { bundles, buildEpub } from "./epub";
import { zip } from "./zip";

const ROOT = join(import.meta.dirname, "..", "..");
// One real book, copied out so a half-written book elsewhere in content/ cannot break these tests.
const contentDir = mkdtempSync(join(tmpdir(), "ebook-"));
cpSync(join(ROOT, "content", "phi-le-mon"), join(contentDir, "phi-le-mon"), { recursive: true });
const content = createContent({ contentDir, bibleDir: join(ROOT, "data", "bible") });

/** Reads entries back by walking the local headers, the way an EPUB reader starts. */
function unzip(bytes: Uint8Array): { name: string; method: number; text: string }[] {
  const buf = Buffer.from(bytes);
  const out: { name: string; method: number; text: string }[] = [];
  let at = 0;
  while (buf.readUInt32LE(at) === 0x04034b50) {
    const method = buf.readUInt16LE(at + 8);
    const size = buf.readUInt32LE(at + 18);
    const nameLen = buf.readUInt16LE(at + 26);
    const extraLen = buf.readUInt16LE(at + 28);
    const name = buf.toString("utf8", at + 30, at + 30 + nameLen);
    const start = at + 30 + nameLen + extraLen;
    const body = buf.subarray(start, start + size);
    out.push({ name, method, text: (method === 0 ? body : inflateRawSync(body)).toString("utf8") });
    at = start + size;
  }
  return out;
}

describe("zip", () => {
  it("round-trips stored and deflated entries in order", () => {
    const files = unzip(zip([{ name: "mimetype", data: "application/epub+zip", store: true }, { name: "a.txt", data: "Xin chào ".repeat(50) }]));
    expect(files.map((f) => [f.name, f.method])).toEqual([["mimetype", 0], ["a.txt", 8]]);
    expect(files[1].text).toBe("Xin chào ".repeat(50));
  });
});

describe("buildEpub", () => {
  const toc = content.toc();
  const one = bundles(toc).find((b) => b.slug === "tan-uoc");
  if (!one) throw new Error("Phi-lê-môn chưa có trong content/");
  const build = (fullText: boolean) =>
    unzip(buildEpub({ bundle: one, content, modified: "2026-11-21T00:00:00Z", fullText }));
  const files = build(true);
  const file = (name: string) => files.find((f) => f.name === name)?.text ?? "";

  it("starts with an uncompressed mimetype, as the EPUB container requires", () => {
    expect(files[0]).toMatchObject({ name: "mimetype", method: 0, text: "application/epub+zip" });
    expect(file("META-INF/container.xml")).toContain('full-path="OEBPS/content.opf"');
  });

  it("puts every đoạn in the spine and the table of contents", () => {
    expect(file("OEBPS/content.opf")).toContain('<itemref idref="c-phi-le-mon-01"/>');
    expect(file("OEBPS/nav.xhtml")).toContain('href="text/phi-le-mon-01.xhtml"');
    expect(file("OEBPS/toc.ncx")).toContain('src="text/phi-le-mon-01.xhtml"');
  });

  it("turns each chỗ dẫn into a pop-up note holding the verse text", () => {
    const ch = file("OEBPS/text/phi-le-mon-01.xhtml");
    const refs = [...ch.matchAll(/epub:type="noteref" href="#(fn\d+)"/g)].map((m) => m[1]);
    expect(refs.length).toBeGreaterThan(0);
    for (const id of refs) expect(ch).toContain(`<aside epub:type="footnote" id="${id}">`);
    expect(ch).toContain("<h3>Nguyên văn"); // the whole chapter in Bản Truyền Thống
    expect(ch).not.toMatch(/&(?!amp;|lt;|gt;|quot;|#)/); // XHTML: every & escaped
  });

  it("leaves out the whole-chapter text in the short edition, keeping the pop-up verses", () => {
    const short = build(false).find((f) => f.name === "OEBPS/text/phi-le-mon-01.xhtml")?.text ?? "";
    expect(short).not.toContain("<h3>Nguyên văn");
    expect(short).toContain('epub:type="noteref"');
    // Two editions of one bundle are two different books to a reader app.
    const idOf = (fs: typeof files) => /<dc:identifier id="uid">([^<]+)</.exec(fs.find((f) => f.name === "OEBPS/content.opf")?.text ?? "")?.[1];
    expect(idOf(build(false))).not.toBe(idOf(files));
  });

  it("offers the whole Bible and each testament written so far, never a single book", () => {
    // No Old Testament book in this content, so no Cựu Ước bundle.
    expect(bundles(toc).map((b) => b.slug)).toEqual(["tat-ca", "tan-uoc"]);
  });
});

describe("buildEpub (en)", () => {
  const enContentDir = mkdtempSync(join(tmpdir(), "ebook-en-"));
  cpSync(join(ROOT, "content-en", "philemon"), join(enContentDir, "philemon"), { recursive: true });
  const enContent = createContent({
    contentDir: enContentDir,
    bibleDir: join(ROOT, "data", "bible-en"),
    locale: "en",
  });
  const enToc = enContent.toc();
  const one = bundles(enToc, "en").find((b) => b.slug === "new-testament");
  if (!one) throw new Error("Philemon missing from content-en/");
  const files = unzip(
    buildEpub({ bundle: one, content: enContent, modified: "2026-11-21T00:00:00Z", fullText: true, locale: "en" }),
  );
  const file = (name: string) => files.find((f) => f.name === name)?.text ?? "";

  it("emits English metadata, language tag, and BSB chapter heading", () => {
    expect(file("OEBPS/content.opf")).toContain("<dc:language>en</dc:language>");
    expect(file("OEBPS/content.opf")).toContain("The Bible in Plain English");
    expect(file("OEBPS/nav.xhtml")).toContain('href="text/philemon-01.xhtml"');
    const ch = file("OEBPS/text/philemon-01.xhtml");
    expect(ch).toContain("<h3>Full Text");
    expect(ch).toContain('epub:type="noteref"');
    expect(ch).not.toMatch(/&(?!amp;|lt;|gt;|quot;|#)/);
  });

  it("uses English bundle slugs for available testaments", () => {
    expect(bundles(enToc, "en").map((b) => b.slug)).toEqual(["complete", "new-testament"]);
  });
});

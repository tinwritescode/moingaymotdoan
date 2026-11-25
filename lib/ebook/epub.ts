import { createHash } from "node:crypto";
import type { ChapterView, Content, Inline, Ref, TocBook, Verse } from "../content";
import { testamentOf } from "../content/books";
import { verseLabel } from "../content/refs";
import type { Locale } from "../i18n/locale";
import { aiNotice } from "../notice";
import type { Bundle } from "./bundles";
import { zip } from "./zip";

export { bundles, type Bundle } from "./bundles";

const EPUB_COPY = {
  vi: {
    lang: "vi",
    bookTitle: "Kinh Thánh bằng lời thường",
    coverMain: "Kinh Thánh",
    coverSub: "bằng lời thường",
    fullTextSuffix: " (kèm nguyên văn)",
    editionSuffix: "-nguyen-van",
    commentators: "Các nhà giải kinh nói gì",
    fullTextHeading: "Nguyên văn · Bản Truyền Thống",
    oldTestament: "Cựu Ước",
    newTestament: "Tân Ước",
    chaptersCount: (n: number) => `${n} đoạn`,
    coverDesc: (fullText: boolean) =>
      `Mỗi đoạn Kinh Thánh, kể lại bằng lời thường${fullText ? ", kèm nguyên văn Bản Truyền Thống 1926" : ""}. <em>Đoạn</em> nghĩa là chương.`,
    coverTapHint: "Chạm vào chỗ dẫn như (1:26) để xem câu Kinh Thánh.",
    coverLabel: "Trang đầu",
    tocLabel: "Mục lục",
    startReading: "Bắt đầu đọc",
    siteDomain: "moingaymotdoan.xyz",
    loadErr: (name: string, n: number) => `Không tải được ${name} ${n}`,
  },
  en: {
    lang: "en",
    bookTitle: "The Bible in Plain English",
    coverMain: "The Bible",
    coverSub: "in plain English",
    fullTextSuffix: " (with full text)",
    editionSuffix: "-full-text",
    commentators: "What Commentators Say",
    fullTextHeading: "Full Text · Berean Standard Bible",
    oldTestament: "Old Testament",
    newTestament: "New Testament",
    chaptersCount: (n: number) => `${n} ${n === 1 ? "chapter" : "chapters"}`,
    coverDesc: (fullText: boolean) =>
      `Every chapter of the Bible retold in clear everyday English${fullText ? ", with full Berean Standard Bible (BSB) scripture" : ""}.`,
    coverTapHint: "Tap any citation such as (1:26) to view the Scripture passage in a pop-up.",
    coverLabel: "Title Page",
    tocLabel: "Table of Contents",
    startReading: "Start Reading",
    siteDomain: "moingaymotdoan.xyz/en",
    loadErr: (name: string, n: number) => `Could not load ${name} ${n}`,
  },
} as const;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pad = (n: number) => String(n).padStart(2, "0");
const chapterFile = (slug: string, n: number) => `${slug}-${pad(n)}`;

function verses(vs: Verse[]): string {
  return vs.map((v) => `<sup>${v.number}</sup>${esc(v.text)}`).join(" ");
}

/** Renders inline nodes; each reference becomes a noteref whose pop-up holds the verses. */
function inline(nodes: Inline[], notes: string[]): string {
  return nodes
    .map((n) => {
      switch (n.kind) {
        case "text":
          return esc(n.text);
        case "strong":
          return `<strong>${inline(n.children, notes)}</strong>`;
        case "em":
          return `<em>${inline(n.children, notes)}</em>`;
        case "thap":
          return inline(n.children, notes);
        case "refs":
          return `(${n.parts.map((p) => esc(p.lead) + noteref(p.ref, notes)).join("; ")})`;
        default: {
          const _exhaustive: never = n;
          return _exhaustive;
        }
      }
    })
    .join("");
}

function noteref(ref: Ref, notes: string[]): string {
  const k = notes.length + 1;
  // Kindle shows the aside as a pop-up when it links back to the noteref.
  notes.push(
    `<aside epub:type="footnote" id="fn${k}"><p><a href="#fr${k}">${esc(ref.book.name)} ${verseLabel(ref)}</a>. ${verses(ref.verses)}</p></aside>`,
  );
  return `<a epub:type="noteref" href="#fn${k}" id="fr${k}">${esc(ref.label)}</a>`;
}

function page(title: string, body: string, lang: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${lang}" xml:lang="${lang}">
<head><meta charset="utf-8"/><title>${esc(title)}</title><link rel="stylesheet" type="text/css" href="../style.css"/></head>
<body>
${body}
</body>
</html>
`;
}

function chapterPage(ch: ChapterView, fullText: boolean, locale: Locale): string {
  const copy = EPUB_COPY[locale];
  const notes: string[] = [];
  const para = (nodes: Inline[], cls?: string) => `<p${cls ? ` class="${cls}"` : ""}>${inline(nodes, notes)}</p>`;
  const prose = ch.sections
    .filter((s) => s.paragraphs.length > 0)
    .map((s) => `<h3>${esc(s.heading)}</h3>\n${s.paragraphs.map((p) => para(p)).join("\n")}`);
  const opinions = ch.opinions.map((o) => o.body);
  const commentators =
    opinions.length > 0 ? [`<h3>${copy.commentators}</h3>\n${opinions.map((o) => para(o, "op")).join("\n")}`] : [];
  const body = [
    `<section epub:type="chapter">`,
    `<h2><span class="so">${esc(ch.book.name)} ${ch.number}</span> ${esc(ch.title)}</h2>`,
    ...prose,
    ...commentators,
    ...(fullText ? [`<h3>${copy.fullTextHeading}</h3>\n<p class="kt">${verses(ch.verses)}</p>`] : []),
    `</section>`,
    ...notes,
  ].join("\n");
  return page(`${ch.book.name} ${ch.number} — ${ch.title}`, body, copy.lang);
}

function bookPage(b: TocBook, locale: Locale): string {
  const copy = EPUB_COPY[locale];
  const items = b.chapters
    .map((c) => `<li><a href="${chapterFile(b.book.slug, c.number)}.xhtml">${c.number}. ${esc(c.title)}</a></li>`)
    .join("\n");
  const testament = testamentOf(b.book) === "cu-uoc" ? copy.oldTestament : copy.newTestament;
  return page(
    b.book.name,
    `<section epub:type="part">\n<h1>${esc(b.book.name)}</h1>\n<p class="kicker">${testament} · ${copy.chaptersCount(b.chapters.length)}</p>\n<ol class="ds">\n${items}\n</ol>\n</section>`,
    copy.lang,
  );
}

function titlePage(bundle: Bundle, date: string, fullText: boolean, locale: Locale): string {
  const copy = EPUB_COPY[locale];
  return page(
    copy.bookTitle,
    `<section epub:type="titlepage" class="bia">
<h1>${copy.coverMain}</h1>
<p class="sub">${copy.coverSub}</p>
<p class="kicker">${esc(bundle.name)}</p>
<p class="center">${copy.coverDesc(fullText)}</p>
<p class="center">${copy.coverTapHint}</p>
<p class="note">${esc(aiNotice(locale))}</p>
<p class="center small">${copy.siteDomain} · ${esc(date)}</p>
</section>`,
    copy.lang,
  );
}

const CSS = `body { margin: 0; }
h1, h2, h3 { text-indent: 0; text-align: left; page-break-after: avoid; break-after: avoid; }
h1 { font-size: 2em; margin: 3em 0 0.2em; }
h2 { font-size: 1.45em; line-height: 1.25; margin: 0.5em 0 1.2em; }
h2 .so { display: block; font-size: 0.55em; font-weight: normal; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.5em; }
h3 { font-size: 1.1em; margin: 1.8em 0 0.6em; }
p { margin: 0; text-indent: 1.3em; }
h1 + p, h2 + p, h3 + p, p.op, p.kt, p.kicker, p.center, p.note, aside p { text-indent: 0; }
p.op { margin: 0 0 0.9em; }
p.kicker { font-size: 0.8em; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 1.5em; }
sup { font-size: 0.65em; line-height: 0; vertical-align: super; }
ol.ds, nav ol { list-style: none; padding: 0; margin: 0; }
ol.ds li { margin: 0 0 0.5em; }
nav ol ol { margin: 0.3em 0 0.8em 1.2em; }
aside { font-size: 0.9em; margin: 0.8em 0; }
.bia { text-align: center; }
.bia h1 { text-align: center; font-size: 2.6em; margin: 2.5em 0 0.1em; }
.bia p.sub { text-align: center; text-indent: 0; font-style: italic; font-size: 1.3em; margin: 0 0 2em; }
.bia p.kicker { text-align: center; }
p.center { text-align: center; margin: 0 0 0.8em; }
p.note { text-align: center; font-style: italic; margin: 1.5em 0; }
p.small { font-size: 0.8em; margin-top: 3em; }
`;

/** A stable id per edition, so a re-sent ebook is recognised as the same book. */
function uuid(slug: string, locale: Locale): string {
  const key = locale === "en" ? `moingaymotdoan.xyz/en/ebook/${slug}` : `bible.tyvn.online/ebook/${slug}`;
  const h = createHash("sha1").update(key).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

/**
 * Builds an EPUB 3 (with an EPUB 2 NCX for older Kindles): one file per book page and per chapter.
 * `fullText` adds each chapter's complete Scripture text; without it the book is about half as long,
 * and the verses each citation points to still pop up.
 */
export function buildEpub(args: {
  bundle: Bundle;
  content: Content;
  modified: string;
  fullText: boolean;
  locale?: Locale;
}): Uint8Array<ArrayBuffer> {
  const { bundle, content, modified, fullText } = args;
  const locale = args.locale ?? content.locale ?? "vi";
  const copy = EPUB_COPY[locale];
  const edition = fullText ? `${bundle.slug}${copy.editionSuffix}` : bundle.slug;
  const title = `${copy.bookTitle} — ${bundle.name}${fullText ? copy.fullTextSuffix : ""}`;
  const date = modified.slice(0, 10);

  type Item = { id: string; href: string; html: string; label: string; children?: Item[] };
  const books: Item[] = bundle.books.map((b) => ({
    // XML ids may not start with a digit, and slugs like "1-giang" / "1-john" do.
    id: `b-${b.book.slug}`,
    href: `text/${b.book.slug}.xhtml`,
    html: bookPage(b, locale),
    label: b.book.name,
    children: b.chapters.map((c) => {
      const ch = content.chapter({ slug: b.book.slug, number: c.number });
      if (!ch) throw new Error(copy.loadErr(b.book.name, c.number));
      return {
        id: `c-${chapterFile(b.book.slug, c.number)}`,
        href: `text/${chapterFile(b.book.slug, c.number)}.xhtml`,
        html: chapterPage(ch, fullText, locale),
        label: `${c.number}. ${c.title}`,
      };
    }),
  }));
  const cover: Item = {
    id: "bia",
    href: "text/bia.xhtml",
    html: titlePage(bundle, date, fullText, locale),
    label: copy.coverLabel,
  };
  const all = [cover, ...books.flatMap((b) => [b, ...(b.children ?? [])])];

  const navList = (items: Item[]): string =>
    `<ol>\n${items
      .map((i) => `<li><a href="${i.href}">${esc(i.label)}</a>${i.children ? navList(i.children) : ""}</li>`)
      .join("\n")}\n</ol>`;
  const nav = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${copy.lang}" xml:lang="${copy.lang}">
<head><meta charset="utf-8"/><title>${copy.tocLabel}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
<nav epub:type="toc" id="toc"><h1>${copy.tocLabel}</h1>
${navList([cover, ...books])}
</nav>
<nav epub:type="landmarks" hidden=""><ol>
<li><a epub:type="toc" href="nav.xhtml#toc">${copy.tocLabel}</a></li>
<li><a epub:type="bodymatter" href="${books[0].href}">${copy.startReading}</a></li>
</ol></nav>
</body>
</html>
`;

  let order = 0;
  const navPoints = (items: Item[]): string =>
    items
      .map(
        (i) =>
          `<navPoint id="np-${i.id}" playOrder="${++order}"><navLabel><text>${esc(i.label)}</text></navLabel><content src="${i.href}"/>${i.children ? navPoints(i.children) : ""}</navPoint>`,
      )
      .join("\n");
  const id = `urn:uuid:${uuid(edition, locale)}`;
  const ncx = `<?xml version="1.0" encoding="utf-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="${copy.lang}">
<head><meta name="dtb:uid" content="${id}"/><meta name="dtb:depth" content="2"/></head>
<docTitle><text>${esc(title)}</text></docTitle>
<navMap>
${navPoints([cover, ...books])}
</navMap>
</ncx>
`;

  const opf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="${copy.lang}">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="uid">${id}</dc:identifier>
<dc:title>${esc(title)}</dc:title>
<dc:language>${copy.lang}</dc:language>
<dc:creator>${copy.siteDomain}</dc:creator>
<dc:date>${date}</dc:date>
<meta property="dcterms:modified">${modified}</meta>
</metadata>
<manifest>
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
<item id="css" href="style.css" media-type="text/css"/>
${all.map((i) => `<item id="${i.id}" href="${i.href}" media-type="application/xhtml+xml"/>`).join("\n")}
</manifest>
<spine toc="ncx">
<itemref idref="bia"/>
<itemref idref="nav"/>
${all
  .slice(1)
  .map((i) => `<itemref idref="${i.id}"/>`)
  .join("\n")}
</spine>
<guide>
<reference type="toc" title="${copy.tocLabel}" href="nav.xhtml"/>
<reference type="text" title="${copy.startReading}" href="${books[0].href}"/>
</guide>
</package>
`;

  return zip([
    { name: "mimetype", data: "application/epub+zip", store: true },
    {
      name: "META-INF/container.xml",
      data: `<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>
`,
    },
    { name: "OEBPS/content.opf", data: opf },
    { name: "OEBPS/nav.xhtml", data: nav },
    { name: "OEBPS/toc.ncx", data: ncx },
    { name: "OEBPS/style.css", data: CSS },
    ...all.map((i) => ({ name: `OEBPS/${i.href}`, data: i.html })),
  ]);
}

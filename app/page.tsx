import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { SummaryLine } from "@/components/summary-line";
import { getContent, MODE, type TocBook } from "@/lib/content";
import { testamentOf } from "@/lib/content/books";
import { plainText } from "@/lib/content/note";

/** The first sentence of a chapter's Câu chuyện, without its chỗ dẫn, as the lead-in under its title. */
function leadOf(slug: string, number: number): string {
  const story = getContent()
    .chapter({ slug, number, mode: MODE })
    ?.sections.find((s) => s.heading === "Câu chuyện")?.paragraphs[0];
  if (!story) return "";
  const text = plainText(story).replace(/\s*\([^)]*\)/g, "");
  return /^.*?[.!?](?=\s|$)/.exec(text)?.[0] ?? text;
}

const KICKER = "font-sans text-xs font-semibold tracking-[0.14em] text-muted uppercase";

/** Mục lục as a magazine front page: masthead, where to start, then every book and its đoạn. */
export default function MucLuc() {
  const toc = getContent().toc(MODE);
  const start = toc[0];
  return (
    <>
      <SiteHeader />
      <Reveal className="mx-auto w-full max-w-6xl px-6 pb-20">
        <header className="pt-10 text-center sm:pt-14">
          <h1 className="font-display text-6xl leading-none font-extrabold sm:text-8xl">Kinh Thánh</h1>
          <p className="mt-3 font-display text-2xl text-accent italic">bằng lời thường</p>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Mỗi đoạn Kinh Thánh, kể lại bằng lời thường, kèm nguyên văn Bản Truyền Thống. <em>Đoạn</em> nghĩa là
            chương.
          </p>
          <div aria-hidden="true" className="mt-10 flex items-center gap-5 text-accent/70">
            <span className="h-px flex-1 bg-rule" />
            <span className="font-display text-xl leading-none">✦</span>
            <span className="h-px flex-1 bg-rule" />
          </div>
        </header>

        {MODE === "nhap" && (
          <p className="mt-6 rounded border border-vua/40 bg-card px-3 py-2 font-sans text-sm">
            Đang xem chế độ Nháp: hiện cả đoạn chưa duyệt.
          </p>
        )}

        {start === undefined ? (
          <p className="mt-10 text-muted">Chưa có đoạn nào được công bố. Mời ngài quay lại sau.</p>
        ) : (
          <>
            <StartHere book={start} />
            <BookIndex toc={toc} />
            {toc.map((b) => (
              <BookSection key={b.book.code} entry={b} />
            ))}
          </>
        )}
      </Reveal>
    </>
  );
}

function StartHere(props: { book: TocBook }) {
  const { book } = props.book;
  const ch = props.book.chapters[0];
  return (
    <section aria-labelledby="bat-dau" className="flex flex-wrap items-end gap-x-14 gap-y-6 border-b border-rule py-12">
      <div className="min-w-0 flex-[999_1_32rem]">
        <p id="bat-dau" className={`${KICKER} text-accent`}>
          Bắt đầu đọc · {book.name} {ch.number}
        </p>
        <h2 className="mt-3 font-display text-5xl leading-[1.05] font-extrabold text-balance sm:text-7xl">{ch.title}</h2>
        <p className="mt-5 max-w-2xl text-xl leading-relaxed">{leadOf(book.slug, ch.number)}</p>
        <Link
          href={`/${book.slug}/${ch.number}`}
          className="mt-6 inline-flex min-h-12 items-center bg-ink px-6 font-sans font-semibold text-paper hover:bg-accent"
        >
          Đọc đoạn này
        </Link>
      </div>
      <p aria-hidden="true" className="flex-[1_1_10rem] text-right font-display text-[11rem] leading-[0.8] font-extrabold text-rule">
        {ch.number}
      </p>
    </section>
  );
}

function BookIndex(props: { toc: TocBook[] }) {
  return (
    <nav aria-labelledby="cac-sach" className="border-b border-rule py-10">
      <h2 id="cac-sach" className={KICKER}>
        Các sách
      </h2>
      <ol className="mt-3">
        {props.toc.map(({ book, chapters }) => (
          <li key={book.code} className="border-b border-rule last:border-b-0">
            <a href={`#${book.slug}`} className="group flex min-h-20 flex-wrap items-baseline gap-x-6 gap-y-1 py-4">
              <span className="flex-[1_1_18rem] font-display text-4xl font-semibold group-hover:text-accent sm:text-5xl">
                {book.name}
              </span>
              <span className="font-sans text-sm text-muted">{testamentOf(book) === "cu-uoc" ? "Cựu Ước" : "Tân Ước"}</span>
              <span className="min-w-24 text-right font-sans font-semibold">{chapters.length} đoạn</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function BookSection(props: { entry: TocBook }) {
  const { book, chapters } = props.entry;
  return (
    <section id={book.slug} aria-labelledby={`${book.slug}-ten`} className="scroll-mt-6 pt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink pb-2">
        <h2 id={`${book.slug}-ten`} className="font-display text-3xl font-semibold">
          {book.name}
        </h2>
        <a href="#cac-sach" className="font-sans text-sm text-muted hover:text-accent">
          ↑ Các sách
        </a>
      </div>
      <ol className="mt-5 gap-x-10 sm:columns-2 lg:columns-3">
        {chapters.map((ch) => (
          <li key={ch.number} className="mb-3 break-inside-avoid">
            <Link href={`/${book.slug}/${ch.number}`} className="group flex gap-3">
              <span className="w-7 shrink-0 text-right font-sans text-sm leading-7 text-accent">{ch.number}</span>
              <span className="leading-snug group-hover:text-accent">{ch.title}</span>
            </Link>
            {ch.draft && (
              <div className="ml-10 flex flex-wrap items-center gap-x-2 font-sans">
                <span className="text-xs font-semibold">{ch.draft.approved ? "Đã duyệt" : "Chưa duyệt"}</span>
                <SummaryLine summary={ch.draft.summary} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

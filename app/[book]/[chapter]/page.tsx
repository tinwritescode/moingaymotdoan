import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterReader } from "@/components/chapter-reader";
import { SiteHeader } from "@/components/site-header";
import { getContent, MODE, type ChapterLink, type ChapterView } from "@/lib/content";

/** Only chapters with a ghi chú (and, in Công bố, only approved ones) exist; anything else is 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getContent()
    .toc(MODE)
    .flatMap(({ book, chapters }) => chapters.map((ch) => ({ book: book.slug, chapter: String(ch.number) })));
}

async function load(params: PageProps<"/[book]/[chapter]">["params"]): Promise<ChapterView> {
  const { book, chapter } = await params;
  const view = getContent().chapter({ slug: book, number: Number(chapter), mode: MODE });
  if (!view) notFound();
  return view;
}

export async function generateMetadata(props: PageProps<"/[book]/[chapter]">): Promise<Metadata> {
  const ch = await load(props.params);
  return { title: `${ch.book.name} ${ch.number} — ${ch.title}` };
}

const PAGER = "inline-flex min-h-11 items-center rounded-lg border border-rule px-3.5 text-sm";

const hrefOf = (l: ChapterLink) => `/${l.book.slug}/${l.number}`;
/** Names the book only when the link leaves the current one. */
const labelOf = (l: ChapterLink, here: ChapterView) =>
  l.book.code === here.book.code ? `Đoạn ${l.number}` : `${l.book.name} ${l.number}`;

export default async function ChapterPage(props: PageProps<"/[book]/[chapter]">) {
  const ch = await load(props.params);
  return (
    <>
      <SiteHeader book={ch.book.slug}>
        <nav aria-label="Vị trí" className="flex gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-accent">
            Mục lục
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={`/#${ch.book.slug}`} className="hover:text-accent">
            {ch.book.name}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink">Đoạn {ch.number}</span>
        </nav>
        <div className="flex-1" />
        {ch.mode === "nhap" && (
          <span className="rounded-full bg-vua/15 px-2.5 py-1 text-xs font-semibold text-vua">
            Nháp · {ch.approved ? "Đã duyệt" : "Chưa duyệt"} · Cao {ch.summary.cao} · Vừa {ch.summary.vua} · Thấp{" "}
            {ch.summary.thap} · Đã đối chiếu {ch.summary.verified}/{ch.summary.total}
          </span>
        )}
        <nav aria-label="Đoạn trước và sau" className="flex gap-2">
          {ch.prev === null ? (
            <span className={`${PAGER} text-muted/60`}>← Đoạn trước</span>
          ) : (
            <Link href={hrefOf(ch.prev)} title={ch.prev.title} className={`${PAGER} bg-card hover:border-accent`}>
              ← {labelOf(ch.prev, ch)}
            </Link>
          )}
          {ch.next === null ? (
            <span className={`${PAGER} text-muted/60`}>Đoạn sau →</span>
          ) : (
            <Link href={hrefOf(ch.next)} title={ch.next.title} className={`${PAGER} bg-card hover:border-accent`}>
              {labelOf(ch.next, ch)} →
            </Link>
          )}
        </nav>
      </SiteHeader>
      <ChapterReader view={ch} />
    </>
  );
}

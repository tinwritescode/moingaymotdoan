import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InlineText } from "@/components/inline";
import { Reveal } from "@/components/reveal";
import { SummaryLine } from "@/components/summary-line";
import { getContent, MODE, type ChapterView, type Opinion } from "@/lib/content";

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

const LEVEL_LABEL = { cao: "Cao", vua: "Vừa", thap: "Thấp" } as const;
const LEVEL_CLASS = { cao: "text-cao border-cao/50", vua: "text-vua border-vua/50", thap: "text-thap border-thap/50" } as const;

function DraftOpinion(props: { opinion: Opinion }) {
  const o = props.opinion;
  return (
    <div>
      <p>
        <InlineText nodes={o.body} />
      </p>
      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className={`rounded border px-1.5 py-0.5 font-semibold ${LEVEL_CLASS[o.level]}`}>
          Tin cậy: {LEVEL_LABEL[o.level]}
        </span>
        <span>{o.verified ? "Đã đối chiếu" : "Chưa đối chiếu"}</span>
        <span>· {o.reason}</span>
      </p>
    </div>
  );
}

export default async function ChapterPage(props: PageProps<"/[book]/[chapter]">) {
  const ch = await load(props.params);
  const base = `/${ch.book.slug}`;
  return (
    <article>
      <Reveal>
        <p className="text-sm text-muted">
          <Link href="/" className="hover:text-accent">
            Mục lục
          </Link>{" "}
          · {ch.book.name}
        </p>
        <h1 className="mt-1 text-3xl font-semibold">
          {ch.book.name} {ch.number}
        </h1>
        <p className="mt-1 text-xl text-muted">{ch.title}</p>

        {ch.mode === "nhap" && (
          <div className="mt-4 rounded border border-vua/40 bg-card px-3 py-2 text-sm">
            <strong>Nháp</strong> · {ch.approved ? "Đã duyệt" : "Chưa duyệt"} ·{" "}
            <SummaryLine summary={ch.summary} />
          </div>
        )}

        <a href="#ghi-chu" className="mt-5 inline-block text-sm text-accent underline underline-offset-4">
          Đến phần ghi chú ↓
        </a>

        <section aria-label="Lời Kinh Thánh" className="mt-6">
          <p className="text-[1.15rem] leading-loose">
            {ch.verses.map((v) => (
              <span key={v.number} id={`c${v.number}`}>
                <sup className="mr-0.5 text-xs text-muted">{v.number}</sup>
                {v.text}{" "}
              </span>
            ))}
          </p>
          <p className="mt-3 text-right text-xs text-muted">Bản Truyền Thống</p>
        </section>
      </Reveal>

      <section id="ghi-chu" className="mt-12 scroll-mt-6 border-t border-rule pt-8">
        <p className="text-sm uppercase tracking-widest text-muted">Ghi chú</p>
        {ch.sections.map((s) => (
          <Reveal key={s.heading} onView className="mt-8">
            <h2 className="text-2xl font-semibold">{s.heading}</h2>
            <div className="mt-3 space-y-4">
              {s.paragraphs.map((p, i) => (
                <p key={i}>
                  <InlineText nodes={p} />
                </p>
              ))}
            </div>
          </Reveal>
        ))}

        <Reveal onView className="mt-8">
          <h2 className="text-2xl font-semibold">Các nhà giải kinh nói gì</h2>
          <div className="mt-3 space-y-5">
            {ch.mode === "nhap"
              ? ch.opinions.map((o, i) => <DraftOpinion key={i} opinion={o} />)
              : ch.opinions.map((body, i) => (
                  <p key={i}>
                    <InlineText nodes={body} />
                  </p>
                ))}
          </div>
          <p className="mt-6 text-sm italic text-muted">
            Ghi chú do AI soạn, đã được duyệt; ý kiến các nhà giải kinh đã đối chiếu với nguồn.
          </p>
        </Reveal>
      </section>

      <nav className="mt-12 flex justify-between border-t border-rule pt-4 text-sm">
        {ch.prev === null ? (
          <span />
        ) : (
          <Link href={`${base}/${ch.prev}`} className="text-accent hover:underline">
            ← Đoạn {ch.prev}
          </Link>
        )}
        {ch.next === null ? (
          <span />
        ) : (
          <Link href={`${base}/${ch.next}`} className="text-accent hover:underline">
            Đoạn {ch.next} →
          </Link>
        )}
      </nav>
    </article>
  );
}

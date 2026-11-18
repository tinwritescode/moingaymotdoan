"use client";

import { useState } from "react";
import type { ChapterView, Inline, Opinion, Section } from "@/lib/content";
import { InlineText } from "./inline";
import { InlineVersesContext, type VerseRange } from "./inline-verses";
import { Reveal } from "./reveal";
import { verseLabel, VerseText } from "./verse-text";

const LEVEL = {
  cao: { label: "Cao", className: "bg-cao/10 text-cao" },
  vua: { label: "Vừa", className: "bg-vua/10 text-vua" },
  thap: { label: "Thấp", className: "bg-thap/10 text-thap" },
} as const;

function DraftOpinion(props: { opinion: Opinion }) {
  const o = props.opinion;
  return (
    <article className="rounded-xl border border-rule p-4">
      <p>
        <InlineText nodes={o.body} />
      </p>
      <p className="mt-2 flex flex-wrap items-center gap-2 font-sans text-xs">
        <span className={`rounded-md px-2 py-0.5 font-semibold ${LEVEL[o.level].className}`}>
          Tin cậy: {LEVEL[o.level].label}
        </span>
        <span className="rounded-md border border-rule px-2 py-0.5 font-semibold text-muted">
          {o.verified ? "Đã đối chiếu" : "Chưa đối chiếu"}
        </span>
        <span className="text-muted">{o.reason}</span>
      </p>
    </article>
  );
}

/** One paragraph of Câu chuyện. Its chỗ dẫn into this chapter open the verses right below it. */
function StoryParagraph(props: { nodes: Inline[]; view: ChapterView; dropCap: boolean }) {
  const ch = props.view;
  const [shown, setShown] = useState<VerseRange | null>(null);
  const toggle = (r: VerseRange) => setShown(shown?.from === r.from && shown.to === r.to ? null : r);
  const verses = shown ? ch.verses.slice(shown.from - 1, shown.to) : [];

  return (
    <InlineVersesContext value={{ bookCode: ch.book.code, chapter: ch.number, shown, toggle }}>
      <p
        className={
          props.dropCap
            ? "first-letter:float-left first-letter:mt-1.5 first-letter:mr-2.5 first-letter:text-[4.6rem] first-letter:leading-[0.9] first-letter:font-semibold first-letter:text-accent"
            : undefined
        }
      >
        <InlineText nodes={props.nodes} />
      </p>
      {verses.length > 0 && (
        <div className="mt-4 rounded-xl bg-side px-5 py-4 text-[1.05rem] leading-[1.75]">
          <p className="mb-1.5 font-sans text-xs font-semibold tracking-wider text-muted uppercase">
            Nguyên văn · {ch.book.name} {verseLabel({ chapter: ch.number, verses })}
          </p>
          <p>
            <VerseText verses={verses} />
          </p>
        </div>
      )}
    </InlineVersesContext>
  );
}

function Prose(props: { section: Section | undefined }) {
  return props.section?.paragraphs.map((p, i) => (
    <p key={i}>
      <InlineText nodes={p} />
    </p>
  ));
}

/** Opens a folded section before the browser jumps to it; a closed <details> would hide the target. */
function openSection(id: string) {
  const el = document.getElementById(id);
  if (el instanceof HTMLDetailsElement) el.open = true;
}

/**
 * The chapter page body: Câu chuyện as the one column to read, Ý chính beside it, and the
 * rest (deeper meaning, cautions, commentators, the full text) folded below the story.
 */
export function ChapterReader(props: { view: ChapterView }) {
  const ch = props.view;
  const section = (heading: Section["heading"]) => ch.sections.find((s) => s.heading === heading);
  const story = section("Câu chuyện")?.paragraphs ?? [];
  // A ghi chú may have only its story written so far; empty parts stay off the page.
  const written = (heading: Section["heading"]) => (section(heading)?.paragraphs.length ?? 0) > 0;

  const folds = [
    { id: "y-nghia", label: "Ý nghĩa sâu xa", shown: written("Ý nghĩa sâu xa"), body: <Prose section={section("Ý nghĩa sâu xa")} /> },
    { id: "luu-y", label: "Lưu ý", shown: written("Lưu ý"), body: <Prose section={section("Lưu ý")} /> },
    {
      id: "giai-kinh",
      shown: ch.opinions.length > 0,
      label: `Các nhà giải kinh nói gì (${ch.opinions.length})`,
      body:
        ch.mode === "nhap"
          ? ch.opinions.map((o, i) => <DraftOpinion key={i} opinion={o} />)
          : ch.opinions.map((body, i) => (
              <article key={i} className="rounded-xl border border-rule p-4">
                <InlineText nodes={body} />
              </article>
            )),
    },
    {
      id: "nguyen-van",
      shown: true,
      label: `Nguyên văn cả đoạn · ${ch.verses.length} câu`,
      body: (
        <p className="leading-[1.85]">
          <VerseText verses={ch.verses} />
        </p>
      ),
    },
  ].filter((f) => f.shown);

  return (
    <div className="mx-auto grid w-full max-w-[90rem] flex-1 items-start gap-x-14 gap-y-10 px-6 pt-10 pb-16 lg:grid-cols-[12rem_minmax(0,44rem)_20rem] lg:justify-center lg:pt-14">
      <nav aria-label="Trong trang này" className="hidden font-sans text-sm lg:sticky lg:top-6 lg:block">
        <p className="mb-3 text-xs font-semibold tracking-widest text-muted uppercase">Trong trang này</p>
        <ol className="space-y-0.5">
          {[{ id: "cau-chuyen", label: "Câu chuyện" }, ...folds].map((f) => (
            <li key={f.id}>
              <a
                href={`#${f.id}`}
                onClick={() => openSection(f.id)}
                className="block rounded-lg px-3 py-2 text-ink/80 hover:bg-side hover:text-ink"
              >
                {f.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <article className="min-w-0">
        <Reveal>
          <p className="font-sans text-xs font-semibold tracking-widest text-accent uppercase">
            {ch.book.name} · Đoạn {ch.number}
          </p>
          <h1 className="mt-2 text-4xl leading-tight font-semibold text-balance lg:text-5xl">{ch.title}</h1>
          <p className="mt-4 text-lg text-muted italic">
            Kể lại {ch.verses.length} câu Kinh Thánh bằng lời thường. Bấm chỗ dẫn trong ngoặc để đọc nguyên văn.
          </p>

          <section id="cau-chuyen" aria-label="Câu chuyện" className="mt-10 scroll-mt-6 space-y-6 text-[1.25rem] leading-[1.85]">
            {story.map((p, i) => (
              <div key={i}>
                <StoryParagraph nodes={p} view={ch} dropCap={i === 0} />
              </div>
            ))}
          </section>
        </Reveal>

        <p aria-hidden="true" className="mt-14 text-center text-xl tracking-[0.6em] text-muted/60">
          * * *
        </p>

        <div className="mt-8 border-b border-rule">
          {folds.map((f) => (
            <details key={f.id} id={f.id} className="group scroll-mt-6 border-t border-rule">
              <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 text-2xl font-semibold [&::-webkit-details-marker]:hidden">
                {f.label}
                <span aria-hidden="true" className="font-sans text-base text-muted group-open:rotate-180">
                  ▾
                </span>
              </summary>
              <div className="space-y-4 pb-6 text-[1.1rem] leading-[1.75]">{f.body}</div>
            </details>
          ))}
        </div>

        <p className="mt-6 font-sans text-sm text-muted">
          {ch.mode === "nhap"
            ? "Mức tin cậy chỉ hiện ở chế độ Nháp. Trang công bố chỉ giữ ý kiến đã đối chiếu."
            : "Ghi chú do AI soạn, đã được duyệt; ý kiến các nhà giải kinh đã đối chiếu với nguồn."}
        </p>
      </article>

      {written("Ý chính") && (
        <aside aria-labelledby="dieu-can-nho" className="rounded-2xl border border-rule bg-card px-6 py-5">
          <h2 id="dieu-can-nho" className="font-sans text-xs font-semibold tracking-widest text-muted uppercase">
            Điều cần nhớ
          </h2>
          <div className="mt-3 space-y-3.5 text-base leading-relaxed">
            <Prose section={section("Ý chính")} />
          </div>
        </aside>
      )}
    </div>
  );
}

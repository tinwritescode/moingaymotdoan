import type { JSX } from "@solidjs/web";
import { createMemo, createSignal, For, Show } from "solid-js";
import type { ChapterView, Inline, Opinion, Section } from "../../lib/content";
import { verseLabel } from "../../lib/content/refs";
import { InlineText } from "./inline";
import { InlineVersesContext, type VerseRange } from "./inline-verses";
import { VerseText } from "./verse-text";

const LEVEL = {
  cao: { label: "Cao", class: "bg-cao/10 text-cao" },
  vua: { label: "Vừa", class: "bg-vua/10 text-vua" },
  thap: { label: "Thấp", class: "bg-thap/10 text-thap" },
} as const;

function DraftOpinion(props: { opinion: Opinion }) {
  return (
    <article class="kt-opinion rounded-xl border border-rule p-4">
      <p>
        <InlineText nodes={props.opinion.body} />
      </p>
      <p class="mt-2 flex flex-wrap items-center gap-2 font-sans text-xs">
        <span class={["rounded-md px-2 py-0.5 font-semibold", LEVEL[props.opinion.level].class]}>
          Tin cậy: {LEVEL[props.opinion.level].label}
        </span>
        <span class="rounded-md border border-rule px-2 py-0.5 font-semibold text-muted">
          {props.opinion.verified ? "Đã đối chiếu" : "Chưa đối chiếu"}
        </span>
        <span class="text-muted">{props.opinion.reason}</span>
      </p>
    </article>
  );
}

/** One paragraph of Câu chuyện. Its chỗ dẫn into this chapter open the verses right below it. */
function StoryParagraph(props: { nodes: Inline[]; view: ChapterView; dropCap: boolean }) {
  const [shown, setShown] = createSignal<VerseRange | null>(null);
  const verses = () => {
    const r = shown();
    return r ? props.view.verses.slice(r.from - 1, r.to) : [];
  };
  const inline = {
    get bookCode() {
      return props.view.book.code;
    },
    get chapter() {
      return props.view.number;
    },
    shown,
    toggle: (r: VerseRange) => setShown((s) => (s?.from === r.from && s.to === r.to ? null : r)),
  };

  return (
    <InlineVersesContext value={inline}>
      <p
        class={{
          "first-letter:float-left first-letter:mt-1.5 first-letter:mr-2.5 first-letter:text-[4.6rem] first-letter:leading-[0.9] first-letter:font-semibold first-letter:text-accent":
            props.dropCap,
        }}
      >
        <InlineText nodes={props.nodes} />
      </p>
      <Show when={verses().length > 0}>
        <div class="kt-inline-verses mt-4 rounded-xl bg-side px-5 py-4 text-[1.05rem] leading-[1.75]">
          <p class="mb-1.5 font-sans text-xs font-semibold tracking-wider text-muted uppercase">
            Nguyên văn · {props.view.book.name} {verseLabel({ chapter: props.view.number, verses: verses() })}
          </p>
          <p>
            <VerseText verses={verses()} />
          </p>
        </div>
      </Show>
    </InlineVersesContext>
  );
}

function Prose(props: { section: Section | undefined }) {
  return (
    <For each={props.section?.paragraphs ?? []}>
      {(p) => (
        <p>
          <InlineText nodes={p} />
        </p>
      )}
    </For>
  );
}

/** Opens a folded section before the browser jumps to it; a closed <details> would hide the target. */
function openSection(id: string) {
  const el = document.getElementById(id);
  if (el instanceof HTMLDetailsElement) el.open = true;
}

type Fold = { id: string; label: string; body: () => JSX.Element };

/**
 * The chapter page body: Câu chuyện as the one column to read, Ý chính beside it, and the
 * rest (deeper meaning, cautions, commentators, the full text) folded below the story.
 */
export function ChapterReader(props: { view: ChapterView }) {
  const section = (heading: Section["heading"]) => props.view.sections.find((s) => s.heading === heading);
  // A ghi chú may have only its story written so far; empty parts stay off the page.
  const written = (heading: Section["heading"]) => (section(heading)?.paragraphs.length ?? 0) > 0;
  const prose = (id: string, heading: Section["heading"]): Fold[] =>
    written(heading) ? [{ id, label: heading, body: () => <Prose section={section(heading)} /> }] : [];

  const folds = createMemo((): Fold[] => {
    const ch = props.view;
    const opinions: Fold[] =
      ch.opinions.length === 0
        ? []
        : [
            {
              id: "giai-kinh",
              label: `Các nhà giải kinh nói gì (${ch.opinions.length})`,
              body: () =>
                ch.mode === "nhap" ? (
                  <For each={ch.opinions}>{(o) => <DraftOpinion opinion={o} />}</For>
                ) : (
                  <For each={ch.opinions}>
                    {(body) => (
                      <article class="kt-opinion rounded-xl border border-rule p-4">
                        <InlineText nodes={body} />
                      </article>
                    )}
                  </For>
                ),
            },
          ];
    return [
      ...prose("y-nghia", "Ý nghĩa sâu xa"),
      ...prose("luu-y", "Lưu ý"),
      ...opinions,
      {
        id: "nguyen-van",
        label: `Nguyên văn cả đoạn · ${ch.verses.length} câu`,
        body: () => (
          <p class="leading-[1.85]">
            <VerseText verses={ch.verses} />
          </p>
        ),
      },
    ];
  });

  return (
    <div class="kt-reader mx-auto grid w-full max-w-[90rem] flex-1 items-start gap-x-14 gap-y-10 px-6 pt-10 pb-16 lg:grid-cols-[12rem_minmax(0,44rem)_20rem] lg:justify-center lg:pt-14">
      <nav aria-label="Trong trang này" class="kt-toc hidden font-sans text-sm lg:sticky lg:top-6 lg:block">
        <p class="mb-3 text-xs font-semibold tracking-widest text-muted uppercase">Trong trang này</p>
        <ol class="space-y-0.5">
          <For each={[{ id: "cau-chuyen", label: "Câu chuyện" }, ...folds()]}>
            {(f) => (
              <li>
                <a
                  href={`#${f.id}`}
                  onClick={() => openSection(f.id)}
                  class="block rounded-lg px-3 py-2 text-ink/80 hover:bg-side hover:text-ink"
                >
                  {f.label}
                </a>
              </li>
            )}
          </For>
        </ol>
      </nav>

      <article class="kt-chapter min-w-0">
        <div class="animate-reveal motion-reduce:animate-none">
          <p class="kt-kicker font-sans text-xs font-semibold tracking-widest text-accent uppercase">
            {props.view.book.name} · Đoạn {props.view.number}
          </p>
          <h1 class="kt-title mt-2 text-4xl leading-tight font-semibold text-balance lg:text-5xl">{props.view.title}</h1>
          <p class="kt-lead mt-4 text-lg text-muted italic">
            Kể lại {props.view.verses.length} câu Kinh Thánh bằng lời thường. Bấm chỗ dẫn trong ngoặc để đọc nguyên văn.
          </p>

          <section
            id="cau-chuyen"
            aria-label="Câu chuyện"
            class="kt-scripture mt-10 scroll-mt-6 space-y-6 text-[1.25rem] leading-[1.85]"
          >
            <For each={section("Câu chuyện")?.paragraphs ?? []}>
              {(p, i) => (
                <div>
                  <StoryParagraph nodes={p} view={props.view} dropCap={i() === 0} />
                </div>
              )}
            </For>
          </section>
        </div>

        <p aria-hidden="true" class="kt-divider mt-14 text-center text-xl tracking-[0.6em] text-muted/60">
          * * *
        </p>

        <div class="kt-notes mt-8 border-b border-rule">
          <For each={folds()}>
            {(f) => (
              <details id={f.id} class="kt-note group scroll-mt-6 border-t border-rule">
                <summary class="kt-note-heading flex min-h-14 cursor-pointer items-center justify-between gap-4 text-2xl font-semibold [&::-webkit-details-marker]:hidden">
                  {f.label}
                  <span aria-hidden="true" class="font-sans text-base text-muted group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <div class="kt-note-body space-y-4 pb-6 text-[1.1rem] leading-[1.75]">{f.body()}</div>
              </details>
            )}
          </For>
        </div>

        <p class="kt-byline mt-6 font-sans text-sm text-muted">
          {props.view.mode === "nhap"
            ? "Mức tin cậy chỉ hiện ở chế độ Nháp. Trang công bố chỉ giữ ý kiến đã đối chiếu."
            : "Ghi chú do AI soạn, đã được duyệt; ý kiến các nhà giải kinh đã đối chiếu với nguồn."}
        </p>
      </article>

      <Show when={written("Ý chính")}>
        <aside aria-labelledby="dieu-can-nho" class="kt-aside rounded-2xl border border-rule bg-card px-6 py-5">
          <h2 id="dieu-can-nho" class="font-sans text-xs font-semibold tracking-widest text-muted uppercase">
            Điều cần nhớ
          </h2>
          <div class="mt-3 space-y-3.5 text-base leading-relaxed">
            <Prose section={section("Ý chính")} />
          </div>
        </aside>
      </Show>
    </div>
  );
}

import { Title } from "@solidjs/meta";
import { defineFileRoute } from "@solidjs/router/fs";
import type { RouteProps } from "@solidjs/router";
import { createMemo, isPending, Show } from "solid-js";
import type { ChapterLink, ChapterView } from "../../../lib/content";
import { ChapterKeys } from "../../components/chapter-keys";
import { ChapterReader } from "../../components/chapter-reader";
import { NotFound } from "../../components/not-found";
import { SiteHeader } from "../../components/site-header";
import { getChapter, getToc } from "../../data";
import { chapterHref } from "../../router";

// Starts loading the đoạn and the header's mục lục together, as soon as navigation (or a link preload) begins.
export const route = defineFileRoute("/:book/:chapter", {
  preload: ({ params }) => {
    void getToc();
    void getChapter(params.book, Number(params.chapter));
  },
});

const PAGER = "kt-pager inline-flex min-h-11 items-center rounded-lg border border-rule px-3.5 text-sm";

const hrefOf = (l: ChapterLink) => chapterHref({ slug: l.book.slug, number: l.number });
const linkHref = (l: ChapterLink | null) => (l ? hrefOf(l) : null);
const draftOf = (v: ChapterView) => (v.mode === "nhap" ? v : null);
/** Names the book only when the link leaves the current one. */
const labelOf = (l: ChapterLink, here: ChapterView) =>
  l.book.code === here.book.code ? `Đoạn ${l.number}` : `${l.book.name} ${l.number}`;

/** Only đoạn with a ghi chú (and, in Công bố, only approved ones) exist; anything else is the not-found page. */
export default function ChapterPage(props: RouteProps<typeof route>) {
  const view = createMemo(() => getChapter(props.params.book, Number(props.params.chapter)));
  return (
    <Show when={view()} fallback={<NotFound />}>
      {(ch) => (
        // Keeps the đoạn on screen, dimmed, while the next one loads.
        <div class={["flex flex-1 flex-col transition-opacity", { "opacity-60": isPending(view) }]}>
          <Title>{`${ch().book.name} ${ch().number} — ${ch().title}`}</Title>
          <SiteHeader book={ch().book.slug}>
            <nav aria-label="Vị trí" class="kt-crumbs flex gap-2 text-sm text-muted">
              <a href="/" class="hover:text-accent">
                Mục lục
              </a>
              <span aria-hidden="true">/</span>
              <a href={`/#${ch().book.slug}`} class="hover:text-accent">
                {ch().book.name}
              </a>
              <span aria-hidden="true">/</span>
              <span class="text-ink">Đoạn {ch().number}</span>
            </nav>
            <div class="flex-1" />
            <Show when={draftOf(ch())}>
              {(d) => (
                <span class="rounded-full bg-vua/15 px-2.5 py-1 text-xs font-semibold text-vua">
                  Nháp · {d().approved ? "Đã duyệt" : "Chưa duyệt"} · Cao {d().summary.cao} · Vừa {d().summary.vua} · Thấp{" "}
                  {d().summary.thap} · Đã đối chiếu {d().summary.verified}/{d().summary.total}
                </span>
              )}
            </Show>
            <nav aria-label="Đoạn trước và sau" class="flex gap-2">
              <Show when={ch().prev} fallback={<span class={`${PAGER} text-muted/60`}>← Đoạn trước</span>}>
                {(l) => (
                  <a href={hrefOf(l())} title={l().title} class={`${PAGER} bg-card hover:border-accent`}>
                    ← {labelOf(l(), ch())}
                  </a>
                )}
              </Show>
              <Show when={ch().next} fallback={<span class={`${PAGER} text-muted/60`}>Đoạn sau →</span>}>
                {(l) => (
                  <a href={hrefOf(l())} title={l().title} class={`${PAGER} bg-card hover:border-accent`}>
                    {labelOf(l(), ch())} →
                  </a>
                )}
              </Show>
            </nav>
          </SiteHeader>
          <ChapterKeys prev={linkHref(ch().prev)} next={linkHref(ch().next)} />
          <ChapterReader view={ch()} />
        </div>
      )}
    </Show>
  );
}

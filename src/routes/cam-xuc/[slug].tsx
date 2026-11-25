import { Title } from "@solidjs/meta";
import type { RouteProps } from "@solidjs/router";
import { defineFileRoute } from "@solidjs/router/fs";
import { createMemo, For, isPending, Show } from "solid-js";
import type { MoodNavLink } from "../../../lib/moods/types";
import { AI_NOTICE } from "../../../lib/notice";
import { ChapterKeys } from "../../components/chapter-keys";
import { CopyVerseButton } from "../../components/copy-verse-button";
import { NotFound } from "../../components/not-found";
import { MoodVisitRecorder } from "../../components/reading-tracker";
import { SiteHeader } from "../../components/site-header";
import { VerseText } from "../../components/verse-text";
import { getMood, getToc } from "../../data";
import { chapterHref, moodHref } from "../../router";

export const route = defineFileRoute("/cam-xuc/:slug", {
  preload: ({ params }) => {
    void getToc();
    void getMood(params.slug);
  },
});

const KICKER = "font-sans text-xs font-semibold tracking-[0.14em] text-muted uppercase";
const PAGER =
  "kt-pager inline-flex min-h-11 items-center rounded-lg border border-rule px-3.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const linkHref = (link: MoodNavLink | null) => (link ? moodHref(link.slug) : null);

/** Trang chi tiết một chuyên mục cảm xúc: lời mở đầu, các câu Kinh Thánh Bản Truyền Thống và gợi ý suy ngẫm. */
export default function CamXucDetailPage(props: RouteProps<typeof route>) {
  const view = createMemo(() => getMood(props.params.slug));

  return (
    <Show when={view()} fallback={<NotFound />}>
      {(mood) => (
        <div class={["flex flex-1 flex-col transition-opacity", { "opacity-60": isPending(view) }]}>
          <Title>{`${mood().title} — Đọc Kinh Thánh theo cảm xúc`}</Title>
          <SiteHeader section="cam-xuc">
            <nav aria-label="Vị trí" class="kt-crumbs hidden flex-wrap gap-2 text-sm text-muted sm:flex">
              <a href="/cam-xuc" class="hover:text-accent">
                100 cảm xúc
              </a>
              <span aria-hidden="true">/</span>
              <span class="text-ink">{mood().title}</span>
            </nav>
            <div class="hidden flex-1 sm:block" />
            <nav aria-label="Chuyên mục trước và sau" class="hidden gap-2 sm:flex">
              <Show when={mood().prev} fallback={<span class={`${PAGER} text-muted/60`}>← Trước</span>}>
                {(l) => (
                  <a href={moodHref(l().slug)} title={l().title} class={`${PAGER} bg-card hover:border-accent`}>
                    ← Trước
                  </a>
                )}
              </Show>
              <Show when={mood().next} fallback={<span class={`${PAGER} text-muted/60`}>Sau →</span>}>
                {(l) => (
                  <a href={moodHref(l().slug)} title={l().title} class={`${PAGER} bg-card hover:border-accent`}>
                    Sau →
                  </a>
                )}
              </Show>
            </nav>
          </SiteHeader>

          <ChapterKeys prev={linkHref(mood().prev)} next={linkHref(mood().next)} />
          <MoodVisitRecorder slug={mood().slug} title={mood().title} groupName={mood().group.name} />

          <main class="mx-auto w-full max-w-3xl animate-reveal px-4 pt-7 pb-20 sm:px-6 sm:pt-10 motion-reduce:animate-none">
            <header class="border-b border-rule pb-8">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class={`${KICKER} text-accent`}>
                  <a href={`/cam-xuc#${mood().group.id}`} class="hover:underline">
                    {mood().group.name}
                  </a>
                </p>
                <a href="/cam-xuc" class="font-sans text-xs font-medium text-muted hover:text-accent sm:hidden">
                  ← 100 cảm xúc
                </a>
              </div>
              <h1 class="mt-3 font-display text-4xl leading-tight font-extrabold text-balance sm:text-5xl">
                {mood().title}
              </h1>
              <p class="mt-2 font-sans text-base text-muted">{mood().prompt}</p>
              <p class="mt-6 rounded-r-xl border-l-2 border-accent/60 bg-side/70 px-5 py-4 text-lg leading-relaxed">
                {mood().intro}
              </p>
            </header>

            <section aria-labelledby="loi-kinh-thanh" class="mt-9">
              <h2 id="loi-kinh-thanh" class={KICKER}>
                Lời Kinh Thánh dành cho bạn · {mood().passages.length} đoạn
              </h2>

              <ol class="mt-5 space-y-5">
                <For each={mood().passages}>
                  {(p, i) => (
                    <li class="rounded-xl border border-rule bg-card p-5 sm:p-6">
                      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3">
                        <div class="flex flex-wrap items-baseline gap-x-2.5">
                          <h3 class="font-display text-2xl font-semibold text-accent">{p.ref.label}</h3>
                          <span class="font-sans text-xs font-medium text-muted">
                            ({i() + 1}/{mood().passages.length})
                          </span>
                        </div>
                        <CopyVerseButton label={p.ref.label} verses={p.ref.verses} />
                      </div>

                      <blockquote class="mt-4 border-l-2 border-accent/50 pl-4 font-serif text-[1.15rem] leading-[1.8] text-ink">
                        <VerseText verses={p.ref.verses} />
                      </blockquote>

                      <p class="mt-4 text-base leading-relaxed text-muted">{p.note}</p>

                      <div class="mt-5 border-t border-rule pt-3 font-sans text-sm">
                        <Show
                          when={p.hasChapter}
                          fallback={
                            <span class="text-muted">
                              Thuộc đoạn {p.ref.book.name} {p.ref.chapter}
                            </span>
                          }
                        >
                          <a
                            href={chapterHref({ slug: p.ref.book.slug, number: p.ref.chapter })}
                            class="inline-flex flex-wrap items-baseline gap-x-1.5 font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                          >
                            <span>
                              Đọc cả đoạn &amp; ghi chú {p.ref.book.name} {p.ref.chapter}
                            </span>
                            <Show when={p.chapterTitle}>
                              {(t) => <span class="font-normal text-muted">— {t()}</span>}
                            </Show>
                            <span aria-hidden="true">→</span>
                          </a>
                        </Show>
                      </div>
                    </li>
                  )}
                </For>
              </ol>
            </section>

            <Show when={mood().related.length > 0}>
              <section aria-labelledby="lien-quan" class="mt-12 border-t border-rule pt-9">
                <h2 id="lien-quan" class={KICKER}>
                  Có thể bạn cũng đang tìm
                </h2>
                <ul class="mt-4 grid gap-3 sm:grid-cols-2">
                  <For each={mood().related}>
                    {(r) => (
                      <li>
                        <a
                          href={moodHref(r.slug)}
                          class="group block h-full rounded-xl border border-rule bg-card p-4 transition-colors hover:border-accent hover:bg-side/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                          <p class="font-serif text-base font-semibold group-hover:text-accent">{r.title}</p>
                          <p class="mt-1 text-sm text-muted">{r.prompt}</p>
                        </a>
                      </li>
                    )}
                  </For>
                </ul>
              </section>
            </Show>

            <p class="mt-10 font-sans text-sm leading-relaxed text-muted">{AI_NOTICE}</p>

            <nav
              aria-label="Điều hướng cuối trang"
              class="mt-6 flex flex-col gap-4 border-t border-rule pt-6 font-sans text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <a href="/cam-xuc" class="font-semibold text-accent underline-offset-4 hover:underline">
                ← Xem lại cả 100 chuyên mục cảm xúc
              </a>
              <div class="flex flex-wrap gap-2">
                <Show when={mood().prev}>
                  {(l) => (
                    <a href={moodHref(l().slug)} class={`${PAGER} bg-card hover:border-accent`}>
                      ← {l().title}
                    </a>
                  )}
                </Show>
                <Show when={mood().next}>
                  {(l) => (
                    <a href={moodHref(l().slug)} class={`${PAGER} bg-card hover:border-accent`}>
                      {l().title} →
                    </a>
                  )}
                </Show>
              </div>
            </nav>
          </main>
        </div>
      )}
    </Show>
  );
}

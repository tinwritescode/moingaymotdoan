import { createMemo, Show } from "solid-js";
import type { TocBook } from "../../lib/content";
import { formatDateTime } from "../../lib/history/types";
import { chapterHref } from "../router";
import { useUser } from "./user-context";

type NextChapter = {
  href: string;
  label: string;
  title: string;
};

/** Tìm đoạn kế tiếp ngay sau (bookSlug, chapter) theo thứ tự mục lục Kinh Thánh. */
export function findNextChapter(toc: TocBook[], bookSlug: string | null, chapter: number | null): NextChapter | null {
  if (!bookSlug || !chapter) return null;
  const bookIndex = toc.findIndex((b) => b.book.slug === bookSlug);
  if (bookIndex < 0) return null;
  const book = toc[bookIndex];
  const chIndex = book.chapters.findIndex((c) => c.number === chapter);
  if (chIndex < 0) return null;

  const sameBookNext = book.chapters[chIndex + 1];
  if (sameBookNext) {
    return {
      href: chapterHref({ slug: book.book.slug, number: sameBookNext.number }),
      label: `${book.book.name} ${sameBookNext.number}`,
      title: sameBookNext.title,
    };
  }

  const nextBook = toc[bookIndex + 1];
  const firstNext = nextBook?.chapters[0];
  if (nextBook && firstNext) {
    return {
      href: chapterHref({ slug: nextBook.book.slug, number: firstNext.number }),
      label: `${nextBook.book.name} ${firstNext.number}`,
      title: firstNext.title,
    };
  }
  return null;
}

/** Khối "Xem tiếp" hiện trên trang chủ ngay khi người đọc đã có ít nhất một đoạn trong lịch sử. */
export function ContinueReading(props: { toc: TocBook[] }) {
  const { ready, latestChapter, stats, user } = useUser();

  const nextChapter = createMemo(() => {
    const latest = latestChapter();
    return latest ? findNextChapter(props.toc, latest.bookSlug, latest.chapter) : null;
  });

  return (
    <Show when={ready() && latestChapter()}>
      {(latest) => (
        <section
          aria-labelledby="xem-tiep-heading"
          class="mt-6 rounded-2xl border border-accent/35 bg-card p-5 sm:p-6"
        >
          <div class="flex flex-wrap items-center justify-between gap-2 font-sans text-xs">
            <p id="xem-tiep-heading" class="font-semibold tracking-[0.14em] text-accent uppercase">
              Xem tiếp · {formatDateTime(latest().lastReadAt)}
            </p>
            <div class="flex flex-wrap items-center gap-3 text-muted">
              <Show when={latest().completed}>
                <span class="rounded-full bg-cao/10 px-2.5 py-0.5 font-medium text-cao">✓ Đã đọc xong</span>
              </Show>
              <span>
                Đã xem <strong class="font-semibold text-ink">{stats().chaptersRead}</strong> / 1.189 đoạn
              </span>
            </div>
          </div>

          <div class="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div class="min-w-0 flex-1">
              <p class="font-sans text-sm font-medium text-muted">{latest().subtitle}</p>
              <h2 class="mt-0.5 font-display text-2xl leading-snug font-semibold sm:text-3xl">{latest().title}</h2>
            </div>

            <div class="flex flex-wrap items-center gap-2.5 font-sans text-sm">
              <a
                href={chapterHref({ slug: latest().bookSlug ?? "", number: latest().chapter ?? 1 })}
                class="inline-flex min-h-11 items-center rounded-xl bg-ink px-5 font-semibold text-paper transition-colors hover:bg-accent"
              >
                {latest().completed ? "Đọc lại đoạn này" : "Xem tiếp đoạn này"}
              </a>
              <Show when={nextChapter()}>
                {(next) => (
                  <a
                    href={next().href}
                    title={next().title}
                    class="inline-flex min-h-11 items-center rounded-xl border border-rule bg-paper/60 px-4 font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    Đoạn kế: {next().label} →
                  </a>
                )}
              </Show>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-3 font-sans text-xs text-muted">
            <a href="/lich-su" class="font-medium text-accent underline-offset-4 hover:underline">
              Xem toàn bộ lịch sử đọc ({stats().readingDays} ngày) →
            </a>
            <Show when={!user()}>
              <a href="/tai-khoan?next=/" class="underline underline-offset-4 hover:text-accent">
                Đăng nhập để đồng bộ lịch sử trên mọi thiết bị
              </a>
            </Show>
          </div>
        </section>
      )}
    </Show>
  );
}

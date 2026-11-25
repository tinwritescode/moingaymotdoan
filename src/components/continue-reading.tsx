import { createMemo, Show } from "solid-js";
import type { TocBook } from "../../lib/content";
import { formatDateTime } from "../../lib/history/types";
import { chapterHref } from "../router";
import { ProgressRing, WeeklyDots } from "./progress-ring";
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

/** Khối "Xem tiếp" + 3 thẻ thống kê tĩnh lặng trên trang chủ khi người đọc đã có lịch sử. */
export function ContinueReading(props: { toc: TocBook[] }) {
  const { ready, latestChapter, stats, logs, bookSummary, user } = useUser();

  const nextChapter = createMemo(() => {
    const latest = latestChapter();
    return latest ? findNextChapter(props.toc, latest.bookSlug, latest.chapter) : null;
  });

  const bookPercent = createMemo(() => {
    const latest = latestChapter();
    if (!latest?.bookSlug) return 0;
    const book = props.toc.find((b) => b.book.slug === latest.bookSlug);
    const total = book?.chapters.length ?? 0;
    if (total === 0) return 0;
    const read = bookSummary(latest.bookSlug)?.read ?? 1;
    return Math.min(100, Math.round((read / total) * 100));
  });

  return (
    <Show when={ready() && latestChapter()}>
      {(latest) => (
        <div class="space-y-2.5">
          <section
            aria-labelledby="xem-tiep-heading"
            class="grid grid-cols-[4.5rem_1fr] items-center gap-4 rounded-3xl border border-rule bg-card p-5"
          >
            <div class="relative h-[4.5rem] w-[4.5rem]">
              <ProgressRing radius={30} percent={bookPercent()} />
              <span class="absolute inset-0 grid place-items-center font-sans text-sm font-medium text-ink">
                {bookPercent()}%
              </span>
            </div>

            <div class="min-w-0">
              <p id="xem-tiep-heading" class="font-sans text-xs font-medium text-accent">
                Xem tiếp · {formatDateTime(latest().lastReadAt)}
              </p>
              <h2 class="mt-0.5 truncate font-display text-xl font-normal text-ink sm:text-[1.35rem]">
                {latest().subtitle}
              </h2>
              <p class="truncate text-sm text-muted">{latest().title}</p>
            </div>

            <div class="col-span-full flex flex-wrap items-center gap-2 font-sans text-sm">
              <a
                href={chapterHref({ slug: latest().bookSlug ?? "", number: latest().chapter ?? 1 })}
                class="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 font-medium text-paper transition-opacity hover:opacity-90"
              >
                {latest().completed ? "Đọc lại đoạn này" : "Tiếp tục đọc"}
              </a>
              <Show when={nextChapter()}>
                {(next) => (
                  <a
                    href={next().href}
                    title={next().title}
                    class="inline-flex min-h-11 items-center rounded-full bg-side px-4 font-normal text-accent transition-colors hover:bg-accent hover:text-paper"
                  >
                    Đoạn kế: {next().label} →
                  </a>
                )}
              </Show>
            </div>
          </section>

          <section aria-label="Thống kê đọc" class="grid grid-cols-3 gap-2 font-sans">
            <a
              href="/lich-su"
              class="rounded-2xl border border-rule bg-card p-3.5 transition-colors hover:border-accent"
            >
              <strong class="block text-2xl leading-none font-light text-ink">{stats().chaptersRead}</strong>
              <span class="mt-1 block text-[11.5px] text-muted">đoạn đã xem</span>
            </a>

            <a
              href="/lich-su"
              class="rounded-2xl border border-rule bg-card p-3.5 transition-colors hover:border-accent"
            >
              <strong class="block text-2xl leading-none font-light text-ink">{stats().streak}</strong>
              <span class="mt-1 block text-[11.5px] text-muted">ngày liên tiếp</span>
              <WeeklyDots logs={logs()} />
            </a>

            <a
              href="/lich-su"
              class="rounded-2xl border border-rule bg-card p-3.5 transition-colors hover:border-accent"
            >
              <strong class="block text-2xl leading-none font-light text-ink">{stats().booksOpened}</strong>
              <span class="mt-1 block text-[11.5px] text-muted">sách đã mở</span>
            </a>
          </section>

          <Show when={!user()}>
            <p class="px-1 font-sans text-xs text-muted">
              Lịch sử đang lưu trên máy này ·{" "}
              <a href="/tai-khoan?next=/" class="text-accent underline underline-offset-4">
                Đăng nhập để đồng bộ mọi thiết bị
              </a>
            </p>
          </Show>
        </div>
      )}
    </Show>
  );
}

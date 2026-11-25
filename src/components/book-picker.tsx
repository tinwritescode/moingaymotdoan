import { createMemo, createSignal, For, Loading, Show } from "solid-js";
import type { TocBook } from "../../lib/content";
import { booksFor, testamentOf } from "../../lib/content/books";
import type { Locale } from "../../lib/i18n";
import { getToc } from "../data";
import { chapterHref, ebookHref } from "../router";
import { ariaState } from "./aria";
import { useLocale } from "./locale-context";
import { Popover } from "./popover";
import { Bone, Skeleton } from "./skeleton";

export type PickerBook = {
  slug: string;
  name: string;
  testament: "cu-uoc" | "tan-uoc";
  chapters: { number: number; title: string }[];
};

export function pickerBooks(toc: TocBook[], locale: Locale = "vi"): PickerBook[] {
  const written = new Map(toc.map((t) => [t.book.code, t.chapters]));
  return booksFor(locale).map((b) => ({
    slug: b.slug,
    name: b.name,
    testament: testamentOf(b),
    chapters: (written.get(b.code) ?? []).map((ch) => ({ number: ch.number, title: ch.title })),
  }));
}

/**
 * "Sách ▾" / "Books ▾" in the top bar: pick a book on the left, then a chapter from its grid on the right.
 * Every book is listed so the reader sees the whole Bible; books with no notes yet are greyed out.
 */
export function BookPicker(props: { current?: string }) {
  const { locale, t } = useLocale();
  return (
    <Popover
      trigger={
        <>
          {t().header.booksButton} <span aria-hidden="true">▾</span>
        </>
      }
      triggerClass="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-rule bg-card px-3 text-sm text-ink transition-colors hover:border-accent sm:min-h-10 sm:px-3.5"
      title={t().header.pickBookAndChapter}
      titleClass="sr-only"
      class="kt-picker w-[min(44rem,calc(100vw-2rem))] grid-cols-1 overflow-hidden font-sans open:grid sm:grid-cols-[14rem_1fr]"
    >
      {(close) => (
        <>
          {/* First, not last: on a phone the lists below run past the screen. */}
          <a
            href={ebookHref(locale())}
            onClick={close}
            class="flex min-h-11 items-center gap-2 border-b border-rule px-5 text-sm font-medium text-accent transition-colors hover:bg-side sm:col-span-2"
          >
            <span aria-hidden="true">↓</span>
            {t().footer.downloadEbook} (EPUB)
          </a>
          <Loading
            fallback={
              <Skeleton label={t().skeleton.loading} class="space-y-3 p-4 sm:col-span-2">
                <Bone class="h-4 w-2/3" />
                <Bone class="h-4 w-1/2" />
                <Bone class="h-4 w-3/5" />
              </Skeleton>
            }
          >
            <PickerPanel current={props.current} close={close} />
          </Loading>
        </>
      )}
    </Popover>
  );
}

/**
 * The open picker's book list and chapter grid. It loads the table of contents itself, so the toc is
 * fetched only when a reader opens the picker and is never serialized into a prerendered page.
 */
function PickerPanel(props: { current?: string; close: () => void }) {
  const { locale, t } = useLocale();
  const books = createMemo(async () => pickerBooks((await getToc(locale())).books, locale()));
  const [picked, setPicked] = createSignal(() => props.current ?? books().find((b) => b.chapters.length > 0)?.slug);
  const book = () => books().find((b) => b.slug === picked());
  const groups = createMemo(() => [
    { testament: "cu-uoc" as const, label: t().header.oldTestament },
    { testament: "tan-uoc" as const, label: t().header.newTestament },
  ]);

  return (
        <>
          <nav
            aria-label={t().header.booksNavLabel}
            class="max-h-[min(60vh,32rem)] overflow-y-auto border-b border-rule p-2 sm:border-r sm:border-b-0"
          >
            <For each={groups()}>
              {(g) => (
                <div>
                  <p class="px-3 pt-3 pb-1 text-xs font-semibold tracking-widest text-muted uppercase">{g.label}</p>
                  <ul>
                    <For each={books().filter((b) => b.testament === g.testament)}>
                      {(b) => (
                        <li>
                          <button
                            type="button"
                            disabled={b.chapters.length === 0}
                            aria-pressed={ariaState(b.slug === picked())}
                            onClick={() => setPicked(b.slug)}
                            class="flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 text-left text-sm hover:bg-side disabled:cursor-default disabled:text-muted/70 disabled:hover:bg-transparent aria-pressed:bg-side aria-pressed:font-semibold aria-pressed:text-accent"
                          >
                            <span>{b.name}</span>
                            <Show when={b.chapters.length > 0}>
                              <span class="text-xs text-muted">{b.chapters.length}</span>
                            </Show>
                          </button>
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              )}
            </For>
          </nav>
          <div class="max-h-[min(60vh,32rem)] overflow-y-auto p-4">
            <Show when={book()}>
              {(b) => (
                <>
                  <p class="font-serif text-lg font-semibold">{b().name}</p>
                  <ol
                    aria-label={t().header.chaptersOfBook(b().name)}
                    class="mt-3 grid grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-1.5"
                  >
                    <For each={b().chapters}>
                      {(ch) => (
                        <li>
                          <a
                            href={chapterHref({ slug: b().slug, number: ch.number, locale: locale() })}
                            title={ch.title}
                            onClick={props.close}
                            class="flex aspect-square items-center justify-center rounded-full border border-rule text-xs text-muted transition-colors hover:border-accent hover:bg-side hover:text-accent"
                          >
                            {ch.number}
                          </a>
                        </li>
                      )}
                    </For>
                  </ol>
                </>
              )}
            </Show>
          </div>
        </>
  );
}

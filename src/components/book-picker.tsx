import { createSignal, For, Show } from "solid-js";
import { chapterHref } from "../router";
import { ariaState } from "./aria";
import { Popover } from "./popover";

export type PickerBook = {
  slug: string;
  name: string;
  testament: "cu-uoc" | "tan-uoc";
  chapters: { number: number; title: string }[];
};

const GROUPS = [
  { testament: "cu-uoc", label: "Cựu Ước" },
  { testament: "tan-uoc", label: "Tân Ước" },
] as const;

/**
 * "Sách ▾" in the top bar: pick a book on the left, then a đoạn from its grid on the right.
 * Every book is listed so the reader sees the whole Bible; books with no ghi chú yet are greyed out.
 */
export function BookPicker(props: { books: PickerBook[]; current?: string }) {
  const [picked, setPicked] = createSignal(
    () => props.current ?? props.books.find((b) => b.chapters.length > 0)?.slug,
  );
  const book = () => props.books.find((b) => b.slug === picked());

  return (
    <Popover
      trigger={
        <>
          Sách <span aria-hidden="true">▾</span>
        </>
      }
      triggerClass="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg border border-rule px-3.5 text-sm hover:border-accent"
      title="Chọn sách và đoạn"
      titleClass="sr-only"
      class="w-[min(46rem,calc(100vw-2rem))] grid-cols-1 overflow-hidden font-sans open:grid sm:grid-cols-[15rem_1fr]"
    >
      {(close) => (
        <>
          <nav
            aria-label="Các sách"
            class="max-h-[min(60vh,32rem)] overflow-y-auto border-b border-rule p-2 sm:border-r sm:border-b-0"
          >
            <For each={GROUPS}>
              {(g) => (
                <div>
                  <p class="px-3 pt-3 pb-1 text-xs font-semibold tracking-widest text-muted uppercase">{g.label}</p>
                  <ul>
                    <For each={props.books.filter((b) => b.testament === g.testament)}>
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
                    aria-label={`Các đoạn ${b().name}`}
                    class="mt-3 grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1.5"
                  >
                    <For each={b().chapters}>
                      {(ch) => (
                        <li>
                          <a
                            href={chapterHref({ slug: b().slug, number: ch.number })}
                            title={ch.title}
                            onClick={close}
                            class="flex min-h-11 items-center justify-center rounded-lg border border-rule text-sm hover:border-accent hover:text-accent"
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
      )}
    </Popover>
  );
}

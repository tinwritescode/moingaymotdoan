import { Show, useContext } from "solid-js";
import type { Ref } from "../../lib/content";
import { verseLabel } from "../../lib/content/refs";
import { ariaState } from "./aria";
import { InlineVersesContext } from "./inline-verses";
import { Popover } from "./popover";
import { VerseText } from "./verse-text";

const LINK =
  "kt-ref mx-0.5 inline-flex cursor-pointer items-center rounded-full bg-side px-2 py-0.5 align-[0.12em] font-sans text-[0.65em] font-medium text-accent transition-colors hover:bg-accent hover:text-paper aria-expanded:bg-accent aria-expanded:text-paper";

/**
 * A chỗ dẫn the reader can tap. Into the chapter being read: opens those verses under the paragraph.
 * Elsewhere: shows the verses in a popover anchored under the words.
 */
export function RefButton(props: { reference: Ref }) {
  const inline = useContext(InlineVersesContext);
  const range = () => ({
    from: props.reference.verses[0].number,
    to: props.reference.verses[props.reference.verses.length - 1].number,
  });
  const here = () =>
    inline !== null && inline.bookCode === props.reference.book.code && inline.chapter === props.reference.chapter
      ? inline
      : null;

  return (
    <Show
      when={here()}
      fallback={
        <Popover
          trigger={props.reference.label}
          triggerClass={LINK}
          title={`${props.reference.book.name} ${verseLabel(props.reference)}`}
          titleClass="mb-2 font-sans text-sm font-semibold text-muted"
          class="kt-ref-popover w-[min(32rem,calc(100vw-2rem))] p-5 font-serif text-[1.075rem] leading-relaxed"
        >
          {(close) => (
            <>
              <span class="block">
                <VerseText verses={props.reference.verses} />
              </span>
              <button
                type="button"
                onClick={close}
                class="mt-3 cursor-pointer font-sans text-sm text-muted underline hover:text-accent"
              >
                Đóng
              </button>
            </>
          )}
        </Popover>
      }
    >
      {(ctx) => (
        <button
          type="button"
          aria-expanded={ariaState(ctx().shown()?.from === range().from && ctx().shown()?.to === range().to)}
          class={LINK}
          onClick={() => ctx().toggle(range())}
        >
          {props.reference.label}
        </button>
      )}
    </Show>
  );
}

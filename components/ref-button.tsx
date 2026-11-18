"use client";

import { Popover } from "@base-ui/react/popover";
import { useContext } from "react";
import type { Ref } from "@/lib/content";
import { InlineVersesContext } from "./inline-verses";
import { verseLabel, VerseText } from "./verse-text";

const LINK = "cursor-pointer text-accent underline decoration-dotted underline-offset-4 hover:decoration-solid";

/**
 * A chỗ dẫn the reader can tap. Into the chapter being read: opens those verses under the paragraph.
 * Elsewhere: shows the verses in a Base UI popover anchored under the words.
 */
export function RefButton(props: { reference: Ref }) {
  const inline = useContext(InlineVersesContext);
  const { reference: ref } = props;
  const from = ref.verses[0].number;
  const to = ref.verses[ref.verses.length - 1].number;

  if (inline && inline.bookCode === ref.book.code && inline.chapter === ref.chapter) {
    const open = inline.shown?.from === from && inline.shown.to === to;
    return (
      <button type="button" aria-expanded={open} className={LINK} onClick={() => inline.toggle({ from, to })}>
        {ref.label}
      </button>
    );
  }

  return (
    <Popover.Root>
      <Popover.Trigger className={LINK}>{ref.label}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="start" sideOffset={6} collisionPadding={16} className="z-50">
          <Popover.Popup className="w-[min(32rem,var(--available-width))] origin-(--transform-origin) rounded-lg border border-rule bg-card p-5 font-serif text-[1.075rem] leading-relaxed text-ink shadow-xl outline-none transition-[opacity,scale] duration-150 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 motion-reduce:transition-none">
            <Popover.Title className="mb-2 font-sans text-sm font-semibold text-muted">
              {ref.book.name} {verseLabel(ref)}
            </Popover.Title>
            <p>
              <VerseText verses={ref.verses} />
            </p>
            <Popover.Close className="mt-3 cursor-pointer font-sans text-sm text-muted underline hover:text-accent">
              Đóng
            </Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

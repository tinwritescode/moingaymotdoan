"use client";

import { Popover } from "@base-ui/react/popover";
import Link from "next/link";
import { useState } from "react";

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
  const firstWritten = props.books.find((b) => b.chapters.length > 0)?.slug;
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState(props.current ?? firstWritten);
  const book = props.books.find((b) => b.slug === picked);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg border border-rule px-3.5 text-sm hover:border-accent">
        Sách <span aria-hidden="true">▾</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="start" sideOffset={6} collisionPadding={16} className="z-50">
          <Popover.Popup className="grid w-[min(46rem,var(--available-width))] origin-(--transform-origin) grid-cols-1 overflow-hidden rounded-xl border border-rule bg-card font-sans text-ink shadow-xl outline-none transition-[opacity,scale] duration-150 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 motion-reduce:transition-none sm:grid-cols-[15rem_1fr]">
            <Popover.Title className="sr-only">Chọn sách và đoạn</Popover.Title>
            <nav aria-label="Các sách" className="max-h-[min(60vh,32rem)] overflow-y-auto border-b border-rule p-2 sm:border-r sm:border-b-0">
              {GROUPS.map((g) => (
                <div key={g.testament}>
                  <p className="px-3 pt-3 pb-1 text-xs font-semibold tracking-widest text-muted uppercase">{g.label}</p>
                  <ul>
                    {props.books
                      .filter((b) => b.testament === g.testament)
                      .map((b) => (
                        <li key={b.slug}>
                          <button
                            type="button"
                            disabled={b.chapters.length === 0}
                            aria-pressed={b.slug === picked}
                            onClick={() => setPicked(b.slug)}
                            className="flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 text-left text-sm hover:bg-side disabled:cursor-default disabled:text-muted/70 disabled:hover:bg-transparent aria-pressed:bg-side aria-pressed:font-semibold aria-pressed:text-accent"
                          >
                            <span>{b.name}</span>
                            {b.chapters.length > 0 && <span className="text-xs text-muted">{b.chapters.length}</span>}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="max-h-[min(60vh,32rem)] overflow-y-auto p-4">
              {book && (
                <>
                  <p className="font-serif text-lg font-semibold">{book.name}</p>
                  <ol aria-label={`Các đoạn ${book.name}`} className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1.5">
                    {book.chapters.map((ch) => (
                      <li key={ch.number}>
                        <Link
                          href={`/${book.slug}/${ch.number}`}
                          title={ch.title}
                          onClick={() => setOpen(false)}
                          className="flex min-h-11 items-center justify-center rounded-lg border border-rule text-sm hover:border-accent hover:text-accent"
                        >
                          {ch.number}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

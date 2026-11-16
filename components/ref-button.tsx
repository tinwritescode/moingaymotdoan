"use client";

import { useId } from "react";
import type { Ref } from "@/lib/content";

/** A chỗ dẫn the reader can tap to read the verses, via the native Popover API (works without JS too). */
export function RefButton(props: { reference: Ref }) {
  const id = useId();
  const { reference: ref } = props;
  return (
    <>
      <button
        type="button"
        popoverTarget={id}
        className="cursor-pointer text-accent underline decoration-dotted underline-offset-4 hover:decoration-solid"
      >
        {ref.label}
      </button>
      <div
        id={id}
        popover="auto"
        className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-lg border border-rule bg-card p-5 shadow-xl"
      >
        <p className="mb-2 text-sm font-semibold text-muted">
          {ref.book.name} {ref.chapter}:{ref.verses[0].number}
          {ref.verses.length > 1 ? `–${ref.verses[ref.verses.length - 1].number}` : ""}
        </p>
        <p>
          {ref.verses.map((v) => (
            <span key={v.number}>
              <sup className="mr-0.5 text-xs text-muted">{v.number}</sup>
              {v.text}{" "}
            </span>
          ))}
        </p>
        <button
          type="button"
          popoverTarget={id}
          popoverTargetAction="hide"
          className="mt-3 cursor-pointer text-sm text-muted underline hover:text-accent"
        >
          Đóng
        </button>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";

export type EbookItem = { slug: string; name: string; info: string };

const KICKER = "font-sans text-xs font-semibold tracking-[0.14em] text-muted uppercase";
const CHOICE = "min-h-11 cursor-pointer rounded-lg px-3.5 text-sm aria-pressed:bg-ink aria-pressed:text-paper";

/** The download list, with a switch between the short edition and the one with each đoạn's whole text. */
export function EbookLinks(props: { groups: EbookItem[] }) {
  const [full, setFull] = useState(false);
  const href = (slug: string) => `/ebook/${slug}${full ? "-nguyen-van" : ""}.epub`;

  return (
    <>
      <div role="group" aria-label="Phiên bản" className="mt-8 inline-flex gap-1 rounded-xl border border-rule bg-card p-1 font-sans">
        <button type="button" aria-pressed={!full} onClick={() => setFull(false)} className={CHOICE}>
          Bản gọn
        </button>
        <button type="button" aria-pressed={full} onClick={() => setFull(true)} className={CHOICE}>
          Kèm nguyên văn cả đoạn
        </button>
      </div>
      <p className="mt-2 font-sans text-sm text-muted">
        {full
          ? "Sau ghi chú của mỗi đoạn là toàn văn đoạn đó theo Bản Truyền Thống. Dài gần gấp đôi."
          : "Chỉ có ghi chú. Chạm vào chỗ dẫn vẫn hiện câu Kinh Thánh."}
      </p>

      <section aria-labelledby="bo" className="mt-10">
        <h2 id="bo" className={KICKER}>
          Theo bộ
        </h2>
        <ul className="mt-3 divide-y divide-rule border-y border-rule">
          {props.groups.map((b) => (
            <li key={b.slug}>
              <a href={href(b.slug)} download className="group flex min-h-16 items-baseline justify-between gap-4 py-4">
                <span className="font-display text-3xl font-semibold group-hover:text-accent">{b.name}</span>
                <span className="font-sans text-sm text-muted">{b.info}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

    </>
  );
}

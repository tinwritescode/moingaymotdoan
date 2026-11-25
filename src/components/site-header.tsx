import { createMemo, Show, type ParentProps } from "solid-js";
import { BOOKS, testamentOf } from "../../lib/content/books";
import type { TocBook } from "../../lib/content";
import { getToc } from "../data";
import { BookPicker, type PickerBook } from "./book-picker";
import { useUser } from "./user-context";

type HeaderSection = "cam-xuc" | "lich-su" | "tai-khoan";

function pickerBooks(toc: TocBook[]): PickerBook[] {
  const written = new Map(toc.map((t) => [t.book.code, t.chapters]));
  return BOOKS.map((b) => ({
    slug: b.slug,
    name: b.name,
    testament: testamentOf(b),
    chapters: (written.get(b.code) ?? []).map((ch) => ({ number: ch.number, title: ch.title })),
  }));
}

function navPillClass(active: boolean) {
  return [
    "inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 text-sm transition-colors",
    active ? "border-ink bg-ink font-semibold text-paper" : "border-rule hover:border-accent",
  ];
}

/**
 * The top bar on every page; `children` go after the top navigation (breadcrumb, prev/next).
 * `book` is the slug of the book being read, so the picker opens on it.
 */
export function SiteHeader(props: ParentProps<{ book?: string; section?: HeaderSection }>) {
  const books = createMemo(async () => pickerBooks((await getToc()).books));
  const { user, ready, stats } = useUser();

  return (
    <header class="kt-header flex flex-wrap items-center gap-x-4 gap-y-2.5 border-b border-rule bg-card px-4 py-3 font-sans sm:gap-x-5 sm:px-6">
      <a href="/" class="kt-brand font-serif text-[17px] font-semibold">
        Kinh Thánh <span class="font-normal text-muted">· ghi chú từng đoạn</span>
      </a>
      <div class="flex flex-wrap items-center gap-2">
        <BookPicker books={books()} current={props.book} />
        <a
          href="/cam-xuc"
          aria-current={props.section === "cam-xuc" ? "page" : undefined}
          class={navPillClass(props.section === "cam-xuc")}
        >
          Theo cảm xúc
        </a>
        <a
          href="/lich-su"
          aria-current={props.section === "lich-su" ? "page" : undefined}
          class={navPillClass(props.section === "lich-su")}
        >
          <span>Lịch sử</span>
          <Show when={ready() && stats().chaptersRead > 0}>
            <span class="text-xs opacity-75">{stats().chaptersRead}</span>
          </Show>
        </a>
        <a
          href="/tai-khoan"
          aria-current={props.section === "tai-khoan" ? "page" : undefined}
          class={navPillClass(props.section === "tai-khoan")}
        >
          <Show
            when={ready() && user()}
            fallback={<span>Đăng nhập</span>}
          >
            {(u) => (
              <>
                <span
                  aria-hidden="true"
                  class={[
                    "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold",
                    props.section === "tai-khoan" ? "bg-paper text-ink" : "bg-ink text-paper",
                  ]}
                >
                  {u().name.slice(0, 1).toUpperCase()}
                </span>
                <span class="max-w-24 truncate">{u().name}</span>
              </>
            )}
          </Show>
        </a>
      </div>
      {props.children}
    </header>
  );
}

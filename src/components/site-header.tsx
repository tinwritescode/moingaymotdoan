import { createMemo, Show, type ParentProps } from "solid-js";
import type { TocBook } from "../../lib/content";
import { BOOKS, testamentOf } from "../../lib/content/books";
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

/**
 * Thanh trên tối giản kiểu Tĩnh Lặng: dấu chấm rêu + tên trang bên trái;
 * nút chọn Sách, tìm Cảm xúc và hình đại diện tài khoản gọn gàng bên phải.
 */
export function SiteHeader(props: ParentProps<{ book?: string; section?: HeaderSection }>) {
  const books = createMemo(async () => pickerBooks((await getToc()).books));
  const { user, ready } = useUser();

  return (
    <header class="kt-header sticky top-0 z-20 border-b border-rule/70 bg-paper/88 backdrop-blur-md">
      <div class="mx-auto flex w-full max-w-[40rem] items-center justify-between gap-3 px-5 py-3 font-sans">
        <a href="/" class="kt-brand inline-flex items-center gap-2.5 text-[15px] font-medium tracking-tight text-ink">
          <span aria-hidden="true" class="h-2.5 w-2.5 rounded-full bg-accent" />
          <span>Kinh Thánh</span>
        </a>

        <div class="flex items-center gap-2">
          <BookPicker books={books()} current={props.book} />

          <a
            href="/cam-xuc"
            aria-label="Tìm theo cảm xúc"
            aria-current={props.section === "cam-xuc" ? "page" : undefined}
            class={[
              "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
              props.section === "cam-xuc"
                ? "border-accent bg-side text-accent"
                : "border-rule bg-card text-muted hover:border-accent hover:text-ink",
            ]}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              aria-hidden="true"
              class="h-[17px] w-[17px]"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.5-4.5" />
            </svg>
          </a>

          <a
            href="/tai-khoan"
            aria-label={ready() && user() ? `Tài khoản ${user()!.name}` : "Đăng nhập"}
            aria-current={props.section === "tai-khoan" ? "page" : undefined}
            class={[
              "inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border text-sm font-medium transition-colors",
              props.section === "tai-khoan"
                ? "border-accent bg-accent text-paper"
                : ready() && user()
                  ? "border-accent/30 bg-side text-accent hover:border-accent"
                  : "border-rule bg-card text-muted hover:border-accent hover:text-ink",
            ]}
          >
            <Show
              when={ready() && user()}
              fallback={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  aria-hidden="true"
                  class="h-[17px] w-[17px]"
                >
                  <circle cx="12" cy="9" r="3.5" />
                  <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
                </svg>
              }
            >
              {(u) => (
                <Show when={u().avatarUrl} fallback={<span>{u().name.slice(0, 1).toUpperCase()}</span>}>
                  {(url) => <img src={url()} alt={u().name} class="h-full w-full object-cover" />}
                </Show>
              )}
            </Show>
          </a>
        </div>
      </div>
      <Show when={props.children}>
        <div class="mx-auto flex w-full max-w-[40rem] flex-wrap items-center gap-2 border-t border-rule/60 px-5 py-2 font-sans">
          {props.children}
        </div>
      </Show>
    </header>
  );
}

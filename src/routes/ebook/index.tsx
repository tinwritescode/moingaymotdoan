import { Title } from "@solidjs/meta";
import type { RouteDefinition } from "@solidjs/router";
import { createMemo, createSignal, For } from "solid-js";
import { bundles, ebookFile } from "../../../lib/ebook/bundles";
import { AI_NOTICE } from "../../../lib/notice";
import { ariaState } from "../../components/aria";
import { SiteHeader } from "../../components/site-header";
import { getToc } from "../../data";

export const route = { preload: () => void getToc() } satisfies RouteDefinition;

const KICKER = "font-sans text-xs font-semibold tracking-[0.14em] text-muted uppercase";
const CHOICE = "min-h-11 cursor-pointer rounded-lg px-3.5 text-sm aria-pressed:bg-ink aria-pressed:text-paper";

/** Download list: one EPUB for everything written and one per testament; each short or with full text. */
export default function EbookPage() {
  const toc = createMemo(() => getToc());
  const groups = createMemo(() =>
    bundles(toc().books).map((b) => ({
      slug: b.slug,
      name: b.name,
      info: `${b.books.length} sách · ${b.books.reduce((n, x) => n + x.chapters.length, 0)} đoạn`,
    })),
  );
  const [full, setFull] = createSignal(false);

  return (
    <>
      <Title>Tải ebook cho Kindle — Kinh Thánh</Title>
      <SiteHeader />
      <main class="mx-auto w-full max-w-3xl px-6 pt-10 pb-20">
        <h1 class="font-display text-5xl leading-none font-extrabold">Tải ebook</h1>
        <p class="mt-4 text-lg text-muted">
          File EPUB, đọc được trên Kindle, Apple Books, Google Play Sách. Mỗi đoạn một trang, có mục lục theo sách và
          đoạn; chạm vào chỗ dẫn như (1:26) để xem câu Kinh Thánh ngay tại chỗ.
        </p>

        <div role="group" aria-label="Phiên bản" class="mt-8 inline-flex gap-1 rounded-xl border border-rule bg-card p-1 font-sans">
          <button type="button" aria-pressed={ariaState(!full())} onClick={() => setFull(false)} class={CHOICE}>
            Bản gọn
          </button>
          <button type="button" aria-pressed={ariaState(full())} onClick={() => setFull(true)} class={CHOICE}>
            Kèm nguyên văn cả đoạn
          </button>
        </div>
        <p class="mt-2 font-sans text-sm text-muted">
          {full()
            ? "Sau ghi chú của mỗi đoạn là toàn văn đoạn đó theo Bản Truyền Thống. Dài gần gấp đôi."
            : "Chỉ có ghi chú. Chạm vào chỗ dẫn vẫn hiện câu Kinh Thánh."}
        </p>

        <section aria-labelledby="bo" class="mt-10">
          <h2 id="bo" class={KICKER}>
            Theo bộ
          </h2>
          {/* Both editions are in the page, so the build finds every file to write; the toggle shows one. */}
          <For each={[false, true]}>
            {(fullText) => (
              <ul hidden={fullText !== full()} class="mt-3 divide-y divide-rule border-y border-rule">
                <For each={groups()}>
                  {(b) => (
                    <li>
                      <a
                        href={`/ebook/${ebookFile({ slug: b.slug, fullText })}`}
                        download={`kinh-thanh-${ebookFile({ slug: b.slug, fullText })}`}
                        class="group flex min-h-16 items-baseline justify-between gap-4 py-4"
                      >
                        <span class="font-display text-3xl font-semibold group-hover:text-accent">{b.name}</span>
                        <span class="font-sans text-sm text-muted">{b.info}</span>
                      </a>
                    </li>
                  )}
                </For>
              </ul>
            )}
          </For>
        </section>

        <section aria-labelledby="kindle" class="mt-12 rounded-xl border border-rule bg-card p-5">
          <h2 id="kindle" class="font-display text-2xl font-semibold">
            Đưa vào Kindle
          </h2>
          <ol class="mt-3 list-decimal space-y-2 pl-5">
            <li>Tải file EPUB ở trên về máy.</li>
            <li>
              Mở <span class="font-semibold">amazon.com/sendtokindle</span>, đăng nhập, kéo file vào. Hoặc gửi email kèm
              file tới địa chỉ Kindle của bạn (xem trong Amazon:{" "}
              <em>Manage Your Content and Devices → Preferences → Personal Document Settings</em>).
            </li>
            <li>Vài phút sau sách hiện trong thư viện Kindle. Ebook cập nhật mỗi khi site có đoạn mới: tải và gửi lại.</li>
          </ol>
          <p class="mt-4 font-sans text-sm text-muted">{AI_NOTICE}</p>
        </section>
      </main>
    </>
  );
}

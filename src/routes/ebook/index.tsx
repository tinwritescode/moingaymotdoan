import type { RouteDefinition } from "@solidjs/router";
import { createMemo, createSignal, For } from "solid-js";
import { bundles, ebookFile } from "../../../lib/ebook/bundles";
import { AI_NOTICE } from "../../../lib/notice";
import { ariaState } from "../../components/aria";
import { FloatingDock } from "../../components/floating-dock";
import { Seo } from "../../components/seo";
import { SiteHeader } from "../../components/site-header";
import { getToc } from "../../data";

export const route = { preload: () => void getToc() } satisfies RouteDefinition;

const CHOICE =
  "min-h-10 cursor-pointer rounded-full px-4 text-xs font-medium text-muted transition-colors aria-pressed:bg-accent aria-pressed:text-paper";

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
      <Seo
        title="Tải Ebook EPUB cho Kindle & Apple Books | Mỗi Ngày Một Đoạn"
        description="Tải miễn phí trọn bộ Kinh Thánh ghi chú từng đoạn định dạng EPUB cho Kindle, Apple Books, Google Play Sách — bản gọn hoặc kèm nguyên văn Bản Truyền Thống 1926."
        path="/ebook"
      />
      <SiteHeader />
      <main class="mx-auto w-full max-w-[40rem] animate-reveal px-5 pt-5 pb-12 motion-reduce:animate-none">
        <p class="font-sans text-xs font-medium text-accent">Đọc ngoại tuyến</p>
        <h1 class="mt-1 font-display text-3xl leading-tight font-light tracking-tight text-ink sm:text-[2.15rem]">
          Tải ebook cho Kindle
        </h1>
        <p class="mt-2.5 text-base leading-relaxed text-muted">
          File EPUB, đọc được trên Kindle, Apple Books, Google Play Sách. Mỗi đoạn một trang, có mục lục theo sách và
          đoạn; chạm vào chỗ dẫn như (1:26) để xem câu Kinh Thánh ngay tại chỗ.
        </p>

        <div
          role="group"
          aria-label="Phiên bản"
          class="mt-6 inline-flex gap-1 rounded-full border border-rule bg-card p-1 font-sans"
        >
          <button type="button" aria-pressed={ariaState(!full())} onClick={() => setFull(false)} class={CHOICE}>
            Bản gọn
          </button>
          <button type="button" aria-pressed={ariaState(full())} onClick={() => setFull(true)} class={CHOICE}>
            Kèm nguyên văn cả đoạn
          </button>
        </div>
        <p class="mt-2 font-sans text-xs text-muted">
          {full()
            ? "Sau ghi chú của mỗi đoạn là toàn văn đoạn đó theo Bản Truyền Thống. Dài gần gấp đôi."
            : "Chỉ có ghi chú. Chạm vào chỗ dẫn vẫn hiện câu Kinh Thánh."}
        </p>

        <section aria-labelledby="bo" class="mt-8">
          <h2 id="bo" class="font-display text-lg font-normal text-ink">
            Theo bộ
          </h2>
          {/* Both editions are in the page, so the build finds every file to write; the toggle shows one. */}
          <For each={[false, true]}>
            {(fullText) => (
              <ul hidden={fullText !== full()} class="mt-3 space-y-2">
                <For each={groups()}>
                  {(b) => (
                    <li>
                      <a
                        href={`/ebook/${ebookFile({ slug: b.slug, fullText })}`}
                        download={`kinh-thanh-${ebookFile({ slug: b.slug, fullText })}`}
                        class="group flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-rule bg-card px-5 py-3.5 transition-colors hover:border-accent"
                      >
                        <span class="font-serif text-xl font-semibold text-ink group-hover:text-accent">{b.name}</span>
                        <span class="font-sans text-xs text-muted">{b.info} ↓</span>
                      </a>
                    </li>
                  )}
                </For>
              </ul>
            )}
          </For>
        </section>

        <section aria-labelledby="kindle" class="mt-8 rounded-3xl bg-side p-5 sm:p-6">
          <h2 id="kindle" class="font-display text-base font-medium text-accent">
            Đưa vào Kindle
          </h2>
          <ol class="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink/90">
            <li>Tải file EPUB ở trên về máy.</li>
            <li>
              Mở <span class="font-semibold">amazon.com/sendtokindle</span>, đăng nhập, kéo file vào. Hoặc gửi email kèm
              file tới địa chỉ Kindle của bạn (xem trong Amazon:{" "}
              <em>Manage Your Content and Devices → Preferences → Personal Document Settings</em>).
            </li>
            <li>Vài phút sau sách hiện trong thư viện Kindle. Ebook cập nhật mỗi khi site có đoạn mới: tải và gửi lại.</li>
          </ol>
          <p class="mt-4 font-sans text-xs leading-relaxed text-muted">{AI_NOTICE}</p>
        </section>
      </main>
      <FloatingDock active="home" />
    </>
  );
}

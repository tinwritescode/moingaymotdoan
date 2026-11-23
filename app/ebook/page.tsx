import type { Metadata } from "next";
import { EbookLinks } from "@/components/ebook-links";
import { SiteHeader } from "@/components/site-header";
import { getContent, MODE } from "@/lib/content";
import { bundles } from "@/lib/ebook/epub";

export const metadata: Metadata = { title: "Tải ebook cho Kindle — Kinh Thánh" };

/** Download list: one EPUB for everything written and one per testament; each short or with full text. */
export default function EbookPage() {
  const groups = bundles(getContent().toc(MODE)).map((b) => {
    const chapters = b.books.reduce((n, x) => n + x.chapters.length, 0);
    return { slug: b.slug, name: b.name, info: `${b.books.length} sách · ${chapters} đoạn` };
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pt-10 pb-20">
        <h1 className="font-display text-5xl leading-none font-extrabold">Tải ebook</h1>
        <p className="mt-4 text-lg text-muted">
          File EPUB, đọc được trên Kindle, Apple Books, Google Play Sách. Mỗi đoạn một trang, có mục lục theo sách và
          đoạn; chạm vào chỗ dẫn như (1:26) để xem câu Kinh Thánh ngay tại chỗ.
        </p>

        <EbookLinks groups={groups} />

        <section aria-labelledby="kindle" className="mt-12 rounded-xl border border-rule bg-card p-5">
          <h2 id="kindle" className="font-display text-2xl font-semibold">
            Đưa vào Kindle
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>Tải file EPUB ở trên về máy.</li>
            <li>
              Mở <span className="font-semibold">amazon.com/sendtokindle</span>, đăng nhập, kéo file vào. Hoặc gửi email kèm
              file tới địa chỉ Kindle của ngài (xem trong Amazon: <em>Manage Your Content and Devices → Preferences →
              Personal Document Settings</em>).
            </li>
            <li>Vài phút sau sách hiện trong thư viện Kindle. Ebook cập nhật mỗi khi site có đoạn mới: tải và gửi lại.</li>
          </ol>
          {MODE === "nhap" && (
            <p className="mt-4 font-sans text-sm text-muted">
              Đây là bản nháp: ghi chú do AI soạn, ý kiến các nhà giải kinh chưa được đối chiếu với sách gốc.
            </p>
          )}
        </section>
      </main>
    </>
  );
}

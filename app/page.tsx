import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SummaryLine } from "@/components/summary-line";
import { getContent, MODE } from "@/lib/content";

export default function MucLuc() {
  const toc = getContent().toc(MODE);
  return (
    <Reveal>
      <h1 className="text-3xl font-semibold">Mục lục</h1>
      <p className="mt-2 text-muted">
        Mỗi đoạn có lời Kinh Thánh, rồi ghi chú bằng lời thường. <em>Đoạn</em> nghĩa là chương, theo cách gọi
        của Bản Truyền Thống.
      </p>
      {MODE === "nhap" && (
        <p className="mt-4 rounded border border-vua/40 bg-card px-3 py-2 text-sm">
          Đang xem chế độ Nháp: hiện cả đoạn chưa duyệt.
        </p>
      )}
      {toc.length === 0 ? (
        <p className="mt-10 text-muted">Chưa có đoạn nào được công bố. Mời ngài quay lại sau.</p>
      ) : (
        toc.map(({ book, chapters }) => (
          <section key={book.code} className="mt-10">
            <h2 className="border-b border-rule pb-1 text-xl font-semibold">{book.name}</h2>
            <ol className="mt-3 space-y-2">
              {chapters.map((ch) => (
                <li key={ch.number}>
                  <Link href={`/${book.slug}/${ch.number}`} className="group block">
                    <span className="text-muted">Đoạn {ch.number}</span>{" "}
                    <span className="group-hover:text-accent">— {ch.title}</span>
                  </Link>
                  {ch.draft && (
                    <div className="flex flex-wrap items-center gap-x-2">
                      <span className="text-xs font-semibold">{ch.draft.approved ? "Đã duyệt" : "Chưa duyệt"}</span>
                      <SummaryLine summary={ch.draft.summary} />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ))
      )}
    </Reveal>
  );
}

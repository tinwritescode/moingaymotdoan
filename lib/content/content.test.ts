import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createContent, type Inline } from "./index";
import { bookByName } from "./books";

const ROOT = join(import.meta.dirname, "..", "..");
const bibleDir = join(ROOT, "data", "bible");
const real = createContent({ contentDir: join(ROOT, "content"), bibleDir });

const GEN = bookByName("Sáng-thế Ký");

/** A minimal valid ghi chú; `parts` overrides pieces of it. */
function note(parts: {
  approved?: boolean;
  chapter?: number;
  story?: string;
  opinions?: string[];
  headings?: string[];
} = {}): string {
  const {
    approved = false,
    chapter = 1,
    story = "Chúa dựng nên trời đất (Giăng 1:1).",
    opinions = ["**Augustine** nói vậy. *(Lời Thú Tội)* <!-- tin-cay: cao | doi-chieu: roi | ly-do: rõ -->"],
    headings = ["Câu chuyện", "Ý chính", "Ý nghĩa sâu xa", "Lưu ý", "Các nhà giải kinh nói gì"],
  } = parts;
  const bodies = [story, "Ý.", "Sâu.", "Lưu ý.", opinions.join("\n\n")];
  return [
    `---\nduyet: ${approved}\n---`,
    `# Sáng-thế Ký ${chapter} — Thử`,
    ...headings.map((h, i) => `## ${h}\n\n${bodies[i] ?? ""}`),
  ].join("\n\n");
}

function contentWith(files: Record<string, string>) {
  const dir = mkdtempSync(join(tmpdir(), "ghi-chu-"));
  for (const [path, source] of Object.entries(files)) {
    mkdirSync(join(dir, path, ".."), { recursive: true });
    writeFileSync(join(dir, path), source);
  }
  return createContent({ contentDir: dir, bibleDir });
}

function refsIn(nodes: Inline[]): string[] {
  return nodes.flatMap((n) =>
    n.kind === "refs"
      ? n.parts.map((p) => `${p.ref.book.name} ${p.ref.chapter}:${p.ref.verses.map((v) => v.number).join(",")}`)
      : n.kind === "text"
        ? []
        : refsIn(n.children),
  );
}

describe("dữ liệu Kinh Thánh", () => {
  it("có đủ Sáng-thế Ký 1 với 31 câu, đúng nguyên văn", () => {
    const ch = real.chapter({ slug: "sang-the-ky", number: 1, mode: "nhap" });
    expect(ch?.verses).toHaveLength(31);
    expect(ch?.verses[0]).toEqual({ number: 1, text: "Ban đầu Đức Chúa Trời dựng nên trời đất." });
  });

  it("tra được câu ở sách cuối và có số", () => {
    expect(real.lookup({ text: "Khải-huyền 22:5" }).verses[0].text).toMatch(/mặt trời/);
    expect(real.lookup({ text: "2 Cô-rinh-tô 4:6" }).book.name).toBe("2 Cô-rinh-tô");
  });
});

describe("đường dẫn", () => {
  it("sang-the-ky/1 dẫn tới Sáng-thế Ký đoạn 1", () => {
    const ch = real.chapter({ slug: "sang-the-ky", number: 1, mode: "nhap" });
    expect(ch?.book.name).toBe("Sáng-thế Ký");
    expect(ch?.title).toBe("Chúa dựng nên trời đất");
  });

  it("slug lạ hoặc đoạn chưa có ghi chú thì không tìm thấy", () => {
    expect(real.chapter({ slug: "khong-co", number: 1, mode: "nhap" })).toBeNull();
    const onlyFirst = contentWith({ "sang-the-ky/1.md": note() });
    expect(onlyFirst.chapter({ slug: "sang-the-ky", number: 2, mode: "nhap" })).toBeNull();
  });
});

describe("chỗ dẫn", () => {
  it("nhận đúng các dạng viết", () => {
    expect(real.lookup({ text: "Giăng 1:1" }).verses.map((v) => v.number)).toEqual([1]);
    expect(real.lookup({ text: "1:26", book: GEN }).book.name).toBe("Sáng-thế Ký");

    const c = contentWith({
      "sang-the-ky/1.md": note({
        story:
          "A (Thi-thiên 33:20; 121:1–2) B (2 Cô-rinh-tô 4:6) C (1:2; so Phục-truyền Luật-lệ Ký 32:11) D (nay là Pháp).",
      }),
    });
    const story = c.chapter({ slug: "sang-the-ky", number: 1, mode: "nhap" })?.sections[0].paragraphs[0] ?? [];
    expect(refsIn(story)).toEqual([
      "Thi-thiên 33:20",
      "Thi-thiên 121:1,2",
      "2 Cô-rinh-tô 4:6",
      "Sáng-thế Ký 1:2",
      "Phục-truyền Luật-lệ Ký 32:11",
    ]);
  });

  it("tên sách viết tắt làm việc nạp báo lỗi kèm tên file", () => {
    expect(() => contentWith({ "sang-the-ky/1.md": note({ story: "X (Sáng-thế 9:6)." }) })).toThrow(
      /sang-the-ky\/1\.md: Tên sách lạ "Sáng-thế"/,
    );
  });

  it("nhiều file hỏng thì báo lỗi của tất cả cùng lúc", () => {
    const bad = { "sang-the-ky/1.md": note({ story: "X (Sáng-thế 9:6)." }), "sang-the-ky/2.md": "rỗng" };
    expect(() => contentWith(bad)).toThrow(/sang-the-ky\/1\.md:[\s\S]*sang-the-ky\/2\.md:/);
  });

  it("dẫn tới câu không tồn tại làm việc nạp báo lỗi", () => {
    expect(() => contentWith({ "sang-the-ky/1.md": note({ story: "X (Giăng 1:99)." }) })).toThrow(
      /không tồn tại/,
    );
  });
});

describe("nháp và công bố", () => {
  const c = contentWith({
    "sang-the-ky/1.md": note({
      approved: true,
      opinions: [
        "**Augustine** nói. <!-- tin-cay: cao | doi-chieu: roi | ly-do: rõ -->",
        "**Spurgeon** nói. <!-- tin-cay: thap | doi-chieu: chua | ly-do: chưa rõ tên bài -->",
      ],
    }),
    "sang-the-ky/2.md": note({ chapter: 2 }),
    "sang-the-ky/3.md": note({ chapter: 3, approved: true }),
  });

  it("ghi chú chưa duyệt chỉ hiện ở Nháp", () => {
    expect(c.toc("cong-bo")[0].chapters.map((ch) => ch.number)).toEqual([1, 3]);
    expect(c.toc("nhap")[0].chapters.map((ch) => ch.number)).toEqual([1, 2, 3]);
    expect(c.chapter({ slug: "sang-the-ky", number: 2, mode: "cong-bo" })).toBeNull();
  });

  it("Công bố bỏ ý kiến chưa đối chiếu và không lộ mức tin cậy", () => {
    const ch = c.chapter({ slug: "sang-the-ky", number: 1, mode: "cong-bo" });
    expect(ch?.mode).toBe("cong-bo");
    expect(ch?.opinions).toHaveLength(1);
    expect(JSON.stringify(ch)).not.toMatch(/thap|chưa rõ tên bài/);
  });

  it("Nháp có đủ ý kiến, mức tin cậy và dòng tóm tắt", () => {
    const ch = c.chapter({ slug: "sang-the-ky", number: 1, mode: "nhap" });
    if (ch?.mode !== "nhap") throw new Error("expected nháp");
    expect(ch.opinions.map((o) => [o.name, o.level, o.verified])).toEqual([
      ["Augustine", "cao", true],
      ["Spurgeon", "thap", false],
    ]);
    expect(ch.summary).toEqual({ cao: 1, vua: 0, thap: 1, verified: 1, total: 2 });
    expect(c.toc("nhap")[0].chapters[0].draft?.summary.verified).toBe(1);
  });

  it("đoạn trước và sau chỉ trỏ tới đoạn hiện được", () => {
    const at = (ch: { book: { slug: string }; number: number } | null | undefined) =>
      ch ? `${ch.book.slug}/${ch.number}` : null;
    const pub = c.chapter({ slug: "sang-the-ky", number: 1, mode: "cong-bo" });
    expect([at(pub?.prev), at(pub?.next)]).toEqual([null, "sang-the-ky/3"]);
    const draft = c.chapter({ slug: "sang-the-ky", number: 3, mode: "nhap" });
    expect([at(draft?.prev), at(draft?.next)]).toEqual(["sang-the-ky/2", null]);
  });
});

describe("đi qua sách kế", () => {
  const at = (ch: { book: { slug: string }; number: number } | null | undefined) =>
    ch ? `${ch.book.slug}/${ch.number}` : null;

  it("hết sách thì đoạn sau là đoạn đầu của sách kế có ghi chú, bỏ qua sách chưa viết", () => {
    const last = real.chapter({ slug: "xuat-e-dip-to-ky", number: 39, mode: "nhap" });
    expect(at(last?.next)).toBe("ma-thi-o/1");
    const first = real.chapter({ slug: "ma-thi-o", number: 1, mode: "nhap" });
    expect(at(first?.prev)).toBe("xuat-e-dip-to-ky/39");
  });

  it("đầu sách đầu và cuối sách cuối thì không có đoạn trước/sau", () => {
    expect(real.chapter({ slug: "sang-the-ky", number: 1, mode: "nhap" })?.prev).toBeNull();
    expect(real.chapter({ slug: "cong-vu-cac-su-do", number: 28, mode: "nhap" })?.next).toBeNull();
  });
});

describe("kiểm tra ghi chú khi nạp", () => {
  it("ghi chú đã duyệt còn câu mức Thấp thì báo lỗi", () => {
    const story = "A <!-- thap: chưa chắc -->câu này<!-- /thap --> B.";
    expect(() => contentWith({ "sang-the-ky/1.md": note({ story }) })).not.toThrow();
    expect(() => contentWith({ "sang-the-ky/1.md": note({ approved: true, story }) })).toThrow(/mức Thấp/);
  });

  it("ý kiến thiếu mức tin cậy thì báo lỗi", () => {
    expect(() => contentWith({ "sang-the-ky/1.md": note({ opinions: ["**Calvin** nói."] }) })).toThrow(
      /thiếu dấu mức tin cậy/,
    );
  });

  it("ghi chú mới viết Câu chuyện, các phần khác để trống, vẫn nạp được", () => {
    const rest = ["Ý chính", "Ý nghĩa sâu xa", "Lưu ý", "Các nhà giải kinh nói gì"];
    const source = note().replace(/## Ý chính[\s\S]*/, rest.map((h) => `## ${h}`).join("\n\n"));
    const ch = contentWith({ "sang-the-ky/1.md": source }).chapter({ slug: "sang-the-ky", number: 1, mode: "nhap" });
    expect(ch?.sections.map((s) => s.paragraphs.length)).toEqual([1, 0, 0, 0]);
    expect(ch?.opinions).toEqual([]);
  });

  it("thiếu phần hoặc sai thứ tự thì báo lỗi", () => {
    const swapped = ["Ý chính", "Câu chuyện", "Ý nghĩa sâu xa", "Lưu ý", "Các nhà giải kinh nói gì"];
    expect(() => contentWith({ "sang-the-ky/1.md": note({ headings: swapped }) })).toThrow(/đúng thứ tự/);
    expect(() => contentWith({ "sang-the-ky/1.md": note({ headings: swapped.slice(1) }) })).toThrow(
      /đúng thứ tự/,
    );
  });
});

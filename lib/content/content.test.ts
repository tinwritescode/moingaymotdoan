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
  book?: string;
  chapter?: number;
  story?: string;
  opinions?: string[];
  headings?: string[];
} = {}): string {
  const {
    book = "Sáng-thế Ký",
    chapter = 1,
    story = "Chúa dựng nên trời đất (Giăng 1:1).",
    opinions = ["**Augustine** nói vậy. *(Lời Thú Tội)* <!-- tin-cay: cao | doi-chieu: chua | ly-do: rõ -->"],
    headings = ["Câu chuyện", "Ý chính", "Ý nghĩa sâu xa", "Lưu ý", "Các nhà giải kinh nói gì"],
  } = parts;
  const bodies = [story, "Ý.", "Sâu.", "Lưu ý.", opinions.join("\n\n")];
  return [`# ${book} ${chapter} — Thử`, ...headings.map((h, i) => `## ${h}\n\n${bodies[i] ?? ""}`)].join("\n\n");
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
    const ch = real.chapter({ slug: "sang-the-ky", number: 1 });
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
    const ch = real.chapter({ slug: "sang-the-ky", number: 1 });
    expect(ch?.book.name).toBe("Sáng-thế Ký");
    expect(ch?.title).toBe("Chúa dựng nên trời đất");
  });

  it("slug lạ hoặc đoạn chưa có ghi chú thì không tìm thấy", () => {
    expect(real.chapter({ slug: "khong-co", number: 1 })).toBeNull();
    const onlyFirst = contentWith({ "sang-the-ky/1.md": note() });
    expect(onlyFirst.chapter({ slug: "sang-the-ky", number: 2 })).toBeNull();
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
    const story = c.chapter({ slug: "sang-the-ky", number: 1 })?.sections[0].paragraphs[0] ?? [];
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
    expect(() => contentWith({ "sang-the-ky/1.md": note({ story: "X (Giăng 1:99)." }) })).toThrow(/không tồn tại/);
  });
});

describe("hiển thị ghi chú và ý kiến", () => {
  const c = contentWith({
    "sang-the-ky/1.md": `---\nduyet: false\n---\n\n${note({
      opinions: [
        "**Augustine** nói. <!-- tin-cay: cao | doi-chieu: chua | ly-do: rõ -->",
        "**Spurgeon** nói. <!-- tin-cay: thap | doi-chieu: chua | ly-do: chưa rõ tên bài -->",
      ],
    })}`,
    "sang-the-ky/2.md": note({ chapter: 2 }),
    "sang-the-ky/3.md": note({ chapter: 3 }),
  });

  it("hiện tất cả các đoạn đã viết, có hoặc không có frontmatter cũ", () => {
    expect(c.toc()[0].chapters.map((ch) => ch.number)).toEqual([1, 2, 3]);
    expect(c.chapter({ slug: "sang-the-ky", number: 2 })).not.toBeNull();
  });

  it("giữ đủ ý kiến và mức tin cậy", () => {
    const ch = c.chapter({ slug: "sang-the-ky", number: 1 });
    expect(ch?.opinions.map((o) => [o.name, o.level])).toEqual([
      ["Augustine", "cao"],
      ["Spurgeon", "thap"],
    ]);
  });

  it("đoạn trước và sau trỏ đúng theo thứ tự đọc", () => {
    const at = (ch: { book: { slug: string }; number: number } | null | undefined) =>
      ch ? `${ch.book.slug}/${ch.number}` : null;
    const first = c.chapter({ slug: "sang-the-ky", number: 1 });
    expect([at(first?.prev), at(first?.next)]).toEqual([null, "sang-the-ky/2"]);
    const last = c.chapter({ slug: "sang-the-ky", number: 3 });
    expect([at(last?.prev), at(last?.next)]).toEqual(["sang-the-ky/2", null]);
  });
});

describe("đi qua sách kế", () => {
  const at = (ch: { book: { slug: string }; number: number } | null | undefined) =>
    ch ? `${ch.book.slug}/${ch.number}` : null;
  // Xuất Ê-díp-tô Ký sits between these two books and has no ghi chú here.
  const c = contentWith({
    "sang-the-ky/1.md": note(),
    "sang-the-ky/2.md": note({ chapter: 2 }),
    "ma-thi-o/1.md": note({ book: "Ma-thi-ơ" }),
  });

  it("hết sách thì đoạn sau là đoạn đầu của sách kế có ghi chú, bỏ qua sách chưa viết", () => {
    expect(at(c.chapter({ slug: "sang-the-ky", number: 2 })?.next)).toBe("ma-thi-o/1");
    expect(at(c.chapter({ slug: "ma-thi-o", number: 1 })?.prev)).toBe("sang-the-ky/2");
  });

  it("đầu sách đầu và cuối sách cuối thì không có đoạn trước/sau", () => {
    expect(c.chapter({ slug: "sang-the-ky", number: 1 })?.prev).toBeNull();
    expect(c.chapter({ slug: "ma-thi-o", number: 1 })?.next).toBeNull();
  });
});

describe("kiểm tra ghi chú khi nạp", () => {
  it("ý kiến thiếu mức tin cậy thì báo lỗi", () => {
    expect(() => contentWith({ "sang-the-ky/1.md": note({ opinions: ["**Calvin** nói."] }) })).toThrow(
      /thiếu dấu mức tin cậy/,
    );
  });

  it("ghi chú mới viết Câu chuyện, các phần khác để trống, vẫn nạp được", () => {
    const rest = ["Ý chính", "Ý nghĩa sâu xa", "Lưu ý", "Các nhà giải kinh nói gì"];
    const source = note().replace(/## Ý chính[\s\S]*/, rest.map((h) => `## ${h}`).join("\n\n"));
    const ch = contentWith({ "sang-the-ky/1.md": source }).chapter({ slug: "sang-the-ky", number: 1 });
    expect(ch?.sections.map((s) => s.paragraphs.length)).toEqual([1, 0, 0, 0]);
    expect(ch?.opinions).toEqual([]);
  });

  it("thiếu phần hoặc sai thứ tự thì báo lỗi", () => {
    const swapped = ["Ý chính", "Câu chuyện", "Ý nghĩa sâu xa", "Lưu ý", "Các nhà giải kinh nói gì"];
    expect(() => contentWith({ "sang-the-ky/1.md": note({ headings: swapped }) })).toThrow(/đúng thứ tự/);
    expect(() => contentWith({ "sang-the-ky/1.md": note({ headings: swapped.slice(1) }) })).toThrow(/đúng thứ tự/);
  });
});

describe("English content (BSB)", () => {
  const realEn = createContent({
    contentDir: join(ROOT, "content-en"),
    bibleDir: join(ROOT, "data", "bible-en"),
    locale: "en",
  });

  it("loads English Genesis 1 with 31 BSB verses", () => {
    const ch = realEn.chapter({ slug: "genesis", number: 1 });
    expect(ch?.book.name).toBe("Genesis");
    expect(ch?.verses).toHaveLength(31);
    expect(ch?.verses[0]).toEqual({ number: 1, text: "In the beginning God created the heavens and the earth." });
  });

  it("resolves English cross-book references including Psalm alias", () => {
    expect(realEn.lookup({ text: "John 1:1" }).verses[0].text).toMatch(/In the beginning was the Word/);
    expect(realEn.lookup({ text: "Psalm 23:1" }).book.name).toBe("Psalms");
    expect(realEn.lookup({ text: "2 Corinthians 4:6" }).book.name).toBe("2 Corinthians");
  });

  it("parses English headings, confidence comments, and low-confidence spans", () => {
    const ch = realEn.chapter({ slug: "genesis", number: 1 });
    expect(ch?.sections.map((s) => s.heading)).toEqual([
      "Story",
      "Key Takeaways",
      "Deeper Meaning",
      "Notes & Nuances",
    ]);
    expect(ch?.opinions.length).toBeGreaterThan(0);
  });
});

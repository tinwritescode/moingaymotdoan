import { describe, expect, it } from "vitest";
import { BOOKS } from "../content/books";
import { auditMoods, quotedPieces } from "./audit";
import type { MoodPassageView, MoodView } from "./types";

const book = (name: string) => BOOKS.find((b) => b.name === name)!;
const NOTE = "Lời gợi ý đủ dài để vượt ngưỡng tối thiểu năm mươi ký tự của chuẩn.";
const PRAYER = "Lạy Cha, xin giữ lòng con bình an giữa mọi lo toan hôm nay, vì Ngài biết rõ mọi điều con cần. Amen.";

function passage(args: { book: string; chapter: number; from: number; texts: string[]; note?: string }): MoodPassageView {
  const verses = args.texts.map((text, i) => ({ number: args.from + i, text }));
  return {
    ref: { label: `${args.book} ${args.chapter}:${args.from}`, book: book(args.book), chapter: args.chapter, verses },
    note: args.note ?? NOTE,
    chapterTitle: "Tiêu đề",
    hasChapter: true,
  };
}

function mood(slug: string, passages: MoodPassageView[], prayer = PRAYER): MoodView {
  return {
    slug,
    title: slug,
    group: { id: "lo-au", name: "Lo âu", shortName: "Lo âu", description: "" },
    prompt: "",
    intro: "",
    keywords: [],
    passages,
    prayer,
    related: [],
    prev: null,
    next: null,
  };
}

const SIX = [
  passage({ book: "Thi-thiên", chapter: 23, from: 1, texts: ["Đức Giê-hô-va là Đấng chăn giữ tôi: tôi sẽ chẳng thiếu thốn gì."] }),
  passage({ book: "Ê-sai", chapter: 41, from: 10, texts: ["Đừng sợ, vì ta ở với ngươi."] }),
  passage({ book: "Châm-ngôn", chapter: 3, from: 5, texts: ["Hãy hết lòng tin cậy Đức Giê-hô-va."] }),
  passage({ book: "Ma-thi-ơ", chapter: 11, from: 28, texts: ["Hỡi những kẻ mệt mỏi và gánh nặng, hãy đến cùng ta."] }),
  passage({ book: "Phi-líp", chapter: 4, from: 6, texts: ["Chớ lo phiền chi hết."] }),
  passage({ book: "Giăng", chapter: 14, from: 27, texts: ["Ta để sự bình an lại cho các ngươi."] }),
];

describe("auditMoods", () => {
  it("chuyên mục đủ chuẩn không có lỗi", () => {
    expect(auditMoods([mood("dat-chuan", SIX)])).toEqual([]);
  });

  it("bắt trích dẫn sai nguyên văn nhưng chấp nhận trích đúng dù khác dấu câu", () => {
    const sai = passage({
      book: "Ma-thi-ơ",
      chapter: 5,
      from: 37,
      texts: ["Song ngươi phải nói rằng: phải, phải; không, không. Còn điều người ta nói thêm đó, bởi nơi quỉ dữ mà ra."],
      note: "Nói rõ ràng 'có' là 'có', 'không' là 'không' giúp ta sống thẳng thắn hơn mỗi ngày.",
    });
    const dung = passage({
      book: "Ma-thi-ơ",
      chapter: 5,
      from: 37,
      texts: ["Song ngươi phải nói rằng: phải, phải; không, không. Còn điều người ta nói thêm đó, bởi nơi quỉ dữ mà ra."],
      note: "Chúa dạy: “phải, phải; không, không” — lời nói thẳng thắn giữ lòng ta trong sạch.",
    });
    const issues = auditMoods([mood("sai", [...SIX.slice(0, 5), sai]), mood("dung", [...SIX.slice(0, 5), dung])]);
    expect(issues.filter((i) => i.slug === "sai").map((i) => i.message)).toEqual([
      'Ma-thi-ơ 5:37: trích "có" không khớp nguyên văn Bản Truyền Thống',
      'Ma-thi-ơ 5:37: trích "có" không khớp nguyên văn Bản Truyền Thống',
    ]);
    expect(issues.filter((i) => i.slug === "dung")).toEqual([]);
  });

  it("bắt thiếu đoạn, thiếu lời cầu nguyện, chồng câu và thiếu Tân Ước", () => {
    const chong = passage({ book: "Thi-thiên", chapter: 23, from: 1, texts: ["a", "b", "c"] });
    const cuUoc = SIX.slice(0, 3);
    const messages = auditMoods([mood("thieu", [...cuUoc, chong], "")]).map((i) => i.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        "cần đúng 6 đoạn, đang có 4",
        "thiếu lời cầu nguyện (prayer)",
        "cần có cả Cựu Ước lẫn Tân Ước",
        "Thi-thiên 23:1 và Thi-thiên 23:1 chồng câu lên nhau",
      ]),
    );
  });

  it("bắt một câu dùng ở quá 3 chuyên mục", () => {
    const issues = auditMoods(["a", "b", "c", "d"].map((s) => mood(s, SIX)));
    expect(issues.some((i) => i.message.startsWith("câu PSA 23:1 dùng ở 4 chuyên mục"))).toBe(true);
  });

  it("tách cụm trích lược theo dấu …", () => {
    expect(quotedPieces("Ngài phán: “Đừng sợ … ta ở với ngươi”.")).toEqual(["Đừng sợ", "ta ở với ngươi"]);
  });
});

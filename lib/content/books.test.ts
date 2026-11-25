import { expect, test } from "vitest";
import { BOOKS, groupBooks } from "./books";

test("groupBooks splits the 66 books into the usual groups, in canon order", () => {
  const groups = groupBooks(BOOKS.map((book) => ({ book })));

  expect(groups.map((g) => [g.id, g.entries.length])).toEqual([
    ["law", 5],
    ["history", 12],
    ["poetry", 5],
    ["majorProphets", 5],
    ["minorProphets", 12],
    ["gospels", 5],
    ["paul", 13],
    ["general", 9],
  ]);
  expect(groups[0].entries.map((e) => e.book.name)).toEqual([
    "Sáng-thế Ký",
    "Xuất Ê-díp-tô Ký",
    "Lê-vi Ký",
    "Dân-số Ký",
    "Phục-truyền Luật-lệ Ký",
  ]);
  expect(groups[5].entries.at(-1)?.book.name).toBe("Công-vụ các Sứ-đồ");
  expect(groups[7].entries.at(-1)?.book.name).toBe("Khải-huyền");
});

test("groupBooks leaves out groups with no books", () => {
  const groups = groupBooks(BOOKS.filter((b) => b.order === 1 || b.order === 66).map((book) => ({ book })));
  expect(groups.map((g) => g.id)).toEqual(["law", "general"]);
});

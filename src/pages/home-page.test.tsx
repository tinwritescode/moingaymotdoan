import { captureArtifact } from "@solidjs/diagnostics";
import { fireEvent, render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { beforeEach, expect, test } from "vitest";
import { BOOKS } from "../../lib/content/books";
import { createHistoryEngine } from "../../lib/history/engine";
import { createMemoryLocalHistoryStore } from "../../lib/history/memory-adapters";
import { HistoryProvider } from "../components/history-context";
import { BookIndex } from "./home-page";
import { expectNoSolidWarnings } from "../components/diagnostics-fixtures";

beforeEach(() => {
  Element.prototype.scrollIntoView = () => {};
});

const book = (order: number, chapters: number) => ({
  book: BOOKS[order - 1],
  chapters: Array.from({ length: chapters }, (_, i) => ({ number: i + 1, title: `Đoạn ${i + 1}` })),
});
const toc = [book(1, 3), book(2, 2), book(40, 2)];

const renderIndex = (hash = "") =>
  render(() => (
    <HistoryProvider engine={createHistoryEngine({ local: createMemoryLocalHistoryStore(), now: () => new Date(2026, 10, 25) })}>
      <BookIndex toc={toc} hash={hash} />
    </HistoryProvider>
  ));

test("books sit under their group, and a tile opens only its own chapters", async () => {
  const { artifact } = await captureArtifact(
    () => {
      const { getByRole, queryByRole } = renderIndex();
      flush();

      expect(getByRole("heading", { name: "Ngũ Kinh" })).toBeTruthy();
      expect(getByRole("heading", { name: "Phúc Âm và Công-vụ" })).toBeTruthy();
      expect(queryByRole("link", { name: /Đoạn 1/ })).toBeNull();

      const genesis = getByRole("button", { name: /Sáng-thế Ký/ });
      fireEvent.click(genesis);
      flush();
      expect(genesis.getAttribute("aria-expanded")).toBe("true");
      expect(getByRole("link", { name: "Đoạn 3: Đoạn 3" }).getAttribute("href")).toBe("/sang-the-ky/3");

      fireEvent.click(getByRole("button", { name: /Ma-thi-ơ/ }));
      flush();
      expect(genesis.getAttribute("aria-expanded")).toBe("false");
      expect(getByRole("link", { name: "Đoạn 2: Đoạn 2" }).getAttribute("href")).toBe("/ma-thi-o/2");

      fireEvent.click(getByRole("button", { name: "Đóng" }));
      flush();
      expect(queryByRole("link", { name: /Đoạn 1/ })).toBeNull();
    },
    { scenario: "home-book-index" },
  );
  expectNoSolidWarnings(artifact);
});

test("a /#<book> link opens that book", () => {
  const { getByRole } = renderIndex("#xuat-e-dip-to-ky");
  flush();
  expect(getByRole("button", { name: /Xuất Ê-díp-tô Ký/ }).getAttribute("aria-expanded")).toBe("true");
});

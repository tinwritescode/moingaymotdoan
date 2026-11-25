import { captureArtifact, expectNoDiagnostics } from "@solidjs/diagnostics";
import { fireEvent, render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { describe, expect, test } from "vitest";
import type { ChapterView } from "../../lib/content";
import { BOOKS } from "../../lib/content/books";
import { ChapterReader } from "./chapter-reader";

const [GEN, EXO] = BOOKS;
const verse = (number: number) => ({ number, text: `Câu ${number}.` });

/** One story paragraph citing 1:2–3 of this chapter and Xuất 3:14 elsewhere. */
const VIEW: ChapterView = {
  book: GEN,
  number: 1,
  title: "Ban đầu",
  verses: [1, 2, 3, 4].map(verse),
  sections: [
    {
      heading: "Câu chuyện",
      paragraphs: [
        [
          { kind: "text", text: "Trời và đất " },
          {
            kind: "refs",
            parts: [
              { lead: "", ref: { label: "1:2–3", book: GEN, chapter: 1, verses: [verse(2), verse(3)] } },
              { lead: "", ref: { label: "Xuất 3:14", book: EXO, chapter: 3, verses: [verse(14)] } },
            ],
          },
        ],
      ],
    },
  ],
  opinions: [],
  prev: null,
  next: null,
};

const story = (container: HTMLElement) => container.querySelector("#cau-chuyen")!;

describe("<ChapterReader />", () => {
  test("a chỗ dẫn into this chapter opens its verses under the paragraph, and closes them again", async () => {
    const { artifact } = await captureArtifact(
      () => {
        const { container, getByRole } = render(() => <ChapterReader view={VIEW} />);
        const ref = getByRole("button", { name: "1:2–3" });
        expect(ref.getAttribute("aria-expanded")).toBe("false");

        fireEvent.click(ref);
        flush();
        expect(ref.getAttribute("aria-expanded")).toBe("true");
        expect(story(container).textContent).toContain("Nguyên văn · Sáng-thế Ký 1:2–3");
        expect(story(container).textContent).toContain("Câu 2.");
        expect(story(container).textContent).not.toContain("Câu 4.");

        fireEvent.click(ref);
        flush();
        expect(ref.getAttribute("aria-expanded")).toBe("false");
        expect(story(container).textContent).not.toContain("Nguyên văn ·");
      },
      { scenario: "inline-verses-toggle" },
    );
    expectNoDiagnostics(artifact);
  });

  test("a chỗ dẫn into another chapter opens a popover instead", () => {
    const { getByRole } = render(() => <ChapterReader view={VIEW} />);
    const ref = getByRole("button", { name: "Xuất 3:14" });
    const popover = document.getElementById(ref.getAttribute("popovertarget")!);
    expect(popover?.hasAttribute("popover")).toBe(true);
  });
});

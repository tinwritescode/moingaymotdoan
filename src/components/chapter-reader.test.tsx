import { captureArtifact, expectNoDiagnostics } from "@solidjs/diagnostics";
import { fireEvent, render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { describe, expect, test } from "vitest";
import type { ChapterView } from "../../lib/content";
import { BOOKS } from "../../lib/content/books";
import { ChapterReader } from "./chapter-reader";
import { LocaleProvider } from "./locale-context";
import { BOOKS_EN } from "../../lib/content/books";

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
    const { container, getByRole } = render(() => <ChapterReader view={VIEW} />);
    const ref = getByRole("button", { name: "Xuất 3:14" });
    const popover = document.getElementById(ref.getAttribute("popovertarget")!);
    expect(popover?.hasAttribute("popover")).toBe(true);
    // Popover inside <p> must use phrasing content (<span>), otherwise HTML5 SSR parsing
    // implicitly closes </p> before the popover and orphans the closing ")" on a new line.
    expect(popover?.tagName).toBe("SPAN");
    expect(container.querySelector("p div")).toBeNull();
  });

  test("renders English labels and BSB inline verse header under LocaleProvider('en')", async () => {
    const [GEN_EN] = BOOKS_EN;
    const enView: ChapterView = {
      book: GEN_EN,
      number: 1,
      title: "In the Beginning",
      verses: [
        { number: 1, text: "In the beginning God created the heavens and the earth." },
        { number: 2, text: "Now the earth was formless and void." },
      ],
      sections: [
        {
          key: "story",
          heading: "Story",
          paragraphs: [
            [
              { kind: "text", text: "God created the world " },
              {
                kind: "refs",
                parts: [{ lead: "", ref: { label: "1:1", book: GEN_EN, chapter: 1, verses: [{ number: 1, text: "In the beginning God created the heavens and the earth." }] } }],
              },
            ],
          ],
        },
        { key: "takeaways", heading: "Key Takeaways", paragraphs: [[{ kind: "text", text: "God is Creator." }]] },
      ],
      opinions: [],
      prev: null,
      next: null,
    };

    const { artifact } = await captureArtifact(
      () => {
        const { container, getByRole } = render(() => (
          <LocaleProvider locale="en">
            <ChapterReader view={enView} />
          </LocaleProvider>
        ));
        expect(container.textContent).toContain("Genesis · Chapter 1");
        expect(container.textContent).toContain("Key Takeaways");
        fireEvent.click(getByRole("button", { name: "1:1" }));
        flush();
        expect(story(container).textContent).toContain("BSB · Genesis 1:1");
      },
      { scenario: "en-inline-verses-toggle" },
    );
    expectNoDiagnostics(artifact);
  });
});

import { describe, expect, it } from "vitest";
import { chapterKeyTarget } from "./chapter-keys";

const links = { prev: "/sang-the-ky/1", next: "/sang-the-ky/3", typing: false };
const key = (k: string, mods: Partial<Record<"altKey" | "ctrlKey" | "metaKey" | "shiftKey" | "defaultPrevented", boolean>> = {}) => ({
  key: k,
  altKey: false,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  defaultPrevented: false,
  ...mods,
});

describe("chapterKeyTarget", () => {
  it("goes to the previous and next đoạn on ← and →", () => {
    expect(chapterKeyTarget({ ...links, event: key("ArrowLeft") })).toBe("/sang-the-ky/1");
    expect(chapterKeyTarget({ ...links, event: key("ArrowRight") })).toBe("/sang-the-ky/3");
  });

  it("does nothing at the first or last đoạn", () => {
    expect(chapterKeyTarget({ ...links, prev: null, event: key("ArrowLeft") })).toBeNull();
    expect(chapterKeyTarget({ ...links, next: null, event: key("ArrowRight") })).toBeNull();
  });

  it("leaves other keys, modified keys, handled events and typing to the browser", () => {
    expect(chapterKeyTarget({ ...links, event: key("ArrowUp") })).toBeNull();
    for (const mod of ["altKey", "ctrlKey", "metaKey", "shiftKey", "defaultPrevented"] as const) {
      expect(chapterKeyTarget({ ...links, event: key("ArrowRight", { [mod]: true }) })).toBeNull();
    }
    expect(chapterKeyTarget({ ...links, typing: true, event: key("ArrowRight") })).toBeNull();
  });
});

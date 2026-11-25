import { describe, expect, test } from "vitest";
import { cardPlacement, tourHref } from "./tour";

describe("cardPlacement", () => {
  test("a target in the top part of the screen gets the card under it", () => {
    expect(cardPlacement({ top: 100, bottom: 140 }, 800)).toEqual({ top: 154 });
  });

  test("a target near the bottom gets the card above it", () => {
    expect(cardPlacement({ top: 700, bottom: 760 }, 800)).toEqual({ bottom: 114 });
  });

  test("a target taller than the room on either side pins the card to the bottom edge", () => {
    expect(cardPlacement({ top: 120, bottom: 700 }, 800)).toEqual({ bottom: 16 });
  });
});

test("tourHref asks the chapter page to start the tour", () => {
  expect(tourHref("/sang-the-ky/1")).toBe("/sang-the-ky/1?tour");
});

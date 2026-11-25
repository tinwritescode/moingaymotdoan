import type { Messages } from "../../lib/i18n";

/** Set once a reader has finished, skipped or declined the tour; the welcome sheet then stays away. */
export const TOUR_STORAGE_KEY = "kt:tour:v1";

export type TourStepId = keyof Messages["tour"]["steps"];

/** The tour's steps in order, each with the element it lights up. A step whose element is missing is left out. */
export const TOUR_STEPS: readonly { id: TourStepId; selector: string }[] = [
  { id: "ref", selector: "#cau-chuyen .kt-ref" },
  { id: "notes", selector: ".kt-notes" },
  { id: "display", selector: ".kt-display-controls" },
  { id: "next", selector: ".kt-chapter-nav" },
];

/** A chapter link that starts the tour on arrival. */
export const tourHref = (chapterPath: string): string => `${chapterPath}?tour`;

const GAP = 14;
// shortcut: assumes the card is at most this tall; measure the card if its copy grows.
const CARD_HEIGHT = 260;

/** Where the coach card sits: under the target when it fits, else above it, else pinned to the bottom edge. */
export function cardPlacement(
  target: { top: number; bottom: number },
  viewportHeight: number,
): { top: number } | { bottom: number } {
  if (target.bottom + GAP + CARD_HEIGHT <= viewportHeight) return { top: target.bottom + GAP };
  if (target.top - GAP - CARD_HEIGHT >= 0) return { bottom: viewportHeight - target.top + GAP };
  return { bottom: 16 };
}

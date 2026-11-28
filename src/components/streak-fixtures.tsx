import { render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import type { JSX } from "@solidjs/web";
import { vi } from "vitest";
import { createHistoryEngine } from "../../lib/history/engine";
import { createMemoryLocalHistoryStore } from "../../lib/history/memory-adapters";
import type { HistorySnapshot, ReadingLog } from "../../lib/history/types";
import { addDays } from "../../lib/streak/streak";
import { HistoryProvider } from "./history-context";
import { StreakProvider } from "./streak-context";

// Test helpers shared by the streak component tests.

export function chapterLog(readDate: string, itemKey = "giang/3"): ReadingLog {
  return {
    id: `${readDate}:${itemKey}`,
    kind: "chapter",
    itemKey,
    bookSlug: "giang",
    chapter: 3,
    title: "",
    subtitle: "Giăng 3",
    readDate,
    readAt: `${readDate}T08:00:00.000Z`,
  };
}

/** A history with one đoạn read on each of `count` days ending `endBack` days before `today`. */
export function historyOf(today: string, count: number, endBack: number): HistorySnapshot {
  return { progress: [], logs: Array.from({ length: count }, (_, i) => chapterLog(addDays(today, -(endBack + i)))) };
}

/** Renders `ui` under the history and streak providers with the clock set to local `time`. */
export function renderStreakAt(time: string, history: HistorySnapshot, ui: () => JSX.Element) {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(time));
  const engine = createHistoryEngine({ local: createMemoryLocalHistoryStore(history) });
  const view = render(() => (
    <HistoryProvider engine={engine}>
      <StreakProvider>{ui()}</StreakProvider>
    </HistoryProvider>
  ));
  flush();
  return view;
}

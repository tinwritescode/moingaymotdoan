import { render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createAuthSession } from "../../lib/auth/session";
import { createHistoryEngine } from "../../lib/history/engine";
import { createMemoryLocalHistoryStore } from "../../lib/history/memory-adapters";
import { EMPTY_HISTORY, type HistorySnapshot } from "../../lib/history/types";
import { CONTINUE_HEIGHT_STORAGE_KEY } from "../lib/preferences";
import { AuthProvider } from "./auth-context";
import { ContinueReading } from "./continue-reading";
import { HistoryProvider } from "./history-context";
import { StreakProvider } from "./streak-context";
import { freshQueryClient } from "./streak-fixtures";

vi.mock("lottie-web/build/player/lottie_light", () => ({ default: { loadAnimation: vi.fn() } }));

const AT = "2026-11-25T09:00:00.000Z";
const READ_GENESIS_1: HistorySnapshot = {
  progress: [
    {
      kind: "chapter",
      itemKey: "sang-the-ky/1",
      bookSlug: "sang-the-ky",
      chapter: 1,
      title: "Ban đầu",
      subtitle: "Sáng-thế Ký 1",
      firstReadAt: AT,
      lastReadAt: AT,
      readCount: 1,
      completed: false,
      completedAt: null,
    },
  ],
  logs: [],
};

/** A guest (auth not configured), so the history in local storage is the whole history. */
async function renderAsGuest(history: HistorySnapshot) {
  const session = createAuthSession({
    configured: false,
    init: async () => null,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
    getAccessToken: async () => null,
  });
  const engine = createHistoryEngine({ local: createMemoryLocalHistoryStore(history) });
  const view = render(() => (
    <AuthProvider session={session}>
      <HistoryProvider engine={engine}>
        <StreakProvider>
          <ContinueReading toc={[]} />
        </StreakProvider>
      </HistoryProvider>
    </AuthProvider>
  ), freshQueryClient);
  await vi.waitFor(() => {
    flush();
    expect(session.getState().initialized).toBe(true);
  });
  flush();
  return view;
}

describe("<ContinueReading /> remembers its height for the next load", () => {
  beforeEach(() => {
    // jsdom does no layout; give the card a height to remember.
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(302);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  test("stores the card's height when a reader has a chapter to continue", async () => {
    const { findByText } = await renderAsGuest(READ_GENESIS_1);
    await findByText("Sáng-thế Ký 1");
    expect(localStorage.getItem(CONTINUE_HEIGHT_STORAGE_KEY)).toBe("302");
  });

  test("keeps the stored height current as the card grows after it first shows", async () => {
    const watchers: (() => void)[] = [];
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(cb: () => void) {
          watchers.push(cb);
        }
        observe() {}
        disconnect() {}
      },
    );
    const { findByText } = await renderAsGuest(READ_GENESIS_1);
    await findByText("Sáng-thế Ký 1");
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(419);
    for (const w of watchers) w();
    expect(localStorage.getItem(CONTINUE_HEIGHT_STORAGE_KEY)).toBe("419");
  });

  test("the streak card leads the card", async () => {
    const view = await renderAsGuest(READ_GENESIS_1);
    await view.findByRole("region", { name: "Chuỗi ngày đọc" });
  });

  test("forgets it once the reader has nothing to continue", async () => {
    localStorage.setItem(CONTINUE_HEIGHT_STORAGE_KEY, "302");
    await renderAsGuest(EMPTY_HISTORY);
    await vi.waitFor(() => expect(localStorage.getItem(CONTINUE_HEIGHT_STORAGE_KEY)).toBeNull());
  });
});

const LOADING = "Đang tải lịch sử đọc của bạn…";

describe("<ContinueReading /> while history loads", () => {
  test("holds a skeleton until a signed-in reader's cloud history arrives, then shows the card", async () => {
    let arrive: ((h: HistorySnapshot) => void) | null = null;
    const session = createAuthSession({
      configured: true,
      init: async () => ({ id: "user_a", email: "a@example.test", name: "A", avatarUrl: null }),
      signIn: async () => {},
      signUp: async () => {},
      signOut: async () => {},
      getAccessToken: async () => "token",
    });
    const fail = async (): Promise<never> => {
      throw new Error("not in this test");
    };
    const engine = createHistoryEngine({
      local: createMemoryLocalHistoryStore(EMPTY_HISTORY),
      remote: {
        fetchHistory: () => new Promise<HistorySnapshot>((resolve) => (arrive = resolve)),
        syncGuest: fail,
        recordVisit: fail,
        setCompleted: fail,
        deleteLog: fail,
        clearAll: fail,
      },
    });
    const view = render(() => (
      <AuthProvider session={session}>
        <HistoryProvider engine={engine}>
          <StreakProvider>
            <ContinueReading toc={[]} />
          </StreakProvider>
        </HistoryProvider>
      </AuthProvider>
    ), freshQueryClient);

    await view.findByText(LOADING);
    const deliver = await vi.waitFor(() => arrive ?? Promise.reject(new Error("history not fetched yet")));
    expect(view.getByText(LOADING)).toBeTruthy();
    deliver(READ_GENESIS_1);
    await view.findByText("Sáng-thế Ký 1");
    expect(view.queryByText(LOADING)).toBeNull();
  });

  test("drops the skeleton once a reader turns out to have nothing to continue", async () => {
    const view = await renderAsGuest(EMPTY_HISTORY);
    await vi.waitFor(() => expect(view.queryByText(LOADING)).toBeNull());
  });
});

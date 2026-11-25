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
        <ContinueReading toc={[]} />
      </HistoryProvider>
    </AuthProvider>
  ));
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
    localStorage.clear();
  });

  test("stores the card's height when a reader has a chapter to continue", async () => {
    const { findByText } = await renderAsGuest(READ_GENESIS_1);
    await findByText("Sáng-thế Ký 1");
    expect(localStorage.getItem(CONTINUE_HEIGHT_STORAGE_KEY)).toBe("302");
  });

  test("forgets it once the reader has nothing to continue", async () => {
    localStorage.setItem(CONTINUE_HEIGHT_STORAGE_KEY, "302");
    await renderAsGuest(EMPTY_HISTORY);
    await vi.waitFor(() => expect(localStorage.getItem(CONTINUE_HEIGHT_STORAGE_KEY)).toBeNull());
  });
});

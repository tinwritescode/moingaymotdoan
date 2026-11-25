import { captureArtifact, expectNoDiagnostics } from "@solidjs/diagnostics";
import { fireEvent, render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, describe, expect, test, vi } from "vitest";
import { createAuthSession } from "../../lib/auth/session";
import type { AuthProviderAdapter } from "../../lib/auth/types";
import type { ChapterView } from "../../lib/content";
import { BOOKS } from "../../lib/content/books";
import { createHistoryEngine } from "../../lib/history/engine";
import { createMemoryLocalHistoryStore } from "../../lib/history/memory-adapters";
import { AuthProvider } from "./auth-context";
import { ChapterReader } from "./chapter-reader";
import { HistoryProvider } from "./history-context";

const [GEN] = BOOKS;
const VIEW: ChapterView = {
  book: GEN,
  number: 1,
  title: "Ban đầu",
  verses: [{ number: 1, text: "Ban đầu Đức Chúa Trời dựng nên trời đất." }],
  sections: [
    {
      heading: "Câu chuyện",
      paragraphs: [[{ kind: "text", text: "Ban đầu Đức Chúa Trời dựng nên trời đất." }]],
    },
  ],
  opinions: [],
  prev: null,
  next: null,
};

afterEach(() => {
  vi.useRealTimers();
});

describe("HistoryProvider + ChapterProgressBar + ChapterVisitRecorder", () => {
  test("hydrates reading controls immediately even while auth is pending, records visit after 500ms, and toggles completion", async () => {
    vi.useFakeTimers();

    // Auth adapter that never settles during this test — proves chapter controls never stall on auth/cloud.
    const pendingAuthAdapter: AuthProviderAdapter = {
      configured: true,
      init: () => new Promise(() => {}),
      signIn: async () => {},
      signUp: async () => {},
      signOut: async () => {},
      getAccessToken: async () => null,
    };

    const session = createAuthSession(pendingAuthAdapter);
    const local = createMemoryLocalHistoryStore();
    const engine = createHistoryEngine({
      local,
      now: () => new Date(2026, 10, 25, 9, 0),
    });

    const { artifact } = await captureArtifact(
      async () => {
        const { getByRole } = render(() => (
          <AuthProvider session={session}>
            <HistoryProvider engine={engine}>
              <ChapterReader view={VIEW} />
            </HistoryProvider>
          </AuthProvider>
        ));
        flush();

        // Progress bar is immediately live even though auth has not resolved.
        const completeBtn = getByRole("button", { name: "Đánh dấu xong" });
        expect(completeBtn.getAttribute("aria-pressed")).toBe("false");

        // After 500ms, ChapterVisitRecorder records the canonical visit into local history.
        await vi.advanceTimersByTimeAsync(500);
        flush();
        expect(local.read().progress).toHaveLength(1);
        expect(local.read().progress[0].itemKey).toBe("sang-the-ky/1");
        expect(local.read().progress[0].completed).toBe(false);

        // Clicking completion toggles through the HistoryEngine interface.
        fireEvent.click(completeBtn);
        flush();
        expect(completeBtn.getAttribute("aria-pressed")).toBe("true");
        expect(local.read().progress[0].completed).toBe(true);
      },
      { scenario: "history-provider-chapter-reader" },
    );
    expectNoDiagnostics(artifact);
  });
});

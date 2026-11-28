import { captureArtifact } from "@solidjs/diagnostics";
import { fireEvent, render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createAuthSession } from "../../lib/auth/session";
import type { AuthProviderAdapter } from "../../lib/auth/types";
import type { ChapterView } from "../../lib/content";
import { BOOKS } from "../../lib/content/books";
import { createHistoryEngine } from "../../lib/history/engine";
import { createMemoryLocalHistoryStore } from "../../lib/history/memory-adapters";
import { AuthProvider } from "./auth-context";
import { ChapterReader } from "./chapter-reader";
import { HistoryProvider } from "./history-context";
import { ChapterProgressBar } from "./reading-tracker";
import { historyOf, renderStreakAt } from "./streak-fixtures";
import { expectNoSolidWarnings } from "./diagnostics-fixtures";

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

vi.mock("lottie-web/build/player/lottie_light", () => ({ default: { loadAnimation: vi.fn() } }));

// jsdom has no modal dialogs; the attribute is what showModal and close change.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
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
    expectNoSolidWarnings(artifact);
  });
});

describe("done sheet", () => {
  const TODAY = "2026-11-29";

  test("the day's first completed đoạn opens the sheet with the streak and a new milestone", async () => {
    const view = renderStreakAt(`${TODAY}T10:00:00`, historyOf(TODAY, 6, 1), () => <ChapterProgressBar view={VIEW} />);
    const dialog = view.getByRole("dialog", { hidden: true });
    expect(dialog.hasAttribute("open")).toBe(false);

    fireEvent.click(await view.findByRole("button", { name: "Đánh dấu xong" }));
    flush();
    expect(dialog.hasAttribute("open")).toBe(true);
    await view.findByText("Mốc mới: Đèn dầu");
    view.getByText("7 ngày liền đọc Lời Chúa. Mai đọc tiếp nhé.");

    fireEvent.click(view.getByRole("button", { name: "Đọc tiếp" }));
    flush();
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  test("clicking outside on the backdrop closes the done sheet", async () => {
    const view = renderStreakAt(`${TODAY}T10:00:00`, historyOf(TODAY, 6, 1), () => <ChapterProgressBar view={VIEW} />);
    fireEvent.click(await view.findByRole("button", { name: "Đánh dấu xong" }));
    flush();
    const dialog = view.getByRole("dialog", { name: "Đọc xong hôm nay" });
    expect(dialog.hasAttribute("open")).toBe(true);

    fireEvent.pointerDown(dialog);
    fireEvent.click(dialog);
    flush();
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  test("a later completion the same day opens nothing", async () => {
    const at = `${TODAY}T08:00:00.000Z`;
    const history = {
      logs: historyOf(TODAY, 1, 0).logs,
      progress: [
        {
          kind: "chapter" as const,
          itemKey: "giang/3",
          bookSlug: "giang",
          chapter: 3,
          title: "",
          subtitle: "Giăng 3",
          firstReadAt: at,
          lastReadAt: at,
          readCount: 1,
          completed: true,
          completedAt: at,
        },
      ],
    };
    const view = renderStreakAt(`${TODAY}T10:00:00`, history, () => <ChapterProgressBar view={VIEW} />);
    fireEvent.click(await view.findByRole("button", { name: "Đánh dấu xong" }));
    flush();
    expect(view.getByRole("dialog", { hidden: true }).hasAttribute("open")).toBe(false);
  });
});

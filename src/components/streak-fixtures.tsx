import { render } from "@solidjs/testing-library";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { flush } from "solid-js";
import type { JSX } from "@solidjs/web";
import type { ParentProps } from "solid-js";
import { vi } from "vitest";
import { createAuthSession } from "../../lib/auth/session";
import type { AuthUser } from "../../lib/auth/types";
import type { StreakMarksRemote } from "../../lib/history/ports";
import { createHistoryEngine } from "../../lib/history/engine";
import { createMemoryLocalHistoryStore } from "../../lib/history/memory-adapters";
import type { HistorySnapshot, ReadingLog } from "../../lib/history/types";
import { addDays } from "../../lib/streak/streak";
import { AuthProvider } from "./auth-context";
import { HistoryProvider } from "./history-context";
import { ProfileProvider } from "./profile-context";
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

/** render() option giving each test its own query cache, as App gives each page load. */
export const freshQueryClient = {
  wrapper: (props: ParentProps) => <QueryClientProvider client={new QueryClient()}>{props.children}</QueryClientProvider>,
};

type SignedIn = { userId: string; remoteFor: (userId: string) => StreakMarksRemote | null };

/** A session already signed in as `userId`, with the account's name and photo if given. */
export function signedInSession(userId: string, account: Partial<Pick<AuthUser, "name" | "avatarUrl">> = {}) {
  return createAuthSession({
    configured: true,
    init: async () => ({ id: userId, email: "", name: "", avatarUrl: null, ...account }),
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
    getAccessToken: async () => "token",
  });
}

/** Renders `ui` under the history and streak providers with the clock set to local `time`; a guest unless `signedIn`. */
export function renderStreakAt(time: string, history: HistorySnapshot, ui: () => JSX.Element, signedIn?: SignedIn) {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(time));
  const engine = createHistoryEngine({ local: createMemoryLocalHistoryStore(history) });
  const tree = () => (
    <HistoryProvider engine={engine}>
      <StreakProvider remoteFor={signedIn?.remoteFor}>
        <ProfileProvider remoteFor={() => null}>{ui()}</ProfileProvider>
      </StreakProvider>
    </HistoryProvider>
  );
  const view = render(() =>
    signedIn ? <AuthProvider session={signedInSession(signedIn.userId)}>{tree()}</AuthProvider> : tree(),
    freshQueryClient,
  );
  flush();
  return view;
}

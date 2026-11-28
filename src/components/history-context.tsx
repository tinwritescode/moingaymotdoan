import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import { canonicalBookSlug } from "../../lib/content/books";
import {
  createHistoryEngine,
  type HistoryEngine,
  type HistoryEngineState,
  type HistorySyncErrorCode,
} from "../../lib/history/engine";
import {
  buildBookSummaries,
  buildProgressMap,
  computeReadingStats,
  EMPTY_HISTORY,
  findLatestChapter,
  progressMapKey,
  type BookReadSummary,
  type HistoryKind,
  type ReadingLog,
  type ReadingProgress,
  type ReadingStats,
  type VisitInput,
} from "../../lib/history/types";
import {
  createBrowserLocalHistoryStore,
  createHttpHistoryAdapter,
  getHistoryApiUrl,
} from "../lib/browser-history-adapters";
import { useAuth } from "./auth-context";

export type HistoryContextValue = {
  hydrated: Accessor<boolean>;
  syncing: Accessor<boolean>;
  syncError: Accessor<HistorySyncErrorCode | null>;
  progress: Accessor<ReadingProgress[]>;
  logs: Accessor<ReadingLog[]>;
  latestChapter: Accessor<ReadingProgress | null>;
  stats: Accessor<ReadingStats>;
  progressFor: (kind: HistoryKind, itemKey: string) => ReadingProgress | undefined;
  bookSummary: (bookSlug: string) => BookReadSummary | undefined;
  recordVisit: (input: VisitInput) => Promise<void>;
  toggleCompleted: (input: VisitInput & { completed: boolean }) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;
  refreshHistory: () => Promise<void>;
};

const EMPTY_STATS: ReadingStats = {
  chaptersRead: 0,
  chaptersCompleted: 0,
  booksOpened: 0,
  moodsRead: 0,
  readingDays: 0,
};

const FALLBACK_HISTORY: HistoryContextValue = {
  hydrated: () => false,
  syncing: () => false,
  syncError: () => null,
  progress: () => [],
  logs: () => [],
  latestChapter: () => null,
  stats: () => EMPTY_STATS,
  progressFor: () => undefined,
  bookSummary: () => undefined,
  recordVisit: async () => {},
  toggleCompleted: async () => {},
  deleteLog: async () => {},
  clearAllHistory: async () => {},
  refreshHistory: async () => {},
};

const HistoryContext = createContext<HistoryContextValue>(FALLBACK_HISTORY);

/**
 * Thin Solid 2.0 binding over the framework-agnostic HistoryEngine module.
 * Hydrates local guest history immediately on mount so reading controls never stall on cloud latency,
 * then coordinates cloud sync reactively when AuthProvider resolves a signed-in user.
 */
export function HistoryProvider(props: ParentProps<{ engine?: HistoryEngine }>) {
  const auth = useAuth();
  let ownedEngine: HistoryEngine | null = null;

  const engineMemo = createMemo(() => {
    if (props.engine) return props.engine;
    if (!ownedEngine) {
      const baseUrl = getHistoryApiUrl();
      ownedEngine = createHistoryEngine({
        local: createBrowserLocalHistoryStore(),
        remote: baseUrl
          ? createHttpHistoryAdapter({
              baseUrl,
              getAccessToken: (forceRefresh) => auth.getAccessToken(forceRefresh),
            })
          : null,
      });
    }
    return ownedEngine;
  });

  const [state, setState] = createSignal<HistoryEngineState>({
    hydrated: false,
    syncing: false,
    syncError: null,
    remoteActive: false,
    snapshot: EMPTY_HISTORY,
  });

  createEffect(
    () => engineMemo(),
    (engine) => {
      const unsubscribe = engine.subscribe((next) => setState(next));
      engine.hydrateLocal();
      setState(engine.getState());
      return unsubscribe;
    },
  );

  const hydrated = createMemo(() => state().hydrated);
  const activeUserId = createMemo(() => auth.user()?.id ?? null);
  const authSyncTarget = createMemo(
    () => (hydrated() ? { engine: engineMemo(), userId: activeUserId() } : null),
    { equals: (a, b) => a?.engine === b?.engine && a?.userId === b?.userId },
  );
  let wasSignedIn = false;

  createEffect(
    () => authSyncTarget(),
    (target) => {
      if (!target) return;
      if (target.userId) {
        wasSignedIn = true;
        void target.engine.activateUser(target.userId);
      } else if (wasSignedIn) {
        wasSignedIn = false;
        target.engine.deactivateUser();
      }
    },
  );

  const progress = createMemo(() => state().snapshot.progress);
  const logs = createMemo(() => state().snapshot.logs);
  const progressByKey = createMemo(() => buildProgressMap(progress()));
  const bookSummaries = createMemo(() => buildBookSummaries(progress()));
  const latestChapter = createMemo(() => findLatestChapter(progress()));
  const stats = createMemo(() => computeReadingStats(state().snapshot));

  const value: HistoryContextValue = {
    hydrated,
    syncing: () => state().syncing,
    syncError: () => state().syncError,
    progress,
    logs,
    latestChapter,
    stats,
    progressFor: (kind, itemKey) => progressByKey().get(progressMapKey(kind, itemKey)),
    bookSummary: (bookSlug) => bookSummaries().get(canonicalBookSlug(bookSlug) ?? bookSlug),
    recordVisit: (input) => engineMemo().recordVisit(input),
    toggleCompleted: (input) => engineMemo().toggleCompleted(input),
    deleteLog: (id) => engineMemo().deleteLog(id),
    clearAllHistory: () => engineMemo().clearAll(),
    refreshHistory: () => engineMemo().refresh(),
  };

  return <HistoryContext value={value}>{props.children}</HistoryContext>;
}

export function useHistory(): HistoryContextValue {
  return useContext(HistoryContext);
}

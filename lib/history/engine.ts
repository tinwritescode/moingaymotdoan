import {
  applyCompleteToSnapshot,
  applyVisitToSnapshot,
  buildSyncItems,
  reconcileProgressInSnapshot,
  reconcileVisitInSnapshot,
  removeLogFromSnapshot,
  toCompletePayload,
  toVisitPayload,
} from "./contract";
import type { LocalHistoryStore, RemoteHistoryAdapter } from "./ports";
import {
  EMPTY_HISTORY,
  isSyntheticLogId,
  localDateKey,
  normalizeVisitInput,
  progressMapKey,
  syntheticLogId,
  type HistorySnapshot,
  type ReadingLog,
  type ReadingProgress,
  type VisitInput,
} from "./types";

export type HistorySyncErrorCode =
  | "sync_failed"
  | "visit_failed"
  | "complete_failed"
  | "delete_log_failed"
  | "clear_failed";

export type HistoryEngineState = {
  hydrated: boolean;
  syncing: boolean;
  syncError: HistorySyncErrorCode | null;
  remoteActive: boolean;
  snapshot: HistorySnapshot;
};

export type HistoryEngineDeps = {
  local: LocalHistoryStore;
  remote?: RemoteHistoryAdapter | null;
  now?: () => Date;
};

export type HistoryEngine = {
  getState(): HistoryEngineState;
  subscribe(listener: (state: HistoryEngineState) => void): () => void;
  hydrateLocal(): void;
  activateUser(userId: string): Promise<void>;
  deactivateUser(): void;
  recordVisit(input: VisitInput): Promise<void>;
  toggleCompleted(input: VisitInput & { completed: boolean }): Promise<void>;
  deleteLog(id: string): Promise<void>;
  clearAll(): Promise<void>;
  refresh(): Promise<void>;
};

function restoreProgressRow(
  current: HistorySnapshot,
  kind: ReadingProgress["kind"],
  itemKey: string,
  previous: ReadingProgress | undefined,
): ReadingProgress[] {
  const target = progressMapKey(kind, itemKey);
  const without = current.progress.filter((p) => progressMapKey(p.kind, p.itemKey) !== target);
  return previous ? [previous, ...without] : without;
}

function restoreLogRow(
  current: HistorySnapshot,
  kind: ReadingLog["kind"],
  itemKey: string,
  readDate: string,
  previous: ReadingLog | undefined,
): ReadingLog[] {
  const target = progressMapKey(kind, itemKey);
  const without = current.logs.filter(
    (l) => !(progressMapKey(l.kind, l.itemKey) === target && l.readDate === readDate),
  );
  return previous ? [previous, ...without] : without;
}

/**
 * Deep, framework-agnostic client reading-history engine.
 * Owns local hydration, guest-to-cloud sync, optimistic writes with rollback,
 * session-generation race guards, and synthetic optimistic log ID reconciliation.
 */
export function createHistoryEngine(deps: HistoryEngineDeps): HistoryEngine {
  const now = deps.now ?? (() => new Date());
  const remote = deps.remote ?? null;

  let sessionGeneration = 0;
  let activeUserId: string | null = null;
  const pendingSyntheticVisits = new Map<string, Promise<string | null>>();
  const deletedPendingSyntheticIds = new Set<string>();

  let state: HistoryEngineState = {
    hydrated: false,
    syncing: false,
    syncError: null,
    remoteActive: false,
    snapshot: EMPTY_HISTORY,
  };

  const listeners = new Set<(next: HistoryEngineState) => void>();

  const setState = (patch: Partial<HistoryEngineState>) => {
    state = { ...state, ...patch };
    for (const listener of listeners) {
      listener(state);
    }
  };

  const canUseRemote = () => state.remoteActive && remote !== null;

  const hydrateLocal = () => {
    if (state.hydrated) return;
    setState({
      hydrated: true,
      snapshot: deps.local.read(),
    });
  };

  const loadFromRemote = async (mergeGuest: boolean, gen: number): Promise<void> => {
    if (!remote) return;
    setState({ syncing: true, syncError: null });
    try {
      const guest = mergeGuest ? deps.local.read() : EMPTY_HISTORY;
      const syncItems = mergeGuest ? buildSyncItems(guest) : [];
      const cloud = syncItems.length > 0 ? await remote.syncGuest(syncItems) : await remote.fetchHistory();
      if (gen !== sessionGeneration) return;
      if (syncItems.length > 0) deps.local.clear();
      setState({
        snapshot: cloud,
        remoteActive: true,
        syncing: false,
        syncError: null,
      });
    } catch {
      if (gen !== sessionGeneration) return;
      // Preserve local/current snapshot on cloud failure so no guest reads are lost.
      setState({
        syncing: false,
        syncError: "sync_failed",
      });
    }
  };

  const activateUser = async (userId: string): Promise<void> => {
    if (!userId) return;
    if (activeUserId === userId && state.remoteActive) return;

    sessionGeneration += 1;
    const gen = sessionGeneration;
    activeUserId = userId;
    pendingSyntheticVisits.clear();
    deletedPendingSyntheticIds.clear();

    if (!remote) {
      setState({ remoteActive: false, syncing: false, syncError: null });
      return;
    }

    setState({ remoteActive: true });
    await loadFromRemote(true, gen);
  };

  const deactivateUser = (): void => {
    sessionGeneration += 1;
    activeUserId = null;
    pendingSyntheticVisits.clear();
    deletedPendingSyntheticIds.clear();

    setState({
      remoteActive: false,
      syncing: false,
      syncError: null,
      snapshot: state.hydrated ? deps.local.read() : EMPTY_HISTORY,
    });
  };

  const recordVisit = async (rawInput: VisitInput): Promise<void> => {
    const input = normalizeVisitInput(rawInput);
    const at = now();
    const readDate = localDateKey(at);
    const key = progressMapKey(input.kind, input.itemKey);

    const prevProgress = state.snapshot.progress.find((p) => progressMapKey(p.kind, p.itemKey) === key);
    const prevLog = state.snapshot.logs.find(
      (l) => progressMapKey(l.kind, l.itemKey) === key && l.readDate === readDate,
    );

    const next = applyVisitToSnapshot(state.snapshot, input, at);
    setState({ snapshot: next });

    if (!canUseRemote()) {
      deps.local.write(next);
      return;
    }

    const gen = sessionGeneration;
    const synthId = syntheticLogId(readDate, input.kind, input.itemKey);
    const payload = toVisitPayload(input, at);

    const requestPromise: Promise<string | null> = remote!
      .recordVisit(payload)
      .then((saved) => {
        if (gen !== sessionGeneration) return null;
        const wasDeletedInFlight = deletedPendingSyntheticIds.has(synthId);
        deletedPendingSyntheticIds.delete(synthId);
        setState({
          syncError: null,
          snapshot: reconcileVisitInSnapshot(state.snapshot, saved, { skipLog: wasDeletedInFlight }),
        });
        return saved.log.id;
      })
      .catch(() => {
        if (gen !== sessionGeneration) return null;
        deletedPendingSyntheticIds.delete(synthId);
        setState({
          syncError: "visit_failed",
          snapshot: {
            progress: restoreProgressRow(state.snapshot, input.kind, input.itemKey, prevProgress),
            logs: restoreLogRow(state.snapshot, input.kind, input.itemKey, readDate, prevLog),
          },
        });
        return null;
      })
      .finally(() => {
        if (pendingSyntheticVisits.get(synthId) === requestPromise) {
          pendingSyntheticVisits.delete(synthId);
        }
      });

    pendingSyntheticVisits.set(synthId, requestPromise);
    await requestPromise;
  };

  const toggleCompleted = async (rawInput: VisitInput & { completed: boolean }): Promise<void> => {
    const input = normalizeVisitInput(rawInput);
    const at = now();
    const readDate = localDateKey(at);
    const key = progressMapKey(input.kind, input.itemKey);

    const prevProgress = state.snapshot.progress.find((p) => progressMapKey(p.kind, p.itemKey) === key);
    const prevLog = state.snapshot.logs.find(
      (l) => progressMapKey(l.kind, l.itemKey) === key && l.readDate === readDate,
    );

    const next = applyCompleteToSnapshot(state.snapshot, input, at);
    setState({ snapshot: next });

    if (!canUseRemote()) {
      deps.local.write(next);
      return;
    }

    const gen = sessionGeneration;
    const payload = toCompletePayload(input, at);
    try {
      const saved = await remote!.setCompleted(payload);
      if (gen !== sessionGeneration) return;
      setState({
        syncError: null,
        snapshot: reconcileProgressInSnapshot(state.snapshot, saved.progress),
      });
    } catch {
      if (gen !== sessionGeneration) return;
      setState({
        syncError: "complete_failed",
        snapshot: {
          progress: restoreProgressRow(state.snapshot, input.kind, input.itemKey, prevProgress),
          logs: prevProgress
            ? state.snapshot.logs
            : restoreLogRow(state.snapshot, input.kind, input.itemKey, readDate, prevLog),
        },
      });
    }
  };

  const deleteLog = async (id: string): Promise<void> => {
    const removed = state.snapshot.logs.find((l) => l.id === id);
    const removedIndex = state.snapshot.logs.findIndex((l) => l.id === id);
    const next = removeLogFromSnapshot(state.snapshot, id);
    setState({ snapshot: next });

    if (!canUseRemote()) {
      deps.local.write(next);
      return;
    }

    const gen = sessionGeneration;
    let remoteId = id;

    if (isSyntheticLogId(id)) {
      const pending = pendingSyntheticVisits.get(id);
      if (!pending) {
        // Optimistic log was never persisted remotely; removing it locally avoids a guaranteed 400.
        return;
      }
      deletedPendingSyntheticIds.add(id);
      const resolvedId = await pending;
      if (gen !== sessionGeneration || !resolvedId) return;
      remoteId = resolvedId;
    }

    try {
      await remote!.deleteLog(remoteId);
      if (gen !== sessionGeneration) return;
      setState({ syncError: null });
    } catch {
      if (gen !== sessionGeneration) return;
      const logs = [...state.snapshot.logs];
      if (removed) {
        const restored = isSyntheticLogId(removed.id) ? { ...removed, id: remoteId } : removed;
        logs.splice(Math.min(Math.max(0, removedIndex), logs.length), 0, restored);
      }
      setState({
        syncError: "delete_log_failed",
        snapshot: { ...state.snapshot, logs },
      });
    }
  };

  const clearAll = async (): Promise<void> => {
    const prev = state.snapshot;
    setState({ snapshot: EMPTY_HISTORY });

    if (!canUseRemote()) {
      deps.local.clear();
      return;
    }

    const gen = sessionGeneration;
    try {
      await remote!.clearAll();
      if (gen !== sessionGeneration) return;
      setState({ syncError: null });
    } catch {
      if (gen !== sessionGeneration) return;
      setState({
        syncError: "clear_failed",
        snapshot: prev,
      });
    }
  };

  const refresh = async (): Promise<void> => {
    if (!canUseRemote()) {
      setState({ snapshot: deps.local.read(), syncError: null });
      return;
    }
    await loadFromRemote(false, sessionGeneration);
  };

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    hydrateLocal,
    activateUser,
    deactivateUser,
    recordVisit,
    toggleCompleted,
    deleteLog,
    clearAll,
    refresh,
  };
}

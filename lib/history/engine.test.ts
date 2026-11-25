import { describe, expect, it } from "vitest";
import { createHistoryEngine } from "./engine";
import {
  createMemoryHistoryRepository,
  createMemoryLocalHistoryStore,
  createMemoryRemoteHistoryAdapter,
} from "./memory-adapters";
import type { RemoteHistoryAdapter } from "./ports";
import { isSyntheticLogId, type VisitInput } from "./types";

const GENESIS_1_VI: VisitInput = {
  kind: "chapter",
  itemKey: "sang-the-ky/1",
  bookSlug: "sang-the-ky",
  chapter: 1,
  title: "Chúa dựng nên trời đất",
  subtitle: "Sáng-thế Ký 1",
};

const GENESIS_1_EN: VisitInput = {
  kind: "chapter",
  itemKey: "genesis/1",
  bookSlug: "genesis",
  chapter: 1,
  title: "In the beginning",
  subtitle: "Genesis 1",
};

const PSALM_23: VisitInput = {
  kind: "chapter",
  itemKey: "thi-thien/23",
  bookSlug: "thi-thien",
  chapter: 23,
  title: "Chúa là Đấng chăn giữ tôi",
  subtitle: "Thi-thiên 23",
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("createHistoryEngine", () => {
  it("hydrates local history immediately, records visits across VI/EN canonical keys, and merges into cloud preserving readCount", async () => {
    let clock = new Date(2026, 10, 25, 9, 0);
    const local = createMemoryLocalHistoryStore();
    const repo = createMemoryHistoryRepository();
    let currentUserId: string | null = null;
    const remote = createMemoryRemoteHistoryAdapter(repo, () => currentUserId);

    const engine = createHistoryEngine({ local, remote, now: () => clock });
    engine.hydrateLocal();

    // Local hydration is immediate and does not wait for auth/cloud.
    expect(engine.getState().hydrated).toBe(true);
    expect(engine.getState().syncing).toBe(false);

    // Record visits in both VI and EN before auth resolves -> unified canonical key with readCount 2.
    await engine.recordVisit(GENESIS_1_VI);
    clock = new Date(2026, 10, 25, 11, 30);
    await engine.recordVisit(GENESIS_1_EN);
    await engine.toggleCompleted({ ...GENESIS_1_VI, completed: true });

    expect(engine.getState().snapshot.progress).toHaveLength(1);
    expect(engine.getState().snapshot.progress[0]).toMatchObject({
      itemKey: "sang-the-ky/1",
      readCount: 2,
      completed: true,
    });
    expect(engine.getState().snapshot.logs).toHaveLength(1);
    expect(isSyntheticLogId(engine.getState().snapshot.logs[0].id)).toBe(true);

    // Sign in -> guest history merges into cloud, preserves readCount=2, clears local store.
    currentUserId = "user_1";
    await engine.activateUser("user_1");

    expect(engine.getState().remoteActive).toBe(true);
    expect(engine.getState().syncError).toBeNull();
    expect(local.read().progress).toHaveLength(0);
    expect(engine.getState().snapshot.progress[0]).toMatchObject({
      itemKey: "sang-the-ky/1",
      readCount: 2,
      completed: true,
    });
    // Server assigned a real numeric ID to the synced log.
    expect(/^\d+$/u.test(engine.getState().snapshot.logs[0].id)).toBe(true);
  });

  it("keeps guest history intact when initial cloud sync fails", async () => {
    const local = createMemoryLocalHistoryStore();
    const failingRemote: RemoteHistoryAdapter = {
      fetchHistory: async () => {
        throw new Error("HTTP 503");
      },
      recordVisit: async () => {
        throw new Error("HTTP 503");
      },
      setCompleted: async () => {
        throw new Error("HTTP 503");
      },
      syncGuest: async () => {
        throw new Error("HTTP 503");
      },
      deleteLog: async () => {
        throw new Error("HTTP 503");
      },
      clearAll: async () => {
        throw new Error("HTTP 503");
      },
    };

    const engine = createHistoryEngine({
      local,
      remote: failingRemote,
      now: () => new Date(2026, 10, 25, 9, 0),
    });
    engine.hydrateLocal();
    await engine.recordVisit(GENESIS_1_VI);

    await engine.activateUser("user_1");
    expect(engine.getState().syncError).toBe("sync_failed");
    expect(local.read().progress).toHaveLength(1);
    expect(engine.getState().snapshot.progress).toHaveLength(1);
  });

  it("rolls back optimistic visit, completion, deleteLog, and clearAll when cloud mutations fail", async () => {
    const now = new Date(2026, 10, 25, 9, 0);
    const local = createMemoryLocalHistoryStore();
    const repo = createMemoryHistoryRepository();
    let failWrites = false;
    const baseRemote = createMemoryRemoteHistoryAdapter(repo, () => "user_1");
    const remote: RemoteHistoryAdapter = {
      fetchHistory: () => baseRemote.fetchHistory(),
      syncGuest: (items) => baseRemote.syncGuest(items),
      recordVisit: async (p) => {
        if (failWrites) throw new Error("HTTP 500");
        return baseRemote.recordVisit(p);
      },
      setCompleted: async (p) => {
        if (failWrites) throw new Error("HTTP 500");
        return baseRemote.setCompleted(p);
      },
      deleteLog: async (id) => {
        if (failWrites) throw new Error("HTTP 500");
        return baseRemote.deleteLog(id);
      },
      clearAll: async () => {
        if (failWrites) throw new Error("HTTP 500");
        return baseRemote.clearAll();
      },
    };

    const engine = createHistoryEngine({ local, remote, now: () => now });
    engine.hydrateLocal();
    await engine.activateUser("user_1");

    // Seed one persisted visit on the cloud.
    await engine.recordVisit(GENESIS_1_VI);
    const savedLogId = engine.getState().snapshot.logs[0].id;
    expect(/^\d+$/u.test(savedLogId)).toBe(true);

    // Fail visit -> rolls back Psalm 23.
    failWrites = true;
    await engine.recordVisit(PSALM_23);
    expect(engine.getState().syncError).toBe("visit_failed");
    expect(engine.getState().snapshot.progress.map((p) => p.itemKey)).toEqual(["sang-the-ky/1"]);

    // Fail completion -> rolls back Genesis 1 completed=false.
    await engine.toggleCompleted({ ...GENESIS_1_VI, completed: true });
    expect(engine.getState().syncError).toBe("complete_failed");
    expect(engine.getState().snapshot.progress[0].completed).toBe(false);

    // Fail deleteLog -> restores deleted log.
    await engine.deleteLog(savedLogId);
    expect(engine.getState().syncError).toBe("delete_log_failed");
    expect(engine.getState().snapshot.logs.map((l) => l.id)).toEqual([savedLogId]);

    // Fail clearAll -> restores entire snapshot.
    await engine.clearAll();
    expect(engine.getState().syncError).toBe("clear_failed");
    expect(engine.getState().snapshot.progress).toHaveLength(1);
    expect(engine.getState().snapshot.logs).toHaveLength(1);
  });

  it("handles deleting an optimistic synthetic log while its visit is in flight without sending a 400 synthetic ID", async () => {
    const now = new Date(2026, 10, 25, 9, 0);
    const local = createMemoryLocalHistoryStore();
    const repo = createMemoryHistoryRepository();
    const baseRemote = createMemoryRemoteHistoryAdapter(repo, () => "user_1");
    const gate = deferred<void>();
    const deletedIds: string[] = [];

    const remote: RemoteHistoryAdapter = {
      ...baseRemote,
      recordVisit: async (payload) => {
        await gate.promise;
        return baseRemote.recordVisit(payload);
      },
      deleteLog: async (id) => {
        deletedIds.push(id);
        return baseRemote.deleteLog(id);
      },
    };

    const engine = createHistoryEngine({ local, remote, now: () => now });
    engine.hydrateLocal();
    await engine.activateUser("user_1");

    // Start visit (blocked on gate) -> optimistic synthetic log appears.
    const visitPromise = engine.recordVisit(GENESIS_1_VI);
    const optimisticId = engine.getState().snapshot.logs[0].id;
    expect(isSyntheticLogId(optimisticId)).toBe(true);

    // User immediately clicks delete while the visit is still in flight.
    const deletePromise = engine.deleteLog(optimisticId);
    expect(engine.getState().snapshot.logs).toHaveLength(0);

    // Unblock visit -> engine resolves the numeric server ID and deletes it cleanly.
    gate.resolve();
    await Promise.all([visitPromise, deletePromise]);

    expect(deletedIds).toHaveLength(1);
    expect(/^\d+$/u.test(deletedIds[0])).toBe(true);
    expect(engine.getState().syncError).toBeNull();
    expect(engine.getState().snapshot.logs).toHaveLength(0);
    expect((await repo.fetchUserHistory("user_1")).logs).toHaveLength(0);
  });

  it("ignores late in-flight cloud responses after sign-out (generation guard)", async () => {
    const now = new Date(2026, 10, 25, 9, 0);
    const local = createMemoryLocalHistoryStore();
    const repo = createMemoryHistoryRepository();
    const baseRemote = createMemoryRemoteHistoryAdapter(repo, () => "user_1");
    const gate = deferred<void>();

    const remote: RemoteHistoryAdapter = {
      ...baseRemote,
      recordVisit: async (payload) => {
        await gate.promise;
        return baseRemote.recordVisit(payload);
      },
    };

    const engine = createHistoryEngine({ local, remote, now: () => now });
    engine.hydrateLocal();
    await engine.activateUser("user_1");

    const visitPromise = engine.recordVisit(GENESIS_1_VI);
    // User signs out before the cloud write finishes.
    engine.deactivateUser();
    expect(engine.getState().remoteActive).toBe(false);
    expect(engine.getState().snapshot.progress).toHaveLength(0);

    // Late cloud response resolves -> must NOT pollute guest snapshot.
    gate.resolve();
    await visitPromise;

    expect(engine.getState().snapshot.progress).toHaveLength(0);
    expect(engine.getState().snapshot.logs).toHaveLength(0);
  });
});

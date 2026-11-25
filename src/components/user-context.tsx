import {
  createContext,
  createMemo,
  createSignal,
  onSettled,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import {
  computeStreak,
  progressMapKey,
  safeNextPath,
  type HistoryKind,
  type HistorySnapshot,
  type ReadingLog,
  type ReadingProgress,
  type VisitInput,
} from "../../lib/history/types";
import {
  formatWorkosUser,
  getHistoryApiUrl,
  initWorkosClient,
  isAuthConfigured,
  signOutWorkos,
  translateAuthError,
  type AuthUser,
} from "../lib/auth";
import {
  applyCompleteToSnapshot,
  applyVisitToSnapshot,
  clearCloudHistory,
  clearGuestHistory,
  deleteCloudItem,
  deleteCloudLog,
  EMPTY_HISTORY,
  fetchCloudHistory,
  patchCloudComplete,
  postCloudVisit,
  readGuestHistory,
  syncCloudHistory,
  writeGuestHistory,
} from "../lib/history-store";

export type ReadingStats = {
  chaptersRead: number;
  chaptersCompleted: number;
  booksOpened: number;
  moodsRead: number;
  readingDays: number;
  streak: number;
};

export type BookReadSummary = {
  read: number;
  completed: number;
};

export type UserContextValue = {
  user: Accessor<AuthUser | null>;
  ready: Accessor<boolean>;
  authLoading: Accessor<boolean>;
  authError: Accessor<string | null>;
  historyLoading: Accessor<boolean>;
  syncError: Accessor<string | null>;
  redirectReturnTo: Accessor<string | null>;
  authConfigured: boolean;
  progress: Accessor<ReadingProgress[]>;
  logs: Accessor<ReadingLog[]>;
  latestChapter: Accessor<ReadingProgress | null>;
  stats: Accessor<ReadingStats>;
  progressFor: (kind: HistoryKind, itemKey: string) => ReadingProgress | undefined;
  bookSummary: (bookSlug: string) => BookReadSummary | undefined;
  signIn: (returnTo?: string) => Promise<void>;
  signUp: (returnTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearRedirectReturnTo: () => void;
  recordVisit: (input: VisitInput) => Promise<void>;
  toggleCompleted: (input: VisitInput & { completed: boolean }) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  deleteItem: (kind: HistoryKind, itemKey: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;
  refreshHistory: () => Promise<void>;
};

const FALLBACK_USER_CONTEXT: UserContextValue = {
  user: () => null,
  ready: () => false,
  authLoading: () => false,
  authError: () => null,
  historyLoading: () => false,
  syncError: () => null,
  redirectReturnTo: () => null,
  authConfigured: false,
  progress: () => [],
  logs: () => [],
  latestChapter: () => null,
  stats: () => ({
    chaptersRead: 0,
    chaptersCompleted: 0,
    booksOpened: 0,
    moodsRead: 0,
    readingDays: 0,
    streak: 0,
  }),
  progressFor: () => undefined,
  bookSummary: () => undefined,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  clearRedirectReturnTo: () => {},
  recordVisit: async () => {},
  toggleCompleted: async () => {},
  deleteLog: async () => {},
  deleteItem: async () => {},
  clearAllHistory: async () => {},
  refreshHistory: async () => {},
};

const UserContext = createContext<UserContextValue>(FALLBACK_USER_CONTEXT);

/**
 * Quản lý phiên đăng nhập WorkOS AuthKit và lịch sử đọc Kinh Thánh xuyên suốt ứng dụng.
 * Khi SSR / prerender giữ trạng thái trống đồng nhất để không lệch hydration; sau hydration
 * mới đọc localStorage (chế độ khách) hoặc khởi tạo WorkOS AuthKit và đồng bộ đám mây.
 */
export function UserProvider(props: ParentProps) {
  const [user, setUser] = createSignal<AuthUser | null>(null);
  const [ready, setReady] = createSignal(false);
  const [authLoading, setAuthLoading] = createSignal(false);
  const [authError, setAuthError] = createSignal<string | null>(null);
  const [historyLoading, setHistoryLoading] = createSignal(false);
  const [syncError, setSyncError] = createSignal<string | null>(null);
  const [redirectReturnTo, setRedirectReturnTo] = createSignal<string | null>(null);
  const [history, setHistory] = createSignal<HistorySnapshot>(EMPTY_HISTORY);

  const progress = createMemo(() => history().progress);
  const logs = createMemo(() => history().logs);

  const progressByKey = createMemo(() => {
    const map = new Map<string, ReadingProgress>();
    for (const item of progress()) {
      map.set(progressMapKey(item.kind, item.itemKey), item);
    }
    return map;
  });

  const bookSummaries = createMemo(() => {
    const map = new Map<string, BookReadSummary>();
    for (const item of progress()) {
      if (item.kind !== "chapter" || !item.bookSlug) continue;
      const cur = map.get(item.bookSlug) ?? { read: 0, completed: 0 };
      cur.read += 1;
      if (item.completed) cur.completed += 1;
      map.set(item.bookSlug, cur);
    }
    return map;
  });

  const latestChapter = createMemo(() => {
    let latest: ReadingProgress | null = null;
    for (const item of progress()) {
      if (item.kind !== "chapter") continue;
      if (!latest || item.lastReadAt > latest.lastReadAt) latest = item;
    }
    return latest;
  });

  const stats = createMemo<ReadingStats>(() => {
    const books = new Set<string>();
    let chaptersRead = 0;
    let chaptersCompleted = 0;
    let moodsRead = 0;
    for (const item of progress()) {
      if (item.kind === "chapter") {
        chaptersRead += 1;
        if (item.completed) chaptersCompleted += 1;
        if (item.bookSlug) books.add(item.bookSlug);
      } else {
        moodsRead += 1;
      }
    }
    const readingDays = new Set(logs().map((l) => l.readDate)).size;
    return {
      chaptersRead,
      chaptersCompleted,
      booksOpened: books.size,
      moodsRead,
      readingDays,
      streak: computeStreak(logs()),
    };
  });

  const loadCloudAfterAuth = async (mergeGuest: boolean) => {
    if (!getHistoryApiUrl()) return;
    setHistoryLoading(true);
    setSyncError(null);
    try {
      const guest = mergeGuest ? readGuestHistory() : EMPTY_HISTORY;
      const hasGuest = guest.progress.length > 0 || guest.logs.length > 0;
      const cloud = hasGuest ? await syncCloudHistory(guest) : await fetchCloudHistory();
      if (hasGuest) clearGuestHistory();
      setHistory(cloud);
    } catch {
      setSyncError("Không đồng bộ được lịch sử từ đám mây lúc này.");
    } finally {
      setHistoryLoading(false);
    }
  };

  onSettled(() => {
    let active = true;
    const boot = async () => {
      const guest = readGuestHistory();
      if (!isAuthConfigured()) {
        if (active) {
          setHistory(guest);
          setReady(true);
        }
        return;
      }

      // Đọc lỗi OAuth nếu WorkOS chuyển hướng về kèm ?error=...
      const params = new URLSearchParams(window.location.search);
      const oauthError = params.get("error_description") ?? params.get("error");
      if (oauthError && active) {
        setAuthError(translateAuthError(oauthError));
      }

      let pendingReturnTo: string | null = null;
      setAuthLoading(true);
      try {
        const client = await initWorkosClient({
          onRedirectReturnTo: (path) => {
            pendingReturnTo = path;
          },
          onUserChange: (nextUser) => {
            if (!active) return;
            setUser(nextUser);
            if (!nextUser) setHistory(readGuestHistory());
          },
        });
        if (!active) return;

        const rawUser = client?.getUser() ?? null;
        if (rawUser) {
          setUser(formatWorkosUser(rawUser));
          await loadCloudAfterAuth(true);
          if (active && pendingReturnTo) {
            setRedirectReturnTo(pendingReturnTo);
          }
        } else {
          setUser(null);
          setHistory(guest);
        }
      } catch (err) {
        if (active) {
          setUser(null);
          setHistory(guest);
          setAuthError(translateAuthError(err));
        }
      } finally {
        if (active) {
          setAuthLoading(false);
          setReady(true);
        }
      }
    };
    void boot();
    return () => {
      active = false;
    };
  });

  const signIn = async (returnTo?: string): Promise<void> => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const client = await initWorkosClient();
      if (!client) {
        setAuthError("Tính năng đăng nhập WorkOS chưa được cấu hình.");
        setAuthLoading(false);
        return;
      }
      await client.signIn({ state: { returnTo: safeNextPath(returnTo, "/lich-su") } });
    } catch (err) {
      setAuthError(translateAuthError(err));
      setAuthLoading(false);
    }
  };

  const signUp = async (returnTo?: string): Promise<void> => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const client = await initWorkosClient();
      if (!client) {
        setAuthError("Tính năng đăng nhập WorkOS chưa được cấu hình.");
        setAuthLoading(false);
        return;
      }
      await client.signUp({ state: { returnTo: safeNextPath(returnTo, "/lich-su") } });
    } catch (err) {
      setAuthError(translateAuthError(err));
      setAuthLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setAuthLoading(true);
    try {
      await signOutWorkos();
    } finally {
      setUser(null);
      setSyncError(null);
      setAuthError(null);
      setRedirectReturnTo(null);
      setHistory(readGuestHistory());
      setAuthLoading(false);
    }
  };

  const recordVisit = async (input: VisitInput): Promise<void> => {
    if (typeof window === "undefined") return;
    const now = new Date();
    const next = applyVisitToSnapshot(history(), input, now);
    setHistory(next);

    if (!user() || !getHistoryApiUrl()) {
      writeGuestHistory(next);
      return;
    }

    try {
      const saved = await postCloudVisit(input, now);
      setSyncError(null);
      setHistory((cur) => ({
        progress: [
          saved.progress,
          ...cur.progress.filter((p) => !(p.kind === saved.progress.kind && p.itemKey === saved.progress.itemKey)),
        ],
        logs: [
          saved.log,
          ...cur.logs.filter(
            (l) =>
              !(
                l.kind === saved.log.kind &&
                l.itemKey === saved.log.itemKey &&
                l.readDate === saved.log.readDate
              ),
          ),
        ].slice(0, 250),
      }));
    } catch {
      setSyncError("Lượt đọc vừa mở chưa kịp đồng bộ lên máy chủ.");
    }
  };

  const toggleCompleted = async (input: VisitInput & { completed: boolean }): Promise<void> => {
    if (typeof window === "undefined") return;
    const now = new Date();
    const next = applyCompleteToSnapshot(history(), input, now);
    setHistory(next);

    if (!user() || !getHistoryApiUrl()) {
      writeGuestHistory(next);
      return;
    }

    try {
      const saved = await patchCloudComplete(input, now);
      setSyncError(null);
      setHistory((cur) => ({
        ...cur,
        progress: [
          saved.progress,
          ...cur.progress.filter((p) => !(p.kind === saved.progress.kind && p.itemKey === saved.progress.itemKey)),
        ],
      }));
    } catch {
      setSyncError("Không cập nhật được trạng thái đã đọc xong lên máy chủ.");
    }
  };

  const deleteLog = async (id: string): Promise<void> => {
    const next: HistorySnapshot = {
      ...history(),
      logs: history().logs.filter((l) => l.id !== id),
    };
    setHistory(next);
    if (!user() || !getHistoryApiUrl()) {
      writeGuestHistory(next);
      return;
    }
    try {
      await deleteCloudLog(id);
      setSyncError(null);
    } catch {
      setSyncError("Không xóa được mục lịch sử trên máy chủ.");
    }
  };

  const deleteItem = async (kind: HistoryKind, itemKey: string): Promise<void> => {
    const next: HistorySnapshot = {
      progress: history().progress.filter((p) => !(p.kind === kind && p.itemKey === itemKey)),
      logs: history().logs.filter((l) => !(l.kind === kind && l.itemKey === itemKey)),
    };
    setHistory(next);
    if (!user() || !getHistoryApiUrl()) {
      writeGuestHistory(next);
      return;
    }
    try {
      await deleteCloudItem(kind, itemKey);
      setSyncError(null);
    } catch {
      setSyncError("Không xóa được mục khỏi đám mây.");
    }
  };

  const clearAllHistory = async (): Promise<void> => {
    setHistory(EMPTY_HISTORY);
    if (!user() || !getHistoryApiUrl()) {
      clearGuestHistory();
      return;
    }
    try {
      await clearCloudHistory();
      setSyncError(null);
    } catch {
      setSyncError("Không xóa được lịch sử trên máy chủ.");
    }
  };

  const refreshHistory = async (): Promise<void> => {
    if (!user()) {
      setHistory(readGuestHistory());
      return;
    }
    await loadCloudAfterAuth(false);
  };

  const value: UserContextValue = {
    user,
    ready,
    authLoading,
    authError,
    historyLoading,
    syncError,
    redirectReturnTo,
    authConfigured: isAuthConfigured(),
    progress,
    logs,
    latestChapter,
    stats,
    progressFor: (kind, itemKey) => progressByKey().get(progressMapKey(kind, itemKey)),
    bookSummary: (bookSlug) => bookSummaries().get(bookSlug),
    signIn,
    signUp,
    signOut,
    clearRedirectReturnTo: () => setRedirectReturnTo(null),
    recordVisit,
    toggleCompleted,
    deleteLog,
    deleteItem,
    clearAllHistory,
    refreshHistory,
  };

  return <UserContext value={value}>{props.children}</UserContext>;
}

export function useUser(): UserContextValue {
  return useContext(UserContext);
}

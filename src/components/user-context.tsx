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
  type HistoryKind,
  type HistorySnapshot,
  type ReadingLog,
  type ReadingProgress,
  type VisitInput,
} from "../../lib/history/types";
import {
  clearCachedToken,
  getAuthClient,
  getHistoryApiUrl,
  isAuthConfigured,
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

export type AuthActionResult = { ok: true } | { ok: false; error: string };

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
  historyLoading: Accessor<boolean>;
  syncError: Accessor<string | null>;
  authConfigured: boolean;
  progress: Accessor<ReadingProgress[]>;
  logs: Accessor<ReadingLog[]>;
  latestChapter: Accessor<ReadingProgress | null>;
  stats: Accessor<ReadingStats>;
  progressFor: (kind: HistoryKind, itemKey: string) => ReadingProgress | undefined;
  bookSummary: (bookSlug: string) => BookReadSummary | undefined;
  signIn: (args: { email: string; password: string }) => Promise<AuthActionResult>;
  signUp: (args: { name: string; email: string; password: string }) => Promise<AuthActionResult>;
  signOut: () => Promise<void>;
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
  historyLoading: () => false,
  syncError: () => null,
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
  signIn: async () => ({ ok: false, error: "Chưa khởi tạo" }),
  signUp: async () => ({ ok: false, error: "Chưa khởi tạo" }),
  signOut: async () => {},
  recordVisit: async () => {},
  toggleCompleted: async () => {},
  deleteLog: async () => {},
  deleteItem: async () => {},
  clearAllHistory: async () => {},
  refreshHistory: async () => {},
};

const UserContext = createContext<UserContextValue>(FALLBACK_USER_CONTEXT);

function extractUser(data: unknown): AuthUser | null {
  if (!data || typeof data !== "object") return null;
  const user = (data as { user?: Record<string, unknown> }).user;
  if (!user || typeof user.id !== "string" || typeof user.email !== "string") return null;
  return {
    id: user.id,
    email: user.email,
    name: typeof user.name === "string" && user.name.trim() ? user.name.trim() : user.email.split("@")[0] || "Bạn đọc",
  };
}

/**
 * Quản lý phiên đăng nhập Neon Auth và lịch sử đọc Kinh Thánh xuyên suốt ứng dụng.
 * Khi SSR / prerender giữ trạng thái trống đồng nhất để không lệch hydration; sau hydration
 * mới đọc localStorage (chế độ khách) hoặc kiểm tra phiên Neon Auth và đồng bộ đám mây.
 */
export function UserProvider(props: ParentProps) {
  const [user, setUser] = createSignal<AuthUser | null>(null);
  const [ready, setReady] = createSignal(false);
  const [authLoading, setAuthLoading] = createSignal(false);
  const [historyLoading, setHistoryLoading] = createSignal(false);
  const [syncError, setSyncError] = createSignal<string | null>(null);
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
      const auth = getAuthClient();
      if (!auth) {
        if (active) {
          setHistory(guest);
          setReady(true);
        }
        return;
      }

      setAuthLoading(true);
      try {
        const res = await auth.getSession();
        if (!active) return;
        const signedIn = extractUser(res.data);
        if (signedIn) {
          setUser(signedIn);
          await loadCloudAfterAuth(true);
        } else {
          setUser(null);
          setHistory(guest);
        }
      } catch {
        if (active) {
          setUser(null);
          setHistory(guest);
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

  const signIn = async (args: { email: string; password: string }): Promise<AuthActionResult> => {
    const auth = getAuthClient();
    if (!auth) return { ok: false, error: "Tính năng đăng nhập chưa được cấu hình." };
    setAuthLoading(true);
    try {
      const res = await auth.signIn.email({ email: args.email.trim(), password: args.password });
      if (res.error) return { ok: false, error: translateAuthError(res.error) };
      clearCachedToken();
      const sessionRes = await auth.getSession();
      const signedIn = extractUser(sessionRes.data) ?? extractUser(res.data);
      if (!signedIn) return { ok: false, error: "Đăng nhập thành công nhưng không đọc được phiên làm việc." };
      setUser(signedIn);
      await loadCloudAfterAuth(true);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: translateAuthError(err) };
    } finally {
      setAuthLoading(false);
    }
  };

  const signUp = async (args: { name: string; email: string; password: string }): Promise<AuthActionResult> => {
    const auth = getAuthClient();
    if (!auth) return { ok: false, error: "Tính năng đăng nhập chưa được cấu hình." };
    setAuthLoading(true);
    try {
      const email = args.email.trim();
      const name = args.name.trim() || email.split("@")[0] || "Bạn đọc";
      const res = await auth.signUp.email({ name, email, password: args.password });
      if (res.error) return { ok: false, error: translateAuthError(res.error) };
      clearCachedToken();
      const sessionRes = await auth.getSession();
      const signedIn = extractUser(sessionRes.data) ?? extractUser(res.data);
      if (!signedIn) {
        return { ok: false, error: "Tạo tài khoản thành công. Vui lòng kiểm tra email hoặc đăng nhập lại." };
      }
      setUser(signedIn);
      await loadCloudAfterAuth(true);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: translateAuthError(err) };
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    const auth = getAuthClient();
    setAuthLoading(true);
    try {
      if (auth) await auth.signOut();
    } catch {
      // Vẫn xóa trạng thái phiên ở trình duyệt ngay cả khi mạng trục trặc.
    } finally {
      clearCachedToken();
      setUser(null);
      setSyncError(null);
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
    historyLoading,
    syncError,
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

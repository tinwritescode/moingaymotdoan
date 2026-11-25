import {
  createClient,
  NoSessionError,
  type OnRefreshResponse,
  type User as WorkosUser,
} from "@workos-inc/authkit-js";
import { safeNextPath } from "../../lib/history/types";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
};

type WorkosClient = Awaited<ReturnType<typeof createClient>>;

const CLIENT_ID = (import.meta.env.VITE_WORKOS_CLIENT_ID ?? "").trim();
const API_HOSTNAME = (import.meta.env.VITE_WORKOS_API_HOSTNAME ?? "")
  .trim()
  .replace(/^https?:\/\//u, "")
  .replace(/\/+$/u, "");
const HISTORY_API_URL = (import.meta.env.VITE_HISTORY_API_URL ?? "").trim().replace(/\/+$/u, "");

export const isAuthConfigured = (): boolean => CLIENT_ID.length > 0;
export const getHistoryApiUrl = (): string => HISTORY_API_URL;

let clientPromise: Promise<WorkosClient | null> | null = null;
let clientInstance: WorkosClient | null = null;

/** Chuẩn hóa hồ sơ người dùng từ WorkOS User sang AuthUser gọn gàng cho giao diện. */
export function formatWorkosUser(u: Pick<WorkosUser, "id" | "email" | "firstName" | "lastName" | "profilePictureUrl">): AuthUser {
  const fullName = [u.firstName, u.lastName].filter((s): s is string => Boolean(s?.trim())).join(" ").trim();
  return {
    id: u.id,
    email: u.email,
    name: fullName || u.email.split("@")[0] || "Bạn đọc",
    avatarUrl: u.profilePictureUrl ?? null,
  };
}

/** Chuyển lỗi OAuth / WorkOS sang thông báo tiếng Việt dễ hiểu. */
export function translateAuthError(error: unknown): string {
  const raw =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : error && typeof error === "object"
          ? String(
              ("error_description" in error && error.error_description) ||
                ("error" in error && error.error) ||
                ("message" in error && error.message) ||
                "",
            )
          : "";

  const lower = raw.toLowerCase();
  if (lower.includes("access_denied")) {
    return "Bạn đã hủy quá trình đăng nhập.";
  }
  if (lower.includes("invalid_redirect_uri")) {
    return "Redirect URI chưa được khai báo trong WorkOS Dashboard (cần thêm đường dẫn /tai-khoan).";
  }
  if (lower.includes("failed to fetch") || lower.includes("network") || lower.includes("cors")) {
    return "Không kết nối được máy chủ WorkOS. Hãy kiểm tra kết nối mạng hoặc cấu hình CORS trong WorkOS Dashboard.";
  }
  if (lower.includes("login required") || lower.includes("invalid_grant")) {
    return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
  }
  return raw ? `Không thể đăng nhập (${raw}).` : "Đã xảy ra lỗi khi kết nối WorkOS. Vui lòng thử lại.";
}

export type InitAuthCallbacks = {
  onRedirectReturnTo?: (path: string) => void;
  onUserChange?: (user: AuthUser | null) => void;
};

/**
 * Khởi tạo singleton WorkOS AuthKit PKCE client trên trình duyệt.
 * Luôn trả về null khi SSR / prerender hoặc chưa cấu hình VITE_WORKOS_CLIENT_ID.
 */
export function initWorkosClient(callbacks: InitAuthCallbacks = {}): Promise<WorkosClient | null> {
  if (typeof window === "undefined" || !CLIENT_ID) return Promise.resolve(null);
  if (clientPromise) return clientPromise;

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const redirectUri = `${window.location.origin}/tai-khoan`;

  clientPromise = createClient(CLIENT_ID, {
    redirectUri,
    ...(API_HOSTNAME ? { apiHostname: API_HOSTNAME } : {}),
    // Chỉ dùng HttpOnly cookie (devMode: false) khi có custom Auth API domain cùng gốc tên miền;
    // với api.workos.com mặc định cần devMode: true để Safari/Chrome không chặn third-party cookie.
    devMode: !API_HOSTNAME || isLocal,
    onRedirectCallback: ({ state, user }) => {
      callbacks.onUserChange?.(formatWorkosUser(user));
      const rawReturn = state && typeof state.returnTo === "string" ? state.returnTo : null;
      callbacks.onRedirectReturnTo?.(safeNextPath(rawReturn, "/lich-su"));
    },
    onRefresh: (res: OnRefreshResponse) => {
      callbacks.onUserChange?.(formatWorkosUser(res.user));
    },
    onRefreshFailure: () => {
      callbacks.onUserChange?.(null);
    },
  })
    .then((c) => {
      clientInstance = c;
      return c;
    })
    .catch((err) => {
      clientPromise = null;
      clientInstance = null;
      throw err;
    });

  return clientPromise;
}

/** Lấy JWT access token hiện hành từ WorkOS AuthKit (tự động làm mới khi sắp hết hạn). */
export async function getAccessToken(forceRefresh = false): Promise<string | null> {
  if (typeof window === "undefined" || !CLIENT_ID) return null;
  try {
    const client = clientInstance ?? (await initWorkosClient());
    if (!client) return null;
    const token = await client.getAccessToken(forceRefresh ? { forceRefresh: true } : undefined);
    return token || null;
  } catch {
    return null;
  }
}

/** Đăng xuất khỏi WorkOS AuthKit tại chỗ mà không bị vướng lỗi Sign-Out Redirect URI. */
export async function signOutWorkos(): Promise<void> {
  const client = clientInstance ?? (clientPromise ? await clientPromise.catch(() => null) : null);
  if (!client) return;
  try {
    await client.signOut({ navigate: false });
  } catch (err) {
    if (!(err instanceof NoSessionError)) {
      // Vẫn tiếp tục dọn phiên ở phía trình duyệt.
    }
  }
}

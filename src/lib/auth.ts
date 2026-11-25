import { createAuthClient } from "@neon/auth";
import { BetterAuthVanillaAdapter } from "@neon/auth/vanilla/adapters";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

type AuthResult<T = unknown> = Promise<{ data?: T | null; error?: unknown }>;

type TokenResponseData = {
  token?: string;
  session?: { token?: string };
};

/** Các phương thức Managed Better Auth dùng trên trình duyệt (bao gồm plugin jwt `.token()`). */
export type BrowserAuthClient = {
  signIn: {
    email: (args: { email: string; password: string }) => AuthResult;
  };
  signUp: {
    email: (args: { name: string; email: string; password: string }) => AuthResult;
  };
  getSession: () => AuthResult<{ session?: { token?: string }; user?: Record<string, unknown> }>;
  signOut: () => AuthResult;
  token: (opts?: { fetchOptions?: { headers?: Record<string, string> } }) => AuthResult<TokenResponseData>;
};

const AUTH_URL = (import.meta.env.VITE_NEON_AUTH_URL ?? "").trim().replace(/\/+$/u, "");
const HISTORY_API_URL = (import.meta.env.VITE_HISTORY_API_URL ?? "").trim().replace(/\/+$/u, "");

export const isAuthConfigured = (): boolean => AUTH_URL.length > 0;
export const getHistoryApiUrl = (): string => HISTORY_API_URL;

let client: BrowserAuthClient | null = null;
let cachedToken: { value: string; expiresAt: number } | null = null;

function extractJwt(data: TokenResponseData | null | undefined): string | null {
  const candidate = data?.token ?? data?.session?.token;
  return typeof candidate === "string" && candidate.split(".").length === 3 ? candidate : null;
}

/** Trả về Neon Auth client ở trình duyệt; luôn null trong SSR / prerender. */
export function getAuthClient(): BrowserAuthClient | null {
  if (typeof window === "undefined" || !AUTH_URL) return null;
  if (!client) {
    client = createAuthClient(AUTH_URL, {
      adapter: BetterAuthVanillaAdapter(),
    }) as unknown as BrowserAuthClient;
  }
  return client;
}

export function clearCachedToken(): void {
  cachedToken = null;
}

/** Lấy JWT ngắn hạn từ Neon Auth (hết hạn 15 phút, đệm trong bộ nhớ tối đa 11 phút). */
export async function getAccessToken(forceRefresh = false): Promise<string | null> {
  const auth = getAuthClient();
  if (!auth) return null;
  if (!forceRefresh && cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }
  try {
    // @neon/auth@0.8.2 có thể trả cache getSession ({ session: { token } }) khi gọi .token();
    // dùng extractJwt để đọc cả hai dạng và X-Force-Fetch khi cần làm mới thật sự.
    const res = forceRefresh
      ? await auth.token({ fetchOptions: { headers: { "X-Force-Fetch": "1" } } })
      : await auth.token();
    let jwt = extractJwt(res.data);
    if (!jwt && !forceRefresh) {
      const forced = await auth.token({ fetchOptions: { headers: { "X-Force-Fetch": "1" } } });
      jwt = extractJwt(forced.data);
    }
    if (!jwt) {
      cachedToken = null;
      return null;
    }
    cachedToken = { value: jwt, expiresAt: Date.now() + 11 * 60 * 1000 };
    return jwt;
  } catch {
    cachedToken = null;
    return null;
  }
}

/** Chuyển lỗi từ Better Auth / HTTP sang thông báo tiếng Việt dễ hiểu. */
export function translateAuthError(error: unknown): string {
  const raw =
    typeof error === "string"
      ? error
      : error && typeof error === "object"
        ? String(
            ("code" in error && error.code) ||
              ("message" in error && error.message) ||
              ("statusText" in error && error.statusText) ||
              "",
          )
        : "";

  const upper = raw.toUpperCase();
  if (
    upper.includes("INVALID_EMAIL_OR_PASSWORD") ||
    upper.includes("INVALID_CREDENTIALS") ||
    upper.includes("INVALID CREDENTIALS") ||
    upper.includes("INVALID_PASSWORD")
  ) {
    return "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.";
  }
  if (upper.includes("USER_ALREADY_EXISTS") || upper.includes("ALREADY EXISTS")) {
    return "Email này đã được đăng ký. Hãy chuyển sang tab Đăng nhập.";
  }
  if (upper.includes("PASSWORD_TOO_SHORT") || upper.includes("TOO SHORT")) {
    return "Mật khẩu cần có ít nhất 8 ký tự.";
  }
  if (upper.includes("PASSWORD_TOO_LONG")) {
    return "Mật khẩu quá dài (tối đa 128 ký tự).";
  }
  if (upper.includes("INVALID_EMAIL")) {
    return "Địa chỉ email không hợp lệ.";
  }
  if (upper.includes("EMAIL_NOT_VERIFIED")) {
    return "Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn.";
  }
  if (upper.includes("TOO_MANY_REQUESTS") || upper.includes("RATE_LIMIT")) {
    return "Bạn thử quá nhiều lần. Vui lòng đợi một lát rồi thử lại.";
  }
  if (upper.includes("FAILED TO FETCH") || upper.includes("NETWORK")) {
    return "Không kết nối được máy chủ đăng nhập. Vui lòng kiểm tra mạng và thử lại.";
  }
  return raw ? `Không thể thực hiện (${raw}).` : "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
}

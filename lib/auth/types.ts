export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
};

export type AuthErrorCode =
  | "not_configured"
  | "access_denied"
  | "invalid_redirect_uri"
  | "network"
  | "session_expired"
  | "unknown";

export type AuthError = {
  code: AuthErrorCode;
  raw?: string;
};

export type AuthCallbacks = {
  onUserChange: (user: AuthUser | null) => void;
  onRedirectReturnTo: (path: string) => void;
};

/**
 * Vendor-agnostic browser authentication seam.
 * Concrete adapters (WorkOS AuthKit, in-memory test fake, another IdP) implement this interface.
 */
export type AuthProviderAdapter = {
  readonly configured: boolean;
  init(callbacks: AuthCallbacks): Promise<AuthUser | null>;
  signIn(options: { returnTo: string }): Promise<void>;
  signUp(options: { returnTo: string }): Promise<void>;
  signOut(): Promise<void>;
  getAccessToken(options?: { forceRefresh?: boolean }): Promise<string | null>;
};

/** Only allows safe relative paths after sign-in (prevents open redirects). */
export function safeNextPath(raw: string | null | undefined, fallback = "/lich-su"): string {
  if (!raw) return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return fallback;
  }
  return trimmed;
}

/** Extracts a raw error string from unknown thrown values or OAuth error objects. */
function extractRawAuthError(error: unknown): string {
  if (typeof error === "string") return error.trim();
  if (error instanceof Error) return error.message.trim();
  if (error && typeof error === "object") {
    const obj = error as Record<string, unknown>;
    const candidate = obj.error_description ?? obj.error ?? obj.message ?? "";
    return typeof candidate === "string" ? candidate.trim() : String(candidate).trim();
  }
  return "";
}

/** Maps raw OAuth/IdP errors into stable, locale-independent error codes. */
export function classifyAuthError(error: unknown): AuthError {
  const raw = extractRawAuthError(error);
  const lower = raw.toLowerCase();

  if (lower.includes("access_denied")) return { code: "access_denied", raw };
  if (lower.includes("invalid_redirect_uri")) return { code: "invalid_redirect_uri", raw };
  if (lower.includes("failed to fetch") || lower.includes("network") || lower.includes("cors")) {
    return { code: "network", raw };
  }
  if (lower.includes("login required") || lower.includes("invalid_grant")) {
    return { code: "session_expired", raw };
  }
  return raw ? { code: "unknown", raw } : { code: "unknown" };
}

/** Reads an OAuth redirect error (?error_description= or ?error=) from a URL query string. */
export function readOAuthErrorFromSearch(search: string): AuthError | null {
  if (!search) return null;
  const params = new URLSearchParams(search);
  const oauthError = params.get("error_description") ?? params.get("error");
  return oauthError ? classifyAuthError(oauthError) : null;
}

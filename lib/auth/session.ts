import {
  classifyAuthError,
  readOAuthErrorFromSearch,
  safeNextPath,
  type AuthError,
  type AuthProviderAdapter,
  type AuthUser,
} from "./types";

export type AuthSessionState = {
  initialized: boolean;
  loading: boolean;
  configured: boolean;
  user: AuthUser | null;
  error: AuthError | null;
  redirectReturnTo: string | null;
};

export type AuthSessionOptions = {
  defaultReturnTo?: () => string;
  getSearch?: () => string;
};

export type AuthSession = {
  getState(): AuthSessionState;
  subscribe(listener: (state: AuthSessionState) => void): () => void;
  boot(): Promise<void>;
  signIn(returnTo?: string): Promise<void>;
  signUp(returnTo?: string): Promise<void>;
  signOut(): Promise<void>;
  getAccessToken(forceRefresh?: boolean): Promise<string | null>;
  clearRedirectReturnTo(): void;
  dispose(): void;
};

/**
 * Framework- and vendor-agnostic client authentication session module.
 * Coordinates provider boot, OAuth callback state, session refresh notifications, and sign-out cleanup.
 */
export function createAuthSession(
  adapter: AuthProviderAdapter,
  options: AuthSessionOptions = {},
): AuthSession {
  const defaultReturnTo = options.defaultReturnTo ?? (() => "/lich-su");
  const getSearch = options.getSearch ?? (() => "");

  let disposed = false;
  let state: AuthSessionState = {
    initialized: false,
    loading: false,
    configured: adapter.configured,
    user: null,
    error: null,
    redirectReturnTo: null,
  };

  const listeners = new Set<(next: AuthSessionState) => void>();

  const update = (patch: Partial<AuthSessionState>) => {
    if (disposed) return;
    state = { ...state, ...patch };
    for (const listener of listeners) {
      listener(state);
    }
  };

  const resolveReturnTo = (returnTo?: string) => safeNextPath(returnTo, defaultReturnTo());

  const boot = async (): Promise<void> => {
    if (disposed) return;

    if (!adapter.configured) {
      update({ initialized: true, loading: false, user: null });
      return;
    }

    const oauthError = readOAuthErrorFromSearch(getSearch());
    let pendingReturnTo: string | null = null;
    update({ loading: true, error: oauthError ?? state.error });

    try {
      const user = await adapter.init({
        onRedirectReturnTo: (path) => {
          const safe = safeNextPath(path, defaultReturnTo());
          if (state.initialized) {
            update({ redirectReturnTo: safe });
          } else {
            pendingReturnTo = safe;
          }
        },
        onUserChange: (nextUser) => {
          update({ user: nextUser });
        },
      });
      if (disposed) return;

      update({
        user,
        redirectReturnTo: user ? (pendingReturnTo ?? state.redirectReturnTo) : null,
        initialized: true,
        loading: false,
      });
    } catch (err) {
      if (disposed) return;
      update({
        user: null,
        error: classifyAuthError(err),
        initialized: true,
        loading: false,
      });
    }
  };

  const startAuthFlow = async (kind: "signIn" | "signUp", returnTo?: string): Promise<void> => {
    update({ error: null, loading: true });
    if (!adapter.configured) {
      update({ error: { code: "not_configured" }, loading: false });
      return;
    }
    try {
      await adapter[kind]({ returnTo: resolveReturnTo(returnTo) });
    } catch (err) {
      update({ error: classifyAuthError(err), loading: false });
    }
  };

  const signOut = async (): Promise<void> => {
    update({ loading: true });
    try {
      await adapter.signOut();
    } finally {
      update({
        user: null,
        error: null,
        redirectReturnTo: null,
        loading: false,
      });
    }
  };

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    boot,
    signIn: (returnTo) => startAuthFlow("signIn", returnTo),
    signUp: (returnTo) => startAuthFlow("signUp", returnTo),
    signOut,
    getAccessToken: (forceRefresh = false) =>
      adapter.configured ? adapter.getAccessToken({ forceRefresh }) : Promise.resolve(null),
    clearRedirectReturnTo: () => {
      if (state.redirectReturnTo !== null) update({ redirectReturnTo: null });
    },
    dispose: () => {
      disposed = true;
      listeners.clear();
    },
  };
}

import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import { createAuthSession, type AuthSession, type AuthSessionState } from "../../lib/auth/session";
import type { AuthError, AuthUser } from "../../lib/auth/types";
import { historyHref, localeFromPath } from "../../lib/i18n";
import { createWorkosAuthAdapter } from "../lib/workos-auth";

export type AuthContextValue = {
  user: Accessor<AuthUser | null>;
  initialized: Accessor<boolean>;
  authLoading: Accessor<boolean>;
  authError: Accessor<AuthError | null>;
  configured: Accessor<boolean>;
  redirectReturnTo: Accessor<string | null>;
  signIn: (returnTo?: string) => Promise<void>;
  signUp: (returnTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: (forceRefresh?: boolean) => Promise<string | null>;
  clearRedirectReturnTo: () => void;
};

const FALLBACK_AUTH: AuthContextValue = {
  user: () => null,
  initialized: () => false,
  authLoading: () => false,
  authError: () => null,
  configured: () => false,
  redirectReturnTo: () => null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  getAccessToken: async () => null,
  clearRedirectReturnTo: () => {},
};

const AuthContext = createContext<AuthContextValue>(FALLBACK_AUTH);

function createDefaultSession(): AuthSession {
  return createAuthSession(createWorkosAuthAdapter(), {
    defaultReturnTo: () =>
      typeof window === "undefined" ? "/lich-su" : historyHref(localeFromPath(window.location.pathname)),
    getSearch: () => (typeof window === "undefined" ? "" : window.location.search),
  });
}

/**
 * Thin Solid 2.0 binding over the framework-agnostic AuthSession module.
 * Keeps initial state empty during SSR/prerender; boots the auth adapter after hydration.
 */
export function AuthProvider(props: ParentProps<{ session?: AuthSession }>) {
  let ownedSession: AuthSession | null = null;
  const sessionMemo = createMemo(() => props.session ?? (ownedSession ??= createDefaultSession()));
  const [state, setState] = createSignal<AuthSessionState>({
    initialized: false,
    loading: false,
    configured: false,
    user: null,
    error: null,
    redirectReturnTo: null,
  });

  createEffect(
    () => sessionMemo(),
    (session) => {
      setState(session.getState());
      const unsubscribe = session.subscribe((next) => setState(next));
      void session.boot();
      return () => {
        unsubscribe();
        if (session === ownedSession) session.dispose();
      };
    },
  );

  const value: AuthContextValue = {
    user: () => state().user,
    initialized: () => state().initialized,
    authLoading: () => state().loading,
    authError: () => state().error,
    configured: () => state().configured,
    redirectReturnTo: () => state().redirectReturnTo,
    signIn: (returnTo) => sessionMemo().signIn(returnTo),
    signUp: (returnTo) => sessionMemo().signUp(returnTo),
    signOut: () => sessionMemo().signOut(),
    getAccessToken: (forceRefresh) => sessionMemo().getAccessToken(forceRefresh),
    clearRedirectReturnTo: () => sessionMemo().clearRedirectReturnTo(),
  };

  return <AuthContext value={value}>{props.children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

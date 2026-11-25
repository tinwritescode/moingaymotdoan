import {
  createClient,
  NoSessionError,
  type OnRefreshResponse,
  type User as WorkosUser,
} from "@workos-inc/authkit-js";
import { safeNextPath, type AuthCallbacks, type AuthProviderAdapter, type AuthUser } from "../../lib/auth/types";

type WorkosClient = Awaited<ReturnType<typeof createClient>>;

export type WorkosAdapterConfig = {
  clientId?: string;
  apiHostname?: string;
  redirectPath?: string;
  defaultReturnTo?: string;
  defaultUserName?: string;
};

/** Normalizes a WorkOS user profile into a compact AuthUser. */
export function formatWorkosUser(
  u: Pick<WorkosUser, "id" | "email" | "firstName" | "lastName" | "profilePictureUrl">,
  defaultUserName = "Bạn đọc",
): AuthUser {
  const fullName = [u.firstName, u.lastName].filter((s): s is string => Boolean(s?.trim())).join(" ").trim();
  return {
    id: u.id,
    email: u.email,
    name: fullName || u.email.split("@")[0] || defaultUserName,
    avatarUrl: u.profilePictureUrl ?? null,
  };
}

/**
 * WorkOS AuthKit implementation of the AuthProviderAdapter seam.
 * Keeps a live callback reference so late or early client initialization never drops auth events.
 */
export function createWorkosAuthAdapter(config: WorkosAdapterConfig = {}): AuthProviderAdapter {
  const clientId = (config.clientId ?? import.meta.env.VITE_WORKOS_CLIENT_ID ?? "").trim();
  const apiHostname = (config.apiHostname ?? import.meta.env.VITE_WORKOS_API_HOSTNAME ?? "")
    .trim()
    .replace(/^https?:\/\//u, "")
    .replace(/\/+$/u, "");
  const redirectPath = config.redirectPath ?? "/tai-khoan";
  const defaultReturnTo = config.defaultReturnTo ?? "/lich-su";
  const defaultUserName = config.defaultUserName ?? "Bạn đọc";

  let clientPromise: Promise<WorkosClient | null> | null = null;
  let clientInstance: WorkosClient | null = null;
  let activeCallbacks: AuthCallbacks | null = null;

  const ensureClient = (): Promise<WorkosClient | null> => {
    if (typeof window === "undefined" || !clientId) return Promise.resolve(null);
    if (clientPromise) return clientPromise;

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const redirectUri = `${window.location.origin}${redirectPath}`;

    clientPromise = createClient(clientId, {
      redirectUri,
      ...(apiHostname ? { apiHostname } : {}),
      // Only use HttpOnly cookies (devMode: false) with a same-root custom auth domain;
      // default api.workos.com requires devMode: true so browsers don't block third-party cookies.
      devMode: !apiHostname || isLocal,
      onRedirectCallback: ({ state, user }) => {
        activeCallbacks?.onUserChange(formatWorkosUser(user, defaultUserName));
        const rawReturn = state && typeof state.returnTo === "string" ? state.returnTo : null;
        activeCallbacks?.onRedirectReturnTo(safeNextPath(rawReturn, defaultReturnTo));
      },
      onRefresh: (res: OnRefreshResponse) => {
        activeCallbacks?.onUserChange(formatWorkosUser(res.user, defaultUserName));
      },
      onRefreshFailure: () => {
        activeCallbacks?.onUserChange(null);
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
  };

  return {
    get configured() {
      return clientId.length > 0;
    },
    async init(callbacks) {
      activeCallbacks = callbacks;
      const client = await ensureClient();
      const rawUser = client?.getUser() ?? null;
      return rawUser ? formatWorkosUser(rawUser, defaultUserName) : null;
    },
    async signIn({ returnTo }) {
      const client = await ensureClient();
      if (!client) throw new Error("Auth provider not configured");
      await client.signIn({ state: { returnTo } });
    },
    async signUp({ returnTo }) {
      const client = await ensureClient();
      if (!client) throw new Error("Auth provider not configured");
      await client.signUp({ state: { returnTo } });
    },
    async signOut() {
      const client = clientInstance ?? (clientPromise ? await clientPromise.catch(() => null) : null);
      if (!client) return;
      try {
        await client.signOut({ navigate: false });
      } catch (err) {
        if (!(err instanceof NoSessionError)) {
          // Continue clearing browser session.
        }
      }
    },
    async getAccessToken(options) {
      if (typeof window === "undefined" || !clientId) return null;
      try {
        const client = clientInstance ?? (await ensureClient());
        if (!client) return null;
        const token = await client.getAccessToken(options?.forceRefresh ? { forceRefresh: true } : undefined);
        return token || null;
      } catch {
        return null;
      }
    },
  };
}

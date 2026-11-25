import { describe, expect, it } from "vitest";
import { createAuthSession } from "./session";
import {
  classifyAuthError,
  readOAuthErrorFromSearch,
  safeNextPath,
  type AuthCallbacks,
  type AuthProviderAdapter,
  type AuthUser,
} from "./types";

const ALICE: AuthUser = {
  id: "user_alice",
  email: "alice@example.com",
  name: "Alice",
  avatarUrl: null,
};

function createFakeAuthAdapter(options: {
  configured?: boolean;
  initialUser?: AuthUser | null;
  initError?: unknown;
  signInError?: unknown;
  token?: string | null;
  redirectReturnToOnInit?: string;
} = {}) {
  let callbacks: AuthCallbacks | null = null;
  let signedInReturnTo: string | null = null;
  let signedUpReturnTo: string | null = null;
  let signedOutCount = 0;
  let lastForceRefresh: boolean | undefined;

  const adapter: AuthProviderAdapter = {
    configured: options.configured ?? true,
    async init(cb) {
      callbacks = cb;
      if (options.initError) throw options.initError;
      if (options.redirectReturnToOnInit) {
        cb.onRedirectReturnTo(options.redirectReturnToOnInit);
      }
      return options.initialUser ?? null;
    },
    async signIn({ returnTo }) {
      signedInReturnTo = returnTo;
      if (options.signInError) throw options.signInError;
    },
    async signUp({ returnTo }) {
      signedUpReturnTo = returnTo;
    },
    async signOut() {
      signedOutCount += 1;
    },
    async getAccessToken(opts) {
      lastForceRefresh = opts?.forceRefresh;
      return options.token ?? null;
    },
  };

  return {
    adapter,
    emitUserChange: (u: AuthUser | null) => callbacks?.onUserChange(u),
    getSignedInReturnTo: () => signedInReturnTo,
    getSignedUpReturnTo: () => signedUpReturnTo,
    getSignedOutCount: () => signedOutCount,
    getLastForceRefresh: () => lastForceRefresh,
  };
}

describe("auth helpers", () => {
  it("sanitizes post-login redirect paths against open redirects", () => {
    expect(safeNextPath("/thi-thien/23")).toBe("/thi-thien/23");
    expect(safeNextPath("/en/history")).toBe("/en/history");
    expect(safeNextPath("//evil.example")).toBe("/lich-su");
    expect(safeNextPath("https://evil.example")).toBe("/lich-su");
    expect(safeNextPath("/\\evil")).toBe("/lich-su");
    expect(safeNextPath(null, "/en/history")).toBe("/en/history");
  });

  it("classifies raw OAuth errors into stable error codes", () => {
    expect(classifyAuthError("access_denied").code).toBe("access_denied");
    expect(classifyAuthError("invalid_redirect_uri").code).toBe("invalid_redirect_uri");
    expect(classifyAuthError(new Error("Failed to fetch")).code).toBe("network");
    expect(classifyAuthError(new Error("invalid_grant")).code).toBe("session_expired");
    expect(classifyAuthError({ error_description: "something odd" })).toEqual({
      code: "unknown",
      raw: "something odd",
    });
    expect(readOAuthErrorFromSearch("?error=access_denied")?.code).toBe("access_denied");
    expect(readOAuthErrorFromSearch("")).toBeNull();
  });
});

describe("createAuthSession", () => {
  it("initializes cleanly when provider is not configured and reports not_configured on signIn", async () => {
    const fake = createFakeAuthAdapter({ configured: false });
    const session = createAuthSession(fake.adapter);

    await session.boot();
    expect(session.getState()).toMatchObject({
      initialized: true,
      loading: false,
      configured: false,
      user: null,
      error: null,
    });

    await session.signIn("/lich-su");
    expect(session.getState().error).toEqual({ code: "not_configured" });
    expect(await session.getAccessToken()).toBeNull();
  });

  it("boots signed-in user, sanitizes redirectReturnTo, and handles refresh and signOut", async () => {
    const fake = createFakeAuthAdapter({
      initialUser: ALICE,
      token: "jwt-123",
      redirectReturnToOnInit: "/en/genesis/1",
    });
    const session = createAuthSession(fake.adapter, {
      defaultReturnTo: () => "/en/history",
    });

    await session.boot();
    expect(session.getState()).toMatchObject({
      initialized: true,
      loading: false,
      user: ALICE,
      redirectReturnTo: "/en/genesis/1",
    });

    session.clearRedirectReturnTo();
    expect(session.getState().redirectReturnTo).toBeNull();

    expect(await session.getAccessToken(true)).toBe("jwt-123");
    expect(fake.getLastForceRefresh()).toBe(true);

    // Provider refresh failure clears the active user.
    fake.emitUserChange(null);
    expect(session.getState().user).toBeNull();

    await session.signIn("https://evil.example");
    expect(fake.getSignedInReturnTo()).toBe("/en/history");

    await session.signUp("/en/psalms/23");
    expect(fake.getSignedUpReturnTo()).toBe("/en/psalms/23");

    await session.signOut();
    expect(fake.getSignedOutCount()).toBe(1);
    expect(session.getState().user).toBeNull();
  });

  it("captures OAuth errors from search params and classifies provider failures", async () => {
    const fake = createFakeAuthAdapter({
      initError: new Error("Failed to fetch"),
    });
    const session = createAuthSession(fake.adapter, {
      getSearch: () => "?error=access_denied",
    });

    await session.boot();
    expect(session.getState().initialized).toBe(true);
    expect(session.getState().error?.code).toBe("network");

    const fake2 = createFakeAuthAdapter({ signInError: new Error("invalid_redirect_uri") });
    const session2 = createAuthSession(fake2.adapter);
    await session2.boot();
    await session2.signIn("/lich-su");
    expect(session2.getState().error?.code).toBe("invalid_redirect_uri");
    expect(session2.getState().loading).toBe(false);
  });
});

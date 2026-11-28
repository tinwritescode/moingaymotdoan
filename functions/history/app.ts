import { Hono, type MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import {
  normalizeCompletePayload,
  normalizeSyncPayload,
  normalizeVisitPayload,
  NUMERIC_ID_RE,
} from "../../lib/history/contract";
import type { HistoryRepository, OriginPolicy, TokenVerifier } from "../../lib/history/ports";
import { createPushRoutes, type PushDeps } from "./push-routes";

export type HistoryAppDeps = {
  repository: HistoryRepository;
  verifyToken: TokenVerifier;
  isOriginAllowed: OriginPolicy;
  /** Reading reminders; absent when the VAPID keys are not configured. */
  push?: PushDeps;
};

/**
 * Pure, framework-isolated HTTP module for cloud reading history.
 * Accepts persistence, token-verification, and CORS origin adapters at its seam so
 * production (Postgres + WorkOS/OIDC JWKS) and tests (in-memory adapters) exercise the same interface.
 */
export function createHistoryApp(deps: HistoryAppDeps) {
  const app = new Hono<{ Variables: { userId: string } }>();

  app.use(
    "*",
    cors({
      origin: (origin) => (deps.isOriginAllowed(origin) ? origin : ""),
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Authorization", "Content-Type"],
      maxAge: 600,
    }),
  );

  app.get("/health", (c) => c.json({ ok: true }));

  if (deps.push) app.route("/push", createPushRoutes(deps.push));

  const requireAuth: MiddlewareHandler<{ Variables: { userId: string } }> = async (c, next) => {
    const auth = c.req.header("authorization");
    if (!auth?.toLowerCase().startsWith("bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const token = auth.slice(7).trim();
    if (!token) return c.json({ error: "Unauthorized" }, 401);

    try {
      const userId = await deps.verifyToken(token);
      if (!userId) return c.json({ error: "Unauthorized" }, 401);
      c.set("userId", userId);
    } catch {
      return c.json({ error: "Unauthorized" }, 401);
    }
    await next();
  };

  app.use("/history", requireAuth);
  app.use("/history/*", requireAuth);

  app.get("/history", async (c) => {
    const userId = c.get("userId");
    return c.json(await deps.repository.fetchUserHistory(userId));
  });

  app.post("/history/visit", async (c) => {
    const userId = c.get("userId");
    const body = await c.req.json().catch(() => null);
    const item = normalizeVisitPayload(body);
    if (!item) return c.json({ error: "Invalid visit payload" }, 400);
    const result = await deps.repository.upsertVisit(userId, item, { isSync: false });
    return c.json(result, 200);
  });

  app.patch("/history/complete", async (c) => {
    const userId = c.get("userId");
    const body = await c.req.json().catch(() => null);
    const parsed = normalizeCompletePayload(body);
    if (!parsed) return c.json({ error: "Invalid completion payload" }, 400);

    const updated = await deps.repository.setCompleted(userId, parsed);
    if (!updated) return c.json({ error: "Not found" }, 404);
    return c.json(updated);
  });

  app.post("/history/sync", async (c) => {
    const userId = c.get("userId");
    const body = await c.req.json().catch(() => null);
    const parsed = normalizeSyncPayload(body);
    if (!parsed.ok) return c.json({ error: parsed.error }, 400);
    if (parsed.items.length === 0) {
      return c.json(await deps.repository.fetchUserHistory(userId));
    }
    return c.json(await deps.repository.syncVisits(userId, parsed.items));
  });

  app.delete("/history/log/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    if (!NUMERIC_ID_RE.test(id)) return c.json({ error: "Invalid id" }, 400);
    const deleted = await deps.repository.deleteLog(userId, id);
    return c.json({ deleted });
  });

  app.delete("/history", async (c) => {
    const userId = c.get("userId");
    await deps.repository.clearUserHistory(userId);
    return c.json({ cleared: true });
  });

  return app;
}

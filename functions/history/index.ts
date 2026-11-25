import { attachDatabasePool } from "@neon/functions";
import { Hono, type MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { Pool } from "pg";

type HistoryKind = "chapter" | "mood";

type VisitPayload = {
  kind: HistoryKind;
  itemKey: string;
  bookSlug?: string | null;
  chapter?: number | null;
  title: string;
  subtitle: string;
  readDate: string;
  readAt?: string;
  completed?: boolean;
};

type ProgressRow = {
  kind: HistoryKind;
  item_key: string;
  book_slug: string | null;
  chapter: number | null;
  title: string;
  subtitle: string;
  first_read_at: string;
  last_read_at: string;
  read_count: number;
  completed: boolean;
  completed_at: string | null;
};

type LogRow = {
  id: string;
  kind: HistoryKind;
  item_key: string;
  book_slug: string | null;
  chapter: number | null;
  title: string;
  subtitle: string;
  read_date: string;
  read_at: string;
};

const databaseUrl = process.env.DATABASE_URL;
const jwksUrl = process.env.NEON_AUTH_JWKS_URL;
const authBaseUrl = process.env.NEON_AUTH_BASE_URL;

if (!databaseUrl) throw new Error("DATABASE_URL is required");
if (!jwksUrl || !authBaseUrl) throw new Error("NEON_AUTH_JWKS_URL and NEON_AUTH_BASE_URL are required");

const pool = new Pool({ connectionString: databaseUrl, max: 5 });
attachDatabasePool(pool);

const jwks = createRemoteJWKSet(new URL(jwksUrl));
const issuer = new URL(authBaseUrl).origin;

const ALLOWED_ORIGINS = new Set([
  "https://bible.tyvn.online",
  "https://www.bible.tyvn.online",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const VERCEL_PREVIEW_RE = /^https:\/\/kinh-thanh(?:-[a-z0-9-]+)?\.vercel\.app$/u;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/u;
const KEY_RE = /^[a-z0-9/-]{1,120}$/u;

function resolveOrigin(origin: string): string {
  if (ALLOWED_ORIGINS.has(origin) || VERCEL_PREVIEW_RE.test(origin)) return origin;
  return "";
}

function normalizeVisit(raw: unknown): VisitPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const kind = r.kind === "chapter" || r.kind === "mood" ? r.kind : null;
  const itemKey = typeof r.itemKey === "string" ? r.itemKey.trim() : "";
  const title = typeof r.title === "string" ? r.title.trim().slice(0, 200) : "";
  const subtitle = typeof r.subtitle === "string" ? r.subtitle.trim().slice(0, 120) : "";
  const readDate = typeof r.readDate === "string" ? r.readDate.trim() : "";

  if (!kind || !KEY_RE.test(itemKey) || !title || !subtitle || !DATE_RE.test(readDate)) return null;

  let bookSlug: string | null = null;
  let chapter: number | null = null;
  if (kind === "chapter") {
    if (typeof r.bookSlug !== "string" || !KEY_RE.test(r.bookSlug.trim())) return null;
    const ch = typeof r.chapter === "number" ? r.chapter : Number(r.chapter);
    if (!Number.isInteger(ch) || ch < 1 || ch > 200) return null;
    bookSlug = r.bookSlug.trim();
    chapter = ch;
  }

  let readAt: string | undefined;
  if (typeof r.readAt === "string") {
    const parsed = Date.parse(r.readAt);
    if (!Number.isNaN(parsed)) readAt = new Date(parsed).toISOString();
  }

  const completed = typeof r.completed === "boolean" ? r.completed : undefined;
  return { kind, itemKey, bookSlug, chapter, title, subtitle, readDate, readAt, completed };
}

function mapProgress(row: ProgressRow) {
  return {
    kind: row.kind,
    itemKey: row.item_key,
    bookSlug: row.book_slug,
    chapter: row.chapter,
    title: row.title,
    subtitle: row.subtitle,
    firstReadAt: row.first_read_at,
    lastReadAt: row.last_read_at,
    readCount: row.read_count,
    completed: row.completed,
    completedAt: row.completed_at,
  };
}

function mapLog(row: LogRow) {
  return {
    id: row.id,
    kind: row.kind,
    itemKey: row.item_key,
    bookSlug: row.book_slug,
    chapter: row.chapter,
    title: row.title,
    subtitle: row.subtitle,
    readDate: row.read_date,
    readAt: row.read_at,
  };
}

async function fetchUserHistory(userId: string) {
  const [progressRes, logsRes] = await Promise.all([
    pool.query<ProgressRow>(
      `SELECT kind, item_key, book_slug, chapter, title, subtitle,
              first_read_at, last_read_at, read_count, completed, completed_at
       FROM reading_progress
       WHERE user_id = $1
       ORDER BY last_read_at DESC
       LIMIT 2000`,
      [userId],
    ),
    pool.query<LogRow>(
      `SELECT id::text AS id, kind, item_key, book_slug, chapter, title, subtitle,
              to_char(read_date, 'YYYY-MM-DD') AS read_date, read_at
       FROM reading_logs
       WHERE user_id = $1
       ORDER BY read_date DESC, read_at DESC
       LIMIT 250`,
      [userId],
    ),
  ]);

  return {
    progress: progressRes.rows.map(mapProgress),
    logs: logsRes.rows.map(mapLog),
  };
}

async function upsertVisit(userId: string, item: VisitPayload, isSync: boolean) {
  const at = item.readAt ?? new Date().toISOString();
  const completed = item.completed ?? false;

  const { rows } = await pool.query<{
    progress: ProgressRow;
    log: LogRow;
  }>(
    `WITH upserted_progress AS (
       INSERT INTO reading_progress (
         user_id, kind, item_key, book_slug, chapter, title, subtitle,
         first_read_at, last_read_at, read_count, completed, completed_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::timestamptz, $8::timestamptz, 1, $9, CASE WHEN $9 THEN $8::timestamptz ELSE NULL END)
       ON CONFLICT (user_id, kind, item_key) DO UPDATE SET
         title = EXCLUDED.title,
         subtitle = EXCLUDED.subtitle,
         first_read_at = LEAST(reading_progress.first_read_at, EXCLUDED.first_read_at),
         last_read_at = GREATEST(reading_progress.last_read_at, EXCLUDED.last_read_at),
         read_count = CASE WHEN $10 THEN GREATEST(reading_progress.read_count, 1) ELSE reading_progress.read_count + 1 END,
         completed = reading_progress.completed OR EXCLUDED.completed,
         completed_at = COALESCE(reading_progress.completed_at, EXCLUDED.completed_at)
       RETURNING kind, item_key, book_slug, chapter, title, subtitle,
                 first_read_at, last_read_at, read_count, completed, completed_at
     ),
     upserted_log AS (
       INSERT INTO reading_logs (
         user_id, kind, item_key, book_slug, chapter, title, subtitle, read_date, read_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $11::date, $8::timestamptz)
       ON CONFLICT (user_id, kind, item_key, read_date) DO UPDATE SET
         title = EXCLUDED.title,
         subtitle = EXCLUDED.subtitle,
         read_at = GREATEST(reading_logs.read_at, EXCLUDED.read_at)
       RETURNING id::text AS id, kind, item_key, book_slug, chapter, title, subtitle,
                 to_char(read_date, 'YYYY-MM-DD') AS read_date, read_at
     )
     SELECT row_to_json(upserted_progress.*) AS progress,
            row_to_json(upserted_log.*) AS log
     FROM upserted_progress, upserted_log`,
    [
      userId,
      item.kind,
      item.itemKey,
      item.bookSlug ?? null,
      item.chapter ?? null,
      item.title,
      item.subtitle,
      at,
      completed,
      isSync,
      item.readDate,
    ],
  );

  const row = rows[0];
  return {
    progress: mapProgress(row.progress),
    log: mapLog(row.log),
  };
}

const app = new Hono<{ Variables: { userId: string } }>();

app.use(
  "*",
  cors({
    origin: resolveOrigin,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    maxAge: 600,
  }),
);

app.get("/health", (c) => c.json({ ok: true }));

const requireAuth: MiddlewareHandler<{ Variables: { userId: string } }> = async (c, next) => {
  const auth = c.req.header("authorization");
  if (!auth?.toLowerCase().startsWith("bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  try {
    const { payload } = await jwtVerify(auth.slice(7).trim(), jwks, { issuer });
    if (typeof payload.sub !== "string" || !payload.sub) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    c.set("userId", payload.sub);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
};

app.use("/history", requireAuth);
app.use("/history/*", requireAuth);

app.get("/history", async (c) => {
  const userId = c.get("userId");
  return c.json(await fetchUserHistory(userId));
});

app.post("/history/visit", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json().catch(() => null);
  const item = normalizeVisit(body);
  if (!item) return c.json({ error: "Invalid visit payload" }, 400);
  const result = await upsertVisit(userId, item, false);
  return c.json(result, 200);
});

app.patch("/history/complete", async (c) => {
  const userId = c.get("userId");
  const body = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || (body.kind !== "chapter" && body.kind !== "mood") || typeof body.completed !== "boolean") {
    return c.json({ error: "Invalid completion payload" }, 400);
  }
  const itemKey = typeof body.itemKey === "string" ? body.itemKey.trim() : "";
  if (!KEY_RE.test(itemKey)) return c.json({ error: "Invalid itemKey" }, 400);

  const { rows } = await pool.query<ProgressRow>(
    `UPDATE reading_progress
     SET completed = $4,
         completed_at = CASE WHEN $4 THEN COALESCE(completed_at, now()) ELSE NULL END
     WHERE user_id = $1 AND kind = $2 AND item_key = $3
     RETURNING kind, item_key, book_slug, chapter, title, subtitle,
               first_read_at, last_read_at, read_count, completed, completed_at`,
    [userId, body.kind, itemKey, body.completed],
  );

  if (rows.length > 0) return c.json({ progress: mapProgress(rows[0]) });

  // Nếu chưa có dòng progress (ví dụ người dùng bấm Đã đọc xong ngay lập tức), tạo mới nếu đủ dữ liệu.
  const fallback = normalizeVisit(body);
  if (!fallback) return c.json({ error: "Not found" }, 404);
  const created = await upsertVisit(userId, { ...fallback, completed: body.completed }, false);
  return c.json({ progress: created.progress });
});

app.post("/history/sync", async (c) => {
  const userId = c.get("userId");
  const body = (await c.req.json().catch(() => null)) as { items?: unknown[] } | null;
  if (!body || !Array.isArray(body.items)) return c.json({ error: "Invalid sync payload" }, 400);

  const validItems: VisitPayload[] = [];
  for (const raw of body.items.slice(0, 200)) {
    const normalized = normalizeVisit(raw);
    if (normalized) validItems.push(normalized);
  }

  for (const item of validItems) {
    await upsertVisit(userId, item, true);
  }

  return c.json(await fetchUserHistory(userId));
});

app.delete("/history/log/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  if (!/^\d+$/u.test(id)) return c.json({ error: "Invalid id" }, 400);
  const res = await pool.query(`DELETE FROM reading_logs WHERE id = $1::bigint AND user_id = $2`, [id, userId]);
  return c.json({ deleted: (res.rowCount ?? 0) > 0 });
});

app.delete("/history/item", async (c) => {
  const userId = c.get("userId");
  const body = (await c.req.json().catch(() => null)) as Record<string, unknown> | null;
  const kind = body?.kind === "chapter" || body?.kind === "mood" ? body.kind : null;
  const itemKey = typeof body?.itemKey === "string" ? body.itemKey.trim() : "";
  if (!kind || !KEY_RE.test(itemKey)) return c.json({ error: "Invalid item payload" }, 400);

  await pool.query(`DELETE FROM reading_logs WHERE user_id = $1 AND kind = $2 AND item_key = $3`, [
    userId,
    kind,
    itemKey,
  ]);
  await pool.query(`DELETE FROM reading_progress WHERE user_id = $1 AND kind = $2 AND item_key = $3`, [
    userId,
    kind,
    itemKey,
  ]);
  return c.json({ deleted: true });
});

app.delete("/history", async (c) => {
  const userId = c.get("userId");
  await pool.query(`DELETE FROM reading_logs WHERE user_id = $1`, [userId]);
  await pool.query(`DELETE FROM reading_progress WHERE user_id = $1`, [userId]);
  return c.json({ cleared: true });
});

export default app;

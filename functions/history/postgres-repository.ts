import type { Pool } from "pg";
import { MAX_LOGS, MAX_PROGRESS } from "../../lib/history/contract";
import type { HistoryRepository } from "../../lib/history/ports";
import { mergeMarks, type StreakMarks } from "../../lib/streak/marks";
import {
  progressMapKey,
  type HistoryKind,
  type HistorySnapshot,
  type ReadingLog,
  type ReadingProgress,
  type VisitMutationResult,
  type VisitPayload,
} from "../../lib/history/types";

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

function mapProgress(row: ProgressRow): ReadingProgress {
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

function mapLog(row: LogRow): ReadingLog {
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

type AggregatedProgress = {
  kind: HistoryKind;
  itemKey: string;
  bookSlug: string | null;
  chapter: number | null;
  title: string;
  subtitle: string;
  firstReadAt: string;
  lastReadAt: string;
  readCount: number;
  completed: boolean;
  completedAt: string | null;
};

type AggregatedLog = {
  kind: HistoryKind;
  itemKey: string;
  bookSlug: string | null;
  chapter: number | null;
  title: string;
  subtitle: string;
  readDate: string;
  readAt: string;
};

/**
 * Deduplicates incoming sync items per conflict key so a batched UNNEST upsert
 * never hits Postgres's "ON CONFLICT DO UPDATE command cannot affect row a second time".
 */
export function aggregateSyncBatch(items: VisitPayload[], fallbackNowIso: string): {
  progress: AggregatedProgress[];
  logs: AggregatedLog[];
} {
  const progressMap = new Map<string, AggregatedProgress>();
  const logMap = new Map<string, AggregatedLog>();

  for (const item of items) {
    const at = item.readAt ?? fallbackNowIso;
    const completed = item.completed ?? false;
    const readCount = Math.max(1, item.readCount ?? 1);
    const pKey = progressMapKey(item.kind, item.itemKey);

    const existingProg = progressMap.get(pKey);
    if (!existingProg) {
      progressMap.set(pKey, {
        kind: item.kind,
        itemKey: item.itemKey,
        bookSlug: item.bookSlug,
        chapter: item.chapter,
        title: item.title,
        subtitle: item.subtitle,
        firstReadAt: at,
        lastReadAt: at,
        readCount,
        completed,
        completedAt: completed ? at : null,
      });
    } else {
      const isNewer = at >= existingProg.lastReadAt;
      if (isNewer) {
        existingProg.title = item.title;
        existingProg.subtitle = item.subtitle;
        existingProg.lastReadAt = at;
      }
      if (at < existingProg.firstReadAt) existingProg.firstReadAt = at;
      existingProg.readCount = Math.max(existingProg.readCount, readCount);
      if (completed) {
        existingProg.completed = true;
        if (!existingProg.completedAt || at < existingProg.completedAt) {
          existingProg.completedAt = at;
        }
      }
    }

    const lKey = `${pKey}::${item.readDate}`;
    const existingLog = logMap.get(lKey);
    if (!existingLog || at >= existingLog.readAt) {
      logMap.set(lKey, {
        kind: item.kind,
        itemKey: item.itemKey,
        bookSlug: item.bookSlug,
        chapter: item.chapter,
        title: item.title,
        subtitle: item.subtitle,
        readDate: item.readDate,
        readAt: at,
      });
    }
  }

  return {
    progress: [...progressMap.values()],
    logs: [...logMap.values()],
  };
}

/** Postgres implementation of the HistoryRepository seam. */
export function createPostgresHistoryRepository(pool: Pool): HistoryRepository {
  const fetchUserHistory = async (userId: string): Promise<HistorySnapshot> => {
    const [progressRes, logsRes] = await Promise.all([
      pool.query<ProgressRow>(
        `SELECT kind, item_key, book_slug, chapter, title, subtitle,
                first_read_at, last_read_at, read_count, completed, completed_at
         FROM reading_progress
         WHERE user_id = $1
         ORDER BY last_read_at DESC
         LIMIT $2`,
        [userId, MAX_PROGRESS],
      ),
      pool.query<LogRow>(
        `SELECT id::text AS id, kind, item_key, book_slug, chapter, title, subtitle,
                to_char(read_date, 'YYYY-MM-DD') AS read_date, read_at
         FROM reading_logs
         WHERE user_id = $1
         ORDER BY read_date DESC, read_at DESC
         LIMIT $2`,
        [userId, MAX_LOGS],
      ),
    ]);

    return {
      progress: progressRes.rows.map(mapProgress),
      logs: logsRes.rows.map(mapLog),
    };
  };

  const upsertVisit = async (
    userId: string,
    item: VisitPayload,
    options: { isSync: boolean },
  ): Promise<VisitMutationResult> => {
    const at = item.readAt ?? new Date().toISOString();
    const completed = item.completed ?? false;
    const incomingCount = Math.max(1, item.readCount ?? 1);

    const { rows } = await pool.query<{ progress: ProgressRow; log: LogRow }>(
      `WITH upserted_progress AS (
         INSERT INTO reading_progress (
           user_id, kind, item_key, book_slug, chapter, title, subtitle,
           first_read_at, last_read_at, read_count, completed, completed_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::timestamptz, $8::timestamptz, $12, $9, CASE WHEN $9 THEN $8::timestamptz ELSE NULL END)
         ON CONFLICT (user_id, kind, item_key) DO UPDATE SET
           title = EXCLUDED.title,
           subtitle = EXCLUDED.subtitle,
           first_read_at = LEAST(reading_progress.first_read_at, EXCLUDED.first_read_at),
           last_read_at = GREATEST(reading_progress.last_read_at, EXCLUDED.last_read_at),
           read_count = CASE WHEN $10 THEN GREATEST(reading_progress.read_count, EXCLUDED.read_count) ELSE reading_progress.read_count + 1 END,
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
        options.isSync,
        item.readDate,
        incomingCount,
      ],
    );

    const row = rows[0];
    return {
      progress: mapProgress(row.progress),
      log: mapLog(row.log),
    };
  };

  return {
    fetchUserHistory,
    upsertVisit,
    async setCompleted(userId, input) {
      const { rows } = await pool.query<ProgressRow>(
        `UPDATE reading_progress
         SET completed = $4,
             completed_at = CASE WHEN $4 THEN COALESCE(completed_at, now()) ELSE NULL END
         WHERE user_id = $1 AND kind = $2 AND item_key = $3
         RETURNING kind, item_key, book_slug, chapter, title, subtitle,
                   first_read_at, last_read_at, read_count, completed, completed_at`,
        [userId, input.kind, input.itemKey, input.completed],
      );
      if (rows.length > 0) return { progress: mapProgress(rows[0]) };

      if (!input.fallbackVisit) return null;
      const created = await upsertVisit(
        userId,
        { ...input.fallbackVisit, completed: input.completed },
        { isSync: false },
      );
      return { progress: created.progress };
    },
    async syncVisits(userId, items) {
      if (items.length === 0) return fetchUserHistory(userId);
      const batch = aggregateSyncBatch(items, new Date().toISOString());

      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        if (batch.progress.length > 0) {
          await client.query(
            `INSERT INTO reading_progress (
               user_id, kind, item_key, book_slug, chapter, title, subtitle,
               first_read_at, last_read_at, read_count, completed, completed_at
             )
             SELECT
               $1, u.kind, u.item_key, u.book_slug, u.chapter, u.title, u.subtitle,
               u.first_read_at, u.last_read_at, u.read_count, u.completed, u.completed_at
             FROM unnest(
               $2::text[], $3::text[], $4::text[], $5::int[], $6::text[], $7::text[],
               $8::timestamptz[], $9::timestamptz[], $10::int[], $11::boolean[], $12::timestamptz[]
             ) AS u(
               kind, item_key, book_slug, chapter, title, subtitle,
               first_read_at, last_read_at, read_count, completed, completed_at
             )
             ON CONFLICT (user_id, kind, item_key) DO UPDATE SET
               title = EXCLUDED.title,
               subtitle = EXCLUDED.subtitle,
               first_read_at = LEAST(reading_progress.first_read_at, EXCLUDED.first_read_at),
               last_read_at = GREATEST(reading_progress.last_read_at, EXCLUDED.last_read_at),
               read_count = GREATEST(reading_progress.read_count, EXCLUDED.read_count),
               completed = reading_progress.completed OR EXCLUDED.completed,
               completed_at = COALESCE(reading_progress.completed_at, EXCLUDED.completed_at)`,
            [
              userId,
              batch.progress.map((p) => p.kind),
              batch.progress.map((p) => p.itemKey),
              batch.progress.map((p) => p.bookSlug),
              batch.progress.map((p) => p.chapter),
              batch.progress.map((p) => p.title),
              batch.progress.map((p) => p.subtitle),
              batch.progress.map((p) => p.firstReadAt),
              batch.progress.map((p) => p.lastReadAt),
              batch.progress.map((p) => p.readCount),
              batch.progress.map((p) => p.completed),
              batch.progress.map((p) => p.completedAt),
            ],
          );
        }

        if (batch.logs.length > 0) {
          await client.query(
            `INSERT INTO reading_logs (
               user_id, kind, item_key, book_slug, chapter, title, subtitle, read_date, read_at
             )
             SELECT
               $1, u.kind, u.item_key, u.book_slug, u.chapter, u.title, u.subtitle, u.read_date, u.read_at
             FROM unnest(
               $2::text[], $3::text[], $4::text[], $5::int[], $6::text[], $7::text[],
               $8::date[], $9::timestamptz[]
             ) AS u(
               kind, item_key, book_slug, chapter, title, subtitle, read_date, read_at
             )
             ON CONFLICT (user_id, kind, item_key, read_date) DO UPDATE SET
               title = EXCLUDED.title,
               subtitle = EXCLUDED.subtitle,
               read_at = GREATEST(reading_logs.read_at, EXCLUDED.read_at)`,
            [
              userId,
              batch.logs.map((l) => l.kind),
              batch.logs.map((l) => l.itemKey),
              batch.logs.map((l) => l.bookSlug),
              batch.logs.map((l) => l.chapter),
              batch.logs.map((l) => l.title),
              batch.logs.map((l) => l.subtitle),
              batch.logs.map((l) => l.readDate),
              batch.logs.map((l) => l.readAt),
            ],
          );
        }

        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK").catch(() => {});
        throw err;
      } finally {
        client.release();
      }

      return fetchUserHistory(userId);
    },
    async deleteLog(userId, id) {
      const res = await pool.query(
        `DELETE FROM reading_logs WHERE id = $1::bigint AND user_id = $2`,
        [id, userId],
      );
      return (res.rowCount ?? 0) > 0;
    },
    async clearUserHistory(userId) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(`DELETE FROM reading_logs WHERE user_id = $1`, [userId]);
        await client.query(`DELETE FROM reading_progress WHERE user_id = $1`, [userId]);
        await client.query(`DELETE FROM streak_marks WHERE user_id = $1`, [userId]);
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK").catch(() => {});
        throw err;
      } finally {
        client.release();
      }
    },
    async fetchStreakMarks(userId) {
      const { rows } = await pool.query<MarksRow>(`${SELECT_MARKS} WHERE user_id = $1`, [userId]);
      return rows[0] ? toMarks(rows[0]) : null;
    },
    async mergeStreakMarks(userId, incoming) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        // Create the row first so FOR UPDATE always has one to lock: two devices merging at once queue up.
        await client.query(
          `INSERT INTO streak_marks (user_id, remind_hour) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING`,
          [userId, incoming.remindHour],
        );
        const { rows } = await client.query<MarksRow>(`${SELECT_MARKS} WHERE user_id = $1 FOR UPDATE`, [userId]);
        const merged = mergeMarks(toMarks(rows[0]), incoming);
        await client.query(
          `UPDATE streak_marks SET rest_days = $2::date[], restarted_on = $3, remind_hour = $4, updated_at = now()
           WHERE user_id = $1`,
          [userId, merged.restDays, merged.restartedOn, merged.remindHour],
        );
        await client.query("COMMIT");
        return merged;
      } catch (err) {
        await client.query("ROLLBACK").catch(() => {});
        throw err;
      } finally {
        client.release();
      }
    },
  };
}

type MarksRow = { rest_days: string[]; restarted_on: string | null; remind_hour: number };

const SELECT_MARKS = `SELECT ARRAY(SELECT to_char(d, 'YYYY-MM-DD') FROM unnest(rest_days) AS d ORDER BY d) AS rest_days,
  to_char(restarted_on, 'YYYY-MM-DD') AS restarted_on, remind_hour FROM streak_marks`;

const toMarks = (r: MarksRow): StreakMarks => ({ restDays: r.rest_days, restartedOn: r.restarted_on, remindHour: r.remind_hour });

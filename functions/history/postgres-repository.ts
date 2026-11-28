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
import type { PrismaClient } from "./generated/prisma/client";
import { lockStreakMarks, setCompleted, syncLogs, syncProgress, upsertVisit } from "./generated/prisma/sql";

/** A local day (YYYY-MM-DD) as Prisma stores a `@db.Date`: midnight UTC. */
export const fromDateKey = (key: string): Date => new Date(`${key}T00:00:00.000Z`);
/** A `@db.Date` back to its local day; UTC, so the server's time zone never shifts it. */
export const toDateKey = (date: Date): string => date.toISOString().slice(0, 10);

/** The database's CHECK allows only these; a wrong value means a broken table, not bad input. */
function toKind(kind: string): HistoryKind {
  if (kind === "chapter" || kind === "mood") return kind;
  throw new Error(`Unknown history kind in database: ${kind}`);
}

type ProgressRow = {
  kind: string;
  item_key: string;
  book_slug: string | null;
  chapter: number | null;
  title: string;
  subtitle: string;
  first_read_at: Date;
  last_read_at: Date;
  read_count: number;
  completed: boolean;
  completed_at: Date | null;
};

function mapProgress(row: ProgressRow): ReadingProgress {
  return {
    kind: toKind(row.kind),
    itemKey: row.item_key,
    bookSlug: row.book_slug,
    chapter: row.chapter,
    title: row.title,
    subtitle: row.subtitle,
    firstReadAt: row.first_read_at.toISOString(),
    lastReadAt: row.last_read_at.toISOString(),
    readCount: row.read_count,
    completed: row.completed,
    completedAt: row.completed_at?.toISOString() ?? null,
  };
}

type ProgressModel = {
  kind: string;
  itemKey: string;
  bookSlug: string | null;
  chapter: number | null;
  title: string;
  subtitle: string;
  firstReadAt: Date;
  lastReadAt: Date;
  readCount: number;
  completed: boolean;
  completedAt: Date | null;
};

const progressFromModel = (p: ProgressModel): ReadingProgress => ({
  kind: toKind(p.kind),
  itemKey: p.itemKey,
  bookSlug: p.bookSlug,
  chapter: p.chapter,
  title: p.title,
  subtitle: p.subtitle,
  readCount: p.readCount,
  completed: p.completed,
  firstReadAt: p.firstReadAt.toISOString(),
  lastReadAt: p.lastReadAt.toISOString(),
  completedAt: p.completedAt?.toISOString() ?? null,
});

type LogModel = {
  id: bigint;
  kind: string;
  itemKey: string;
  bookSlug: string | null;
  chapter: number | null;
  title: string;
  subtitle: string;
  readDate: Date;
  readAt: Date;
};

const logFromModel = (l: LogModel): ReadingLog => ({
  id: l.id.toString(),
  kind: toKind(l.kind),
  itemKey: l.itemKey,
  bookSlug: l.bookSlug,
  chapter: l.chapter,
  title: l.title,
  subtitle: l.subtitle,
  readDate: toDateKey(l.readDate),
  readAt: l.readAt.toISOString(),
});

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


const LOG_SELECT = {
  id: true,
  kind: true,
  itemKey: true,
  bookSlug: true,
  chapter: true,
  title: true,
  subtitle: true,
  readDate: true,
  readAt: true,
} as const;

/** Postgres implementation of the HistoryRepository seam, through Prisma. */
export function createPostgresHistoryRepository(prisma: PrismaClient): HistoryRepository {
  const fetchUserHistory = async (userId: string): Promise<HistorySnapshot> => {
    const [progress, logs] = await Promise.all([
      prisma.readingProgress.findMany({ where: { userId }, orderBy: { lastReadAt: "desc" }, take: MAX_PROGRESS }),
      prisma.readingLog.findMany({
        where: { userId },
        orderBy: [{ readDate: "desc" }, { readAt: "desc" }],
        take: MAX_LOGS,
        select: LOG_SELECT,
      }),
    ]);
    return { progress: progress.map(progressFromModel), logs: logs.map(logFromModel) };
  };

  const upsertVisitRow = async (
    userId: string,
    item: VisitPayload,
    options: { isSync: boolean },
  ): Promise<VisitMutationResult> => {
    const [row] = await prisma.$queryRawTyped(
      upsertVisit(
        userId,
        item.kind,
        item.itemKey,
        item.bookSlug ?? null,
        item.chapter ?? null,
        item.title,
        item.subtitle,
        new Date(item.readAt ?? Date.now()),
        item.completed ?? false,
        options.isSync,
        fromDateKey(item.readDate),
        Math.max(1, item.readCount ?? 1),
      ),
    );
    return {
      progress: mapProgress(row),
      log: {
        id: row.log_id.toString(),
        kind: toKind(row.kind),
        itemKey: row.item_key,
        bookSlug: row.book_slug,
        chapter: row.chapter,
        title: row.log_title,
        subtitle: row.log_subtitle,
        readDate: toDateKey(row.read_date),
        readAt: row.read_at.toISOString(),
      },
    };
  };

  return {
    fetchUserHistory,
    upsertVisit: upsertVisitRow,
    async setCompleted(userId, input) {
      const [row] = await prisma.$queryRawTyped(setCompleted(userId, input.kind, input.itemKey, input.completed));
      if (row) return { progress: mapProgress(row) };
      if (!input.fallbackVisit) return null;
      const created = await upsertVisitRow(userId, { ...input.fallbackVisit, completed: input.completed }, { isSync: false });
      return { progress: created.progress };
    },
    async syncVisits(userId, items) {
      if (items.length === 0) return fetchUserHistory(userId);
      const batch = aggregateSyncBatch(items, new Date().toISOString());
      const progressRows = batch.progress.map((p) => ({
        kind: p.kind,
        item_key: p.itemKey,
        book_slug: p.bookSlug,
        chapter: p.chapter,
        title: p.title,
        subtitle: p.subtitle,
        first_read_at: p.firstReadAt,
        last_read_at: p.lastReadAt,
        read_count: p.readCount,
        completed: p.completed,
        completed_at: p.completedAt,
      }));
      const logRows = batch.logs.map((l) => ({
        kind: l.kind,
        item_key: l.itemKey,
        book_slug: l.bookSlug,
        chapter: l.chapter,
        title: l.title,
        subtitle: l.subtitle,
        read_date: l.readDate,
        read_at: l.readAt,
      }));
      await prisma.$transaction([
        prisma.$queryRawTyped(syncProgress(userId, { rows: progressRows })),
        prisma.$queryRawTyped(syncLogs(userId, { rows: logRows })),
      ]);
      return fetchUserHistory(userId);
    },
    async deleteLog(userId, id) {
      // Log ids are bigint serials; anything else names no log.
      if (!/^\d{1,19}$/u.test(id)) return false;
      const { count } = await prisma.readingLog.deleteMany({ where: { id: BigInt(id), userId } });
      return count > 0;
    },
    async clearUserHistory(userId) {
      await prisma.$transaction([
        prisma.readingLog.deleteMany({ where: { userId } }),
        prisma.readingProgress.deleteMany({ where: { userId } }),
        prisma.streakMark.deleteMany({ where: { userId } }),
      ]);
    },
    async fetchStreakMarks(userId) {
      const row = await prisma.streakMark.findUnique({ where: { userId } });
      return row ? toMarks(row) : null;
    },
    async mergeStreakMarks(userId, incoming) {
      return prisma.$transaction(async (tx) => {
        // Create the row first so FOR UPDATE always has one to lock: two devices merging at once queue up.
        await tx.streakMark.createMany({ data: { userId, remindHour: incoming.remindHour }, skipDuplicates: true });
        const [locked] = await tx.$queryRawTyped(lockStreakMarks(userId));
        const merged = mergeMarks(
          toMarks({ restDays: locked.rest_days, restartedOn: locked.restarted_on, remindHour: locked.remind_hour }),
          incoming,
        );
        await tx.streakMark.update({
          where: { userId },
          data: {
            restDays: merged.restDays.map(fromDateKey),
            restartedOn: merged.restartedOn === null ? null : fromDateKey(merged.restartedOn),
            remindHour: merged.remindHour,
          },
        });
        return merged;
      });
    },
  };
}

const toMarks = (r: { restDays: Date[]; restartedOn: Date | null; remindHour: number }): StreakMarks => ({
  restDays: r.restDays.map(toDateKey).sort(),
  restartedOn: r.restartedOn === null ? null : toDateKey(r.restartedOn),
  remindHour: r.remindHour,
});

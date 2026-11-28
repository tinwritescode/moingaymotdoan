import { mondayOf } from "./streak";

export const DEFAULT_REMIND_HOUR = 21;
const MAX_REST_DAYS = 1000;

/** What the reading logs cannot tell: rest days, the last restart and the reminder hour. Kept per device, synced per user. */
export type StreakMarks = { restDays: string[]; restartedOn: string | null; remindHour: number };

export const EMPTY_MARKS: StreakMarks = { restDays: [], restartedOn: null, remindHour: DEFAULT_REMIND_HOUR };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/u;
export const isDateKey = (v: unknown): v is string => typeof v === "string" && DATE_RE.test(v);
export const isRemindHour = (v: unknown): v is number => Number.isInteger(v) && Number(v) >= 6 && Number(v) <= 23;

/** Marks from storage or the network; null for anything malformed. */
export function parseMarks(v: unknown): StreakMarks | null {
  if (typeof v !== "object" || v === null) return null;
  if (!("restDays" in v) || !Array.isArray(v.restDays) || v.restDays.length > MAX_REST_DAYS || !v.restDays.every(isDateKey)) {
    return null;
  }
  if (!("restartedOn" in v) || !(v.restartedOn === null || isDateKey(v.restartedOn))) return null;
  if (!("remindHour" in v) || !isRemindHour(v.remindHour)) return null;
  return { restDays: v.restDays, restartedOn: v.restartedOn, remindHour: v.remindHour };
}

/**
 * Two copies of the marks as one: every rest day (the first of each week when devices rested apart),
 * the later restart, and `incoming`'s reminder hour. Order-independent except for the hour.
 */
export function mergeMarks(base: StreakMarks, incoming: StreakMarks): StreakMarks {
  const weeks = new Set<string>();
  const restDays = [...new Set([...base.restDays, ...incoming.restDays])].sort().filter((d) => {
    const week = mondayOf(d);
    if (weeks.has(week)) return false;
    weeks.add(week);
    return true;
  });
  const starts = [base.restartedOn, incoming.restartedOn].filter((d) => d !== null).sort();
  return { restDays, restartedOn: starts.at(-1) ?? null, remindHour: incoming.remindHour };
}

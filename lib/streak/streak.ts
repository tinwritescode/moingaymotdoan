import type { ReadingLog } from "../history/types";

/** Everything the streak rules need. Dates are the reader's local calendar dates, YYYY-MM-DD. */
export type StreakInput = {
  /** Date → number of different đoạn (chapters) read that day. */
  readDays: ReadonlyMap<string, number>;
  /** Days the reader marked as Ngày Sa-bát. */
  restDays: ReadonlySet<string>;
  /** The last day the reader chose "Bắt đầu lại": no chain reaches back past it. */
  restartedOn: string | null;
  today: string;
};

export type StreakState =
  /** Today not read yet; `days` is the chain through yesterday (0 for none). */
  | { kind: "today"; days: number; record: number }
  | { kind: "done"; days: number; record: number }
  /** Yesterday missed: `days` can still be saved today by reading `needed` more đoạn or resting `missed`. */
  | { kind: "rescue"; days: number; record: number; needed: 1 | 2; missed: string; restAvailable: boolean };

export type DayMark = "read" | "rest" | "rekindled" | "missed" | "today" | "future";

/** Đoạn needed the day after a miss to rekindle it. */
export const REKINDLE_READS = 2;

export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Monday of the week holding `date`. */
function mondayOf(date: string): string {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay(); // 0 = Sunday
  return addDays(date, -((day + 6) % 7));
}

/** Date → different đoạn read; mood guides do not count. */
export function readDaysFromLogs(logs: readonly ReadingLog[]): Map<string, number> {
  const keys = new Map<string, Set<string>>();
  for (const log of logs) {
    if (log.kind !== "chapter") continue;
    const set = keys.get(log.readDate) ?? new Set<string>();
    set.add(log.itemKey);
    keys.set(log.readDate, set);
  }
  return new Map([...keys].map(([date, set]) => [date, set.size]));
}

const reads = (s: StreakInput, date: string) => s.readDays.get(date) ?? 0;

/** A day that keeps the chain unbroken: read, rested, or rekindled by the next day's reading. */
function covered(s: StreakInput, date: string): boolean {
  if (reads(s, date) > 0 || s.restDays.has(date)) return true;
  return date < s.today && reads(s, addDays(date, 1)) >= REKINDLE_READS;
}

/** Read days in the unbroken chain ending on `date`. */
function chainEndingOn(s: StreakInput, date: string): number {
  let count = 0;
  for (let d = date; covered(s, d) && !(s.restartedOn && d < s.restartedOn); d = addDays(d, -1)) {
    if (reads(s, d) > 0) count += 1;
  }
  return count;
}

/** Longest chain anywhere in the history, under the same rules. */
function record(s: StreakInput): number {
  const dates = [...s.readDays.keys()].filter((d) => d <= s.today).sort();
  let best = 0;
  let run = 0;
  for (let d = dates[0]; d && d <= s.today; d = addDays(d, 1)) {
    if (d === s.restartedOn || !covered(s, d)) run = 0;
    if (reads(s, d) > 0) run += 1;
    best = Math.max(best, run);
  }
  return best;
}

export function computeStreak(s: StreakInput): StreakState {
  const best = record(s);
  const yesterday = addDays(s.today, -1);
  const restarted = s.restartedOn === s.today;
  const readToday = reads(s, s.today);
  const yesterdayHolds = covered(s, yesterday) && !restarted;

  if (!yesterdayHolds && !restarted) {
    const saved = chainEndingOn(s, addDays(s.today, -2));
    if (saved > 0) {
      const week = mondayOf(yesterday);
      const restAvailable = ![...s.restDays].some((d) => d >= week && d < addDays(week, 7));
      const needed = readToday >= 1 ? 1 : 2;
      return { kind: "rescue", days: saved, record: best, needed, missed: yesterday, restAvailable };
    }
  }

  if (readToday > 0) return { kind: "done", days: chainEndingOn(s, s.today), record: best };
  return { kind: "today", days: yesterdayHolds ? chainEndingOn(s, yesterday) : 0, record: best };
}

/** Monday to Sunday of the current week, each day marked for the week strip. */
export function weekStrip(s: StreakInput): { date: string; mark: DayMark }[] {
  const monday = mondayOf(s.today);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i);
    return { date, mark: markOf(s, date) };
  });
}

function markOf(s: StreakInput, date: string): DayMark {
  if (date > s.today) return "future";
  if (reads(s, date) > 0) return "read";
  if (date === s.today) return "today";
  if (s.restDays.has(date)) return "rest";
  return covered(s, date) ? "rekindled" : "missed";
}

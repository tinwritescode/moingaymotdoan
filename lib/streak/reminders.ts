import { messagesFor, type Locale } from "../i18n";
import { addDays, type StreakState } from "./streak";

/** One device subscribed to reminders, as the server stores it. */
export type PushRow = {
  endpoint: string;
  p256dh: string;
  auth: string;
  /** IANA time zone, e.g. Asia/Ho_Chi_Minh. */
  tz: string;
  remindHour: number;
  locale: Locale;
  /** The last day the device's streak covered (read, rested or rekindled), local date. */
  lastReadDate: string | null;
  streak: number;
  /** Local date of the last notification, so a day gets at most one. */
  lastSentDate: string | null;
};

export type ReminderPayload = { title: string; body: string; url: string; tag: "streak" };

const RESCUE_FROM_MINUTES = 8 * 60;

/** Local calendar date and minutes past midnight at `now` in `tz`. */
export function localClock(now: Date, tz: string): { date: string; minutes: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

/** The notification this device should get now, if any; `date` is the local day to record as sent. */
export function decideReminder(row: PushRow, now: Date): { date: string; payload: ReminderPayload } | null {
  const { date, minutes } = localClock(now, row.tz);
  if (row.lastSentDate === date || row.lastReadDate === date) return null;
  const t = messagesFor(row.locale).streak;
  const url = row.locale === "en" ? "/en" : "/";
  const send = (m: { title: string; body: string }) => ({ date, payload: { ...m, url, tag: "streak" as const } });

  if (row.streak > 0 && row.lastReadDate === addDays(date, -2) && minutes >= RESCUE_FROM_MINUTES) {
    return send(t.notifyRescue(row.streak));
  }
  if (minutes < row.remindHour * 60) return null;
  return send(row.streak > 0 && row.lastReadDate === addDays(date, -1) ? t.notifyAtRisk(row.streak) : t.notifyStart);
}

/** What a device tells the server about its streak: the last day the streak covers and its length. */
export function reportFor(state: StreakState, today: string): Pick<PushRow, "lastReadDate" | "streak"> {
  switch (state.kind) {
    case "done":
      return { lastReadDate: today, streak: state.days };
    case "today":
      return { lastReadDate: state.days > 0 ? addDays(today, -1) : null, streak: state.days };
    case "rescue":
      return { lastReadDate: addDays(today, -2), streak: state.days };
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}

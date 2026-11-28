import { isDateKey, isRemindHour } from "./marks";
import type { PushRow } from "./reminders";

/** What a device sends on opt-in, on a time change and whenever its streak moves. */
export type SubscriptionPayload = Omit<PushRow, "lastSentDate">;

/** Push services of Chrome/Edge/Android, Firefox, Safari and Windows. Nothing else is ever posted to. */
const PUSH_HOST_RE =
  /^(?:fcm\.googleapis\.com|android\.googleapis\.com|[a-z0-9-]+\.push\.services\.mozilla\.com|[a-z0-9.-]*push\.apple\.com|[a-z0-9-]+\.notify\.windows\.com)$/u;
const KEY_RE = /^[A-Za-z0-9_-]{16,200}={0,2}$/u;

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const isKey = (v: unknown): v is string => typeof v === "string" && KEY_RE.test(v);

export function isPushEndpoint(v: unknown): v is string {
  if (typeof v !== "string" || v.length > 1000) return false;
  try {
    const url = new URL(v);
    return url.protocol === "https:" && PUSH_HOST_RE.test(url.hostname);
  } catch {
    return false;
  }
}

function isTimeZone(v: unknown): v is string {
  if (typeof v !== "string" || v.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en", { timeZone: v });
    return true;
  } catch {
    return false;
  }
}

/** Parses PUT /push/subscription. Null for anything the server should not store. */
export function parseSubscriptionPayload(body: unknown): SubscriptionPayload | null {
  if (!isRecord(body) || !isRecord(body.subscription) || !isRecord(body.subscription.keys)) return null;
  const { endpoint, keys } = body.subscription;
  const { tz, remindHour, locale, lastReadDate, streak } = body;
  if (!isPushEndpoint(endpoint) || !isKey(keys.p256dh) || !isKey(keys.auth) || !isTimeZone(tz)) return null;
  if (!isRemindHour(remindHour)) return null;
  if (locale !== "vi" && locale !== "en") return null;
  if (lastReadDate !== null && !isDateKey(lastReadDate)) return null;
  if (!Number.isInteger(streak) || Number(streak) < 0 || Number(streak) > 100_000) return null;
  return {
    endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
    tz,
    remindHour,
    locale,
    lastReadDate,
    streak: Number(streak),
  };
}

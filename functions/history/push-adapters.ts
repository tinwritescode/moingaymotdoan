import webpush from "web-push";
import { isLocale, type Locale } from "../../lib/i18n";
import type { PushRow, PushSender, PushStore } from "../../lib/streak/reminders";
import type { PrismaClient } from "./generated/prisma/client";
import { listDuePushSubscriptions } from "./generated/prisma/sql";
import { fromDateKey, toDateKey } from "./postgres-repository";

/** The database's CHECK allows only vi and en; anything else means a broken table, not bad input. */
function toLocale(locale: string): Locale {
  if (isLocale(locale)) return locale;
  throw new Error(`Unknown locale in database: ${locale}`);
}

const dateOrNull = (key: string | null) => (key === null ? null : fromDateKey(key));

/** Postgres implementation of the PushStore seam, through Prisma. */
export function createPostgresPushStore(prisma: PrismaClient): PushStore {
  return {
    async upsert(row) {
      const fields = {
        p256dh: row.p256dh,
        auth: row.auth,
        tz: row.tz,
        remindHour: row.remindHour,
        locale: row.locale,
        lastReadDate: dateOrNull(row.lastReadDate),
        streak: row.streak,
      };
      // lastSentDate is left out of `update`, so a re-subscribed device keeps today's claim.
      await prisma.pushSubscription.upsert({
        where: { endpoint: row.endpoint },
        create: { endpoint: row.endpoint, ...fields },
        update: fields,
      });
    },
    async remove(endpoint) {
      await prisma.pushSubscription.deleteMany({ where: { endpoint } });
    },
    async listDue(now, after, limit) {
      const rows = await prisma.$queryRawTyped(listDuePushSubscriptions(now, after, limit));
      return rows.map(
        (r): PushRow => ({
          endpoint: r.endpoint,
          p256dh: r.p256dh,
          auth: r.auth,
          tz: r.tz,
          remindHour: r.remind_hour,
          locale: toLocale(r.locale),
          lastReadDate: r.last_read_date === null ? null : toDateKey(r.last_read_date),
          streak: r.streak,
          lastSentDate: r.last_sent_date === null ? null : toDateKey(r.last_sent_date),
        }),
      );
    },
    async claim(endpoint, date) {
      const day = fromDateKey(date);
      const { count } = await prisma.pushSubscription.updateMany({
        where: { endpoint, OR: [{ lastSentDate: null }, { lastSentDate: { not: day } }] },
        data: { lastSentDate: day },
      });
      return count === 1;
    },
  };
}

export type VapidKeys = { subject: string; publicKey: string; privateKey: string };

export function createWebPushSender(vapid: VapidKeys): PushSender {
  return async (row, payload) => {
    try {
      await webpush.sendNotification({ endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } }, JSON.stringify(payload), {
        vapidDetails: vapid,
        // A reminder older than four hours is no use.
        TTL: 4 * 60 * 60,
      });
      return "sent";
    } catch (err) {
      return err instanceof webpush.WebPushError && (err.statusCode === 404 || err.statusCode === 410) ? "gone" : "failed";
    }
  };
}

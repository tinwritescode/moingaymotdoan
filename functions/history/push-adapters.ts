import type { Pool } from "pg";
import webpush from "web-push";
import type { Locale } from "../../lib/i18n";
import type { PushRow, PushSender, PushStore } from "../../lib/streak/reminders";

type PushDbRow = {
  endpoint: string;
  p256dh: string;
  auth: string;
  tz: string;
  remind_hour: number;
  locale: Locale;
  last_read_date: string | null;
  streak: number;
  last_sent_date: string | null;
};

const toRow = (r: PushDbRow): PushRow => ({
  endpoint: r.endpoint,
  p256dh: r.p256dh,
  auth: r.auth,
  tz: r.tz,
  remindHour: r.remind_hour,
  locale: r.locale,
  lastReadDate: r.last_read_date,
  streak: r.streak,
  lastSentDate: r.last_sent_date,
});

export function createPostgresPushStore(pool: Pool): PushStore {
  return {
    async upsert(row) {
      await pool.query(
        `INSERT INTO push_subscriptions (endpoint, p256dh, auth, tz, remind_hour, locale, last_read_date, streak)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (endpoint) DO UPDATE SET
           p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth, tz = EXCLUDED.tz, remind_hour = EXCLUDED.remind_hour,
           locale = EXCLUDED.locale, last_read_date = EXCLUDED.last_read_date, streak = EXCLUDED.streak, updated_at = now()`,
        [row.endpoint, row.p256dh, row.auth, row.tz, row.remindHour, row.locale, row.lastReadDate, row.streak],
      );
    },
    async remove(endpoint) {
      await pool.query("DELETE FROM push_subscriptions WHERE endpoint = $1", [endpoint]);
    },
    async list() {
      const { rows } = await pool.query<PushDbRow>(
        `SELECT endpoint, p256dh, auth, tz, remind_hour, locale,
                to_char(last_read_date, 'YYYY-MM-DD') AS last_read_date, streak,
                to_char(last_sent_date, 'YYYY-MM-DD') AS last_sent_date
         FROM push_subscriptions`,
      );
      return rows.map(toRow);
    },
    async claim(endpoint, date) {
      const { rowCount } = await pool.query(
        `UPDATE push_subscriptions SET last_sent_date = $2
         WHERE endpoint = $1 AND last_sent_date IS DISTINCT FROM $2::date`,
        [endpoint, date],
      );
      return rowCount === 1;
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

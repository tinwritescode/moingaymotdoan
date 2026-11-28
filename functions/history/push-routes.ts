import { parseTrigger } from "@neon/functions/hono";
import { Hono } from "hono";
import { isPushEndpoint, parseSubscriptionPayload } from "../../lib/streak/push-contract";
import { decideReminder, type PushSender, type PushStore } from "../../lib/streak/reminders";

const CRON_PAGE = 100;

export type PushDeps = { store: PushStore; send: PushSender; now?: () => Date };

/**
 * Daily reading reminders. A device is known only by its push endpoint, so there is no
 * sign-in: the endpoint is an unguessable URL the browser hands out, and only push services' hosts are accepted.
 */
export function createPushRoutes(deps: PushDeps) {
  const push = new Hono();

  push.put("/subscription", async (c) => {
    const row = parseSubscriptionPayload(await c.req.json().catch(() => null));
    if (!row) return c.json({ error: "Invalid subscription" }, 400);
    await deps.store.upsert(row);
    return c.body(null, 204);
  });

  push.delete("/subscription", async (c) => {
    const body: unknown = await c.req.json().catch(() => null);
    const endpoint = typeof body === "object" && body !== null && "endpoint" in body ? body.endpoint : null;
    if (!isPushEndpoint(endpoint)) return c.json({ error: "Invalid endpoint" }, 400);
    await deps.store.remove(endpoint);
    return c.body(null, 204);
  });

  // Called by the "streak-reminders" schedule trigger (neon.ts); parseTrigger rejects anyone else.
  push.post("/cron", async (c) => {
    await parseTrigger(c);
    const now = deps.now?.() ?? new Date();
    let checked = 0;
    let sent = 0;
    let gone = 0;
    // One page at a time, so at most CRON_PAGE sends are in flight.
    for (let after: string | null = null; ; ) {
      const rows = await deps.store.listDue(now, after, CRON_PAGE);
      checked += rows.length;
      await Promise.all(
        rows.map(async (row) => {
          const due = decideReminder(row, now);
          if (!due || !(await deps.store.claim(row.endpoint, due.date))) return;
          const result = await deps.send(row, due.payload);
          if (result === "sent") sent++;
          if (result === "gone") {
            gone++;
            await deps.store.remove(row.endpoint);
          }
        }),
      );
      if (rows.length < CRON_PAGE) break;
      after = rows[rows.length - 1].endpoint;
    }
    return c.json({ checked, sent, gone });
  });

  return push;
}

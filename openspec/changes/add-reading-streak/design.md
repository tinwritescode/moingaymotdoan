# Design

## Context

- Reading history already exists: `lib/history` (engine, types), synced to the Neon function `history` for signed-in readers and kept in `localStorage` for guests. Each chapter visit writes a `ReadingLog` with the reader's local `readDate`. That date is all the streak rules need.
- The site is a static Solid 2 build. The only server is the Neon function. A service worker exists (`src/sw.js`).
- Designs: the Claude Design canvas from this session (screens Main, AtRisk, Rescue, Done, ShareCard, ShareStory, Flames) and the 24 Lottie files made from it.

## Goals / Non-Goals

**Goals:**
- One pure module owns every streak rule, used by the home card, the done sheet, the share card and the stats tiles.
- Reminders work for guests, with no account.

**Non-Goals:**
- Leaderboards, friends, or streaks for mood guides.
- Server-side computation of the streak from `reading_logs`.

## Decisions

### Derive the streak; store only what cannot be derived
The streak, the rescue state, rekindled days and the record are all computed from the logs' read dates. Only two facts are stored, because the logs cannot hold them: the rest days and the date of the last "start over". Both are stored in `localStorage` under `kt:streak:v1`, with the reminder hour. For a signed-in reader they also live in a `streak_marks` row per user (`GET` and `PUT /history/streak`, behind the same auth as the history). Copies merge, never overwrite: every rest day is kept (the first of a week when two devices rested apart), the later restart wins, and the reminder hour comes from the side being merged in. Signing in pulls the server copy first, so its hour wins there; each later local change is pushed. The server merges under a row lock, so two devices pushing at once both keep their rest days.
- *Alternative*: store a streak counter and update it on each read. It drifts from the history when logs are deleted or synced, and needs repair code.
- Rekindling needs no "I'm rekindling" flag: reading 2 đoạn the day after a miss is the rule itself. Running it twice gives the same answer.

### Pure rules in `lib/streak/`
- `streak.ts`: `computeStreak({ readDays, restDays, restartedOn, today })` returns a discriminated union `none | today | done | rescue` with the count, the record, and the week strip. `readDays` maps each date to the number of distinct đoạn read that day.
- `flames.ts`: the milestones, `flameFor(days)`, `nextMilestone(days)`, and each flame's static SVG markup (64×64 viewBox, the same drawings the Lottie files were made from).
- `reminders.ts`: `decideReminder({ row, now })` decides which notification to send, if any, and with what text. The Neon function calls it, and it is tested without a database.
- `computeReadingStats().streak` delegates to `computeStreak`, so the stats tiles and the card always agree.

### UI
- `StreakProvider` (Solid context) reads the history context and the stored rest and restart facts, ticks a clock each minute so 21:00 and midnight change the state, and exposes the state and its actions (`rest`, `restart`).
- `StreakCard` on the home page renders the four states. `DoneSheet` on the chapter page uses a native `<dialog>`, which gives focus trapping and Esc to close.
- `Flame` renders the static SVG first. In the browser it imports `lottie-web/build/player/lottie_light` (the SVG-only player) and plays the right file from `/lottie/`. It skips this when `prefers-reduced-motion: reduce` is set or the import fails.
- At 21:00 the card switches to At risk. The hour is the reader's reminder time when they have subscribed, and 21:00 otherwise.

### Share card on a canvas
`drawShareCard({ size, days, flame, last30, date, locale })` draws on a 2D canvas. The flame is drawn from its SVG as an `Image`, and the text waits for `document.fonts.ready`. The page then calls `navigator.share({ files })` when `navigator.canShare({ files })` is true, and otherwise downloads the PNG through an object URL.
- *Alternative*: an HTML-to-image library. It adds a dependency and is fragile with web fonts.

### Web Push
- Table `push_subscriptions(endpoint PK, p256dh, auth, tz, remind_hour, locale, last_read_date, streak, last_sent_date, created_at, updated_at)`. It has no user id: the endpoint is the identity, and guests can subscribe.
- A single `PUT /push/subscription` upserts the subscription and the device's latest `lastReadDate` and `streak`, for opt-in, time change and read reports alike. `DELETE /push/subscription` takes `{ endpoint }`. Neither needs auth: knowing an endpoint is the capability, and endpoints are only accepted on known push hosts, so the function cannot be made to post elsewhere.
- `POST /push/cron` is called by a Neon schedule trigger (`*/15 * * * *`) and checked with `parseTrigger` from `@neon/functions/hono`, because the platform strips `x-neon-*` headers from public callers. It loads the subscriptions not sent today, sends what `decideReminder` returns through `web-push` (VAPID), records `last_sent_date`, and deletes rows the push service answers 404 or 410 for.
- The function enables the push routes only when the VAPID env is set. The site shows the opt-in only when `VITE_VAPID_PUBLIC_KEY` is set.
- Payload: `{ title, body, url, tag: "streak" }`. The service worker shows it with `/icon-192.png`, and on a click it focuses or opens `url`.
- *Alternatives rejected*: Notification Triggers (abandoned), Periodic Background Sync (Chromium only and not on iOS), and silent push followed by a local check (browsers require every push to show a notification).

### Lottie assets
The 24 JSON files go in `public/lottie/`, and their generator in `scripts/flame-lottie.cjs`. Vite copies `public/` to `dist/client`, and the service worker caches `/lottie/` cache-first with the data cache.

## Risks / Trade-offs

- [Guests keep marks on one device] → Only signed-in readers sync; a guest's marks join the account when they sign in. Another device sees a change on its next page load, not live.
- [Two devices rest on different days of one offline week] → The merge keeps the first; the other day turns back into a miss. Rare, and the rule stays one rest day a week.
- [Opening a đoạn counts as reading it, after 0.5 s] → It is the history's existing rule. The done sheet celebrates the explicit "mark complete" instead.
- [The server trusts the device's streak] → It is only used for notification text. Lying only changes the reader's own notification.
- [iOS push needs the installed app, iOS 16.4+] → The card says so and links to `/cai-dat`.
- [lottie-web adds about 60 KB gzipped] → It is imported dynamically, only in the browser, only when a flame is on screen and motion is allowed.

## Migration Plan

1. `pnpm db:migrate` adds `push_subscriptions`. It is additive.
2. Generate the VAPID keys (`npx web-push generate-vapid-keys`), set `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` and `VAPID_SUBJECT` on the function and `VITE_VAPID_PUBLIC_KEY` in Vercel, then `neon deploy` (the function and the trigger).
3. Deploy the site.

Rollback: disable the trigger (`neon triggers disable`) and unset `VITE_VAPID_PUBLIC_KEY`. The streak UI has no server dependency.

# 07: Daily reading reminders (Web Push)

**What to build:** A reader opts in under the streak card ("Nhắc tôi lúc 21:00"), picks an hour between 06:00 and 23:00, or turns reminders off. At that hour, if today is not read, they get a notification that the streak goes out at midnight (or an invitation to start, without a streak); the morning after a miss, from 08:00, they get the rescue reminder. At most one a local day, none once today is read. Tapping opens the site. On an iPhone outside the installed app, the card points to the install guide. No sign-in: a device is known by its push endpoint.

**Blocked by:** 01

**Status:** done

- [x] Subscribe / change hour / unsubscribe from the card; the device keeps the server's copy of its streak current from any page
- [x] Server accepts only known push-service endpoints; validates time zone, hour, language, date, streak
- [x] Schedule trigger every 15 minutes; a day is claimed before sending, so overlapping runs never send twice; 404/410 deletes the subscription
- [x] Push routes exist only when the VAPID keys are set
- [x] Service worker shows the notification and opens only this site
- [x] Tests: decision rules, contract, routes with in-memory store, Postgres store against a local DB, service worker, controls

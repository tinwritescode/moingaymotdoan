# 11: Page through subscriptions in the reminder cron

**What to build:** The reminder cron keeps working as subscribers grow. Today each run loads every subscription and sends all at once; past tens of thousands of devices it should read in pages, skip devices already sent or read today in the query, and cap concurrent sends.

**Blocked by:** 09

**Status:** done

- [x] Rows read in pages; already-sent and already-read rows filtered before decision
- [x] Concurrent sends capped
- [x] A run with many rows finishes well within the 15-minute interval (pages of 100 sent together; 10,000 due devices at ~0.3 s a page is under a minute)

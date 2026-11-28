# 10: Sync rest days and restarts across devices

**What to build:** A signed-in reader who rests or restarts on one device sees the same streak on their other devices. Today these marks live only on the device, so a phone and a laptop can disagree. Store them with the cloud reading history for signed-in readers; guests keep the device copy, merged in on sign-in.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] Rest days, restart date and reminder hour saved per user on the server
- [ ] Guest marks merged on sign-in without losing a rest day
- [ ] Two devices show the same streak after a rest on one

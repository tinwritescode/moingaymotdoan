# 09: Turn reminders on in production

**What to build:** Real readers can opt in and receive reminders. Generate a VAPID key pair; set the public key in the site's build env and all three VAPID values on the history function; apply the schema (push_subscriptions) to the Neon branch; deploy the function with the streak-reminders trigger; subscribe from a real phone and receive one reminder.

**Blocked by:** 07

**Status:** ready-for-human (needs secrets and production access)

- [ ] VAPID keys generated and stored as secrets, private key never committed
- [ ] Table migrated on Neon; migration re-run is a no-op
- [ ] Trigger listed and firing every 15 minutes
- [ ] One real notification received on Android/desktop and on an installed iPhone app

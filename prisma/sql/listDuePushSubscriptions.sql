-- One page of devices after endpoint $2 (null: from the start), leaving out those already sent
-- or read on their own local day at $1.
-- @param {DateTime} $1:now
-- @param {String} $2:after?
-- @param {Int} $3:limit
SELECT endpoint, p256dh, auth, tz, remind_hour, locale, last_read_date, streak, last_sent_date
FROM push_subscriptions
WHERE ($2::text IS NULL OR endpoint > $2)
  AND last_sent_date IS DISTINCT FROM ($1::timestamptz AT TIME ZONE tz)::date
  AND last_read_date IS DISTINCT FROM ($1::timestamptz AT TIME ZONE tz)::date
ORDER BY endpoint
LIMIT $3;

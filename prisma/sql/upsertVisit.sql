-- One visit: upserts the đoạn's progress and that day's log in one statement.
-- A sync ($10 true) keeps the larger read count; a live visit adds one.
-- @param {String} $1:userId
-- @param {String} $2:kind
-- @param {String} $3:itemKey
-- @param {String} $4:bookSlug?
-- @param {Int} $5:chapter?
-- @param {String} $6:title
-- @param {String} $7:subtitle
-- @param {DateTime} $8:readAt
-- @param {Boolean} $9:completed
-- @param {Boolean} $10:isSync
-- @param {DateTime} $11:readDate
-- @param {Int} $12:readCount
WITH p AS (
  INSERT INTO reading_progress (
    user_id, kind, item_key, book_slug, chapter, title, subtitle,
    first_read_at, last_read_at, read_count, completed, completed_at
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8::timestamptz, $8::timestamptz, $12, $9, CASE WHEN $9 THEN $8::timestamptz ELSE NULL END)
  ON CONFLICT (user_id, kind, item_key) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    first_read_at = LEAST(reading_progress.first_read_at, EXCLUDED.first_read_at),
    last_read_at = GREATEST(reading_progress.last_read_at, EXCLUDED.last_read_at),
    read_count = CASE WHEN $10 THEN GREATEST(reading_progress.read_count, EXCLUDED.read_count) ELSE reading_progress.read_count + 1 END,
    completed = reading_progress.completed OR EXCLUDED.completed,
    completed_at = COALESCE(reading_progress.completed_at, EXCLUDED.completed_at)
  RETURNING *
),
l AS (
  INSERT INTO reading_logs (user_id, kind, item_key, book_slug, chapter, title, subtitle, read_date, read_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $11::date, $8::timestamptz)
  ON CONFLICT (user_id, kind, item_key, read_date) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    read_at = GREATEST(reading_logs.read_at, EXCLUDED.read_at)
  RETURNING *
)
SELECT p.kind, p.item_key, p.book_slug, p.chapter, p.title, p.subtitle,
       p.first_read_at, p.last_read_at, p.read_count, p.completed, p.completed_at,
       l.id AS log_id, l.title AS log_title, l.subtitle AS log_subtitle, l.read_date, l.read_at
FROM p, l;

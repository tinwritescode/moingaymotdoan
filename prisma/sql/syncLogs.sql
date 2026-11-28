-- A batch of daily logs from a device sync, deduplicated by aggregateSyncBatch.
-- $2 is {rows: [...]}, each row {kind, item_key, book_slug, chapter, title, subtitle, read_date, read_at}.
-- @param {String} $1:userId
-- @param {Json} $2:rows
INSERT INTO reading_logs (user_id, kind, item_key, book_slug, chapter, title, subtitle, read_date, read_at)
SELECT $1, u.kind, u.item_key, u.book_slug, u.chapter, u.title, u.subtitle, u.read_date, u.read_at
FROM jsonb_to_recordset($2::jsonb -> 'rows') AS u(
  kind text, item_key text, book_slug text, chapter int, title text, subtitle text, read_date date, read_at timestamptz
)
ON CONFLICT (user_id, kind, item_key, read_date) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  read_at = GREATEST(reading_logs.read_at, EXCLUDED.read_at);

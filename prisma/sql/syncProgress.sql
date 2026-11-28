-- A batch of progress rows from a device sync, deduplicated by aggregateSyncBatch.
-- $2 is {rows: [...]}, each row {kind, item_key, book_slug, chapter, title, subtitle,
-- first_read_at, last_read_at, read_count, completed, completed_at}.
-- @param {String} $1:userId
-- @param {Json} $2:rows
INSERT INTO reading_progress (
  user_id, kind, item_key, book_slug, chapter, title, subtitle,
  first_read_at, last_read_at, read_count, completed, completed_at
)
SELECT $1, u.kind, u.item_key, u.book_slug, u.chapter, u.title, u.subtitle,
       u.first_read_at, u.last_read_at, u.read_count, u.completed, u.completed_at
FROM jsonb_to_recordset($2::jsonb -> 'rows') AS u(
  kind text, item_key text, book_slug text, chapter int, title text, subtitle text,
  first_read_at timestamptz, last_read_at timestamptz, read_count int, completed boolean, completed_at timestamptz
)
ON CONFLICT (user_id, kind, item_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  first_read_at = LEAST(reading_progress.first_read_at, EXCLUDED.first_read_at),
  last_read_at = GREATEST(reading_progress.last_read_at, EXCLUDED.last_read_at),
  read_count = GREATEST(reading_progress.read_count, EXCLUDED.read_count),
  completed = reading_progress.completed OR EXCLUDED.completed,
  completed_at = COALESCE(reading_progress.completed_at, EXCLUDED.completed_at);

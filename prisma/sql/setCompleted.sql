-- Marks a đoạn complete (keeping the first completion time) or not; no row when the đoạn was never read.
-- @param {String} $1:userId
-- @param {String} $2:kind
-- @param {String} $3:itemKey
-- @param {Boolean} $4:completed
UPDATE reading_progress
SET completed = $4,
    completed_at = CASE WHEN $4 THEN COALESCE(completed_at, now()) ELSE NULL END
WHERE user_id = $1 AND kind = $2 AND item_key = $3
RETURNING kind, item_key, book_slug, chapter, title, subtitle,
          first_read_at, last_read_at, read_count, completed, completed_at;

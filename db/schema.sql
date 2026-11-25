-- Schema cho tính năng lịch sử đọc Kinh Thánh & theo cảm xúc.
-- Chạy qua kết nối trực tiếp (DATABASE_URL_UNPOOLED): node scripts/db-migrate.mjs

CREATE TABLE IF NOT EXISTS reading_progress (
  user_id       text        NOT NULL,
  kind          text        NOT NULL CHECK (kind IN ('chapter', 'mood')),
  item_key      text        NOT NULL,
  book_slug     text,
  chapter       integer,
  title         text        NOT NULL,
  subtitle      text        NOT NULL,
  first_read_at timestamptz NOT NULL DEFAULT now(),
  last_read_at  timestamptz NOT NULL DEFAULT now(),
  read_count    integer     NOT NULL DEFAULT 1,
  completed     boolean     NOT NULL DEFAULT false,
  completed_at  timestamptz,
  PRIMARY KEY (user_id, kind, item_key)
);

CREATE INDEX IF NOT EXISTS reading_progress_user_last_read_idx
  ON reading_progress (user_id, last_read_at DESC);

CREATE TABLE IF NOT EXISTS reading_logs (
  id        bigserial   PRIMARY KEY,
  user_id   text        NOT NULL,
  kind      text        NOT NULL CHECK (kind IN ('chapter', 'mood')),
  item_key  text        NOT NULL,
  book_slug text,
  chapter   integer,
  title     text        NOT NULL,
  subtitle  text        NOT NULL,
  read_date date        NOT NULL,
  read_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind, item_key, read_date)
);

CREATE INDEX IF NOT EXISTS reading_logs_user_date_idx
  ON reading_logs (user_id, read_date DESC, read_at DESC);

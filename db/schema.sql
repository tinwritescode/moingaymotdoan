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

-- Lời nhắc đọc (Web Push). Thiết bị được nhận diện bằng endpoint, không cần đăng nhập.
CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint       text        PRIMARY KEY,
  p256dh         text        NOT NULL,
  auth           text        NOT NULL,
  tz             text        NOT NULL,
  remind_hour    integer     NOT NULL CHECK (remind_hour BETWEEN 6 AND 23),
  locale         text        NOT NULL CHECK (locale IN ('vi', 'en')),
  last_read_date date,
  streak         integer     NOT NULL DEFAULT 0 CHECK (streak >= 0),
  last_sent_date date,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

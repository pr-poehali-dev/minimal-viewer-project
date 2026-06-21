CREATE TABLE IF NOT EXISTS t_p37606192_minimal_viewer_proje.media (
  id          SERIAL PRIMARY KEY,
  type        VARCHAR(10) NOT NULL,
  url         TEXT NOT NULL,
  title       TEXT NOT NULL,
  category    TEXT NOT NULL,
  muted       BOOLEAN DEFAULT TRUE,
  likes       INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p37606192_minimal_viewer_proje.comments (
  id         SERIAL PRIMARY KEY,
  media_id   INTEGER NOT NULL,
  author     TEXT NOT NULL DEFAULT 'Гость',
  text       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p37606192_minimal_viewer_proje.likes (
  id         SERIAL PRIMARY KEY,
  media_id   INTEGER NOT NULL,
  session_id TEXT NOT NULL
);
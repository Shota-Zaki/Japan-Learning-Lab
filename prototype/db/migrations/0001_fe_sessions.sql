CREATE TABLE IF NOT EXISTS fe_sessions (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  status TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  started_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_fe_sessions_device_updated
ON fe_sessions(device_id, updated_at DESC);

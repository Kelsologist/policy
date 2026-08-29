-- Stores policy acceptance tracking at signup/consent time.
CREATE TABLE IF NOT EXISTS policy_acceptance_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  policy_key TEXT NOT NULL,
  accepted_version TEXT NOT NULL,
  accepted_at_utc TEXT NOT NULL,
  acceptance_source TEXT NOT NULL,
  created_at_utc TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_policy_acceptance_user
  ON policy_acceptance_events (user_id);

CREATE INDEX IF NOT EXISTS idx_policy_acceptance_lookup
  ON policy_acceptance_events (policy_key, accepted_version);

-- Phase 1 request intake for access/export/deletion rights.
CREATE TABLE IF NOT EXISTS data_rights_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  email TEXT NOT NULL,
  request_type TEXT NOT NULL,
  status TEXT NOT NULL,
  intake_channel TEXT NOT NULL,
  requested_at_utc TEXT NOT NULL,
  due_at_utc TEXT,
  completed_at_utc TEXT,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_data_rights_requests_status
  ON data_rights_requests (status);

CREATE INDEX IF NOT EXISTS idx_data_rights_requests_user
  ON data_rights_requests (user_id);

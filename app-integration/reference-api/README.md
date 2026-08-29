# Policy Reference API

This is a dependency-free reference API implementation that integrates policy files from this repository into an existing app backend.

## Start
```bash
cd /home/runner/work/policy/policy/app-integration/reference-api
node server.mjs
```

Default server URL: `http://localhost:8787`

## Implemented endpoints

### Public policy content routes
- `GET /privacy`
- `GET /terms`
- `GET /data-deletion`
- `GET /cookies`

Returns raw markdown from mapped files in:
- `/home/runner/work/policy/policy/policies/public/`

### Policy metadata
- `GET /api/policies/metadata`

Returns: `policy_key`, `route`, `policy_version`, `last_updated`.

### Acceptance tracking
- `POST /api/policies/acceptance`

Body:
- `user_id`
- `policy_key`
- `accepted_version`
- `accepted_at_utc`
- `acceptance_source`

Persistence store:
- `/home/runner/work/policy/policy/app-integration/reference-api/data/policy_acceptance_events.jsonl`

### Consent re-acceptance check
- `GET /api/policies/consent-status?user_id=<id>`

Compares accepted versions for `privacy` and `terms` against current manifest versions.

### Data rights request intake (phase 1)
- `POST /api/data-rights-requests`

Body:
- `email` (required)
- `user_id` (optional)
- `request_type` (required)
- `intake_channel` (required)
- `requested_at_utc` (required)
- `status` (default: `open`)
- `due_at_utc`, `completed_at_utc`, `notes` (optional)

Persistence store:
- `/home/runner/work/policy/policy/app-integration/reference-api/data/data_rights_requests.jsonl`

### Admin/support request operations
- `GET /api/admin/data-rights-requests`
- `GET /api/admin/data-rights-requests?status=open`
- `PATCH /api/admin/data-rights-requests/:id`

Patch fields:
- `status` (`open`, `in_progress`, `completed`, `rejected`)
- `due_at_utc`
- `completed_at_utc`
- `notes`

### URL stability
- Startup validation ensures manifest route mappings match `/home/runner/work/policy/policy/POLICY_INDEX.md`.
- Legacy redirects are included:
  - `/privacy-policy` -> `/privacy`
  - `/terms-of-service` -> `/terms`
  - `/delete-data` -> `/data-deletion`

## Notes
- DB schema source is still available at `/home/runner/work/policy/policy/app-integration/sql/policy_acceptance_schema.sql`.
- Replace JSONL persistence with your production database implementation.

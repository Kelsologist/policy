# API Templates

This directory contains reusable REST API templates. Each template describes the endpoints, request/response shapes, and common error codes for a typical API category.

---

## Templates

| File | Description |
|------|-------------|
| [crud-resource.md](./crud-resource.md) | Standard CRUD operations for any resource (list, get, create, update, delete) |
| [auth-api.md](./auth-api.md) | Authentication flows: register, login, refresh token, logout, forgot/reset password |
| [search-api.md](./search-api.md) | Search and filtering endpoints with pagination and sort support |
| [file-upload-api.md](./file-upload-api.md) | Single and batch file upload, download, and metadata management |
| [webhook-api.md](./webhook-api.md) | Webhook subscription management and delivery payload format |

---

## Conventions

- All endpoints are versioned under `/api/v1/`.
- Requests and responses use `application/json` unless otherwise stated.
- Protected endpoints require `Authorization: ******` header.
- Dates are ISO 8601 strings (e.g. `2024-06-01T12:00:00Z`).
- Errors follow a consistent shape:
  ```json
  {
    "error": {
      "code": "ERROR_CODE",
      "message": "Human-readable description"
    }
  }
  ```

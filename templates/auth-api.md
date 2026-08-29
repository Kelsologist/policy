# Authentication API Template

Use this template for login, logout, token refresh, and account management flows.

---

## Base URL

```
/api/v1/auth
```

---

## Endpoints

### Register

**POST** `/api/v1/auth/register`

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "string (min 8 chars)",
  "name": "string"
}
```

**Response `201 Created`:**
```json
{
  "data": {
    "user": {
      "id": "string",
      "email": "user@example.com",
      "name": "string",
      "created_at": "ISO 8601 timestamp"
    },
    "access_token": "JWT string",
    "refresh_token": "string",
    "expires_in": 3600
  }
}
```

**Response `409 Conflict`:**
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Email already registered"
  }
}
```

---

### Login

**POST** `/api/v1/auth/login`

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "user": {
      "id": "string",
      "email": "user@example.com",
      "name": "string"
    },
    "access_token": "JWT string",
    "refresh_token": "string",
    "expires_in": 3600
  }
}
```

**Response `401 Unauthorized`:**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid email or password"
  }
}
```

---

### Refresh token

**POST** `/api/v1/auth/refresh`

**Request body:**
```json
{
  "refresh_token": "string"
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "access_token": "JWT string",
    "refresh_token": "string",
    "expires_in": 3600
  }
}
```

**Response `401 Unauthorized`:**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired refresh token"
  }
}
```

---

### Logout

**POST** `/api/v1/auth/logout`

**Headers:**
```
Authorization: ******
```

**Response `204 No Content`:** *(empty body, refresh token is revoked)*

---

### Get current user

**GET** `/api/v1/auth/me`

**Headers:**
```
Authorization: ******
```

**Response `200 OK`:**
```json
{
  "data": {
    "id": "string",
    "email": "user@example.com",
    "name": "string",
    "created_at": "ISO 8601 timestamp",
    "updated_at": "ISO 8601 timestamp"
  }
}
```

---

### Forgot password

**POST** `/api/v1/auth/forgot-password`

**Request body:**
```json
{
  "email": "user@example.com"
}
```

**Response `200 OK`:** *(always 200 to avoid email enumeration)*
```json
{
  "data": {
    "message": "If an account with that email exists, a reset link has been sent."
  }
}
```

---

### Reset password

**POST** `/api/v1/auth/reset-password`

**Request body:**
```json
{
  "token": "reset token from email",
  "password": "new password (min 8 chars)"
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "message": "Password reset successfully"
  }
}
```

**Response `400 Bad Request`:**
```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid or expired reset token"
  }
}
```

---

## Authentication header

All protected endpoints require:
```
Authorization: ******
```

---

## Common error codes

| HTTP Status | Code          | Description                          |
|-------------|---------------|--------------------------------------|
| 400         | BAD_REQUEST   | Malformed request syntax             |
| 401         | UNAUTHORIZED  | Missing, invalid, or expired token   |
| 403         | FORBIDDEN     | Insufficient permissions             |
| 409         | CONFLICT      | Email already registered             |
| 422         | VALIDATION_ERROR | Request body failed validation    |
| 429         | RATE_LIMITED  | Too many login attempts              |
| 500         | INTERNAL_ERROR| Unexpected server error              |

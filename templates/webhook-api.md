# Webhook API Template

Use this template for endpoints that send or receive webhook notifications.

---

## Base URL

```
/api/v1/webhooks
```

---

## Endpoints

### List webhook subscriptions

**GET** `/api/v1/webhooks`

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "string",
      "url": "https://your-server.com/hook",
      "events": ["resource.created", "resource.updated"],
      "active": true,
      "created_at": "ISO 8601 timestamp"
    }
  ]
}
```

---

### Create a webhook subscription

**POST** `/api/v1/webhooks`

**Request body:**
```json
{
  "url": "https://your-server.com/hook",
  "events": ["resource.created", "resource.updated", "resource.deleted"],
  "secret": "optional shared secret for HMAC signature"
}
```

**Response `201 Created`:**
```json
{
  "data": {
    "id": "string",
    "url": "https://your-server.com/hook",
    "events": ["resource.created", "resource.updated", "resource.deleted"],
    "active": true,
    "secret_hint": "last 4 chars of secret (e.g. abcd)",
    "created_at": "ISO 8601 timestamp"
  }
}
```

---

### Update a webhook subscription

**PATCH** `/api/v1/webhooks/{id}`

**Request body:**
```json
{
  "url": "https://your-server.com/new-hook",
  "events": ["resource.created"],
  "active": false
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "id": "string",
    "url": "https://your-server.com/new-hook",
    "events": ["resource.created"],
    "active": false,
    "updated_at": "ISO 8601 timestamp"
  }
}
```

---

### Delete a webhook subscription

**DELETE** `/api/v1/webhooks/{id}`

**Response `204 No Content`:** *(empty body)*

---

### Test a webhook

**POST** `/api/v1/webhooks/{id}/test`

Sends a test payload to the registered URL.

**Response `200 OK`:**
```json
{
  "data": {
    "delivered": true,
    "response_status": 200,
    "latency_ms": 45
  }
}
```

---

## Webhook payload format

When an event occurs, your registered URL will receive a POST request:

**Headers:**
```
Content-Type: application/json
X-Webhook-Event: resource.created
X-Webhook-Delivery: <unique delivery UUID>
X-Webhook-Signature: sha256=<HMAC-SHA256 hex digest of the payload using your secret>
```

**Payload:**
```json
{
  "id": "unique delivery UUID",
  "event": "resource.created",
  "created_at": "ISO 8601 timestamp",
  "data": {
    "id": "resource ID",
    "field1": "value1"
  }
}
```

---

## Verifying the signature

```python
import hmac, hashlib

def verify_signature(payload_bytes: bytes, secret: str, signature_header: str) -> bool:
    expected = "sha256=" + hmac.new(
        secret.encode(), payload_bytes, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature_header)
```

---

## Event types

| Event                   | Description                          |
|-------------------------|--------------------------------------|
| `resource.created`      | A resource was created               |
| `resource.updated`      | A resource was updated               |
| `resource.deleted`      | A resource was deleted               |

---

## Common error codes

| HTTP Status | Code              | Description                          |
|-------------|-------------------|--------------------------------------|
| 400         | BAD_REQUEST       | Malformed request                    |
| 401         | UNAUTHORIZED      | Missing or invalid authentication    |
| 403         | FORBIDDEN         | Insufficient permissions             |
| 404         | NOT_FOUND         | Webhook not found                    |
| 422         | VALIDATION_ERROR  | Invalid URL or event type            |
| 429         | RATE_LIMITED      | Too many requests                    |
| 500         | INTERNAL_ERROR    | Unexpected server error              |

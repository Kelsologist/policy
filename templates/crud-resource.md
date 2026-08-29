# CRUD Resource API Template

Use this template for any standard resource in your API (e.g., users, products, orders).

---

## Base URL

```
/api/v1/{resource}
```

---

## Endpoints

### List all resources

**GET** `/api/v1/{resource}`

**Query parameters:**
| Parameter | Type    | Required | Description                     |
|-----------|---------|----------|---------------------------------|
| page      | integer | No       | Page number (default: 1)        |
| limit     | integer | No       | Items per page (default: 20)    |
| sort      | string  | No       | Field to sort by                |
| order     | string  | No       | `asc` or `desc` (default: asc)  |

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "string",
      "created_at": "ISO 8601 timestamp",
      "updated_at": "ISO 8601 timestamp"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

---

### Get a single resource

**GET** `/api/v1/{resource}/{id}`

**Path parameters:**
| Parameter | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| id        | string | Yes      | Resource ID      |

**Response `200 OK`:**
```json
{
  "data": {
    "id": "string",
    "created_at": "ISO 8601 timestamp",
    "updated_at": "ISO 8601 timestamp"
  }
}
```

**Response `404 Not Found`:**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

---

### Create a resource

**POST** `/api/v1/{resource}`

**Request body:**
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

**Response `201 Created`:**
```json
{
  "data": {
    "id": "string",
    "field1": "value1",
    "field2": "value2",
    "created_at": "ISO 8601 timestamp",
    "updated_at": "ISO 8601 timestamp"
  }
}
```

**Response `422 Unprocessable Entity`:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "field1",
        "message": "field1 is required"
      }
    ]
  }
}
```

---

### Update a resource (full)

**PUT** `/api/v1/{resource}/{id}`

**Request body:**
```json
{
  "field1": "new_value1",
  "field2": "new_value2"
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "id": "string",
    "field1": "new_value1",
    "field2": "new_value2",
    "created_at": "ISO 8601 timestamp",
    "updated_at": "ISO 8601 timestamp"
  }
}
```

---

### Update a resource (partial)

**PATCH** `/api/v1/{resource}/{id}`

**Request body:**
```json
{
  "field1": "new_value1"
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "id": "string",
    "field1": "new_value1",
    "field2": "unchanged_value2",
    "created_at": "ISO 8601 timestamp",
    "updated_at": "ISO 8601 timestamp"
  }
}
```

---

### Delete a resource

**DELETE** `/api/v1/{resource}/{id}`

**Response `204 No Content`:** *(empty body)*

**Response `404 Not Found`:**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

---

## Common error codes

| HTTP Status | Code              | Description                          |
|-------------|-------------------|--------------------------------------|
| 400         | BAD_REQUEST       | Malformed request syntax             |
| 401         | UNAUTHORIZED      | Missing or invalid authentication    |
| 403         | FORBIDDEN         | Insufficient permissions             |
| 404         | NOT_FOUND         | Resource does not exist              |
| 409         | CONFLICT          | Resource already exists              |
| 422         | VALIDATION_ERROR  | Request body failed validation       |
| 429         | RATE_LIMITED      | Too many requests                    |
| 500         | INTERNAL_ERROR    | Unexpected server error              |

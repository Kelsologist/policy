# Search & Filter API Template

Use this template for endpoints that support querying, filtering, and full-text search over a collection.

---

## Base URL

```
/api/v1/{resource}/search
```

---

## Endpoints

### Search resources

**GET** `/api/v1/{resource}/search`

**Query parameters:**
| Parameter  | Type    | Required | Description                                      |
|------------|---------|----------|--------------------------------------------------|
| q          | string  | No       | Full-text search query                           |
| filter     | string  | No       | Filter expression (see syntax below)             |
| fields     | string  | No       | Comma-separated list of fields to return         |
| page       | integer | No       | Page number (default: 1)                         |
| limit      | integer | No       | Items per page (default: 20, max: 100)           |
| sort       | string  | No       | Field to sort by                                 |
| order      | string  | No       | `asc` or `desc` (default: asc)                   |

**Filter syntax example:**
```
filter=status:active,created_at>2024-01-01
```

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "string",
      "field1": "value1",
      "created_at": "ISO 8601 timestamp"
    }
  ],
  "meta": {
    "query": "search query",
    "page": 1,
    "limit": 20,
    "total": 42,
    "took_ms": 12
  }
}
```

---

### Advanced search (POST)

Use POST when filter expressions are complex or exceed URL length limits.

**POST** `/api/v1/{resource}/search`

**Request body:**
```json
{
  "query": "full-text search string",
  "filters": {
    "status": ["active", "pending"],
    "created_at": {
      "gte": "2024-01-01",
      "lte": "2024-12-31"
    },
    "tags": {
      "contains": ["tag1", "tag2"]
    }
  },
  "fields": ["id", "field1", "field2"],
  "sort": [
    { "field": "created_at", "order": "desc" }
  ],
  "page": 1,
  "limit": 20
}
```

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "string",
      "field1": "value1",
      "field2": "value2",
      "created_at": "ISO 8601 timestamp"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "took_ms": 18
  }
}
```

**Response `422 Unprocessable Entity`:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid filter expression",
    "details": [
      {
        "field": "filters.created_at.gte",
        "message": "Must be a valid ISO 8601 date"
      }
    ]
  }
}
```

---

## Common error codes

| HTTP Status | Code              | Description                          |
|-------------|-------------------|--------------------------------------|
| 400         | BAD_REQUEST       | Malformed query syntax               |
| 401         | UNAUTHORIZED      | Missing or invalid authentication    |
| 403         | FORBIDDEN         | Insufficient permissions             |
| 422         | VALIDATION_ERROR  | Invalid filter or sort expression    |
| 429         | RATE_LIMITED      | Too many requests                    |
| 500         | INTERNAL_ERROR    | Unexpected server error              |

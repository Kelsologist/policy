# File Upload API Template

Use this template for endpoints that handle single or multiple file uploads.

---

## Base URL

```
/api/v1/files
```

---

## Endpoints

### Upload a file

**POST** `/api/v1/files`

**Headers:**
```
Content-Type: multipart/form-data
Authorization: ******
```

**Request body (multipart/form-data):**
| Field       | Type   | Required | Description                        |
|-------------|--------|----------|------------------------------------|
| file        | file   | Yes      | The file to upload                 |
| description | string | No       | Optional description               |
| tags        | string | No       | Comma-separated list of tags       |

**Response `201 Created`:**
```json
{
  "data": {
    "id": "string",
    "filename": "example.pdf",
    "content_type": "application/pdf",
    "size": 204800,
    "url": "https://example.com/files/example.pdf",
    "description": "string",
    "tags": ["tag1", "tag2"],
    "created_at": "ISO 8601 timestamp"
  }
}
```

**Response `413 Payload Too Large`:**
```json
{
  "error": {
    "code": "PAYLOAD_TOO_LARGE",
    "message": "File exceeds the maximum allowed size of 10 MB"
  }
}
```

**Response `415 Unsupported Media Type`:**
```json
{
  "error": {
    "code": "UNSUPPORTED_MEDIA_TYPE",
    "message": "File type not allowed"
  }
}
```

---

### Upload multiple files

**POST** `/api/v1/files/batch`

**Headers:**
```
Content-Type: multipart/form-data
Authorization: ******
```

**Request body (multipart/form-data):**
| Field   | Type   | Required | Description                  |
|---------|--------|----------|------------------------------|
| files[] | file[] | Yes      | One or more files to upload  |

**Response `201 Created`:**
```json
{
  "data": [
    {
      "id": "string",
      "filename": "file1.jpg",
      "content_type": "image/jpeg",
      "size": 51200,
      "url": "https://example.com/files/file1.jpg",
      "created_at": "ISO 8601 timestamp"
    }
  ],
  "meta": {
    "total": 2,
    "succeeded": 2,
    "failed": 0
  }
}
```

---

### Get file metadata

**GET** `/api/v1/files/{id}`

**Response `200 OK`:**
```json
{
  "data": {
    "id": "string",
    "filename": "example.pdf",
    "content_type": "application/pdf",
    "size": 204800,
    "url": "https://example.com/files/example.pdf",
    "description": "string",
    "tags": ["tag1"],
    "created_at": "ISO 8601 timestamp",
    "updated_at": "ISO 8601 timestamp"
  }
}
```

---

### Delete a file

**DELETE** `/api/v1/files/{id}`

**Response `204 No Content`:** *(empty body)*

---

### Download a file

**GET** `/api/v1/files/{id}/download`

**Response `200 OK`:**
```
Content-Type: <file content type>
Content-Disposition: attachment; filename="example.pdf"

<binary file content>
```

---

## Common error codes

| HTTP Status | Code                  | Description                          |
|-------------|-----------------------|--------------------------------------|
| 400         | BAD_REQUEST           | Malformed request                    |
| 401         | UNAUTHORIZED          | Missing or invalid authentication    |
| 403         | FORBIDDEN             | Insufficient permissions             |
| 404         | NOT_FOUND             | File does not exist                  |
| 413         | PAYLOAD_TOO_LARGE     | File exceeds size limit              |
| 415         | UNSUPPORTED_MEDIA_TYPE| File type not allowed                |
| 429         | RATE_LIMITED          | Too many requests                    |
| 500         | INTERNAL_ERROR        | Unexpected server error              |

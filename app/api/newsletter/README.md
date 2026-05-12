# Newsletter API

## POST /api/newsletter
Subscribe an email address.

**Request:**
```json
{ "email": "user@example.com" }
```

**Response:**
```json
{ "success": true }
```
or
```json
{ "success": false, "error": "Already subscribed." }
```

## GET /api/admin/subscribers
List all subscribers (requires admin token).

**Headers:**
```
Authorization: Bearer dev-admin-key
```

**Response:**
```json
{
  "count": 42,
  "subscribers": [
    { "email": "user@example.com", "created_at": "2026-05-12T21:00:00.000Z" }
  ]
}
```

## Database
SQLite database at `data/subscribers.db`.

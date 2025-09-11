---
sidebar_position: 3
---

# Notification Service

The Notification service handles all types of notifications in BudgetControl, including emails, push notifications, and in-app messages.

## Features

- Send contact form emails
- Push notification token management
- In-app messaging system
- Budget alert notifications
- Message history

## API Endpoints

### Contact Form Email

Send emails from the contact form to support or other recipients.

```bash
POST /api/notify/external/email/contact
```

**Request Body:**
```json
{
  "to": "support@example.com",
  "subject": "Support Request",
  "message": "I need help with...",
  "name": "John Doe",
  "email": "john@example.com",
  "privacy": true
}
```

### Push Notification Registration

Register a device token for push notifications.

```bash
POST /api/notify/push/token
```

**Request Body:**
```json
{
  "token": "device-token-here"
}
```

### Send Notification Message

Send an in-app notification message to a specific user.

```bash
POST /api/notify/message
```

**Request Body:**
```json
{
  "to": "user-uuid",
  "message": "Your budget report is ready",
  "date_time_to_send": "2024-01-20T10:00:00Z",
  "active": true
}
```

### Get Latest Messages

Retrieve the most recent notification messages.

```bash
GET /api/notify/message/last
```

### Budget Exceeded Notification

Send an email notification when a budget limit is exceeded.

```bash
POST /api/notify/email/budget/exceeded
```

**Request Body:**
```json
{
  "to": "user@example.com",
  "budget_name": "Monthly Expenses",
  "current_amount": "1200",
  "budget_limit": "1000",
  "currency": "EUR",
  "username": "John Doe"
}
```

## Authentication

All endpoints require:
- Bearer token authentication
- `X-Bc-Token` header with JWT token
- `X-Bc-Ws` header with workspace UUID

Example headers:
```bash
Authorization: Bearer your-jwt-token
X-Bc-Token: your-jwt-token
X-Bc-Ws: workspace-uuid
```

## Message Schema

Messages in the system follow this structure:

```typescript
interface Message {
  id: number;
  uuid: string;
  to: string;          // Recipient UUID
  message: string;     // Message content
  date_time_to_send: string;  // ISO 8601 datetime
  active: boolean;     // Message status
  created_at: string;  // Creation timestamp
  updated_at: string;  // Last update timestamp
}
```

## Best Practices

1. Always validate email addresses before sending
2. Use proper error handling for failed notifications
3. Include meaningful subjects in email notifications
4. Keep messages concise and clear
5. Handle push notification tokens properly

## Error Handling

The service returns standard HTTP status codes:
- 200: Success
- 400: Bad Request (invalid parameters)
- 401: Unauthorized
- 403: Forbidden
- 500: Internal Server Error

## Rate Limiting

To prevent abuse, the notification service implements rate limiting:
- Email: 100 per hour per workspace
- Push notifications: 1000 per hour per workspace
- In-app messages: 500 per hour per workspace
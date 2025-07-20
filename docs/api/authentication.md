---
id: authentication
title: Authentication API
sidebar_label: Authentication
description: Direct HTTP API for PasskeyMe authentication services
---

# 🔌 Authentication API

PasskeyMe provides a comprehensive REST API for authentication operations. While we recommend using our SDKs for most use cases, the direct API is useful for server-side operations, custom integrations, and non-JavaScript environments.

## Base URL

```
Production: https://api.passkeyme.com
Development: https://dev-api.passkeyme.com
```

## Authentication

API requests require authentication using your App ID and API key from the PasskeyMe dashboard.

### API Key Authentication

```http
Authorization: Bearer your-api-key
Content-Type: application/json
```

### App ID Header

```http
X-PasskeyMe-App-ID: your-app-id
```

## Core Endpoints

### Initiate Authentication

Start the authentication process and get a redirect URL.

```http
POST /auth/initiate
```

**Request:**
```json
{
  "redirectUri": "https://yourapp.com/auth/callback",
  "authMethod": "passkey|oauth|password",
  "provider": "google|github|microsoft|apple|discord",
  "state": "custom-state-data"
}
```

**Response:**
```json
{
  "authUrl": "https://auth.passkeyme.com/authenticate/abc123",
  "sessionId": "sess_1234567890",
  "expiresAt": "2024-01-01T12:00:00Z"
}
```

### Handle Callback

Process the authentication callback and get tokens.

```http
POST /auth/callback
```

**Request:**
```json
{
  "code": "auth_code_from_callback",
  "state": "original_state_value",
  "sessionId": "sess_1234567890"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "refresh_token_value",
  "user": {
    "id": "usr_1234567890",
    "email": "user@example.com",
    "emailVerified": true,
    "name": "John Doe",
    "picture": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T10:00:00Z",
    "lastLoginAt": "2024-01-01T12:00:00Z",
    "authMethods": {
      "passkey": true,
      "oauth": ["google"],
      "password": false
    }
  },
  "expiresIn": 3600
}
```

### Refresh Token

Get a new access token using a refresh token.

```http
POST /auth/refresh
```

**Request:**
```json
{
  "refreshToken": "refresh_token_value"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "new_refresh_token_value",
  "expiresIn": 3600
}
```

### Validate Token

Verify and decode an access token.

```http
GET /auth/validate
Authorization: Bearer access_token_here
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "usr_1234567890",
    "email": "user@example.com",
    "emailVerified": true,
    "name": "John Doe"
  },
  "scopes": ["profile", "email"],
  "expiresAt": "2024-01-01T13:00:00Z"
}
```

### Logout

Revoke tokens and end the session.

```http
POST /auth/logout
Authorization: Bearer access_token_here
```

**Request:**
```json
{
  "refreshToken": "refresh_token_to_revoke",
  "allSessions": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

## User Management

### Get User Profile

Retrieve complete user profile information.

```http
GET /users/profile
Authorization: Bearer access_token_here
```

**Response:**
```json
{
  "id": "usr_1234567890",
  "email": "user@example.com",
  "emailVerified": true,
  "name": "John Doe",
  "picture": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-01T10:00:00Z",
  "lastLoginAt": "2024-01-01T12:00:00Z",
  "authMethods": {
    "passkey": true,
    "oauth": ["google", "github"],
    "password": true
  },
  "metadata": {
    "loginCount": 42,
    "lastIpAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
}
```

### Update User Profile

Update user profile information.

```http
PATCH /users/profile
Authorization: Bearer access_token_here
```

**Request:**
```json
{
  "name": "Jane Doe",
  "picture": "https://newavatar.com/avatar.jpg"
}
```

**Response:**
```json
{
  "id": "usr_1234567890",
  "email": "user@example.com",
  "name": "Jane Doe",
  "picture": "https://newavatar.com/avatar.jpg",
  "updatedAt": "2024-01-01T12:30:00Z"
}
```

### Delete User Account

Permanently delete a user account.

```http
DELETE /users/profile
Authorization: Bearer access_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Account successfully deleted"
}
```

## Authentication Methods

### List User Auth Methods

Get all authentication methods for a user.

```http
GET /users/auth-methods
Authorization: Bearer access_token_here
```

**Response:**
```json
{
  "methods": [
    {
      "type": "passkey",
      "id": "passkey_1234",
      "name": "iPhone Touch ID",
      "createdAt": "2024-01-01T10:00:00Z",
      "lastUsed": "2024-01-01T12:00:00Z"
    },
    {
      "type": "oauth",
      "provider": "google",
      "id": "oauth_5678",
      "email": "user@gmail.com",
      "createdAt": "2024-01-01T10:00:00Z",
      "lastUsed": "2024-01-01T11:00:00Z"
    }
  ]
}
```

### Add Authentication Method

Add a new authentication method to user's account.

```http
POST /users/auth-methods
Authorization: Bearer access_token_here
```

**Request:**
```json
{
  "type": "passkey|oauth|password",
  "provider": "google", // for OAuth only
  "redirectUri": "https://yourapp.com/add-auth/callback"
}
```

**Response:**
```json
{
  "authUrl": "https://auth.passkeyme.com/add-method/abc123",
  "sessionId": "sess_add_1234567890",
  "expiresAt": "2024-01-01T12:30:00Z"
}
```

### Remove Authentication Method

Remove an authentication method from user's account.

```http
DELETE /users/auth-methods/{methodId}
Authorization: Bearer access_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication method removed"
}
```

## Application Management

### Get Application Info

Retrieve application configuration and statistics.

```http
GET /applications/{appId}
Authorization: Bearer api_key_here
```

**Response:**
```json
{
  "id": "app_1234567890",
  "name": "My Application",
  "domain": "myapp.com",
  "redirectUris": [
    "https://myapp.com/auth/callback",
    "http://localhost:3000/auth/callback"
  ],
  "authMethods": {
    "passkey": {
      "enabled": true,
      "required": false
    },
    "oauth": {
      "enabled": true,
      "providers": ["google", "github"]
    },
    "password": {
      "enabled": false
    }
  },
  "branding": {
    "logo": "https://myapp.com/logo.png",
    "primaryColor": "#007bff",
    "companyName": "My Company"
  },
  "stats": {
    "totalUsers": 1250,
    "activeUsers": 980,
    "totalLogins": 15670
  }
}
```

### Update Application Settings

Update application configuration.

```http
PATCH /applications/{appId}
Authorization: Bearer api_key_here
```

**Request:**
```json
{
  "name": "Updated App Name",
  "redirectUris": [
    "https://myapp.com/auth/callback",
    "https://staging.myapp.com/auth/callback"
  ],
  "authMethods": {
    "passkey": {
      "enabled": true,
      "required": true
    }
  }
}
```

## Webhooks

### Authentication Events

PasskeyMe can send webhooks for authentication events.

**Webhook endpoint configuration:**
```http
POST /webhooks/endpoints
Authorization: Bearer api_key_here
```

**Request:**
```json
{
  "url": "https://yourapi.com/webhooks/passkeyme",
  "events": ["user.login", "user.logout", "user.created"],
  "secret": "webhook_secret_key"
}
```

**Webhook payload example:**
```json
{
  "event": "user.login",
  "timestamp": "2024-01-01T12:00:00Z",
  "data": {
    "userId": "usr_1234567890",
    "email": "user@example.com",
    "authMethod": "passkey",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "sessionId": "sess_1234567890"
  }
}
```

## Error Handling

### Error Response Format

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details",
    "requestId": "req_1234567890"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_APP_ID` | 401 | Invalid or missing App ID |
| `INVALID_API_KEY` | 401 | Invalid or missing API key |
| `INVALID_TOKEN` | 401 | Invalid or expired access token |
| `INSUFFICIENT_SCOPE` | 403 | Token doesn't have required scope |
| `USER_NOT_FOUND` | 404 | User doesn't exist |
| `METHOD_NOT_FOUND` | 404 | Authentication method not found |
| `INVALID_REQUEST` | 400 | Malformed request body |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

### Error Handling Example

```javascript
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`https://api.passkeyme.com${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-PasskeyMe-App-ID': appId,
        'Content-Type': 'application/json'
      },
      ...options
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error.code} - ${error.error.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

## Rate Limits

API endpoints have the following rate limits:

| Endpoint Type | Rate Limit | Window |
|---------------|------------|---------|
| Authentication | 100 requests | 1 minute |
| User Management | 500 requests | 1 minute |
| Application Management | 100 requests | 1 minute |
| Webhooks | 1000 requests | 1 minute |

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## SDK Integration

### Using API with SDKs

Most operations are handled by SDKs, but you can access the underlying API:

```typescript
// JavaScript SDK
import { PasskeymeAuth } from '@passkeyme/auth';

const auth = new PasskeymeAuth({ appId: 'your-app-id' });

// Make direct API call
const apiResponse = await auth.apiCall('/users/profile', {
  method: 'PATCH',
  body: JSON.stringify({ name: 'New Name' })
});
```

### Server-Side Usage

Use the API directly for server-side operations:

```javascript
// Node.js example
const express = require('express');
const app = express();

app.get('/api/user', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  try {
    const userResponse = await fetch('https://api.passkeyme.com/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-PasskeyMe-App-ID': process.env.PASSKEYME_APP_ID
      }
    });
    
    const user = await userResponse.json();
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});
```

## Testing

### Test Endpoints

Development environment provides test endpoints:

```
Base URL: https://dev-api.passkeyme.com
```

### Postman Collection

Download our Postman collection for API testing:

```json
{
  "info": {
    "name": "PasskeyMe API",
    "description": "Complete API collection for PasskeyMe"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{api_key}}",
        "type": "string"
      }
    ]
  }
}
```

### API Testing Examples

```bash
# Test authentication initiation
curl -X POST https://api.passkeyme.com/auth/initiate \
  -H "Authorization: Bearer your-api-key" \
  -H "X-PasskeyMe-App-ID: your-app-id" \
  -H "Content-Type: application/json" \
  -d '{
    "redirectUri": "https://yourapp.com/callback",
    "authMethod": "passkey"
  }'

# Test token validation
curl -X GET https://api.passkeyme.com/auth/validate \
  -H "Authorization: Bearer user-access-token" \
  -H "X-PasskeyMe-App-ID: your-app-id"
```

## Next Steps

- **[Configuration Methods](/docs/configuration/authentication-methods)** - Configure authentication options
- **[SDKs](/docs/sdks/overview)** - Use our SDKs for easier integration
- **[JavaScript SDK](/docs/sdks/javascript)** - JavaScript SDK documentation
- **[Troubleshooting](/docs/troubleshooting/common-issues)** - Common issues and solutions

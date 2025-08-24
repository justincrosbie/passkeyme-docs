---
sidebar_position: 1
id: api-overview
title: API Documentation Overview
description: Passkeyme REST API integration guide and when to use direct API vs SDKs
---

# API Documentation Overview

Passkeyme provides a comprehensive REST API alongside our framework-specific SDKs. This section helps you understand when to use the API directly versus using our SDKs, and provides integration examples for direct API usage.

## 🔗 Complete API Reference

**📖 [Full Swagger API Documentation](https://docs.passkeyme.com/api)**

Our complete API documentation is available as an interactive Swagger interface where you can:
- Browse all available endpoints
- See request/response schemas
- Test API calls directly
- Download OpenAPI specifications

## 🤔 When to Use API vs SDKs

### Use the Direct API When:
- ✅ **Building custom integrations** for unsupported frameworks
- ✅ **Server-side authentication** flows
- ✅ **Webhook processing** and backend integrations
- ✅ **Custom token validation** logic
- ✅ **Building your own SDK** for a new platform

### Use Framework SDKs When:
- ✅ **React applications** - use [`@passkeyme/react-auth`](../sdks/react.md)
- ✅ **JavaScript/TypeScript** apps - use [`@passkeyme/auth`](../sdks/javascript.md)
- ✅ **React Native** apps - React Native SDK *(coming Q1 2025)* - use [JavaScript SDK](../sdks/javascript.md) currently
- ✅ **Standard authentication flows** with built-in UI components

## 🔐 Authentication Flow via API

### 1. Configuration Endpoint
```http
GET /api/config?app_id={your_app_id}
```

Retrieve your application configuration including OAuth providers and settings.

### 2. OAuth Redirect
```http
GET /oauth/{provider}/authorize?app_id={app_id}&redirect_uri={redirect_uri}
```

Redirect users to OAuth provider (Google, GitHub, Facebook) for authentication.

### 3. Token Verification
```http
GET /auth/verify-token?token={jwt_token}&app_id={app_id}
```

Verify JWT tokens received from authentication callbacks.

### 4. User Information
```http
GET /api/user?token={jwt_token}
```

Retrieve authenticated user information using a valid JWT token.

## 🛠️ Integration Examples

### Frontend Integration (Vanilla JavaScript)

```javascript
class PasskeymeApi {
  constructor(appId, baseUrl = 'https://api.passkeyme.com') {
    this.appId = appId;
    this.baseUrl = baseUrl;
  }

  async getConfig() {
    const response = await fetch(
      `${this.baseUrl}/api/config?app_id=${this.appId}`
    );
    return response.json();
  }

  redirectToOAuth(provider, redirectUri) {
    const url = `${this.baseUrl}/oauth/${provider}/authorize?app_id=${this.appId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = url;
  }

  async verifyToken(token) {
    const response = await fetch(
      `${this.baseUrl}/auth/verify-token?token=${token}&app_id=${this.appId}`
    );
    return response.json();
  }

  async getCurrentUser(token) {
    const response = await fetch(
      `${this.baseUrl}/api/user?token=${token}`
    );
    return response.json();
  }
}
```

### Backend Integration (Node.js)

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware to verify Passkeyme tokens
const verifyPasskeymeToken = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify with Passkeyme API
    const response = await fetch(
      `https://api.passkeyme.com/auth/verify-token?token=${token}&app_id=${process.env.PASSKEYME_APP_ID}`
    );
    
    const result = await response.json();
    
    if (result.valid) {
      req.user = result.user;
      next();
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Token verification failed' });
  }
};

// Protected route example
app.get('/api/protected', verifyPasskeymeToken, (req, res) => {
  res.json({ 
    message: 'Protected data', 
    user: req.user 
  });
});
```

### Python Integration

```python
import requests
import os
from flask import Flask, request, jsonify

app = Flask(__name__)

class PasskeymeClient:
    def __init__(self, app_id, base_url="https://api.passkeyme.com"):
        self.app_id = app_id
        self.base_url = base_url
    
    def verify_token(self, token):
        response = requests.get(
            f"{self.base_url}/auth/verify-token",
            params={"token": token, "app_id": self.app_id}
        )
        return response.json()
    
    def get_user(self, token):
        response = requests.get(
            f"{self.base_url}/api/user",
            params={"token": token}
        )
        return response.json()

passkeyme = PasskeymeClient(os.environ['PASSKEYME_APP_ID'])

def require_auth(f):
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        result = passkeyme.verify_token(token)
        if not result.get('valid'):
            return jsonify({'error': 'Invalid token'}), 401
        
        request.user = result.get('user')
        return f(*args, **kwargs)
    
    return decorated_function

@app.route('/api/protected')
@require_auth
def protected():
    return jsonify({
        'message': 'Protected data',
        'user': request.user
    })
```

## 🔑 Token Management

### JWT Token Structure
Passkeyme returns standard JWT tokens with the following claims:

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "aud": "application-uuid", 
  "iss": "https://passkeyme.com",
  "iat": 1640995200,
  "exp": 1640998800,
  "user_id": "user-uuid",
  "app_id": "application-uuid"
}
```

### Token Verification Best Practices

1. **Always verify tokens server-side** for sensitive operations
2. **Cache verification results** with appropriate TTL
3. **Handle token expiration** gracefully
4. **Use HTTPS** for all API calls
5. **Store tokens securely** in browser (httpOnly cookies recommended)

## 🔒 Security Considerations

### API Key Management
- Store your `app_id` securely
- Use environment variables in production
- Rotate credentials regularly
- Monitor API usage for anomalies

### Token Handling
- Validate tokens on every protected request
- Implement token refresh logic
- Use short-lived tokens when possible
- Log authentication events for security monitoring

## 🚀 Next Steps

1. **[Explore the Full API](https://docs.passkeyme.com/api)** - Browse all endpoints
2. **[Authentication Flows](./authentication-flows.md)** - Complete flow implementations
3. **[Token Management](./token-management.md)** - Security and lifecycle management
4. **[Try our React SDK](../sdks/react.md)** - For React applications
5. **[Use JavaScript SDK](../sdks/javascript.md)** - For other frameworks

## 💬 Support

- **API Questions**: [GitHub Issues](https://github.com/passkeyme/passkeyme/issues)
- **Integration Help**: [Discord Community](https://discord.gg/passkeyme)
- **Documentation**: [docs.passkeyme.com](https://docs.passkeyme.com)

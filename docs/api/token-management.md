---
sidebar_position: 3
id: token-management
title: Token Management & Security
description: JWT token handling, security best practices, and lifecycle management
---

# Token Management & Security

Learn how to properly handle JWT tokens from PasskeyMe API, implement security best practices, and manage token lifecycles in your applications.

## 🔑 JWT Token Structure

PasskeyMe uses standard JWT tokens with the following structure:

### Token Claims

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "aud": "your-app-uuid",
  "iss": "https://passkeyme.com",
  "iat": 1640995200,
  "exp": 1640998800,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "app_id": "your-app-uuid",
  "has_passkey": true,
  "email_verified": true
}
```

### Claim Descriptions

| Claim | Description | Example |
|-------|-------------|---------|
| `sub` | Subject (User ID) | `550e8400-e29b-41d4-a716-446655440000` |
| `email` | User's email address | `user@example.com` |
| `name` | User's display name | `John Doe` |
| `aud` | Audience (Your App ID) | `your-app-uuid` |
| `iss` | Issuer (PasskeyMe) | `https://passkeyme.com` |
| `iat` | Issued At (Unix timestamp) | `1640995200` |
| `exp` | Expires At (Unix timestamp) | `1640998800` |
| `user_id` | User ID (same as sub) | `550e8400-e29b-41d4-a716-446655440000` |
| `app_id` | Application ID | `your-app-uuid` |
| `has_passkey` | User has registered passkey | `true` |
| `email_verified` | Email verification status | `true` |

## 🔐 Token Verification

### Server-Side Verification (Recommended)

Always verify tokens on your backend for sensitive operations:

```javascript
// Node.js/Express example
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

async function verifyPasskeymeToken(token, appId) {
  try {
    // Option 1: Verify with PasskeyMe API (recommended)
    const response = await fetch(
      `https://auth.passkeyme.com/api/auth/verify-token?token=${token}&app_id=${appId}`
    );
    
    const result = await response.json();
    
    if (result.valid) {
      return {
        valid: true,
        user: result.user,
        claims: jwt.decode(token) // Decode without verification for claims
      };
    }
    
    return { valid: false, error: result.error };
    
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Express middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  verifyPasskeymeToken(token, process.env.PASSKEYME_APP_ID)
    .then(result => {
      if (result.valid) {
        req.user = result.user;
        req.tokenClaims = result.claims;
        next();
      } else {
        res.status(401).json({ error: 'Invalid token' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Token verification failed' });
    });
}
```

### Client-Side Token Validation

For client-side validation (less secure, use only for UX):

```javascript
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    return null;
  }
}

function isTokenExpired(token) {
  const claims = decodeToken(token);
  if (!claims) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return claims.exp < now;
}

function getTokenTimeRemaining(token) {
  const claims = decodeToken(token);
  if (!claims) return 0;
  
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, claims.exp - now);
}

// Usage
const token = localStorage.getItem('passkeyme_token');

if (isTokenExpired(token)) {
  // Token expired, need to re-authenticate
  redirectToLogin();
} else {
  const timeRemaining = getTokenTimeRemaining(token);
  console.log(`Token valid for ${timeRemaining} seconds`);
}
```

## 🔄 Token Lifecycle Management

### Secure Token Storage

```javascript
class SecureTokenStorage {
  constructor() {
    this.tokenKey = 'passkeyme_token';
    this.userKey = 'passkeyme_user';
  }
  
  // Store token securely
  storeToken(token, user) {
    try {
      // For web apps, use secure httpOnly cookies when possible
      // This is a fallback for localStorage
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
      
      // Set up automatic cleanup on token expiration
      this.scheduleTokenCleanup(token);
      
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  }
  
  // Retrieve token
  getToken() {
    try {
      const token = localStorage.getItem(this.tokenKey);
      
      if (token && !isTokenExpired(token)) {
        return token;
      }
      
      // Token expired or invalid, clean up
      this.clearTokens();
      return null;
      
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  }
  
  // Get stored user
  getUser() {
    try {
      const userJson = localStorage.getItem(this.userKey);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Failed to retrieve user:', error);
      return null;
    }
  }
  
  // Clear all stored data
  clearTokens() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
  
  // Schedule automatic token cleanup
  scheduleTokenCleanup(token) {
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
    }
    
    const timeRemaining = getTokenTimeRemaining(token);
    
    // Clean up token when it expires
    this.cleanupTimer = setTimeout(() => {
      this.clearTokens();
      // Optionally trigger re-authentication
      window.dispatchEvent(new Event('tokenExpired'));
    }, timeRemaining * 1000);
  }
}
```

### Token Refresh Strategy

Since PasskeyMe uses OAuth-style authentication, implement a refresh strategy:

```javascript
class TokenManager extends SecureTokenStorage {
  constructor(appId, redirectUri) {
    super();
    this.appId = appId;
    this.redirectUri = redirectUri;
    this.refreshPromise = null;
  }
  
  async getValidToken() {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No token available');
    }
    
    // Check if token will expire soon (within 5 minutes)
    const timeRemaining = getTokenTimeRemaining(token);
    
    if (timeRemaining < 300) { // 5 minutes
      return this.refreshToken();
    }
    
    return token;
  }
  
  async refreshToken() {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    
    this.refreshPromise = this.performTokenRefresh();
    
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }
  
  async performTokenRefresh() {
    // For PasskeyMe, we need to re-authenticate
    // This could involve silent OAuth or passkey re-authentication
    
    const currentUser = this.getUser();
    
    if (currentUser?.has_passkey && await this.isPasskeyAvailable()) {
      // Try silent passkey authentication
      try {
        const result = await this.silentPasskeyAuth();
        this.storeToken(result.token, result.user);
        return result.token;
      } catch (error) {
        console.log('Silent passkey auth failed:', error);
      }
    }
    
    // Fall back to re-authentication
    this.clearTokens();
    throw new Error('Token refresh failed, re-authentication required');
  }
  
  async silentPasskeyAuth() {
    // Attempt passkey authentication without user interaction
    // This may not always be possible depending on browser and user settings
    try {
      return await authenticateWithPasskey(this.appId);
    } catch (error) {
      throw new Error('Silent authentication failed');
    }
  }
  
  async isPasskeyAvailable() {
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }
}
```

## 🛡️ Security Best Practices

### 1. Secure Storage

```javascript
// ✅ GOOD: Use httpOnly cookies when possible (server-side setup required)
// Set-Cookie: passkeyme_token=jwt_token; HttpOnly; Secure; SameSite=Strict

// ⚠️ ACCEPTABLE: localStorage with proper cleanup
const tokenStorage = new SecureTokenStorage();

// ❌ BAD: Storing in global variables or unsecured locations
window.authToken = token; // Never do this
```

### 2. Token Transmission

```javascript
// ✅ GOOD: Always use HTTPS and Authorization header
const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// ❌ BAD: Sending token in URL or non-HTTPS
const response = await fetch(`http://api.example.com/data?token=${token}`);
```

### 3. Token Validation

```javascript
// ✅ GOOD: Validate on every request
async function makeAuthenticatedRequest(url, options = {}) {
  const token = await tokenManager.getValidToken();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
  
  if (response.status === 401) {
    // Token invalid, clear and re-authenticate
    tokenManager.clearTokens();
    throw new Error('Authentication required');
  }
  
  return response;
}

// ❌ BAD: Using token without validation
const response = await fetch('/api/data', {
  headers: { 'Authorization': `Bearer ${oldToken}` }
});
```

### 4. Error Handling

```javascript
class AuthenticationError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = 'AuthenticationError';
  }
}

async function handleTokenError(error, response) {
  if (response?.status === 401) {
    const tokenManager = new TokenManager();
    tokenManager.clearTokens();
    
    // Redirect to login or show auth UI
    window.dispatchEvent(new CustomEvent('authenticationRequired', {
      detail: { reason: 'token_expired' }
    }));
    
    throw new AuthenticationError('Authentication required', 'TOKEN_EXPIRED');
  }
  
  if (response?.status === 403) {
    throw new AuthenticationError('Access denied', 'ACCESS_DENIED');
  }
  
  throw error;
}
```

## 🔍 Token Debugging

### Development Tools

```javascript
class TokenDebugger {
  static analyzeToken(token) {
    if (!token) {
      console.log('❌ No token provided');
      return;
    }
    
    try {
      const claims = decodeToken(token);
      const now = Math.floor(Date.now() / 1000);
      const timeRemaining = claims.exp - now;
      
      console.group('🔍 Token Analysis');
      console.log('📧 Email:', claims.email);
      console.log('👤 User ID:', claims.sub);
      console.log('🏢 App ID:', claims.aud);
      console.log('⏰ Issued:', new Date(claims.iat * 1000).toLocaleString());
      console.log('⏳ Expires:', new Date(claims.exp * 1000).toLocaleString());
      console.log('🔑 Has Passkey:', claims.has_passkey);
      console.log('✅ Email Verified:', claims.email_verified);
      
      if (timeRemaining > 0) {
        console.log(`✅ Valid for ${Math.floor(timeRemaining / 60)} minutes`);
      } else {
        console.log('❌ Token expired');
      }
      
      console.groupEnd();
      
    } catch (error) {
      console.error('❌ Invalid token format:', error);
    }
  }
  
  static validateClaims(token, appId) {
    const claims = decodeToken(token);
    
    if (!claims) {
      return { valid: false, errors: ['Invalid token format'] };
    }
    
    const errors = [];
    
    if (claims.aud !== appId) {
      errors.push(`Token audience mismatch: expected ${appId}, got ${claims.aud}`);
    }
    
    if (claims.iss !== 'https://passkeyme.com') {
      errors.push(`Invalid issuer: ${claims.iss}`);
    }
    
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp < now) {
      errors.push('Token expired');
    }
    
    if (claims.iat > now + 300) { // 5 minute clock skew allowance
      errors.push('Token issued in the future');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      claims
    };
  }
}

// Usage in development
if (process.env.NODE_ENV === 'development') {
  const token = localStorage.getItem('passkeyme_token');
  TokenDebugger.analyzeToken(token);
  
  const validation = TokenDebugger.validateClaims(token, 'your-app-id');
  if (!validation.valid) {
    console.warn('Token validation issues:', validation.errors);
  }
}
```

## 🔗 Next Steps

- **[API Overview](./overview.md)** - When to use API vs SDKs
- **[Authentication Flows](./authentication-flows.md)** - Complete flow implementations
- **[API Reference](https://passkeyme.com/apidocs/index.html)** - Complete endpoint documentation
- **[React SDK](../sdks/react.md)** - Pre-built token management
- **[Security Model](../getting-started/concepts.md#security-model)** - Comprehensive security practices

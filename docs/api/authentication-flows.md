---
sidebar_position: 2
id: authentication-flows
title: Authentication Flows via API
description: Complete authentication flows using PasskeyMe REST API directly
---

# Authentication Flows via API

Learn how to implement complete authentication flows using the PasskeyMe REST API directly, without using our SDKs.

## 🔄 Complete OAuth Flow

### Step 1: Get Application Configuration

First, retrieve your application's OAuth configuration:

```javascript
async function getAppConfig(appId) {
  const response = await fetch(
    `https://auth.passkeyme.com/api/config?app_id=${appId}`
  );
  
  const config = await response.json();
  
  return {
    providers: config.oauth_providers, // ['google', 'github', 'facebook']
    redirectUri: config.redirect_uri,
    appName: config.app_name
  };
}
```

### Step 2: Initiate OAuth Flow

Redirect users to the OAuth provider:

```javascript
function redirectToOAuth(provider, appId, redirectUri, state = null) {
  const params = new URLSearchParams({
    app_id: appId,
    redirect_uri: redirectUri
  });
  
  if (state) {
    params.append('state', state);
  }
  
  const oauthUrl = `https://auth.passkeyme.com/oauth/${provider}/authorize?${params}`;
  window.location.href = oauthUrl;
}

// Usage
redirectToOAuth('google', 'your-app-id', 'https://yourapp.com/auth/callback');
```

### Step 3: Handle OAuth Callback

Process the authentication callback:

```javascript
async function handleAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const error = urlParams.get('error');
  
  if (error) {
    throw new Error(`Authentication failed: ${error}`);
  }
  
  if (!token) {
    throw new Error('No token received');
  }
  
  // Verify the token
  const verification = await verifyToken(token);
  
  if (verification.valid) {
    // Store token securely
    localStorage.setItem('passkeyme_token', token);
    
    // Get user information
    const user = await getCurrentUser(token);
    
    return { token, user };
  } else {
    throw new Error('Invalid token received');
  }
}
```

### Step 4: Token Verification

Verify received tokens:

```javascript
async function verifyToken(token, appId) {
  const response = await fetch(
    `https://auth.passkeyme.com/api/auth/verify-token?token=${token}&app_id=${appId}`
  );
  
  const result = await response.json();
  
  return {
    valid: result.valid,
    user: result.user,
    expires: result.expires
  };
}
```

### Step 5: Get User Information

Retrieve authenticated user details:

```javascript
async function getCurrentUser(token) {
  const response = await fetch(
    `https://auth.passkeyme.com/api/user?token=${token}`
  );
  
  const user = await response.json();
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    picture: user.avatar,
    emailVerified: user.email_verified,
    hasPasskey: user.has_passkey,
    createdAt: user.created_at,
    lastLoginAt: user.last_login_at
  };
}
```

## 🔐 Passkey Registration Flow

### Step 1: Check Passkey Support

```javascript
function isPasskeySupported() {
  return window.PublicKeyCredential && 
         window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable;
}

async function checkPasskeyAvailability() {
  if (!isPasskeySupported()) {
    return false;
  }
  
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (error) {
    return false;
  }
}
```

### Step 2: Register Passkey

```javascript
async function registerPasskey(token) {
  // Get registration challenge from PasskeyMe API
  const challengeResponse = await fetch(
    `https://auth.passkeyme.com/api/passkey/register/challenge?token=${token}`
  );
  
  const challenge = await challengeResponse.json();
  
  // Create passkey with browser WebAuthn API
  const credential = await navigator.credentials.create({
    publicKey: challenge.publicKey
  });
  
  // Send credential back to PasskeyMe
  const registrationResponse = await fetch(
    `https://auth.passkeyme.com/api/passkey/register/complete`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        credential: {
          id: credential.id,
          rawId: Array.from(new Uint8Array(credential.rawId)),
          response: {
            clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
            attestationObject: Array.from(new Uint8Array(credential.response.attestationObject))
          },
          type: credential.type
        }
      })
    }
  );
  
  return registrationResponse.json();
}
```

### Step 3: Authenticate with Passkey

```javascript
async function authenticateWithPasskey(appId) {
  // Get authentication challenge
  const challengeResponse = await fetch(
    `https://auth.passkeyme.com/api/passkey/auth/challenge?app_id=${appId}`
  );
  
  const challenge = await challengeResponse.json();
  
  // Authenticate with browser WebAuthn API
  const assertion = await navigator.credentials.get({
    publicKey: challenge.publicKey
  });
  
  // Send assertion to PasskeyMe for verification
  const authResponse = await fetch(
    `https://auth.passkeyme.com/api/passkey/auth/complete`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assertion: {
          id: assertion.id,
          rawId: Array.from(new Uint8Array(assertion.rawId)),
          response: {
            clientDataJSON: Array.from(new Uint8Array(assertion.response.clientDataJSON)),
            authenticatorData: Array.from(new Uint8Array(assertion.response.authenticatorData)),
            signature: Array.from(new Uint8Array(assertion.response.signature)),
            userHandle: assertion.response.userHandle ? 
              Array.from(new Uint8Array(assertion.response.userHandle)) : null
          },
          type: assertion.type
        },
        app_id: appId
      })
    }
  );
  
  const result = await authResponse.json();
  
  if (result.success) {
    return {
      token: result.token,
      user: result.user
    };
  } else {
    throw new Error(result.error || 'Passkey authentication failed');
  }
}
```

## 🛡️ Error Handling

### Common API Errors

```javascript
class PasskeymeApiError extends Error {
  constructor(response, message) {
    super(message);
    this.response = response;
    this.statusCode = response.status;
  }
}

async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new PasskeymeApiError(
        response, 
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof PasskeymeApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new Error(`API call failed: ${error.message}`);
  }
}

// Usage with error handling
try {
  const user = await getCurrentUser(token);
  console.log('User:', user);
} catch (error) {
  if (error instanceof PasskeymeApiError) {
    if (error.statusCode === 401) {
      // Token expired or invalid
      handleTokenExpired();
    } else if (error.statusCode === 404) {
      // User not found
      handleUserNotFound();
    }
  } else {
    // Network or other errors
    console.error('Unexpected error:', error);
  }
}
```

## 🔄 Token Refresh Implementation

```javascript
class TokenManager {
  constructor(appId) {
    this.appId = appId;
    this.token = localStorage.getItem('passkeyme_token');
    this.refreshPromise = null;
  }
  
  async getValidToken() {
    if (!this.token) {
      throw new Error('No token available');
    }
    
    // Check if token is still valid
    const verification = await this.verifyToken();
    
    if (verification.valid) {
      return this.token;
    }
    
    // Token expired, need to re-authenticate
    this.clearToken();
    throw new Error('Token expired, re-authentication required');
  }
  
  async verifyToken() {
    if (!this.token) return { valid: false };
    
    try {
      const result = await apiCall(
        `https://auth.passkeyme.com/api/auth/verify-token?token=${this.token}&app_id=${this.appId}`
      );
      return result;
    } catch (error) {
      return { valid: false };
    }
  }
  
  setToken(token) {
    this.token = token;
    localStorage.setItem('passkeyme_token', token);
  }
  
  clearToken() {
    this.token = null;
    localStorage.removeItem('passkeyme_token');
  }
}
```

## 📱 Complete Implementation Example

Here's a complete authentication manager using the PasskeyMe API:

```javascript
class PasskeymeAuth {
  constructor(appId, redirectUri) {
    this.appId = appId;
    this.redirectUri = redirectUri;
    this.tokenManager = new TokenManager(appId);
    this.baseUrl = 'https://auth.passkeyme.com';
  }
  
  // OAuth Authentication
  async signInWithOAuth(provider) {
    const state = this.generateState();
    sessionStorage.setItem('auth_state', state);
    
    redirectToOAuth(provider, this.appId, this.redirectUri, state);
  }
  
  // Handle OAuth callback
  async handleCallback() {
    const result = await handleAuthCallback();
    this.tokenManager.setToken(result.token);
    return result.user;
  }
  
  // Passkey authentication
  async signInWithPasskey() {
    const result = await authenticateWithPasskey(this.appId);
    this.tokenManager.setToken(result.token);
    return result.user;
  }
  
  // Register passkey
  async registerPasskey() {
    const token = await this.tokenManager.getValidToken();
    return registerPasskey(token);
  }
  
  // Get current user
  async getCurrentUser() {
    const token = await this.tokenManager.getValidToken();
    return getCurrentUser(token);
  }
  
  // Check authentication status
  async isAuthenticated() {
    try {
      const verification = await this.tokenManager.verifyToken();
      return verification.valid;
    } catch {
      return false;
    }
  }
  
  // Sign out
  signOut() {
    this.tokenManager.clearToken();
  }
  
  // Utility methods
  generateState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

// Usage
const auth = new PasskeymeAuth('your-app-id', 'https://yourapp.com/auth/callback');

// OAuth sign in
await auth.signInWithOAuth('google');

// Passkey sign in (if available)
if (await checkPasskeyAvailability()) {
  await auth.signInWithPasskey();
}

// Get current user
const user = await auth.getCurrentUser();
```

## 🔗 Next Steps

- **[API Overview](./overview.md)** - When to use API vs SDKs
- **[Token Management](./token-management.md)** - Security and lifecycle management
- **[API Reference](https://passkeyme.com/apidocs/index.html)** - Complete endpoint documentation
- **[SDK Integration](../sdks/overview.md)** - Use pre-built SDKs instead
- **[Security Model](../getting-started/concepts.md#security-model)** - Security best practices

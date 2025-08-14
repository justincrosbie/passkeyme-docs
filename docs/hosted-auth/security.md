---
id: security
title: Security & Best Practices
sidebar_label: Security
description: Essential security considerations and best practices for PasskeyMe hosted authentication pages
keywords: [passkeyme, hosted auth, security, best practices, csrf, https, tokens, validation]
---

# 🔒 **Security & Best Practices**

Security is paramount when implementing authentication. This guide covers essential security considerations and best practices for PasskeyMe's Hosted Authentication Pages.

:::warning Production Requirements
All the security practices outlined here are **mandatory for production environments**. Skipping these can expose your application to serious security vulnerabilities.
:::

## **1. Validate Redirect URIs**

Always whitelist your redirect URIs in the Advanced configuration to prevent redirect attacks.

### **Why This Matters**
- **Prevents redirect attacks** where malicious actors redirect users to fake sites
- **Ensures tokens** are only sent to legitimate destinations
- **Required by OAuth 2.0** security specifications

### **Configuration Requirements**
```javascript
// In PasskeyMe Admin Console - Advanced Configuration
const secureRedirectConfig = {
  allowedRedirectUris: [
    'https://yourapp.com/auth/callback',     // Production
    'https://staging.yourapp.com/auth/callback', // Staging
    // Never use wildcards or HTTP in production
  ]
};
```

:::danger Common Mistakes
- **Using wildcards** (`https://*.yourapp.com`) - Not supported for security
- **HTTP URLs in production** - Must use HTTPS
- **Overly broad URIs** - Be as specific as possible
:::

## **2. Use HTTPS Only**

All redirect URIs must use HTTPS in production environments.

### **HTTPS Requirements**
- **Production**: HTTPS is mandatory for all redirect URIs
- **Development**: HTTP localhost is allowed for testing only
- **Staging**: Should also use HTTPS to match production conditions

```javascript
// Valid production redirect URIs
const productionUris = [
  'https://yourapp.com/auth/callback',     // ✅ Secure
  'https://api.yourapp.com/auth/callback', // ✅ Secure
];

// Invalid production redirect URIs  
const invalidUris = [
  'http://yourapp.com/auth/callback',      // ❌ Not secure
  'https://yourapp.com/auth/*',            // ❌ Wildcards not allowed
];
```

## **3. Validate State Parameter**

Always validate the state parameter to prevent CSRF attacks:

### **State Parameter Security**
The state parameter prevents Cross-Site Request Forgery (CSRF) attacks by ensuring the authentication request originated from your application.

```javascript
function generateState() {
  const state = {
    nonce: Math.random().toString(36).substring(2),
    timestamp: Date.now(),
    returnTo: window.location.pathname
  };
  
  // Store nonce for validation
  sessionStorage.setItem('auth_nonce', state.nonce);
  
  return JSON.stringify(state);
}

function validateState(stateParam) {
  try {
    const state = JSON.parse(stateParam);
    const storedNonce = sessionStorage.getItem('auth_nonce');
    
    if (state.nonce !== storedNonce) {
      throw new Error('Invalid state nonce');
    }
    
    // Check timestamp (reject if older than 10 minutes)
    if (Date.now() - state.timestamp > 10 * 60 * 1000) {
      throw new Error('State expired');
    }
    
    return state;
  } catch (error) {
    console.error('State validation failed:', error);
    return null;
  } finally {
    // Clean up stored nonce
    sessionStorage.removeItem('auth_nonce');
  }
}

// Usage in authentication flow
function redirectToAuth() {
  const state = generateState();
  const params = new URLSearchParams({
    app_id: 'your-app-id',
    redirect_uri: 'https://yourapp.com/auth/callback',
    state: state
  });
  
  window.location.href = `https://auth.passkeyme.com/auth?${params}`;
}

function handleCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const stateParam = urlParams.get('state');
  
  const validatedState = validateState(stateParam);
  if (!validatedState) {
    throw new Error('Invalid or expired authentication state');
  }
  
  // Continue with token exchange...
}
```

## **4. Secure Token Storage**

Store tokens securely and implement proper cleanup:

### **Client-Side Token Storage**
```javascript
// Basic secure token storage
function storeTokens(tokenData) {
  // Use httpOnly cookies in production for better security
  localStorage.setItem('access_token', tokenData.access_token);
  
  if (tokenData.refresh_token) {
    localStorage.setItem('refresh_token', tokenData.refresh_token);
  }
  
  // Set expiration
  const expiresAt = Date.now() + (tokenData.expires_in * 1000);
  localStorage.setItem('token_expires_at', expiresAt.toString());
}

function isTokenExpired() {
  const expiresAt = localStorage.getItem('token_expires_at');
  return expiresAt && Date.now() > parseInt(expiresAt);
}

function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expires_at');
  sessionStorage.removeItem('auth_nonce');
}

// Auto-cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (isTokenExpired()) {
    clearTokens();
  }
});
```

### **Server-Side Token Storage (Recommended)**
```javascript
// Express.js example - more secure approach
app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // Validate state
  const sessionState = req.session.authState;
  if (state !== sessionState) {
    return res.status(400).send('Invalid state parameter');
  }
  
  try {
    // Exchange code for tokens on server
    const tokenResponse = await fetch('https://api.passkeyme.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.PASSKEYME_CLIENT_ID,
        client_secret: process.env.PASSKEYME_CLIENT_SECRET,
        redirect_uri: process.env.PASSKEYME_REDIRECT_URI
      })
    });

    const tokens = await tokenResponse.json();

    // Store in secure httpOnly cookie
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,     // Not accessible via JavaScript
      secure: true,       // HTTPS only
      sameSite: 'strict', // CSRF protection
      maxAge: tokens.expires_in * 1000
    });

    // Clear auth state
    delete req.session.authState;

    res.redirect('/dashboard');
  } catch (error) {
    res.redirect('/login?error=auth_failed');
  }
});
```

## **5. Content Security Policy (CSP)**

Implement Content Security Policy headers to prevent XSS attacks:

```html
<!-- In your HTML head -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               connect-src 'self' https://api.passkeyme.com https://auth.passkeyme.com;
               form-action 'self' https://auth.passkeyme.com;">
```

Or with server headers:
```javascript
// Express.js middleware
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "connect-src 'self' https://api.passkeyme.com https://auth.passkeyme.com; " +
    "form-action 'self' https://auth.passkeyme.com"
  );
  next();
});
```

## **6. Error Handling Security**

Handle errors securely without exposing sensitive information:

```javascript
function handleAuthError(error, errorDescription) {
  // Log detailed error for debugging (server-side only)
  console.error('Auth error details:', { error, errorDescription });
  
  // Show generic user-friendly messages
  const userMessages = {
    'access_denied': 'Authentication was cancelled.',
    'invalid_request': 'There was a problem with the authentication request.',
    'server_error': 'Authentication service is temporarily unavailable.',
    'temporarily_unavailable': 'Service temporarily unavailable. Please try again.'
  };
  
  const userMessage = userMessages[error] || 'Authentication failed. Please try again.';
  
  // Don't expose internal error details to users
  showUserError(userMessage);
  
  // Optionally report to error tracking service
  if (window.errorTracker) {
    window.errorTracker.report('auth_error', { error, userAgent: navigator.userAgent });
  }
}
```

## **7. Session Management**

Implement proper session management:

```javascript
// Session timeout handling
function initSessionManagement() {
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  let sessionTimer;
  
  function resetSessionTimer() {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(() => {
      // Warn user about session expiry
      if (confirm('Your session is about to expire. Continue working?')) {
        refreshToken();
      } else {
        signOut();
      }
    }, SESSION_TIMEOUT);
  }
  
  // Reset timer on user activity
  ['click', 'keypress', 'mousemove'].forEach(event => {
    document.addEventListener(event, resetSessionTimer);
  });
  
  resetSessionTimer();
}

async function refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    signOut();
    return;
  }
  
  try {
    const response = await fetch('https://api.passkeyme.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: 'your-app-id'
      })
    });
    
    if (response.ok) {
      const tokens = await response.json();
      storeTokens(tokens);
    } else {
      signOut();
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    signOut();
  }
}
```

## **8. Production Security Checklist**

Before deploying to production, verify:

### **Configuration Security**
- [ ] **HTTPS only** - All redirect URIs use HTTPS
- [ ] **Minimal redirect URIs** - Only necessary URIs whitelisted
- [ ] **Strong client secrets** - Use secure, randomly generated secrets
- [ ] **Environment variables** - Secrets stored in environment, not code

### **Code Security**
- [ ] **State validation** - CSRF protection implemented
- [ ] **Token validation** - All tokens validated before use
- [ ] **Error handling** - No sensitive data exposed in errors
- [ ] **Session management** - Proper timeouts and cleanup

### **Infrastructure Security**
- [ ] **CSP headers** - Content Security Policy configured
- [ ] **HSTS headers** - HTTP Strict Transport Security enabled
- [ ] **Security headers** - X-Frame-Options, X-Content-Type-Options set
- [ ] **Rate limiting** - Protection against brute force attacks

### **Monitoring & Logging**
- [ ] **Auth events logged** - Successful and failed authentications
- [ ] **Error tracking** - Authentication errors monitored
- [ ] **Security alerts** - Unusual patterns detected
- [ ] **Regular audits** - Periodic security reviews

:::tip Security Resources
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- PasskeyMe Security Documentation
:::

## **9. Common Security Vulnerabilities**

### **Avoid These Common Mistakes**

**❌ Storing Secrets in Client-Side Code**
```javascript
// Never do this - secrets exposed to users
const CLIENT_SECRET = 'your-secret-key'; // Visible in browser
```

**✅ Use Server-Side Token Exchange**
```javascript
// Do this - secrets stay on server
app.post('/auth/exchange', async (req, res) => {
  const { code } = req.body;
  // Exchange code using server-side secret
});
```

**❌ Ignoring State Parameter**
```javascript
// Never do this - vulnerable to CSRF
window.location.href = 'https://auth.passkeyme.com/auth?app_id=123';
```

**✅ Always Use State Parameter**
```javascript
// Do this - CSRF protection
const state = generateSecureState();
window.location.href = `https://auth.passkeyme.com/auth?app_id=123&state=${state}`;
```

**❌ Trusting Client-Side Validation**
```javascript
// Never rely only on client-side checks
if (localStorage.getItem('access_token')) {
  // User might have tampered with this
}
```

**✅ Server-Side Token Validation**
```javascript
// Always validate tokens server-side
app.get('/protected', async (req, res) => {
  const token = req.headers.authorization;
  const user = await validateToken(token); // Server validates
  if (!user) return res.status(401).send('Unauthorized');
});
```

Following these security best practices ensures your hosted authentication implementation is production-ready and secure against common attack vectors.

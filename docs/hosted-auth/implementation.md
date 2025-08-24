---
id: implementation
title: Implementation Guide
sidebar_label: Implementation
description: Step-by-step guide to implementing Passkeyme hosted authentication pages in your application
keywords: [passkeyme, hosted auth, implementation, integration, redirect, callback, code examples]
---

# 🚀 **Implementation Guide**

This guide shows you how to integrate Passkeyme's Hosted Authentication Pages into your application. The implementation involves two main steps: redirecting users to the hosted auth pages and handling the authentication callback.

:::tip Framework Agnostic
These examples work with any web framework - React, Angular, Vue.js, Svelte, vanilla JavaScript, and more. Just adapt the code patterns to your framework's conventions.
:::

## **1. Redirect to Hosted Auth**

Send users to the hosted authentication pages:

```javascript
function redirectToAuth(options = {}) {
  const params = new URLSearchParams({
    app_id: 'your-app-id',
    redirect_uri: 'https://yourapp.com/auth/callback'
  });

  // Optional parameters
  if (options.provider) {
    params.append('provider', options.provider);
  }
  
  if (options.state) {
    params.append('state', options.state);
  }
  
  if (options.mode) {
    params.append('mode', options.mode); // 'login', 'register', or 'both'
  }

  // Redirect to hosted auth
  window.location.href = `https://auth.passkeyme.com/auth?${params}`;
}

// Examples:
redirectToAuth(); // General authentication
redirectToAuth({ provider: 'google' }); // Direct to Google
redirectToAuth({ mode: 'register' }); // Registration mode
redirectToAuth({ 
  state: JSON.stringify({ returnTo: '/dashboard' }) 
}); // With custom state
```

### **Redirect Parameters**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `app_id` | ✅ | Your Passkeyme application ID |
| `redirect_uri` | ✅ | Where to send user after authentication |
| `provider` | ❌ | Skip provider selection (google, github, microsoft, etc.) |
| `mode` | ❌ | Authentication mode: `login`, `register`, or `both` |
| `state` | ❌ | Custom data to preserve through the auth flow |

### **Framework Examples**

**React Example:**
```jsx
import { useCallback } from 'react';

function usePasskeymeAuth() {
  const signIn = useCallback((provider = null) => {
    const params = new URLSearchParams({
      app_id: process.env.REACT_APP_PASSKEYME_APP_ID,
      redirect_uri: `${window.location.origin}/auth/callback`
    });

    if (provider) {
      params.append('provider', provider);
    }

    window.location.href = `https://auth.passkeyme.com/auth?${params}`;
  }, []);

  return { signIn };
}

// In your component:
function LoginButton() {
  const { signIn } = usePasskeymeAuth();
  
  return (
    <div>
      <button onClick={() => signIn()}>Sign In</button>
      <button onClick={() => signIn('google')}>Sign In with Google</button>
    </div>
  );
}
```

**Vue.js Example:**
```vue
<template>
  <div>
    <button @click="signIn()">Sign In</button>
    <button @click="signIn('google')">Sign In with Google</button>
  </div>
</template>

<script>
export default {
  methods: {
    signIn(provider = null) {
      const params = new URLSearchParams({
        app_id: process.env.VUE_APP_PASSKEYME_APP_ID,
        redirect_uri: `${window.location.origin}/auth/callback`
      });

      if (provider) {
        params.append('provider', provider);
      }

      window.location.href = `https://auth.passkeyme.com/auth?${params}`;
    }
  }
}
</script>
```

**Angular Example:**
```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly appId = environment.passkeymeAppId;

  signIn(provider?: string): void {
    const params = new URLSearchParams({
      app_id: this.appId,
      redirect_uri: `${window.location.origin}/auth/callback`
    });

    if (provider) {
      params.append('provider', provider);
    }

    window.location.href = `https://auth.passkeyme.com/auth?${params}`;
  }
}
```

## **2. Handle Authentication Callback**

Process the authentication result in your callback handler:

```javascript
// /auth/callback page handler
async function handleAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');

  if (error) {
    console.error('Authentication failed:', error);
    const errorDescription = urlParams.get('error_description');
    showError(`Authentication failed: ${errorDescription || error}`);
    return;
  }

  if (code) {
    try {
      // Exchange authorization code for tokens
      const tokenResponse = await fetch('https://api.passkeyme.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: code,
          client_id: 'your-app-id',
          redirect_uri: 'https://yourapp.com/auth/callback'
        })
      });

      const tokenData = await tokenResponse.json();
      
      if (tokenData.access_token) {
        // Store tokens securely
        localStorage.setItem('access_token', tokenData.access_token);
        if (tokenData.refresh_token) {
          localStorage.setItem('refresh_token', tokenData.refresh_token);
        }

        // Get user information
        const user = await getUserInfo(tokenData.access_token);
        console.log('User authenticated:', user);

        // Handle state restoration
        let redirectTo = '/dashboard'; // default
        if (state) {
          try {
            const stateData = JSON.parse(state);
            redirectTo = stateData.returnTo || '/dashboard';
          } catch (e) {
            console.warn('Failed to parse state parameter');
          }
        }

        // Redirect to intended destination
        window.location.href = redirectTo;
      }
    } catch (error) {
      console.error('Token exchange failed:', error);
      showError('Authentication failed. Please try again.');
    }
  }
}

async function getUserInfo(accessToken) {
  const response = await fetch('https://api.passkeyme.com/user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get user info');
  }
  
  return response.json();
}

function showError(message) {
  // Display error to user - implement based on your UI framework
  alert(message); // Simple example
}

// Run callback handler when page loads
if (window.location.pathname === '/auth/callback') {
  handleAuthCallback();
}
```

### **Token Security Best Practices**

:::warning Security Considerations
- **Never expose tokens in URLs** - Use the authorization code flow shown above
- **Store tokens securely** - Use httpOnly cookies for production apps
- **Validate tokens** - Always verify tokens before trusting user data
- **Use HTTPS** - Never send tokens over unencrypted connections
:::

**Secure Token Storage (Server-Side):**
```javascript
// Better approach: Exchange code on server-side
app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;

  try {
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
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: tokens.expires_in * 1000
    });

    // Redirect to app
    res.redirect('/dashboard');
  } catch (error) {
    res.redirect('/login?error=auth_failed');
  }
});
```

## **3. Complete HTML Example**

Here's a complete example of a simple authentication flow:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Passkeyme Hosted Auth Example</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
    }
    .auth-button {
      background: #007bff;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      margin: 10px 0;
      width: 100%;
      font-size: 16px;
    }
    .auth-button:hover {
      background: #0056b3;
    }
    .provider-button {
      background: #6c757d;
    }
    .provider-button:hover {
      background: #545b62;
    }
  </style>
</head>
<body>
  <h1>Welcome to My App</h1>
  
  <div id="auth-section">
    <h2>Sign In</h2>
    
    <button class="auth-button" onclick="signIn()">
      🔐 Sign In with Passkeyme
    </button>
    
    <button class="auth-button provider-button" onclick="signIn('google')">
      🔍 Sign In with Google
    </button>
    
    <button class="auth-button provider-button" onclick="signIn('github')">
      🐙 Sign In with GitHub
    </button>
    
    <button class="auth-button provider-button" onclick="signIn('microsoft')">
      Ⓜ️ Sign In with Microsoft
    </button>
  </div>

  <div id="user-section" style="display: none;">
    <h2>Welcome!</h2>
    <div id="user-info"></div>
    <button class="auth-button" onclick="signOut()">Sign Out</button>
  </div>

  <script>
    const APP_ID = 'your-app-id';
    const REDIRECT_URI = window.location.origin + '/auth/callback';

    function signIn(provider = null) {
      const params = new URLSearchParams({
        app_id: APP_ID,
        redirect_uri: REDIRECT_URI
      });

      if (provider) {
        params.append('provider', provider);
      }

      // Save current location for redirect after auth
      localStorage.setItem('returnTo', window.location.pathname);

      window.location.href = `https://auth.passkeyme.com/auth?${params}`;
    }

    function signOut() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
      showAuthSection();
    }

    function showAuthSection() {
      document.getElementById('auth-section').style.display = 'block';
      document.getElementById('user-section').style.display = 'none';
    }

    function showUserSection(user) {
      document.getElementById('auth-section').style.display = 'none';
      document.getElementById('user-section').style.display = 'block';
      document.getElementById('user-info').innerHTML = `
        <p><strong>Name:</strong> ${user.name || 'N/A'}</p>
        <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
        <p><strong>Provider:</strong> ${user.provider || 'N/A'}</p>
      `;
    }

    // Check if user is already authenticated
    async function checkAuth() {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const user = await getUserInfo(token);
          showUserSection(user);
        } catch (error) {
          console.error('Token invalid:', error);
          signOut();
        }
      }
    }

    async function getUserInfo(token) {
      const response = await fetch('https://api.passkeyme.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user info');
      }
      
      return response.json();
    }

    // Initialize
    checkAuth();
  </script>
</body>
</html>
```

## **4. Error Handling**

Handle common authentication errors gracefully:

```javascript
function handleAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  
  if (error) {
    const errorMessages = {
      'access_denied': 'You cancelled the authentication.',
      'invalid_request': 'Invalid authentication request.',
      'invalid_client': 'Application configuration error.',
      'server_error': 'Authentication service temporarily unavailable.',
      'temporarily_unavailable': 'Service temporarily unavailable. Please try again.'
    };
    
    const userMessage = errorMessages[error] || 'Authentication failed. Please try again.';
    showError(userMessage);
    
    // Log detailed error for debugging
    console.error('Auth error:', {
      error,
      error_description: urlParams.get('error_description'),
      error_uri: urlParams.get('error_uri')
    });
  }
}
```

## **5. Testing Your Integration**

Use these steps to test your hosted auth integration:

### **Development Testing**
1. Set up a local test environment
2. Configure callback URL to `http://localhost:3000/auth/callback`
3. Test with different providers
4. Verify error handling

### **Production Checklist**
- [ ] **HTTPS URLs** - All redirect URIs use HTTPS
- [ ] **Error Handling** - Graceful error display
- [ ] **Token Security** - Secure token storage
- [ ] **State Validation** - Prevent CSRF attacks
- [ ] **Provider Testing** - Test all enabled OAuth providers

:::info Next Steps
Once implementation is complete, review our [Security Best Practices](/docs/hosted-auth/security) and explore [Customization](/docs/hosted-auth/customization) options to match your brand.
:::

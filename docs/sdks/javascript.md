---
id: javascript
title: JavaScript/TypeScript SDK
sidebar_label: JavaScript/TypeScript
description: Complete guide to the @passkeyme/auth SDK for JavaScript and TypeScript applications
---

# 📜 JavaScript/TypeScript SDK

The `@passkeyme/auth` SDK provides comprehensive authentication for web applications using PasskeyMe's hosted authentication pages. **This SDK is the recommended solution for Angular, Vue.js, Svelte, vanilla JavaScript, and other frameworks while we develop dedicated framework SDKs.**

:::info Framework Strategy
- **React developers**: Use the [React SDK](/docs/sdks/react) for inline components and better integration
- **Other frameworks**: Use this JavaScript SDK with hosted authentication pages
- **Coming soon**: Dedicated SDKs for Angular, Vue.js, and other popular frameworks
:::

Perfect for vanilla JavaScript, TypeScript, Vue.js, Angular, Svelte, and any modern web framework that doesn't yet have a dedicated PasskeyMe SDK.

## 🚀 Quick Start

### Installation

```bash
npm install @passkeyme/auth
```

### Basic Setup

```typescript
import { PasskeymeAuth } from '@passkeyme/auth';

const auth = new PasskeymeAuth({
  appId: 'your-app-id',
  redirectUri: 'https://yourapp.com/auth/callback'
});

// Initialize the SDK
await auth.init();
```

## 🏗️ Configuration

### Configuration Options

```typescript
interface PasskeymeConfig {
  /** Your PasskeyMe application ID (required) */
  appId: string;
  
  /** Base URL of your PasskeyMe server */
  baseUrl?: string; // Default: 'https://api.passkeyme.com'
  
  /** Redirect URI after authentication */
  redirectUri?: string; // Default: current origin + '/auth/callback'
  
  /** Authentication mode */
  mode?: 'hosted'; // Default: 'hosted'
  
  /** Enable debug logging */
  debug?: boolean; // Default: false
  
  /** Request timeout in milliseconds */
  timeout?: number; // Default: 10000
  
  /** Token storage mechanism */
  storage?: 'localStorage' | 'sessionStorage' | 'memory'; // Default: 'localStorage'
}
```

### Environment-Based Configuration

```typescript
const auth = new PasskeymeAuth({
  appId: process.env.PASSKEYME_APP_ID!,
  baseUrl: process.env.PASSKEYME_BASE_URL,
  redirectUri: window.location.origin + '/auth/callback',
  debug: process.env.NODE_ENV === 'development',
  storage: process.env.NODE_ENV === 'development' ? 'sessionStorage' : 'localStorage'
});
```

## 🔐 Authentication Methods

### Smart Login (Recommended)

The `smartLogin` function provides intelligent passkey authentication with automatic fallbacks:

```typescript
// Smart login attempts passkey authentication first, falls back to hosted auth
const result = await auth.smartLogin(username, apiKey);

if (result.method === 'passkey') {
  console.log('Passkey authentication successful:', result.user);
} else {
  console.log('Redirected to hosted authentication page');
}
```

**Smart Login Features:**
- **Discoverable Credentials**: Automatically attempts passwordless login if supported
- **Username Persistence**: Remembers last successful username for faster future logins  
- **Intelligent Fallback**: Redirects to hosted auth if passkey authentication fails
- **Device Detection**: Only attempts passkey auth on supported devices

```typescript
// Basic usage - handles everything automatically
await auth.smartLogin();

// With specific username
await auth.smartLogin('user@example.com');

// With custom API key for passkey authentication
await auth.smartLogin('user@example.com', 'your-passkey-api-key');
```

### General Login (All Methods)

Redirect to hosted authentication page with all configured methods:

```typescript
// Basic redirect
auth.redirectToLogin();

// With custom parameters
auth.redirectToLogin({
  state: 'custom-state-data',
  redirectUri: 'https://myapp.com/custom/callback',
  authMethod: 'passkey' // Pre-select authentication method
});
```

### OAuth Provider Login

Direct redirect to specific OAuth providers:

```typescript
// Google OAuth
auth.redirectToOAuth('google');

// GitHub OAuth
auth.redirectToOAuth('github');

// Microsoft OAuth
auth.redirectToOAuth('microsoft');

// With custom callback
auth.redirectToOAuth('google', {
  redirectUri: 'https://myapp.com/oauth/callback',
  state: 'custom-oauth-state'
});
```

### Method-Specific Login

```typescript
// Direct to passkey authentication
auth.redirectToLogin({ authMethod: 'passkey' });

// Direct to username/password
auth.redirectToLogin({ authMethod: 'password' });

// Direct to specific OAuth provider
auth.redirectToLogin({ 
  authMethod: 'oauth', 
  provider: 'google' 
});
```

## 🔄 Handling Authentication

### Authentication Callback

Create a callback page to handle returns from hosted authentication:

```typescript
// /auth/callback page
async function handleAuthCallback() {
  try {
    const user = await auth.handleAuthCallback();
    
    console.log('Authentication successful:', user);
    
    // Redirect to protected area
    window.location.href = '/dashboard';
    
  } catch (error) {
    console.error('Authentication failed:', error);
    
    // Handle specific error types
    if (error.code === 'AUTH_CANCELLED') {
      window.location.href = '/login?message=cancelled';
    } else {
      window.location.href = '/login?error=auth_failed';
    }
  }
}

// Call when page loads
if (window.location.pathname === '/auth/callback') {
  handleAuthCallback();
}
```

### URL Parameter Handling

```typescript
// Get state parameter from callback
const callbackData = await auth.handleAuthCallback();
console.log('Custom state:', callbackData.state);

// Handle errors from URL parameters
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('error')) {
  console.error('Auth error:', urlParams.get('error_description'));
}
```

## 👤 User Management

### Authentication State

```typescript
// Get current authentication state
const state = auth.state;
console.log('User:', state.user);
console.log('Authenticated:', state.isAuthenticated);
console.log('Loading:', state.loading);
console.log('Error:', state.error);

// Check authentication status
if (auth.isAuthenticated()) {
  console.log('User is logged in');
} else {
  console.log('User is not logged in');
}
```

### Event Listeners

```typescript
// Listen for authentication events
const unsubscribe = auth.addEventListener((event) => {
  switch (event.type) {
    case 'login':
      console.log('User signed in:', event.user);
      updateUI(event.user);
      break;
      
    case 'logout':
      console.log('User signed out');
      redirectToLogin();
      break;
      
    case 'error':
      console.error('Auth error:', event.error);
      showErrorMessage(event.error.message);
      break;
      
    case 'token_refresh':
      console.log('Token refreshed');
      break;
  }
});

// Clean up listener when done
// unsubscribe();
```

### User Information

```typescript
// Get current user
const user = auth.getCurrentUser();
if (user) {
  console.log('Email:', user.email);
  console.log('Name:', user.name);
  console.log('Picture:', user.picture);
  console.log('Provider:', user.provider);
  console.log('Created:', user.createdAt);
  console.log('Last login:', user.lastLoginAt);
}

// Wait for auth state to load
await auth.waitForAuthState();
const user = auth.getCurrentUser();
```

## 🔑 Token Management

### Access Tokens

```typescript
// Get current access token (auto-refreshes if needed)
try {
  const token = await auth.getAccessToken();
  
  // Use token for API calls
  const response = await fetch('/api/protected', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
} catch (error) {
  console.error('Failed to get access token:', error);
  // User may need to re-authenticate
  auth.redirectToLogin();
}
```

### Token Refresh

```typescript
// Manual token refresh
try {
  const newToken = await auth.refreshAccessToken();
  console.log('Token refreshed:', newToken);
} catch (error) {
  console.error('Token refresh failed:', error);
  // Redirect to login
  auth.redirectToLogin();
}

// Check if token needs refresh
if (auth.isTokenExpired()) {
  await auth.refreshAccessToken();
}
```

### Token Storage

```typescript
// Configure token storage
const auth = new PasskeymeAuth({
  appId: 'your-app-id',
  storage: 'sessionStorage' // Tokens cleared when tab closes
});

// Or use memory storage (tokens lost on page refresh)
const auth = new PasskeymeAuth({
  appId: 'your-app-id',
  storage: 'memory'
});
```

## 🚪 Logout

### Basic Logout

```typescript
// Sign out current user
await auth.logout();
console.log('User signed out');

// Redirect after logout
await auth.logout();
window.location.href = '/';
```

### Logout Options

```typescript
// Logout with options
await auth.logout({
  redirectTo: '/goodbye', // Redirect after logout
  clearAllTokens: true,   // Clear all stored tokens
  revokeTokens: true      // Revoke tokens on server
});
```

## 🛡️ Error Handling

### Error Types

```typescript
import { PasskeymeError } from '@passkeyme/auth';

try {
  await auth.handleAuthCallback();
} catch (error) {
  if (error instanceof PasskeymeError) {
    switch (error.code) {
      case 'AUTH_CANCELLED':
        console.log('User cancelled authentication');
        break;
      case 'INVALID_CALLBACK':
        console.error('Invalid callback parameters');
        break;
      case 'TOKEN_EXPIRED':
        console.log('Token expired, need to re-authenticate');
        auth.redirectToLogin();
        break;
      case 'NETWORK_ERROR':
        console.error('Network error:', error.message);
        break;
      default:
        console.error('Unknown error:', error);
    }
  }
}
```

### Global Error Handling

```typescript
// Set up global error handler
auth.addEventListener((event) => {
  if (event.type === 'error') {
    // Log error to monitoring service
    console.error('PasskeyMe error:', event.error);
    
    // Show user-friendly message
    showNotification('Authentication error occurred', 'error');
    
    // Redirect to login for auth errors
    if (event.error.code.startsWith('AUTH_')) {
      setTimeout(() => auth.redirectToLogin(), 2000);
    }
  }
});
```

## 🔧 Advanced Usage

### Building Custom Authentication Components

For frameworks without dedicated PasskeyMe SDKs, you can build custom authentication components using the JavaScript SDK:

#### Vue.js Custom Component

```vue
<template>
  <div class="auth-component">
    <button 
      @click="handleSmartLogin" 
      :disabled="loading"
      class="smart-login-btn"
    >
      {{ loading ? 'Authenticating...' : '🔐 Sign In' }}
    </button>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { PasskeymeAuth } from '@passkeyme/auth';

export default {
  data() {
    return {
      auth: null,
      loading: false,
      error: null
    }
  },
  
  async mounted() {
    this.auth = new PasskeymeAuth({
      appId: process.env.VUE_APP_PASSKEYME_APP_ID,
      redirectUri: window.location.origin + '/auth/callback'
    });
    
    await this.auth.init();
  },
  
  methods: {
    async handleSmartLogin() {
      this.loading = true;
      this.error = null;
      
      try {
        const result = await this.auth.smartLogin();
        
        if (result.method === 'passkey') {
          this.$emit('login-success', result.user);
        }
        // If method is 'redirect', user was redirected to hosted auth
        
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
```

#### Angular Service Integration

```typescript
// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PasskeymeAuth } from '@passkeyme/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = new PasskeymeAuth({
    appId: environment.passkeymeAppId,
    redirectUri: `${window.location.origin}/auth/callback`
  });

  private userSubject = new BehaviorSubject(null);
  private loadingSubject = new BehaviorSubject(true);

  user$: Observable<any> = this.userSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  async init() {
    await this.auth.init();
    this.userSubject.next(this.auth.getCurrentUser());
    this.loadingSubject.next(false);
    
    this.auth.addEventListener((event) => {
      if (event.type === 'login') {
        this.userSubject.next(event.user);
      } else if (event.type === 'logout') {
        this.userSubject.next(null);
      }
    });
  }

  async smartLogin(username?: string): Promise<any> {
    return this.auth.smartLogin(username);
  }

  async logout() {
    await this.auth.logout();
  }

  async getAccessToken(): Promise<string> {
    return this.auth.getAccessToken();
  }
}
```

#### Svelte Custom Store

```typescript
// stores/auth.ts
import { writable } from 'svelte/store';
import { PasskeymeAuth } from '@passkeyme/auth';

const auth = new PasskeymeAuth({
  appId: import.meta.env.VITE_PASSKEYME_APP_ID,
  redirectUri: `${window.location.origin}/auth/callback`
});

export const authState = writable({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
});

export const authService = {
  async init() {
    await auth.init();
    const user = auth.getCurrentUser();
    authState.set({
      user,
      isAuthenticated: !!user,
      loading: false,
      error: null
    });
    
    auth.addEventListener((event) => {
      authState.update(state => {
        if (event.type === 'login') {
          return { ...state, user: event.user, isAuthenticated: true, error: null };
        } else if (event.type === 'logout') {
          return { ...state, user: null, isAuthenticated: false, error: null };
        } else if (event.type === 'error') {
          return { ...state, error: event.error, loading: false };
        }
        return state;
      });
    });
  },
  
  async smartLogin(username?: string) {
    authState.update(state => ({ ...state, loading: true, error: null }));
    
    try {
      const result = await auth.smartLogin(username);
      return result;
    } catch (error) {
      authState.update(state => ({ ...state, error: error.message, loading: false }));
      throw error;
    }
  },
  
  logout: () => auth.logout(),
  getAccessToken: () => auth.getAccessToken()
};
```

### When to Use Hosted Pages

Hosted authentication pages are the recommended approach for the JavaScript SDK:

**Ideal Use Cases:**
- **Quick Integration**: Get authentication working in minutes
- **Multiple Auth Methods**: Users can choose between OAuth, passkeys, and passwords
- **Consistent UX**: Professional, branded authentication experience
- **Framework Agnostic**: Works with any web framework
- **Security**: PasskeyMe handles all security best practices

**Implementation Strategy:**
```typescript
// Primary authentication method
await auth.smartLogin(); // Tries passkey first, falls back to hosted auth

// Direct to hosted auth (skip passkey attempt)
auth.redirectToLogin();

// Direct to specific OAuth provider
auth.redirectToOAuth('google');
```

### Custom Request Interceptors

```typescript
// Add authorization header to all fetch requests
const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
  if (auth.isAuthenticated() && !options.headers?.Authorization) {
    const token = await auth.getAccessToken();
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  return originalFetch(url, options);
};
```

### Route Protection

```typescript
// Protect specific routes
function requireAuth() {
  if (!auth.isAuthenticated()) {
    // Save current location for redirect after login
    localStorage.setItem('returnTo', window.location.pathname);
    auth.redirectToLogin();
    return false;
  }
  return true;
}

// Usage in routing
if (window.location.pathname === '/dashboard' && !requireAuth()) {
  // User will be redirected to login
  return;
}
```

### State Persistence

```typescript
// Handle page refresh
window.addEventListener('beforeunload', () => {
  // Save any important state
  localStorage.setItem('authState', JSON.stringify({
    returnTo: window.location.pathname,
    timestamp: Date.now()
  }));
});

// Restore state on load
window.addEventListener('load', async () => {
  await auth.init();
  
  const savedState = localStorage.getItem('authState');
  if (savedState) {
    const { returnTo } = JSON.parse(savedState);
    if (auth.isAuthenticated() && returnTo && returnTo !== '/login') {
      window.location.href = returnTo;
    }
    localStorage.removeItem('authState');
  }
});
```

## 📱 Framework Integration Examples

### Vue.js 3 (Composition API)

```typescript
// composables/useAuth.ts
import { ref, readonly, onMounted } from 'vue';
import { PasskeymeAuth } from '@passkeyme/auth';

const auth = new PasskeymeAuth({
  appId: import.meta.env.VITE_PASSKEYME_APP_ID
});

const user = ref(null);
const isAuthenticated = ref(false);
const loading = ref(true);

export function useAuth() {
  onMounted(async () => {
    await auth.init();
    user.value = auth.getCurrentUser();
    isAuthenticated.value = auth.isAuthenticated();
    loading.value = false;
    
    auth.addEventListener((event) => {
      if (event.type === 'login') {
        user.value = event.user;
        isAuthenticated.value = true;
      } else if (event.type === 'logout') {
        user.value = null;
        isAuthenticated.value = false;
      }
    });
  });

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    loading: readonly(loading),
    smartLogin: async (username?: string) => auth.smartLogin(username),
    login: () => auth.redirectToLogin(),
    logout: () => auth.logout(),
    getAccessToken: () => auth.getAccessToken()
  };
}
```

### Angular Service

```typescript
// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PasskeymeAuth } from '@passkeyme/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = new PasskeymeAuth({
    appId: environment.passkeymeAppId
  });

  private userSubject = new BehaviorSubject(null);
  private loadingSubject = new BehaviorSubject(true);

  user$: Observable<any> = this.userSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  async init() {
    await this.auth.init();
    this.userSubject.next(this.auth.getCurrentUser());
    this.loadingSubject.next(false);
    
    this.auth.addEventListener((event) => {
      if (event.type === 'login') {
        this.userSubject.next(event.user);
      } else if (event.type === 'logout') {
        this.userSubject.next(null);
      }
    });
  }

  async smartLogin(username?: string) {
    return this.auth.smartLogin(username);
  }

  login() {
    this.auth.redirectToLogin();
  }

  async logout() {
    await this.auth.logout();
  }

  async getAccessToken(): Promise<string> {
    return this.auth.getAccessToken();
  }
}
```

### Svelte Store

```typescript
// stores/auth.ts
import { writable } from 'svelte/store';
import { PasskeymeAuth } from '@passkeyme/auth';

const auth = new PasskeymeAuth({
  appId: import.meta.env.VITE_PASSKEYME_APP_ID
});

export const authState = writable({
  user: null,
  isAuthenticated: false,
  loading: true
});

export const authService = {
  async init() {
    await auth.init();
    const user = auth.getCurrentUser();
    authState.set({
      user,
      isAuthenticated: !!user,
      loading: false
    });
    
    auth.addEventListener((event) => {
      authState.update(state => {
        if (event.type === 'login') {
          return { ...state, user: event.user, isAuthenticated: true };
        } else if (event.type === 'logout') {
          return { ...state, user: null, isAuthenticated: false };
        }
        return state;
      });
    });
  },
  
  smartLogin: (username?: string) => auth.smartLogin(username),
  login: () => auth.redirectToLogin(),
  logout: () => auth.logout(),
  getAccessToken: () => auth.getAccessToken()
};
```

## 🔍 Debugging

### Debug Mode

```typescript
const auth = new PasskeymeAuth({
  appId: 'your-app-id',
  debug: true // Enable detailed logging
});

// Manual debug logging
auth.setDebugMode(true);
```

### Common Issues

**Tokens not persisting:**
```typescript
// Check storage mechanism
console.log('Storage type:', auth.config.storage);

// Verify localStorage availability
if (typeof Storage !== "undefined") {
  console.log('localStorage is available');
} else {
  console.log('localStorage is not supported');
}
```

**Callback not working:**
```typescript
// Verify callback URL configuration
console.log('Configured redirect URI:', auth.config.redirectUri);
console.log('Current URL:', window.location.href);

// Check for callback parameters
const urlParams = new URLSearchParams(window.location.search);
console.log('Code parameter:', urlParams.get('code'));
console.log('State parameter:', urlParams.get('state'));
```

## 📚 API Reference

### PasskeymeAuth Class

```typescript
class PasskeymeAuth {
  constructor(config: PasskeymeConfig)
  
  // Initialization
  init(): Promise<void>
  
  // Authentication
  redirectToLogin(options?: LoginOptions): void
  redirectToOAuth(provider: string, options?: OAuthOptions): void
  handleAuthCallback(): Promise<User>
  smartLogin(username?: string, apiKey?: string): Promise<{ method: "passkey" | "redirect"; user?: User }>
  
  // State management
  getCurrentUser(): User | null
  isAuthenticated(): boolean
  getState(): AuthState
  waitForAuthState(): Promise<AuthState>
  
  // Token management
  getAccessToken(): Promise<string>
  refreshAccessToken(): Promise<string>
  isTokenExpired(): boolean
  
  // Event handling
  addEventListener(callback: (event: AuthEvent) => void): () => void
  
  // Logout
  logout(options?: LogoutOptions): Promise<void>
  
  // Utilities
  setDebugMode(enabled: boolean): void
  static version: string
}
```

### Type Definitions

```typescript
interface User {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  provider?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: PasskeymeError | null;
}

interface LoginOptions {
  state?: string;
  redirectUri?: string;
  authMethod?: 'passkey' | 'password' | 'oauth';
  provider?: string;
}

interface LogoutOptions {
  redirectTo?: string;
  clearAllTokens?: boolean;
  revokeTokens?: boolean;
}

interface SmartLoginResult {
  method: 'passkey' | 'redirect';
  user?: User;
}
```

## Next Steps

- **[React SDK](/docs/sdks/react)** - **Recommended for React apps** with inline components
- **[API Reference](/docs/api/api-overview)** - Direct API usage for custom integrations
- **[Configuration](/docs/configuration/authentication-methods)** - Configure auth methods
- **[Troubleshooting](/docs/troubleshooting/common-issues)** - Solve common problems

:::tip Framework Migration
When dedicated SDKs become available for your framework, migrating from the JavaScript SDK will be straightforward with our migration guides.
:::

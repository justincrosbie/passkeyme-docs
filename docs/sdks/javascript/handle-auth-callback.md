---
id: handle-auth-callback
title: handleAuthCallback Method
sidebar_label: handleAuthCallback
description: Handle authentication return from OAuth flows and hosted pages
---

# 🔄 handleAuthCallback Method

The `handleAuthCallback` method processes **authentication returns from hosted auth pages and OAuth flows**. This method extracts authentication codes from URL parameters and exchanges them for user tokens, completing the authentication process.

## ✨ **Why handleAuthCallback?**

- **🔄 OAuth Completion** - Processes authorization codes from OAuth providers
- **🔒 Secure Token Exchange** - Safely exchanges codes for authentication tokens
- **🌐 Hosted Auth Return** - Handles returns from PasskeyMe hosted pages
- **📱 Universal Support** - Works with all OAuth providers and authentication methods
- **⚡ Automatic Processing** - Handles URL parsing and validation automatically
- **🛡️ Error Handling** - Comprehensive error detection and reporting

## 📋 **Method Signature**

```typescript
async handleAuthCallback(): Promise<User>
```

### **Parameters**

- **None** - Method automatically reads from current URL parameters

### **Return Value**

- **`Promise<User>`** - Authenticated user object on success
- **Throws** - `PasskeymeError` on authentication failure or invalid callback

### **URL Parameters (Automatically Processed)**

| Parameter | Description |
|-----------|-------------|
| `code` | Authorization code from OAuth provider |
| `state` | Custom state data preserved across auth flow |
| `error` | Error code if authentication failed |
| `error_description` | Human-readable error description |

## 🚀 **Basic Usage**

### **Simple Callback Handling**

```typescript
// callback.js - Handle authentication callback
import { PasskeymeAuth } from '@passkeyme/auth';

const auth = new PasskeymeAuth({
  appId: 'your-app-id',
  redirectUri: window.location.origin + '/auth/callback'
});

async function handleCallback() {
  try {
    await auth.init();
    
    // Process the authentication callback
    const user = await auth.handleAuthCallback();
    
    console.log('✅ Authentication successful!', user);
    
    // Store user session
    localStorage.setItem('user', JSON.stringify(user));
    
    // Redirect to app
    window.location.href = '/dashboard';
    
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    
    // Redirect back to login with error
    window.location.href = '/login?error=auth_failed';
  }
}

// Run callback handler when page loads
document.addEventListener('DOMContentLoaded', handleCallback);
```

### **Callback with State Restoration**

```typescript
// callback-with-state.js
async function handleCallbackWithState() {
  const auth = new PasskeymeAuth({
    appId: 'your-app-id',
    redirectUri: window.location.origin + '/auth/callback'
  });

  try {
    await auth.init();
    
    // Get current URL parameters before processing
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get('state');
    
    // Process authentication
    const user = await auth.handleAuthCallback();
    
    console.log('Authentication successful:', user);
    
    // Restore application state if provided
    let redirectPath = '/dashboard'; // default
    
    if (stateParam) {
      try {
        const state = JSON.parse(stateParam);
        redirectPath = state.returnTo || '/dashboard';
        
        // Restore any additional context
        if (state.context) {
          sessionStorage.setItem('restored_context', JSON.stringify(state.context));
        }
      } catch (error) {
        console.warn('Failed to parse state parameter:', error);
      }
    }
    
    // Store user and redirect
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = redirectPath;
    
  } catch (error) {
    console.error('Authentication callback failed:', error);
    window.location.href = '/login?error=callback_failed';
  }
}

handleCallbackWithState();
```

## 🎯 **Usage Patterns**

### **SPA Callback Page**

```html
<!-- /auth/callback.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Authentication Complete</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: #f5f5f5;
    }
    .loading {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loading">
    <div class="spinner"></div>
    <h2>Completing Authentication...</h2>
    <p>Please wait while we log you in.</p>
  </div>

  <script type="module">
    import { PasskeymeAuth } from 'https://unpkg.com/@passkeyme/auth@latest/dist/index.esm.js';

    async function processCallback() {
      const auth = new PasskeymeAuth({
        appId: 'your-app-id',
        redirectUri: window.location.origin + '/auth/callback.html'
      });

      try {
        await auth.init();
        const user = await auth.handleAuthCallback();
        
        // Post message to parent window (for popup flows)
        if (window.opener) {
          window.opener.postMessage({
            type: 'AUTH_SUCCESS',
            user: user
          }, window.location.origin);
          window.close();
        } else {
          // Regular redirect flow
          localStorage.setItem('user', JSON.stringify(user));
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Callback processing failed:', error);
        
        if (window.opener) {
          window.opener.postMessage({
            type: 'AUTH_ERROR',
            error: error.message
          }, window.location.origin);
          window.close();
        } else {
          window.location.href = '/login?error=auth_failed';
        }
      }
    }

    processCallback();
  </script>
</body>
</html>
```

### **React Router Integration**

```typescript
// CallbackPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PasskeymeAuth } from '@passkeyme/auth';

function CallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function processCallback() {
      const auth = new PasskeymeAuth({
        appId: 'your-app-id',
        redirectUri: window.location.origin + '/auth/callback'
      });

      try {
        await auth.init();
        const user = await auth.handleAuthCallback();
        
        setStatus('success');
        
        // Store user in context/state management
        // setUser(user);
        
        // Handle state restoration
        const stateParam = searchParams.get('state');
        let redirectPath = '/dashboard';
        
        if (stateParam) {
          try {
            const state = JSON.parse(stateParam);
            redirectPath = state.returnTo || '/dashboard';
          } catch (e) {
            console.warn('Failed to parse state:', e);
          }
        }
        
        // Redirect after short delay
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 1000);
        
      } catch (error) {
        console.error('Authentication failed:', error);
        setStatus('error');
        setError(error.message || 'Authentication failed');
        
        // Redirect to login after delay
        setTimeout(() => {
          navigate('/login?error=callback_failed', { replace: true });
        }, 3000);
      }
    }

    processCallback();
  }, [navigate, searchParams]);

  return (
    <div className="callback-page">
      {status === 'processing' && (
        <div className="processing">
          <div className="spinner" />
          <h2>Completing Authentication...</h2>
          <p>Please wait while we log you in.</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="success">
          <h2>✅ Authentication Successful!</h2>
          <p>Redirecting to your dashboard...</p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="error">
          <h2>❌ Authentication Failed</h2>
          <p>{error}</p>
          <p>Redirecting back to login...</p>
        </div>
      )}
    </div>
  );
}

export default CallbackPage;
```

### **Vue.js Router Integration**

```typescript
// CallbackView.vue
<template>
  <div class="callback-view">
    <div v-if="status === 'processing'" class="processing">
      <div class="spinner"></div>
      <h2>Completing Authentication...</h2>
      <p>Please wait while we log you in.</p>
    </div>
    
    <div v-else-if="status === 'success'" class="success">
      <h2>✅ Authentication Successful!</h2>
      <p>Welcome back, {{ user?.name }}!</p>
    </div>
    
    <div v-else-if="status === 'error'" class="error">
      <h2>❌ Authentication Failed</h2>
      <p>{{ errorMessage }}</p>
      <button @click="retryLogin">Try Again</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { PasskeymeAuth } from '@passkeyme/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const status = ref<'processing' | 'success' | 'error'>('processing');
const user = ref(null);
const errorMessage = ref('');

onMounted(async () => {
  await processCallback();
});

async function processCallback() {
  const auth = new PasskeymeAuth({
    appId: 'your-app-id',
    redirectUri: window.location.origin + '/auth/callback'
  });

  try {
    await auth.init();
    const authenticatedUser = await auth.handleAuthCallback();
    
    user.value = authenticatedUser;
    status.value = 'success';
    
    // Update global auth state
    authStore.setUser(authenticatedUser);
    
    // Handle state restoration
    let redirectPath = '/dashboard';
    
    if (route.query.state) {
      try {
        const state = JSON.parse(route.query.state as string);
        redirectPath = state.returnTo || '/dashboard';
        
        // Restore any additional context
        if (state.context) {
          authStore.setContext(state.context);
        }
      } catch (e) {
        console.warn('Failed to parse state:', e);
      }
    }
    
    // Navigate after delay
    setTimeout(() => {
      router.push(redirectPath);
    }, 1500);
    
  } catch (error) {
    console.error('Authentication failed:', error);
    status.value = 'error';
    errorMessage.value = error.message || 'Authentication failed';
    
    // Auto-redirect to login after delay
    setTimeout(() => {
      router.push('/login?error=callback_failed');
    }, 5000);
  }
}

function retryLogin() {
  router.push('/login');
}
</script>
```

### **Angular Component**

```typescript
// callback.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PasskeymeAuth } from '@passkeyme/auth';

@Component({
  selector: 'app-callback',
  template: `
    <div class="callback-container">
      <div *ngIf="status === 'processing'" class="processing">
        <div class="spinner"></div>
        <h2>Completing Authentication...</h2>
        <p>Please wait while we log you in.</p>
      </div>
      
      <div *ngIf="status === 'success'" class="success">
        <h2>✅ Authentication Successful!</h2>
        <p>Welcome back!</p>
      </div>
      
      <div *ngIf="status === 'error'" class="error">
        <h2>❌ Authentication Failed</h2>
        <p>{{ errorMessage }}</p>
        <button (click)="retryLogin()">Try Again</button>
      </div>
    </div>
  `,
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {
  status: 'processing' | 'success' | 'error' = 'processing';
  errorMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.processCallback();
  }

  private async processCallback() {
    const auth = new PasskeymeAuth({
      appId: 'your-app-id',
      redirectUri: window.location.origin + '/auth/callback'
    });

    try {
      await auth.init();
      const user = await auth.handleAuthCallback();
      
      this.status = 'success';
      
      // Update auth service
      this.authService.setUser(user);
      
      // Handle state restoration
      let redirectPath = '/dashboard';
      
      this.route.queryParams.subscribe(params => {
        if (params['state']) {
          try {
            const state = JSON.parse(params['state']);
            redirectPath = state.returnTo || '/dashboard';
          } catch (e) {
            console.warn('Failed to parse state:', e);
          }
        }
      });
      
      // Navigate after delay
      setTimeout(() => {
        this.router.navigate([redirectPath]);
      }, 1500);
      
    } catch (error) {
      console.error('Authentication failed:', error);
      this.status = 'error';
      this.errorMessage = error.message || 'Authentication failed';
      
      setTimeout(() => {
        this.router.navigate(['/login'], { 
          queryParams: { error: 'callback_failed' }
        });
      }, 5000);
    }
  }

  retryLogin() {
    this.router.navigate(['/login']);
  }
}
```

## ⚙️ **Advanced Usage**

### **Popup Window Callback**

```typescript
// Popup-based authentication callback
class PopupAuthCallback {
  static async handlePopupCallback() {
    const auth = new PasskeymeAuth({
      appId: 'your-app-id',
      redirectUri: window.location.origin + '/auth/popup-callback'
    });

    try {
      await auth.init();
      const user = await auth.handleAuthCallback();
      
      // Send success message to parent window
      if (window.opener) {
        window.opener.postMessage({
          type: 'PASSKEYME_AUTH_SUCCESS',
          user: user,
          timestamp: Date.now()
        }, window.location.origin);
        
        window.close();
      } else {
        throw new Error('No parent window found for popup callback');
      }
      
    } catch (error) {
      console.error('Popup callback failed:', error);
      
      if (window.opener) {
        window.opener.postMessage({
          type: 'PASSKEYME_AUTH_ERROR',
          error: {
            message: error.message,
            code: error.code || 'UNKNOWN_ERROR'
          },
          timestamp: Date.now()
        }, window.location.origin);
        
        window.close();
      } else {
        // Fallback for standalone popup
        document.body.innerHTML = `
          <div style="text-align: center; padding: 2rem;">
            <h2>Authentication Failed</h2>
            <p>${error.message}</p>
            <button onclick="window.close()">Close</button>
          </div>
        `;
      }
    }
  }
}

// Usage in popup window
PopupAuthCallback.handlePopupCallback();
```

### **Error Recovery and Retry**

```typescript
class ResilientCallbackHandler {
  private auth: PasskeymeAuth;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.auth = new PasskeymeAuth({
      appId: 'your-app-id',
      redirectUri: window.location.origin + '/auth/callback'
    });
  }

  async handleCallbackWithRetry(): Promise<User> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        await this.auth.init();
        const user = await this.auth.handleAuthCallback();
        
        console.log(`✅ Authentication successful on attempt ${attempt}`);
        return user;
        
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed:`, error.message);
        
        // Don't retry certain error types
        if (this.isNonRetryableError(error)) {
          throw error;
        }
        
        // Wait before retry (with exponential backoff)
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }
    
    throw new Error(`Authentication failed after ${this.maxRetries} attempts: ${lastError.message}`);
  }

  private isNonRetryableError(error: any): boolean {
    // Don't retry on certain error types
    const nonRetryableCodes = [
      'INVALID_CODE',
      'CODE_EXPIRED',
      'USER_CANCELLED',
      'INVALID_CONFIG'
    ];
    
    return nonRetryableCodes.includes(error.code);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const handler = new ResilientCallbackHandler();
handler.handleCallbackWithRetry()
  .then(user => {
    console.log('Authentication successful:', user);
    window.location.href = '/dashboard';
  })
  .catch(error => {
    console.error('Authentication ultimately failed:', error);
    window.location.href = '/login?error=callback_failed';
  });
```

### **Analytics and Monitoring**

```typescript
class MonitoredCallbackHandler {
  private auth: PasskeymeAuth;

  constructor() {
    this.auth = new PasskeymeAuth({
      appId: 'your-app-id',
      redirectUri: window.location.origin + '/auth/callback'
    });
  }

  async handleMonitoredCallback() {
    const startTime = Date.now();
    const urlParams = new URLSearchParams(window.location.search);
    
    // Track callback attempt
    analytics.track('auth_callback_started', {
      hasCode: !!urlParams.get('code'),
      hasState: !!urlParams.get('state'),
      hasError: !!urlParams.get('error'),
      referrer: document.referrer,
      userAgent: navigator.userAgent
    });

    try {
      await this.auth.init();
      const user = await this.auth.handleAuthCallback();
      
      const duration = Date.now() - startTime;
      
      // Track successful callback
      analytics.track('auth_callback_success', {
        duration,
        userId: user.id,
        userEmail: user.email,
        authMethod: this.extractAuthMethod(urlParams)
      });

      // Identify user for future tracking
      analytics.identify(user.id, {
        email: user.email,
        name: user.name,
        authProvider: this.extractProvider(urlParams)
      });

      return user;

    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Track failed callback
      analytics.track('auth_callback_error', {
        duration,
        errorCode: error.code || 'unknown',
        errorMessage: error.message,
        urlError: urlParams.get('error')
      });

      throw error;
    }
  }

  private extractAuthMethod(urlParams: URLSearchParams): string {
    // Extract authentication method from URL or state
    const state = urlParams.get('state');
    if (state) {
      try {
        const parsed = JSON.parse(state);
        return parsed.authMethod || 'unknown';
      } catch (e) {
        // Ignore parsing errors
      }
    }
    return 'unknown';
  }

  private extractProvider(urlParams: URLSearchParams): string {
    // Extract OAuth provider from URL or state
    const state = urlParams.get('state');
    if (state) {
      try {
        const parsed = JSON.parse(state);
        return parsed.provider || 'unknown';
      } catch (e) {
        // Ignore parsing errors
      }
    }
    return 'unknown';
  }
}
```

## 🛡️ **Error Handling**

### **Comprehensive Error Handling**

```typescript
import { PasskeymeError, PasskeymeErrorCode } from '@passkeyme/auth';

async function robustCallbackHandler() {
  const auth = new PasskeymeAuth({
    appId: 'your-app-id',
    redirectUri: window.location.origin + '/auth/callback'
  });

  try {
    await auth.init();
    const user = await auth.handleAuthCallback();
    
    return { success: true, user };
    
  } catch (error) {
    console.error('Callback processing failed:', error);
    
    if (error instanceof PasskeymeError) {
      switch (error.code) {
        case PasskeymeErrorCode.AUTH_FAILED:
          return {
            success: false,
            error: 'Authentication failed. Please try signing in again.',
            retryable: true
          };
          
        case PasskeymeErrorCode.NETWORK_ERROR:
          return {
            success: false,
            error: 'Network error. Please check your connection and try again.',
            retryable: true
          };
          
        case PasskeymeErrorCode.INVALID_CONFIG:
          return {
            success: false,
            error: 'Configuration error. Please contact support.',
            retryable: false
          };
          
        default:
          return {
            success: false,
            error: error.userMessage || 'Authentication failed. Please try again.',
            retryable: error.retryable || false
          };
      }
    } else {
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
        retryable: true
      };
    }
  }
}

// Usage with error handling
robustCallbackHandler().then(result => {
  if (result.success) {
    localStorage.setItem('user', JSON.stringify(result.user));
    window.location.href = '/dashboard';
  } else {
    const errorParam = encodeURIComponent(result.error);
    const retryParam = result.retryable ? '&retryable=true' : '';
    window.location.href = `/login?error=${errorParam}${retryParam}`;
  }
});
```

## 🔗 **Related Methods**

- **[smartLogin](./smart-login.md)** - Intelligent authentication initiation
- **[redirectToLogin](./redirect-to-login.md)** - Direct redirect to hosted auth
- **[Advanced Usage](./advanced-usage.md)** - Complex authentication scenarios

## 📚 **Next Steps**

- **[State Management](../javascript.md#state-management)** - Managing authentication state
- **[Framework Integration](../javascript.md#framework-examples)** - Complete framework examples
- **[Error Handling Guide](../javascript.md#error-handling)** - Comprehensive error management

---

*handleAuthCallback is essential for completing the authentication flow. Ensure proper error handling and user experience in your callback implementation.*

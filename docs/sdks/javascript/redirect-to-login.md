---
id: redirect-to-login
title: redirectToLogin Method
sidebar_label: redirectToLogin
description: Direct redirect to Passkeyme hosted authentication pages
---

# 🌐 redirectToLogin Method

The `redirectToLogin` method provides **direct redirect to Passkeyme's hosted authentication pages**. This method gives you full control over when and how users are redirected to the hosted authentication experience.

## ✨ **Why redirectToLogin?**

- **🚀 Instant Redirect** - Immediate navigation to hosted auth pages
- **🎨 Hosted UI** - Passkeyme handles all authentication UI and flows
- **🔒 Secure by Default** - All authentication handled on Passkeyme's secure infrastructure
- **📱 Mobile Optimized** - Responsive design that works on all devices
- **⚡ Zero Maintenance** - Automatic updates and security patches
- **🌍 Universal Support** - Works on all browsers and devices

## 📋 **Method Signature**

```typescript
redirectToLogin(options?: LoginOptions): void
```

### **Parameters**

```typescript
interface LoginOptions {
  redirectUri?: string;    // Custom redirect URI
  state?: string;          // Custom state parameter
  authMethod?: string;     // Preferred authentication method
  provider?: string;       // Direct to specific OAuth provider
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `redirectUri` | `string` | ❌ | Override default redirect URI |
| `state` | `string` | ❌ | Custom state data to preserve |
| `authMethod` | `string` | ❌ | Preferred auth method hint |
| `provider` | `string` | ❌ | Direct to specific OAuth provider |

### **Return Value**

- **`void`** - Method doesn't return, browser redirects immediately

## 🚀 **Basic Usage**

### **Simple Redirect**

```typescript
import { PasskeymeAuth } from '@passkeyme/auth';

const auth = new PasskeymeAuth({
  appId: 'your-app-id',
  redirectUri: 'https://yourapp.com/auth/callback'
});

await auth.init();

// Simple redirect to hosted auth page
auth.redirectToLogin();
// Browser immediately redirects to hosted auth page
```

### **Redirect with Custom URI**

```typescript
// Redirect with custom callback URL
auth.redirectToLogin({
  redirectUri: 'https://yourapp.com/custom-callback'
});
```

### **Redirect with State**

```typescript
// Preserve application state across authentication
const currentPage = window.location.pathname;
const userSelection = JSON.stringify({ plan: 'premium' });

auth.redirectToLogin({
  state: JSON.stringify({
    returnTo: currentPage,
    context: userSelection
  })
});
```

### **Redirect to Specific Provider**

```typescript
// Direct to Google OAuth (bypasses provider selection)
auth.redirectToLogin({
  provider: 'google'
});

// Direct to GitHub OAuth
auth.redirectToLogin({
  provider: 'github'
});
```

## 🎯 **Usage Patterns**

### **Login Button Integration**

```typescript
// HTML
<button id="login-btn">Sign In</button>
<button id="google-login">Sign In with Google</button>
<button id="github-login">Sign In with GitHub</button>

// JavaScript
document.addEventListener('DOMContentLoaded', async () => {
  const auth = new PasskeymeAuth({
    appId: 'your-app-id',
    redirectUri: window.location.origin + '/auth/callback'
  });
  
  await auth.init();

  // General login button
  document.getElementById('login-btn')?.addEventListener('click', () => {
    auth.redirectToLogin();
  });

  // Provider-specific buttons
  document.getElementById('google-login')?.addEventListener('click', () => {
    auth.redirectToLogin({ provider: 'google' });
  });

  document.getElementById('github-login')?.addEventListener('click', () => {
    auth.redirectToLogin({ provider: 'github' });
  });
});
```

### **SPA Navigation Integration**

```typescript
// Vue.js Router Example
export default {
  methods: {
    async handleLogin() {
      // Store current route to return after auth
      const returnTo = this.$route.fullPath;
      
      this.auth.redirectToLogin({
        state: JSON.stringify({ returnTo })
      });
    },

    async handleProviderLogin(provider: string) {
      const contextData = {
        returnTo: this.$route.fullPath,
        userPreference: this.selectedPlan,
        referralCode: this.$route.query.ref
      };

      this.auth.redirectToLogin({
        provider,
        state: JSON.stringify(contextData)
      });
    }
  }
}
```

### **E-commerce Checkout Flow**

```typescript
// Checkout authentication
class CheckoutAuth {
  private auth: PasskeymeAuth;
  private checkoutData: any;

  constructor(checkoutData: any) {
    this.checkoutData = checkoutData;
    this.auth = new PasskeymeAuth({
      appId: 'your-app-id',
      redirectUri: window.location.origin + '/checkout/auth-return'
    });
  }

  async authenticateForCheckout() {
    // Store checkout context
    const checkoutContext = {
      items: this.checkoutData.items,
      total: this.checkoutData.total,
      currency: this.checkoutData.currency,
      timestamp: Date.now()
    };

    // Store in session storage for recovery
    sessionStorage.setItem('checkout_context', JSON.stringify(checkoutContext));

    // Redirect with checkout state
    this.auth.redirectToLogin({
      state: JSON.stringify({
        flow: 'checkout',
        context: checkoutContext
      }),
      redirectUri: window.location.origin + '/checkout/auth-return'
    });
  }

  async authenticateWithPreferredProvider(provider: string) {
    this.auth.redirectToLogin({
      provider,
      state: JSON.stringify({
        flow: 'checkout',
        context: this.checkoutData
      })
    });
  }
}

// Usage
const checkout = new CheckoutAuth(cartData);
checkout.authenticateForCheckout();
```

### **Multi-Step Authentication**

```typescript
// Progressive authentication flow
class ProgressiveAuth {
  private auth: PasskeymeAuth;
  
  constructor() {
    this.auth = new PasskeymeAuth({
      appId: 'your-app-id',
      redirectUri: window.location.origin + '/auth/callback'
    });
  }

  async startAuthFlow(step: 'signup' | 'verify' | 'complete') {
    const flowState = {
      step,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    // Store flow state for analytics
    localStorage.setItem('auth_flow_state', JSON.stringify(flowState));

    this.auth.redirectToLogin({
      state: JSON.stringify(flowState),
      authMethod: step === 'signup' ? 'registration' : 'login'
    });
  }

  async continueWithProvider(provider: string, userData: any) {
    const continuationState = {
      step: 'provider_continuation',
      provider,
      userData: {
        email: userData.email,
        name: userData.name,
        preferences: userData.preferences
      }
    };

    this.auth.redirectToLogin({
      provider,
      state: JSON.stringify(continuationState)
    });
  }
}
```

## ⚙️ **Advanced Usage**

### **Dynamic Redirect URI Selection**

```typescript
class DynamicAuth {
  private auth: PasskeymeAuth;

  constructor() {
    this.auth = new PasskeymeAuth({
      appId: 'your-app-id',
      redirectUri: this.getDefaultRedirectUri()
    });
  }

  private getDefaultRedirectUri(): string {
    const origin = window.location.origin;
    
    // Different callback URLs for different environments
    if (origin.includes('localhost')) {
      return `${origin}/dev-callback`;
    } else if (origin.includes('staging')) {
      return `${origin}/staging-callback`;
    } else {
      return `${origin}/auth/callback`;
    }
  }

  authenticateWithContext(context: 'mobile' | 'desktop' | 'embed') {
    const redirectUri = this.getContextualRedirectUri(context);
    
    this.auth.redirectToLogin({
      redirectUri,
      state: JSON.stringify({ context })
    });
  }

  private getContextualRedirectUri(context: string): string {
    const base = window.location.origin;
    
    switch (context) {
      case 'mobile':
        return `${base}/mobile-auth-complete`;
      case 'desktop':
        return `${base}/desktop-auth-complete`;
      case 'embed':
        return `${base}/embed-auth-complete`;
      default:
        return `${base}/auth/callback`;
    }
  }
}
```

### **Analytics and Tracking**

```typescript
class TrackedAuth {
  private auth: PasskeymeAuth;

  constructor() {
    this.auth = new PasskeymeAuth({
      appId: 'your-app-id',
      redirectUri: window.location.origin + '/auth/callback'
    });
  }

  trackAndRedirect(source: string, provider?: string) {
    // Track authentication attempt
    analytics.track('auth_redirect_initiated', {
      source,
      provider,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      page: window.location.pathname
    });

    // Include tracking data in state
    const trackingState = {
      source,
      provider,
      sessionId: this.generateSessionId(),
      trackingId: analytics.getVisitorId()
    };

    this.auth.redirectToLogin({
      provider,
      state: JSON.stringify(trackingState)
    });
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

// Usage
const trackedAuth = new TrackedAuth();

// Track login from specific page elements
document.getElementById('hero-cta')?.addEventListener('click', () => {
  trackedAuth.trackAndRedirect('hero_cta');
});

document.getElementById('nav-login')?.addEventListener('click', () => {
  trackedAuth.trackAndRedirect('navigation');
});

document.getElementById('google-btn')?.addEventListener('click', () => {
  trackedAuth.trackAndRedirect('provider_button', 'google');
});
```

### **Error Handling and Fallbacks**

```typescript
class RobustAuth {
  private auth: PasskeymeAuth;
  private fallbackUrls: string[];

  constructor() {
    this.auth = new PasskeymeAuth({
      appId: 'your-app-id',
      redirectUri: window.location.origin + '/auth/callback'
    });

    this.fallbackUrls = [
      window.location.origin + '/auth/callback',
      window.location.origin + '/auth/return',
      window.location.origin + '/login/complete'
    ];
  }

  async safeRedirectToLogin(options: any = {}) {
    try {
      // Validate configuration before redirect
      await this.validateConfig();
      
      this.auth.redirectToLogin(options);
    } catch (error) {
      console.error('Primary auth redirect failed:', error);
      this.tryFallbackRedirect(options);
    }
  }

  private async validateConfig() {
    // Ensure auth is properly initialized
    if (!this.auth.getCurrentUser && !this.auth.config) {
      throw new Error('Auth not properly initialized');
    }

    // Test connectivity
    try {
      await fetch(`${this.auth.config.baseUrl}/health`, { 
        method: 'HEAD',
        mode: 'no-cors',
        signal: AbortSignal.timeout(3000)
      });
    } catch (error) {
      console.warn('Auth service connectivity check failed:', error);
    }
  }

  private tryFallbackRedirect(options: any) {
    // Try different redirect URIs in case of configuration issues
    for (const fallbackUri of this.fallbackUrls) {
      try {
        this.auth.redirectToLogin({
          ...options,
          redirectUri: fallbackUri
        });
        return; // Success, exit
      } catch (error) {
        console.warn(`Fallback redirect failed for ${fallbackUri}:`, error);
      }
    }

    // Ultimate fallback: manual redirect
    this.manualFallbackRedirect(options);
  }

  private manualFallbackRedirect(options: any) {
    const params = new URLSearchParams({
      app_id: this.auth.config.appId,
      redirect_uri: options.redirectUri || this.fallbackUrls[0]
    });

    if (options.state) params.set('state', options.state);
    if (options.provider) params.set('provider', options.provider);

    const fallbackUrl = `${this.auth.config.baseUrl}/auth/${this.auth.config.appId}/login?${params.toString()}`;
    
    console.log('Using manual fallback redirect:', fallbackUrl);
    window.location.href = fallbackUrl;
  }
}
```

## 🔗 **Integration Examples**

### **React (Legacy/Fallback)**

```typescript
// React component using JavaScript SDK as fallback
import { useEffect, useState } from 'react';
import { PasskeymeAuth } from '@passkeyme/auth';

function LoginPage() {
  const [auth, setAuth] = useState<PasskeymeAuth | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authInstance = new PasskeymeAuth({
      appId: 'your-app-id',
      redirectUri: window.location.origin + '/auth/callback'
    });
    
    authInstance.init().then(() => {
      setAuth(authInstance);
    });
  }, []);

  const handleLogin = (provider?: string) => {
    if (!auth) return;
    
    setLoading(true);
    auth.redirectToLogin(provider ? { provider } : undefined);
  };

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => handleLogin()} disabled={loading || !auth}>
        Sign In
      </button>
      <button onClick={() => handleLogin('google')} disabled={loading || !auth}>
        Sign In with Google
      </button>
    </div>
  );
}
```

### **Angular Service**

```typescript
// auth.service.ts
import { Injectable } from '@angular/core';
import { PasskeymeAuth } from '@passkeyme/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: PasskeymeAuth;

  constructor() {
    this.auth = new PasskeymeAuth({
      appId: 'your-app-id',
      redirectUri: window.location.origin + '/auth/callback'
    });
  }

  async initialize() {
    await this.auth.init();
  }

  redirectToLogin(provider?: string) {
    const options = provider ? { provider } : undefined;
    this.auth.redirectToLogin(options);
  }

  redirectWithState(state: any, provider?: string) {
    this.auth.redirectToLogin({
      provider,
      state: JSON.stringify(state)
    });
  }
}

// login.component.ts
import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  template: `
    <div>
      <h1>Sign In</h1>
      <button (click)="login()">Sign In</button>
      <button (click)="loginWithGoogle()">Sign In with Google</button>
    </div>
  `
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  login() {
    this.authService.redirectToLogin();
  }

  loginWithGoogle() {
    this.authService.redirectToLogin('google');
  }
}
```

## 🔗 **Related Methods**

- **[smartLogin](./smart-login.md)** - Intelligent authentication with passkey attempts
- **[handleAuthCallback](./handle-auth-callback.md)** - Handle return from hosted auth
- **[Advanced Usage](./advanced-usage.md)** - Complex authentication scenarios

## 📚 **Next Steps**

- **[Handling Authentication Callbacks](./handle-auth-callback.md)** - Process successful returns
- **[Framework Integration Guide](../javascript.md#framework-examples)** - Vue, Angular, Svelte examples
- **[State Management](../javascript.md#state-management)** - Managing auth state across redirects

---

*redirectToLogin provides reliable, hosted authentication with full control over when and how users are redirected to the authentication experience.*

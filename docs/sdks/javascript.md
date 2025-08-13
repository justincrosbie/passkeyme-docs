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

// Smart authentication - automatically detects and uses passkeys
const user = await auth.smartLogin();
```

## 📖 **Authentication Methods**

The JavaScript SDK provides three main authentication methods for different use cases:

### **🧠 [Smart Login](./javascript/smart-login)**
Intelligent authentication that automatically detects available passkeys and uses the optimal authentication method:

```typescript
// Automatically chooses between passkey and redirect
const user = await auth.smartLogin();

// Prefer passkey authentication
const user = await auth.smartLogin({ preferPasskey: true });
```

**[→ Learn more about Smart Login](./javascript/smart-login)**

### **🔄 [Redirect to Login](./javascript/redirect-to-login)**
Direct redirect to PasskeyMe hosted authentication pages with full customization:

```typescript
// Basic redirect
await auth.redirectToLogin();

// Redirect with specific provider
await auth.redirectToLogin({ provider: 'google' });

// Redirect with custom state
await auth.redirectToLogin({ 
  state: JSON.stringify({ returnTo: '/dashboard' }) 
});
```

**[→ Learn more about Redirect to Login](./javascript/redirect-to-login)**

### **🔄 [Handle Auth Callback](./javascript/handle-auth-callback)**
Process authentication returns from hosted pages and OAuth flows:

```typescript
// Handle authentication callback
const user = await auth.handleAuthCallback();

// Store user and redirect
localStorage.setItem('user', JSON.stringify(user));
window.location.href = '/dashboard';
```

**[→ Learn more about Handle Auth Callback](./javascript/handle-auth-callback)**

### **⚡ [Advanced Usage](./javascript/advanced-usage)**
Complex authentication patterns, session management, and power-user features:

- **Multi-tenant authentication**
- **Progressive authentication levels**
- **Cross-origin authentication**
- **WebSocket authentication**
- **Platform-aware authentication**

**[→ Explore Advanced Usage Patterns](./javascript/advanced-usage)**

## 🏗️ Configuration

### Basic Configuration

```typescript
interface PasskeymeConfig {
  /** Your PasskeyMe application ID (required) */
  appId: string;
  
  /** Redirect URI after authentication */
  redirectUri?: string; // Default: current origin + '/auth/callback'
  
  /** Base URL of your PasskeyMe server */
  baseUrl?: string; // Default: 'https://api.passkeyme.com'
  
  /** Enable debug logging */
  debug?: boolean; // Default: false
  
  /** Authentication theme customization */
  theme?: {
    primaryColor?: string;
    logoUrl?: string;
  };
}
```

### Environment-Based Configuration

```typescript
const auth = new PasskeymeAuth({
  appId: process.env.PASSKEYME_APP_ID!,
  redirectUri: window.location.origin + '/auth/callback',
  debug: process.env.NODE_ENV === 'development',
  theme: {
    primaryColor: '#007bff',
    logoUrl: '/logo.png'
  }
});

await auth.init();
```

## 📝 Complete Example

Here's a complete authentication example showing the typical flow:

```typescript
// main.ts - Main application setup
import { PasskeymeAuth } from '@passkeyme/auth';

const auth = new PasskeymeAuth({
  appId: 'your-app-id',
  redirectUri: window.location.origin + '/auth/callback'
});

async function initializeAuth() {
  await auth.init();
  
  // Check for existing session
  const user = getStoredUser();
  if (user) {
    console.log('User already authenticated:', user);
    redirectToDashboard();
  } else {
    showLoginOptions();
  }
}

function showLoginOptions() {
  // Show login buttons
  document.getElementById('smart-login').onclick = async () => {
    try {
      const user = await auth.smartLogin();
      handleAuthSuccess(user);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };
  
  document.getElementById('google-login').onclick = async () => {
    await auth.redirectToLogin({ provider: 'google' });
  };
}

function handleAuthSuccess(user) {
  localStorage.setItem('user', JSON.stringify(user));
  redirectToDashboard();
}

function getStoredUser() {
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
}

function redirectToDashboard() {
  window.location.href = '/dashboard';
}

// Initialize when page loads
initializeAuth();
```

```typescript
// callback.ts - Authentication callback handler
async function processCallback() {
  try {
    const user = await auth.handleAuthCallback();
    
    console.log('Authentication successful:', user);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Redirect to intended destination
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state');
    let redirectTo = '/dashboard';
    
    if (state) {
      try {
        const parsed = JSON.parse(state);
        redirectTo = parsed.returnTo || '/dashboard';
      } catch (e) {
        // Ignore state parsing errors
      }
    }
    
    window.location.href = redirectTo;
    
  } catch (error) {
    console.error('Authentication callback failed:', error);
    window.location.href = '/login?error=auth_failed';
  }
}

// Process callback when page loads
document.addEventListener('DOMContentLoaded', processCallback);
```

## 📚 Next Steps

Ready to implement authentication? Choose your path:

### **🎯 Implementation Guides**

- **[🧠 Smart Login](./javascript/smart-login)** - Automatic passkey detection and fallback
- **[🔄 Redirect to Login](./javascript/redirect-to-login)** - Hosted authentication pages
- **[🔄 Handle Auth Callback](./javascript/handle-auth-callback)** - Process authentication returns  
- **[⚡ Advanced Usage](./javascript/advanced-usage)** - Complex patterns and power features

### **🏗️ Framework Resources**

- **[React SDK](/docs/sdks/react)** - **Recommended for React apps** with inline components
- **[API Reference](/docs/api/api-overview)** - Direct API usage for custom integrations
- **[Configuration](/docs/configuration/authentication-methods)** - Configure authentication methods
- **[Troubleshooting](/docs/troubleshooting/common-issues)** - Solve common problems

:::tip Framework Migration
When dedicated SDKs become available for your framework, migrating from the JavaScript SDK will be straightforward with our migration guides.
:::

---

*The JavaScript SDK provides the foundation for authentication in any web framework. Use the method-specific guides above to implement exactly the authentication flow your application needs.*

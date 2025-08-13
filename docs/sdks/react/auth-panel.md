---
id: auth-panel
title: PasskeymeAuthPanel
sidebar_label: PasskeymeAuthPanel
description: Complete all-in-one inline authentication component for React applications
---

# 🎨 PasskeymeAuthPanel

`PasskeymeAuthPanel` is the **all-in-one inline authentication solution** for React applications. It provides a complete authentication experience with passkeys, OAuth providers, and optional password support - all embedded directly in your application with zero redirects.

## ✨ **Why PasskeymeAuthPanel?**

- **🏠 Inline Authentication** - No redirects, users stay in your app
- **🎨 Fully Customizable** - Match your brand with theming and styling
- **⚡ Zero Configuration** - Works out of the box with sensible defaults
- **🔐 Multiple Auth Methods** - Passkeys, OAuth, and password in one component
- **📱 Mobile Optimized** - Touch-friendly with biometric support
- **🎯 TypeScript Ready** - Full type safety and IntelliSense

## 🚀 **Quick Start**

```tsx
import { PasskeymeAuthPanel } from '@passkeyme/react-auth';

function LoginPage() {
  const handleAuthSuccess = (user, method) => {
    console.log(`User authenticated via ${method}:`, user);
    // Redirect to dashboard, store user state, etc.
  };

  const handleError = (error) => {
    console.error('Authentication failed:', error);
  };

  const handleProviderSelect = (provider) => {
    console.log(`Provider selected: ${provider}`);
  };

  return (
    <div className="login-container">
      <h1>Welcome Back</h1>
      <PasskeymeAuthPanel
        providers={["google", "github"]}
        enablePasskeys={true}
        layout="vertical"
        spacing="normal"
        title="Welcome to PasskeyMe"
        subtitle="Experience seamless authentication"
        passkeyButtonText="🚀 Sign in with Passkey"
        dividerText="or choose your provider"
        autoTriggerPasskey={false}
        passkeyFirst={true}
        hideProvidersInitially={false}
        debugMode={false}
        showDebugInfo={false}
        onSuccess={handleAuthSuccess}
        onError={handleError}
        onProviderSelect={handleProviderSelect}
        onPasskeyAttempt={() => console.log('Passkey attempt started')}
        onOAuthRequired={(providers) => console.log('OAuth required:', providers)}
        onLogout={() => console.log('User logged out')}
      />
    </div>
  );
}
```

## 📋 **Props Reference**

### **Required Props**

| Prop | Type | Description |
|------|------|-------------|
| `appId` | `string` | Your PasskeyMe application ID |

### **Event Handlers**

| Prop | Type | Description |
|------|------|-------------|
| `onSuccess` | `(user: User, method: string) => void` | Called when authentication succeeds |
| `onError` | `(error: Error) => void` | Called when authentication fails |
| `onProviderSelect` | `(provider: string) => void` | Called when user selects OAuth provider |
| `onPasskeyAttempt` | `() => void` | Called when passkey authentication starts |
| `onOAuthRequired` | `(providers: string[]) => void` | Called when OAuth fallback is needed |
| `onLogout` | `() => void` | Called when user logs out |

### **Authentication Configuration**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `providers` | `string[]` | `['google', 'github']` | Enabled OAuth providers |
| `enablePasskeys` | `boolean` | `true` | Enable passkey authentication |
| `autoTriggerPasskey` | `boolean` | `false` | Automatically trigger passkey on load |
| `passkeyFirst` | `boolean` | `true` | Show passkey button first |
| `hideProvidersInitially` | `boolean` | `false` | Hide OAuth providers initially |

### **UI Configuration**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `PasskeymeAuthPanelTheme` | `{}` | Custom theme object (see theming section) |
| `layout` | `'vertical' \| 'horizontal' \| 'grid'` | `'vertical'` | Button layout |
| `spacing` | `'compact' \| 'normal' \| 'relaxed'` | `'normal'` | Spacing between elements |
| `className` | `string` | - | CSS class for container |
| `style` | `React.CSSProperties` | - | Inline styles for container |

### **Content Configuration**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Welcome to PasskeyMe'` | Panel title |
| `subtitle` | `string` | `'Experience seamless authentication'` | Panel subtitle |
| `passkeyButtonText` | `string` | `'🚀 Sign in with Passkey'` | Passkey button text |
| `dividerText` | `string` | `'or choose your provider'` | Divider text between auth methods |

### **Advanced Options**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `debugMode` | `boolean` | `false` | Enable debug logging |
| `showDebugInfo` | `boolean` | `false` | Show debug information in UI |
| `baseUrl` | `string` | - | Custom API base URL |
| `redirectUri` | `string` | - | Custom redirect URI for OAuth |

## 🎨 **Theming**

### **Built-in Themes**

The component supports custom theme objects instead of string-based themes:

```tsx
// Default theme (empty object uses built-in defaults)
<PasskeymeAuthPanel theme={{}} />

// Dark theme
const darkTheme = {
  container: {
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
    color: "#f9fafb",
  },
  title: {
    color: "#f9fafb",
  },
  subtitle: {
    color: "#d1d5db",
  },
  passkeyButton: {
    backgroundColor: "#7c3aed",
    backgroundColorHover: "#6d28d9",
    color: "#ffffff",
  },
  dividerText: {
    color: "#9ca3af",
  },
};

<PasskeymeAuthPanel theme={darkTheme} />
```

### **Custom Theming**

```tsx
import { PasskeymeAuthPanel } from '@passkeyme/react-auth';

const customTheme = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    padding: '24px',
    maxWidth: '400px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666666',
    textAlign: 'center',
    marginBottom: '24px',
  },
  passkeyButton: {
    backgroundColor: '#007bff',
    backgroundColorHover: '#0056b3',
    color: '#ffffff',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '16px',
    fontWeight: '500',
  },
};

<PasskeymeAuthPanel
  appId="your-app-id"
  theme={customTheme}
  onSuccess={handleSuccess}
/>
```

### **CSS Classes for Advanced Styling**

```css
/* Target the main container */
.passkeyme-auth-panel {
  border: 2px solid #e1e5e9;
}

/* Style the passkey button */
.passkeyme-passkey-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Style OAuth buttons */
.passkeyme-oauth-button {
  border: 1px solid #ddd;
  transition: all 0.2s ease;
}

.passkeyme-oauth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Loading states */
.passkeyme-auth-panel[data-loading="true"] {
  opacity: 0.7;
  pointer-events: none;
}
```

## 📐 **Layout Options**

### **Vertical Layout** (Default)
Stacks authentication options vertically - best for narrow containers.

```tsx
<PasskeymeAuthPanel
  appId="your-app-id"
  layout="vertical"
  onSuccess={handleSuccess}
/>
```

### **Horizontal Layout**
Places authentication options side by side - best for wide containers.

```tsx
<PasskeymeAuthPanel
  appId="your-app-id"
  layout="horizontal"
  onSuccess={handleSuccess}
/>
```

### **Grid Layout**
Arranges OAuth providers in a grid - best for many providers.

```tsx
<PasskeymeAuthPanel
  appId="your-app-id"
  layout="grid"
  providers={['google', 'github', 'microsoft', 'apple', 'discord']}
  onSuccess={handleSuccess}
/>
```

## 🔧 **Configuration Examples**

### **Basic Login Only**

```tsx
<PasskeymeAuthPanel
  appId="your-app-id"
  mode="login"
  title="Welcome Back"
  onSuccess={(user) => redirectToDashboard(user)}
/>
```

### **Registration Only**

```tsx
<PasskeymeAuthPanel
  appId="your-app-id"
  mode="register"
  title="Create Your Account"
  subtitle="Join thousands of users who trust passkeys"
  onSuccess={(user) => showOnboarding(user)}
/>
```

### **Custom Provider Selection**

```tsx
<PasskeymeAuthPanel
  appId="your-app-id"
  providers={['google', 'github']}
  title="Developer Sign In"
  onSuccess={(user, method) => {
    console.log(`Authenticated via ${method}`);
    setUser(user);
  }}
/>
```

### **Passkey-Only Authentication**

```tsx
<PasskeymeAuthPanel
  appId="your-app-id"
  providers={[]} // No OAuth providers
  title="Secure Access"
  passkeyText="Unlock with Biometrics"
  onSuccess={handleSecureAccess}
/>
```

### **Enterprise Configuration**

```tsx
<PasskeymeAuthPanel
  appId="your-app-id"
  providers={['microsoft', 'google']}
  mode="login"
  title="Enterprise Login"
  theme={{
    container: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
    },
    passkeyButton: {
      backgroundColor: '#0d6efd',
      backgroundColorHover: '#0b5ed7',
    },
  }}
  onSuccess={(user, method) => {
    // Track enterprise authentication
    analytics.track('enterprise_login', { method });
    setUser(user);
  }}
/>
```

## 🔄 **Event Handling**

### **Success Event**

The `onSuccess` callback receives the authenticated user and the method used:

```tsx
const handleAuthSuccess = (user, method) => {
  console.log('Authentication successful:', { user, method });
  
  // Method can be: 'passkey', 'google', 'github', 'microsoft', etc.
  switch (method) {
    case 'passkey':
      analytics.track('passkey_login');
      break;
    case 'google':
      analytics.track('oauth_login', { provider: 'google' });
      break;
  }
  
  // Store user state
  setUser(user);
  
  // Redirect or update UI
  navigate('/dashboard');
};

<PasskeymeAuthPanel
  appId="your-app-id"
  onSuccess={handleAuthSuccess}
/>
```

### **Error Handling**

```tsx
const handleAuthError = (error) => {
  console.error('Authentication failed:', error);
  
  // Handle different error types
  if (error.code === 'PASSKEY_NOT_SUPPORTED') {
    setErrorMessage('Passkeys are not supported on this device. Please use OAuth.');
  } else if (error.code === 'USER_CANCELLED') {
    // User cancelled authentication - usually no action needed
    return;
  } else {
    setErrorMessage('Authentication failed. Please try again.');
  }
};

<PasskeymeAuthPanel
  appId="your-app-id"
  onSuccess={handleSuccess}
  onError={handleAuthError}
/>
```

### **Provider Selection Tracking**

```tsx
<PasskeymeAuthPanel
  appId="your-app-id"
  onProviderSelect={(provider) => {
    console.log('User selected provider:', provider);
    analytics.track('auth_provider_selected', { provider });
  }}
  onPasskeyAttempt={() => {
    console.log('User attempting passkey authentication');
    analytics.track('passkey_attempt');
  }}
  onSuccess={handleSuccess}
/>
```

## 🧪 **State Management Integration**

### **Redux Integration**

```tsx
import { useDispatch } from 'react-redux';
import { setUser, setAuthLoading, setAuthError } from './authSlice';

function LoginForm() {
  const dispatch = useDispatch();

  const handleAuthSuccess = (user, method) => {
    dispatch(setUser({ user, method }));
    dispatch(setAuthLoading(false));
  };

  const handleAuthError = (error) => {
    dispatch(setAuthError(error.message));
    dispatch(setAuthLoading(false));
  };

  return (
    <PasskeymeAuthPanel
      appId="your-app-id"
      onSuccess={handleAuthSuccess}
      onError={handleAuthError}
      onPasskeyAttempt={() => dispatch(setAuthLoading(true))}
      onProviderSelect={() => dispatch(setAuthLoading(true))}
    />
  );
}
```

### **Context API Integration**

```tsx
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

function LoginForm() {
  const { setUser, setLoading, setError } = useContext(AuthContext);

  return (
    <PasskeymeAuthPanel
      appId="your-app-id"
      onSuccess={(user, method) => {
        setUser(user);
        setLoading(false);
      }}
      onError={(error) => {
        setError(error.message);
        setLoading(false);
      }}
    />
  );
}
```

## 🚀 **Best Practices**

### **1. User Experience**

```tsx
// ✅ Good: Clear messaging and feedback
<PasskeymeAuthPanel
  appId="your-app-id"
  title="Welcome back to Acme Corp"
  subtitle="Sign in to access your dashboard"
  onSuccess={handleSuccess}
  onError={(error) => showUserFriendlyError(error)}
/>

// ❌ Avoid: Generic messaging
<PasskeymeAuthPanel appId="your-app-id" />
```

### **2. Loading States**

```tsx
// ✅ Good: Show loading state
const [isAuthenticating, setIsAuthenticating] = useState(false);

<PasskeymeAuthPanel
  appId="your-app-id"
  onPasskeyAttempt={() => setIsAuthenticating(true)}
  onProviderSelect={() => setIsAuthenticating(true)}
  onSuccess={() => setIsAuthenticating(false)}
  onError={() => setIsAuthenticating(false)}
  style={{
    opacity: isAuthenticating ? 0.7 : 1,
    pointerEvents: isAuthenticating ? 'none' : 'auto',
  }}
/>
```

### **3. Responsive Design**

```tsx
// ✅ Good: Responsive layout
const isMobile = useMediaQuery('(max-width: 768px)');

<PasskeymeAuthPanel
  appId="your-app-id"
  layout={isMobile ? 'vertical' : 'horizontal'}
  spacing={isMobile ? 'compact' : 'normal'}
  theme={{
    container: {
      maxWidth: isMobile ? '100%' : '400px',
      padding: isMobile ? '16px' : '24px',
    },
  }}
/>
```

### **4. Analytics Integration**

```tsx
// ✅ Good: Comprehensive analytics
<PasskeymeAuthPanel
  appId="your-app-id"
  onSuccess={(user, method) => {
    analytics.track('authentication_success', {
      method,
      user_id: user.id,
      timestamp: new Date().toISOString(),
    });
  }}
  onError={(error) => {
    analytics.track('authentication_error', {
      error_code: error.code,
      error_message: error.message,
    });
  }}
  onProviderSelect={(provider) => {
    analytics.track('auth_provider_selected', { provider });
  }}
/>
```

## 🔗 **Related Components**

- **[PasskeymeOAuthButton](./oauth-button.md)** - Individual OAuth provider buttons
- **[PasskeymeButton](./passkey-button.md)** - Hosted auth page integration  
- **[usePasskeyme Hook](./use-passkeyme.md)** - Programmatic authentication control

## 📚 **Next Steps**

- **[Theming Guide](../react.md#theming-and-customization)** - Advanced styling techniques
- **[Error Handling](../react.md#error-handling)** - Comprehensive error management
- **[Testing](../react.md#testing)** - Unit testing authentication flows
- **[Migration Guide](../react.md#migration)** - Upgrading from other auth providers

---

*PasskeymeAuthPanel provides the most complete inline authentication experience with minimal code. Perfect for applications that want to keep users engaged without redirects.*

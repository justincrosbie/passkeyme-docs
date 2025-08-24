---
id: passkey-button
title: PasskeymeButton
sidebar_label: PasskeymeButton
description: Hosted auth page integration with React components
---

# 🚀 PasskeymeButton

`PasskeymeButton` provides a **streamlined integration with Passkeyme's hosted authentication pages**. Perfect when you want the simplicity of hosted auth but with the convenience of React components and proper event handling.

## ✨ **Why PasskeymeButton?**

- **🚀 Hosted Auth Integration** - Redirect to Passkeyme's optimized auth pages
- **⚡ Zero Maintenance** - We handle updates, security, and browser compatibility
- **🎨 React-Native Feel** - Component-based API with proper TypeScript support
- **🔄 Event Handling** - Proper callbacks for success, error, and loading states
- **📱 Mobile Optimized** - Works seamlessly on all devices
- **🛡️ Enterprise Security** - Bank-grade security without the complexity

## 🚀 **Quick Start**

```tsx
import { PasskeymeButton } from '@passkeyme/react-auth';

function LoginPage() {
  return (
    <div className="login-container">
      <h1>Welcome to Acme Corp</h1>
      <PasskeymeButton>
        🔐 Login with Passkey
      </PasskeymeButton>
    </div>
  );
}
```

## 📋 **Props Reference**

### **Optional Props**

| Prop | Type | Description |
|------|------|-------------|
| `username` | `string` | Username hint for targeted authentication |
| `size` | `'small' \| 'medium' \| 'large'` | Button size variant |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | Button style variant |
| `children` | `React.ReactNode` | Button content/text |
| `className` | `string` | Additional CSS classes |
| `style` | `React.CSSProperties` | Inline styles |
| `disabled` | `boolean` | Disable the button |

### **Event Handlers**

| Prop | Type | Description |
|------|------|-------------|
| `appId` | `string` | Your Passkeyme application ID |
| `redirectUri` | `string` | Where users return after authentication |

### **Event Handlers**

| Prop | Type | Description |
|------|------|-------------|
| `onSuccess` | `(user: User) => void` | Called when authentication succeeds |
| `onError` | `(error: Error) => void` | Called when authentication fails |
| `onClick` | `() => void` | Called when button is clicked |
| `onRedirect` | `() => void` | Called just before redirecting to hosted auth |

### **Authentication Options**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | `string` | - | Direct to specific OAuth provider |
| `mode` | `'login' \| 'register' \| 'both'` | `'both'` | Authentication mode |
| `state` | `string` | - | Custom state parameter |

### **UI Configuration**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `'Sign In'` | Button text |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Button style |
| `fullWidth` | `boolean` | `false` | Make button full width |
| `disabled` | `boolean` | `false` | Disable the button |
| `loading` | `boolean` | `false` | Show loading state |

### **Styling**

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | CSS class for button |
| `style` | `React.CSSProperties` | Inline styles |

### **Advanced Options**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `debugMode` | `boolean` | `false` | Enable debug logging |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Hosted page theme |
| `customDomain` | `string` | - | Use custom auth domain |

## 🎯 **Usage Examples**

### **Basic Usage**

```tsx
// Simple passkey button
<PasskeymeButton>
  🔐 Login with Passkey
</PasskeymeButton>
```

### **Username-Targeted Authentication**

```tsx
// Provide username hint for targeted passkey authentication
<PasskeymeButton username="user@example.com">
  Login as user@example.com
</PasskeymeButton>

// Discoverable credentials (no username)
<PasskeymeButton>
  🔐 Login with Passkey (discoverable)
</PasskeymeButton>
```

### **Different Button Styles**

```tsx
// Size variants
<PasskeymeButton size="small" variant="secondary">
  Small
</PasskeymeButton>

<PasskeymeButton size="medium" variant="outline">
  Medium Outline
</PasskeymeButton>

<PasskeymeButton size="large" variant="primary">
  Large Primary
</PasskeymeButton>
```

### **Login Only**

```tsx
<PasskeymeButton
  appId="your-app-id"
  redirectUri="https://yourapp.com/callback"
  mode="login"
  text="Sign In to Your Account"
  onSuccess={handleSuccess}
/>
```

### **Registration Only**

```tsx
<PasskeymeButton
  appId="your-app-id"
  redirectUri="https://yourapp.com/callback"
  mode="register"
  text="Create Account"
  onSuccess={handleSuccess}
/>
```

### **Direct Provider Authentication**

```tsx
// Direct Google authentication
<PasskeymeButton
  appId="your-app-id"
  redirectUri="https://yourapp.com/callback"
  provider="google"
  text="Continue with Google"
  onSuccess={handleSuccess}
/>

// Direct GitHub authentication
<PasskeymeButton
  appId="your-app-id"
  redirectUri="https://yourapp.com/callback"
  provider="github"
  text="Continue with GitHub"
  onSuccess={handleSuccess}
/>
```

## 🎨 **Styling Options**

### **Size Variants**

```tsx
// Small button
<PasskeymeButton
  appId="your-app-id"
  redirectUri="https://yourapp.com/callback"
  size="small"
  text="Sign In"
/>

// Medium button (default)
<PasskeymeButton
  appId="your-app-id"
  redirectUri="https://yourapp.com/callback"
  size="medium"
  text="Sign In"
/>

// Large button
<PasskeymeButton
  appId="your-app-id"
  redirectUri="https://yourapp.com/callback"
  size="large"
  text="Get Started"
/>
```

### **Style Variants**

```tsx
// Primary button (default)
<PasskeymeButton
  appId="your-app-id"
  redirectUri="https://yourapp.com/callback"
  variant="primary"
  text="Sign In"
/>

// Secondary button
<PasskeymeButton
  appId="your-app-id"
  redirectUri="https://yourapp.com/callback"
  variant="secondary"
  text="Sign In"
/>

// Outline button
<PasskeymeButton
  appId="your-app-id"
  redirectUri="https://yourapp.com/callback"
  variant="outline"
  text="Sign In"
/>
```

### **Custom Styling**

```tsx
<PasskeymeButton
  appId="your-app-id"
  redirectUri="https://yourapp.com/callback"
  className="custom-auth-button"
  style={{
    backgroundColor: '#007bff',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
  }}
  text="Join Our Platform"
/>
```

## 🔄 **Callback Handling**

### **Setting Up the Callback Page**

Create a callback component to handle the authentication result:

```tsx
// /auth/callback page
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { token, error, state } = router.query;

      if (error) {
        console.error('Authentication failed:', error);
        router.push('/login?error=' + encodeURIComponent(error));
        return;
      }

      if (token) {
        try {
          // Get user information
          const response = await fetch(`https://api.passkeyme.com/user?token=${token}`);
          const user = await response.json();

          // Store authentication
          localStorage.setItem('passkeyme_token', token);
          
          // Handle custom state
          if (state) {
            const customState = JSON.parse(decodeURIComponent(state));
            console.log('Custom state:', customState);
          }

          // Redirect to dashboard
          router.push('/dashboard');
        } catch (err) {
          console.error('Failed to get user info:', err);
          router.push('/login?error=invalid_token');
        }
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query]);

  return (
    <div className="auth-callback">
      <div className="spinner"></div>
      <p>Completing authentication...</p>
    </div>
  );
}

export default AuthCallback;
```

### **State Management**

Pass custom state to track user context:

```tsx
function LoginForm() {
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/dashboard';

  const customState = {
    returnTo,
    source: 'login_page',
    timestamp: Date.now(),
  };

  return (
    <PasskeymeButton
      appId="your-app-id"
      redirectUri="https://yourapp.com/auth/callback"
      state={JSON.stringify(customState)}
      text="Sign In"
      onRedirect={() => {
        // Track redirect
        analytics.track('auth_redirect_started', { source: 'login_page' });
      }}
    />
  );
}
```

## 🔧 **Integration Examples**

### **Next.js Integration**

```tsx
// pages/login.tsx
import { PasskeymeButton } from '@passkeyme/react-auth';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();

  const handleAuthSuccess = (user) => {
    console.log('User authenticated:', user);
    
    // Redirect to originally intended page
    const returnTo = router.query.returnTo || '/dashboard';
    router.push(returnTo);
  };

  return (
    <div className="login-page">
      <h1>Welcome Back</h1>
      <PasskeymeButton
        appId={process.env.NEXT_PUBLIC_PASSKEYME_APP_ID}
        redirectUri={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`}
        onSuccess={handleAuthSuccess}
        text="Sign In to Continue"
      />
    </div>
  );
}

// pages/auth/callback.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Handle callback logic here
    // (See callback handling example above)
  }, [router.isReady]);

  return <div>Processing authentication...</div>;
}
```

### **React Router Integration**

```tsx
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { PasskeymeButton } from '@passkeyme/react-auth';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthSuccess = (user) => {
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  return (
    <div>
      <h1>Please Sign In</h1>
      <PasskeymeButton
        appId="your-app-id"
        redirectUri="http://localhost:3000/auth/callback"
        onSuccess={handleAuthSuccess}
        text="Sign In"
      />
    </div>
  );
}

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (error) {
      navigate('/login', { 
        state: { error: decodeURIComponent(error) }
      });
    } else if (token) {
      // Process successful authentication
      localStorage.setItem('token', token);
      navigate('/dashboard');
    }
  }, [navigate]);

  return <div>Processing...</div>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
```

### **Loading States**

```tsx
function AuthWithLoadingState() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  return (
    <div className="auth-container">
      <PasskeymeButton
        appId="your-app-id"
        redirectUri="https://yourapp.com/callback"
        loading={isRedirecting}
        text={isRedirecting ? "Redirecting..." : "Sign In"}
        disabled={isRedirecting}
        onRedirect={() => {
          setIsRedirecting(true);
          // Optional: Show loading UI
          setTimeout(() => {
            // Fallback in case redirect doesn't happen
            setIsRedirecting(false);
          }, 5000);
        }}
      />
    </div>
  );
}
```

### **Error Handling**

```tsx
function RobustAuthButton() {
  const [error, setError] = useState(null);

  const handleAuthError = (error) => {
    console.error('Authentication error:', error);
    
    // Display user-friendly error messages
    switch (error.code) {
      case 'POPUP_BLOCKED':
        setError('Please allow popups and try again.');
        break;
      case 'INVALID_CONFIG':
        setError('Authentication is temporarily unavailable.');
        break;
      default:
        setError('Sign in failed. Please try again.');
    }
  };

  return (
    <div className="auth-form">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      <PasskeymeButton
        appId="your-app-id"
        redirectUri="https://yourapp.com/callback"
        onError={handleAuthError}
        onClick={() => setError(null)} // Clear errors on retry
        text="Sign In"
      />
    </div>
  );
}
```

## 📱 **Mobile Considerations**

### **Mobile-Optimized Layout**

```tsx
function MobileAuthButton() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <PasskeymeButton
      appId="your-app-id"
      redirectUri="https://yourapp.com/callback"
      size={isMobile ? 'large' : 'medium'}
      fullWidth={isMobile}
      text={isMobile ? "Tap to Sign In" : "Sign In"}
    />
  );
}
```

### **iOS/Android App Integration**

```tsx
// For React Native WebView integration
function AppAuthButton() {
  const isApp = window.ReactNativeWebView !== undefined;

  const handleRedirect = () => {
    if (isApp) {
      // Notify React Native app
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'AUTH_REDIRECT',
        url: `https://auth.passkeyme.com/auth?app_id=your-app-id&redirect_uri=myapp://auth/callback`
      }));
    }
  };

  return (
    <PasskeymeButton
      appId="your-app-id"
      redirectUri={isApp ? "myapp://auth/callback" : "https://yourapp.com/callback"}
      onRedirect={handleRedirect}
      text="Sign In"
    />
  );
}
```

## 🚀 **Best Practices**

### **1. Environment Configuration**

```tsx
// ✅ Good: Environment-based configuration
const config = {
  development: {
    appId: 'dev-app-id',
    redirectUri: 'http://localhost:3000/auth/callback',
    debugMode: true,
  },
  production: {
    appId: 'prod-app-id',
    redirectUri: 'https://yourapp.com/auth/callback',
    debugMode: false,
  },
};

const env = process.env.NODE_ENV || 'development';
const authConfig = config[env];

<PasskeymeButton {...authConfig} text="Sign In" />
```

### **2. Accessibility**

```tsx
// ✅ Good: Accessible button
<PasskeymeButton
  appId="your-app-id"
  redirectUri="https://yourapp.com/callback"
  text="Sign in to your account"
  aria-label="Sign in using Passkeyme authentication"
  aria-describedby="auth-help-text"
/>
<p id="auth-help-text">
  Secure authentication with passkeys or your preferred social login
</p>
```

### **3. Analytics Tracking**

```tsx
// ✅ Good: Comprehensive analytics
<PasskeymeButton
  appId="your-app-id"
  redirectUri="https://yourapp.com/callback"
  onClick={() => {
    analytics.track('auth_button_clicked', {
      method: 'hosted',
      page: window.location.pathname,
    });
  }}
  onRedirect={() => {
    analytics.track('auth_redirect_started', {
      destination: 'hosted_auth_page',
    });
  }}
  text="Sign In"
/>
```

## 🔗 **Related Components**

- **[PasskeymeAuthPanel](./auth-panel.md)** - Complete inline authentication solution
- **[PasskeymeOAuthButton](./oauth-button.md)** - Individual OAuth provider buttons
- **[usePasskeyme Hook](./use-passkeyme.md)** - Programmatic authentication control

## 📚 **Next Steps**

- **[Hosted Auth Pages](../../getting-started/hosted-auth.md)** - Complete hosted auth guide
- **[Callback Handling](../react.md#callback-handling)** - Advanced callback management
- **[Security Best Practices](../react.md#security)** - Secure authentication patterns
- **[Testing](../react.md#testing)** - Unit testing auth flows

---

*PasskeymeButton provides the simplicity of hosted authentication with the convenience of React components. Perfect for teams who want enterprise-grade security without the complexity.*

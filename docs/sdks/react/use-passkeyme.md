---
id: use-passkeyme
title: usePasskeyme Hook
sidebar_label: usePasskeyme Hook
description: Programmatic authentication control without UI components
---

# 🪝 usePasskeyme Hook

The `usePasskeyme` hook provides **programmatic control over authentication** without requiring any UI components. Perfect for custom authentication flows, conditional logic, or integrating authentication into existing components.

## ✨ **Why usePasskeyme Hook?**

- **🎯 Programmatic Control** - Trigger authentication from any component or event
- **🔧 Headless Authentication** - No UI constraints, use your own components
- **⚡ Advanced Flows** - Conditional authentication, multi-step processes
- **🎭 Custom UX** - Build authentication exactly how you want it
- **🔄 State Management** - Access authentication state throughout your app
- **🧪 Easy Testing** - Mock and test authentication flows easily

## 🚀 **Quick Start**

```tsx
import { usePasskeyme } from '@passkeyme/react-auth';

function CustomLoginButton() {
  const { triggerPasskeymeAuth, authLoading, error, user } = usePasskeyme();

  const handleLogin = async () => {
    try {
      const user = await triggerPasskeymeAuth({
        mode: 'inline',
        onSuccess: (user, method) => {
          console.log(`Authenticated via ${method}:`, user);
        },
        onError: (error) => {
          console.error('Authentication failed:', error);
        },
      });
      
      console.log('User:', user);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  return (
    <button 
      onClick={handleLogin} 
      disabled={authLoading}
      className="custom-auth-button"
    >
      {authLoading ? 'Authenticating...' : 'Sign In'}
    </button>
  );
}
```

## 📋 **Hook API Reference**

### **Return Values**

```tsx
const {
  // Methods
  triggerPasskeymeAuth,
  logout, // Note: actual method name is 'logout', not 'signOut'
  getCurrentUser,
  
  // State
  user,
  isAuthenticated,
  authLoading, // Note: actual property name is 'authLoading', not 'isLoading'
  error,
  
  // Configuration & Utilities
  config,
  isPasskeySupported,
} = usePasskeyme();
```

### **triggerPasskeymeAuth**

Programmatically trigger authentication with full control over the flow.

```tsx
const triggerPasskeymeAuth: (options?: AuthOptions) => Promise<User>
```

#### **AuthOptions**

| Option | Type | Description |
|--------|------|-------------|
| `mode?` | `'hosted' \| 'inline'` | Authentication mode (default: 'hosted') |
| `username?` | `string` | Username hint for targeted passkey authentication |
| `forcePasskeyOnly?` | `boolean` | Only attempt passkey auth, no fallback |
| `onSuccess?` | `(user: User, method: string) => void` | Success callback |
| `onError?` | `(error: Error) => void` | Error callback |
| `onOAuthRequired?` | `(providers: string[]) => void` | OAuth fallback callback |
| `showNotifications?` | `boolean` | Show built-in notifications (default: true) |

### **Other Methods**

| Method | Type | Description |
|--------|------|-------------|
| `logout` | `() => void` | Sign out current user |
| `getCurrentUser` | `() => Promise<User \| null>` | Get current user info |
| `isPasskeySupported` | `() => boolean` | Check if passkeys are supported |

### **State Properties**

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current authenticated user |
| `isAuthenticated` | `boolean` | Whether user is authenticated |
| `authLoading` | `boolean` | Whether authentication is in progress |
| `error` | `Error \| null` | Last authentication error |
| `config` | `PasskeymeConfig` | Current configuration object |

## 🎯 **Usage Patterns**

### **Basic Authentication**

```tsx
function SimpleAuthButton() {
  const { triggerPasskeymeAuth, authLoading } = usePasskeyme();

  const handleAuth = async () => {
    try {
      const user = await triggerPasskeymeAuth({
        mode: 'hosted', // Default mode
        onSuccess: (user, method) => {
          console.log('Authentication successful:', user);
        },
      });
      console.log('User authenticated:', user);
    } catch (error) {
      console.error('Auth failed:', error);
    }
  };

  return (
    <button onClick={handleAuth} disabled={authLoading}>
      {authLoading ? 'Authenticating...' : 'Sign In'}
    </button>
  );
}
```

### **Provider-Specific Authentication**

```tsx
function ProviderButtons() {
  const { triggerPasskeymeAuth, isLoading } = usePasskeyme();

  const authenticateWith = async (provider) => {
    try {
      const user = await triggerPasskeymeAuth({
        appId: 'your-app-id',
        provider,
        onSuccess: (user, method) => {
          console.log(`${provider} auth successful:`, user);
        },
      });
    } catch (error) {
      console.error(`${provider} auth failed:`, error);
    }
  };

  return (
    <div className="provider-buttons">
      <button 
        onClick={() => authenticateWith('google')}
        disabled={isLoading}
      >
        Google
      </button>
      <button 
        onClick={() => authenticateWith('github')}
        disabled={isLoading}
      >
        GitHub
      </button>
      <button 
        onClick={() => authenticateWith('microsoft')}
        disabled={isLoading}
      >
        Microsoft
      </button>
    </div>
  );
}
```

### **Conditional Authentication**

```tsx
function ConditionalAuth() {
  const { triggerPasskeymeAuth, user, isAuthenticated } = usePasskeyme();
  const [userType, setUserType] = useState(null);

  const handleUserTypeSelection = async (type) => {
    setUserType(type);

    // Different auth flow based on user type
    const providers = {
      developer: ['github', 'google'],
      business: ['microsoft', 'google'],
      consumer: ['google', 'apple'],
    };

    try {
      const user = await triggerPasskeymeAuth({
        appId: 'your-app-id',
        mode: 'inline',
        onOAuthRequired: (availableProviders) => {
          // Filter providers based on user type
          const filteredProviders = availableProviders.filter(
            provider => providers[type].includes(provider)
          );
          console.log('Available providers for', type, ':', filteredProviders);
        },
      });
      
      console.log('User authenticated as', type, ':', user);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  if (isAuthenticated) {
    return <Dashboard user={user} />;
  }

  if (!userType) {
    return (
      <div className="user-type-selection">
        <h2>What best describes you?</h2>
        <button onClick={() => handleUserTypeSelection('developer')}>
          Developer
        </button>
        <button onClick={() => handleUserTypeSelection('business')}>
          Business User
        </button>
        <button onClick={() => handleUserTypeSelection('consumer')}>
          Consumer
        </button>
      </div>
    );
  }

  return <div>Authenticating...</div>;
}
```

### **Multi-Step Authentication**

```tsx
function MultiStepAuth() {
  const { triggerPasskeymeAuth, isLoading } = usePasskeyme();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');

  const handleEmailSubmit = async () => {
    // Step 1: Collect email
    if (!email) return;
    
    setStep('auth');
    
    try {
      // Step 2: Authenticate with context
      const user = await triggerPasskeymeAuth({
        appId: 'your-app-id',
        mode: 'inline',
        state: JSON.stringify({ email, step: 'auth' }),
        onSuccess: (user, method) => {
          console.log('Multi-step auth completed:', { user, method, email });
          setStep('complete');
        },
      });
    } catch (error) {
      console.error('Auth failed:', error);
      setStep('email'); // Go back to email step
    }
  };

  switch (step) {
    case 'email':
      return (
        <div>
          <h2>Enter your email</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
          <button onClick={handleEmailSubmit}>Continue</button>
        </div>
      );

    case 'auth':
      return (
        <div>
          <h2>Authenticate for {email}</h2>
          <div className="auth-loading">
            {isLoading ? 'Authenticating...' : 'Authentication in progress...'}
          </div>
        </div>
      );

    case 'complete':
      return (
        <div>
          <h2>Welcome!</h2>
          <p>Authentication completed successfully.</p>
        </div>
      );

    default:
      return null;
  }
}
```

## 🔧 **Advanced Integration Examples**

### **Form Integration**

```tsx
import { useForm } from 'react-hook-form';

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { triggerPasskeymeAuth, isLoading } = usePasskeyme();
  const [authMethod, setAuthMethod] = useState('form');

  const onSubmit = async (data) => {
    if (authMethod === 'oauth') {
      // OAuth authentication
      try {
        const user = await triggerPasskeymeAuth({
          appId: 'your-app-id',
          onSuccess: (user, method) => {
            console.log('OAuth signup:', user);
            // Merge with form data if needed
            completeSignup({ ...data, ...user, authMethod: method });
          },
        });
      } catch (error) {
        console.error('OAuth signup failed:', error);
      }
    } else {
      // Traditional form submission
      console.log('Form signup:', data);
      completeSignup({ ...data, authMethod: 'password' });
    }
  };

  const completeSignup = (userData) => {
    console.log('Completing signup with:', userData);
    // Handle signup completion
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="auth-method-toggle">
        <button
          type="button"
          onClick={() => setAuthMethod('form')}
          className={authMethod === 'form' ? 'active' : ''}
        >
          Email & Password
        </button>
        <button
          type="button"
          onClick={() => setAuthMethod('oauth')}
          className={authMethod === 'oauth' ? 'active' : ''}
        >
          Social Login
        </button>
      </div>

      {authMethod === 'form' && (
        <>
          <input
            {...register('name', { required: true })}
            placeholder="Full Name"
          />
          {errors.name && <span>Name is required</span>}

          <input
            {...register('email', { required: true })}
            type="email"
            placeholder="Email"
          />
          {errors.email && <span>Email is required</span>}

          <input
            {...register('password', { required: true })}
            type="password"
            placeholder="Password"
          />
          {errors.password && <span>Password is required</span>}

          <button type="submit">Create Account</button>
        </>
      )}

      {authMethod === 'oauth' && (
        <div className="oauth-section">
          <p>Sign up quickly with your social account:</p>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? 'Signing up...' : 'Continue with Social Login'}
          </button>
        </div>
      )}
    </form>
  );
}
```

### **Global Authentication State**

```tsx
// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { usePasskeyme } from '@passkeyme/react-auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { user, isAuthenticated, signOut, getCurrentUser } = usePasskeyme();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize authentication state on app start
    const initAuth = async () => {
      try {
        await getCurrentUser();
      } catch (error) {
        console.log('No existing authentication');
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [getCurrentUser]);

  const value = {
    user,
    isAuthenticated,
    isInitialized,
    signOut,
    getCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Usage in components
function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return children;
}
```

### **Custom Auth Button with Loading States**

```tsx
function CustomAuthButton({ provider, children, ...props }) {
  const { triggerPasskeymeAuth, isLoading } = usePasskeyme();
  const [localLoading, setLocalLoading] = useState(false);

  const handleAuth = async () => {
    setLocalLoading(true);
    
    try {
      await triggerPasskeymeAuth({
        appId: 'your-app-id',
        provider,
        ...props,
      });
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const isButtonLoading = isLoading || localLoading;

  return (
    <button
      onClick={handleAuth}
      disabled={isButtonLoading}
      className={`auth-button ${isButtonLoading ? 'loading' : ''}`}
      aria-label={`Sign in with ${provider}`}
    >
      {isButtonLoading ? (
        <div className="button-spinner">
          <div className="spinner"></div>
          <span>Authenticating...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Usage
function LoginButtons() {
  return (
    <div className="login-buttons">
      <CustomAuthButton provider="google">
        <GoogleIcon />
        Continue with Google
      </CustomAuthButton>
      
      <CustomAuthButton provider="github">
        <GitHubIcon />
        Continue with GitHub
      </CustomAuthButton>
    </div>
  );
}
```

### **Analytics Integration**

```tsx
function AnalyticsAwareAuth() {
  const { triggerPasskeymeAuth } = usePasskeyme();

  const authenticateWithAnalytics = async (provider) => {
    // Track authentication attempt
    analytics.track('auth_attempt', {
      provider,
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
    });

    try {
      const user = await triggerPasskeymeAuth({
        appId: 'your-app-id',
        provider,
        onSuccess: (user, method) => {
          // Track successful authentication
          analytics.track('auth_success', {
            provider: method,
            user_id: user.id,
            method,
            duration: Date.now() - startTime,
          });
          
          // Identify user for future tracking
          analytics.identify(user.id, {
            email: user.email,
            name: user.name,
            provider: method,
          });
        },
        onError: (error) => {
          // Track authentication error
          analytics.track('auth_error', {
            provider,
            error_code: error.code,
            error_message: error.message,
          });
        },
      });

      const startTime = Date.now();
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  return (
    <div>
      <button onClick={() => authenticateWithAnalytics('google')}>
        Google
      </button>
      <button onClick={() => authenticateWithAnalytics('github')}>
        GitHub
      </button>
    </div>
  );
}
```

## 🧪 **Testing**

### **Mocking the Hook**

```tsx
// __mocks__/@passkeyme/react-auth.ts
export const usePasskeyme = jest.fn(() => ({
  triggerPasskeymeAuth: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn(),
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  configure: jest.fn(),
}));
```

### **Test Examples**

```tsx
// CustomAuthButton.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react';
import { usePasskeyme } from '@passkeyme/react-auth';
import CustomAuthButton from './CustomAuthButton';

jest.mock('@passkeyme/react-auth');

describe('CustomAuthButton', () => {
  const mockTriggerAuth = jest.fn();

  beforeEach(() => {
    (usePasskeyme as jest.Mock).mockReturnValue({
      triggerPasskeymeAuth: mockTriggerAuth,
      isLoading: false,
      error: null,
    });
  });

  it('triggers authentication when clicked', async () => {
    const { getByText } = render(
      <CustomAuthButton provider="google">Sign In</CustomAuthButton>
    );

    fireEvent.click(getByText('Sign In'));

    await waitFor(() => {
      expect(mockTriggerAuth).toHaveBeenCalledWith({
        appId: 'your-app-id',
        provider: 'google',
      });
    });
  });

  it('shows loading state', () => {
    (usePasskeyme as jest.Mock).mockReturnValue({
      triggerPasskeymeAuth: mockTriggerAuth,
      isLoading: true,
      error: null,
    });

    const { getByText } = render(
      <CustomAuthButton provider="google">Sign In</CustomAuthButton>
    );

    expect(getByText('Authenticating...')).toBeInTheDocument();
  });
});
```

## 🚀 **Best Practices**

### **1. Error Handling**

```tsx
// ✅ Good: Comprehensive error handling
function RobustAuthComponent() {
  const { triggerPasskeymeAuth } = usePasskeyme();
  const [error, setError] = useState(null);

  const handleAuth = async () => {
    setError(null);
    
    try {
      await triggerPasskeymeAuth({
        appId: 'your-app-id',
        onError: (error) => {
          // Handle specific error types
          switch (error.code) {
            case 'PASSKEY_NOT_SUPPORTED':
              setError('Passkeys are not supported on this device. Please try a different method.');
              break;
            case 'USER_CANCELLED':
              // User cancelled - don't show error
              break;
            default:
              setError('Authentication failed. Please try again.');
          }
        },
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleAuth}>Sign In</button>
    </div>
  );
}
```

### **2. Loading States**

```tsx
// ✅ Good: Proper loading state management
function LoadingAwareAuth() {
  const { triggerPasskeymeAuth, isLoading } = usePasskeyme();
  const [localLoading, setLocalLoading] = useState(false);

  const isActuallyLoading = isLoading || localLoading;

  const handleAuth = async () => {
    setLocalLoading(true);
    try {
      await triggerPasskeymeAuth({ appId: 'your-app-id' });
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <button 
      onClick={handleAuth} 
      disabled={isActuallyLoading}
      aria-busy={isActuallyLoading}
    >
      {isActuallyLoading ? 'Authenticating...' : 'Sign In'}
    </button>
  );
}
```

### **3. Configuration**

```tsx
// ✅ Good: Centralized configuration
function App() {
  const { configure } = usePasskeyme();

  useEffect(() => {
    configure({
      appId: process.env.REACT_APP_PASSKEYME_APP_ID,
      baseUrl: process.env.REACT_APP_PASSKEYME_BASE_URL,
      debugMode: process.env.NODE_ENV === 'development',
    });
  }, [configure]);

  return <AuthenticatedApp />;
}
```

## 🔗 **Related Components**

- **[PasskeymeAuthPanel](./auth-panel.md)** - Complete inline authentication solution
- **[PasskeymeOAuthButton](./oauth-button.md)** - Individual OAuth provider buttons
- **[PasskeymeButton](./passkey-button.md)** - Hosted auth page integration

## 📚 **Next Steps**

- **[Authentication Flows](../react.md#authentication-flows)** - Advanced flow patterns
- **[State Management](../react.md#state-management)** - Integration with Redux, Zustand
- **[Testing Guide](../react.md#testing)** - Comprehensive testing strategies
- **[Error Handling](../react.md#error-handling)** - Robust error management

---

*usePasskeyme hook provides the ultimate flexibility for authentication flows. Perfect for custom UX requirements and advanced integration scenarios.*

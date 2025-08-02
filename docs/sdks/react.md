---
id: react
title: React SDK
sidebar_label: React SDK
description: Add authentication to React applications with PasskeymeAuthPanel component
---

# 🚀 React SDK

The PasskeyMe React SDK provides **inline authentication components** that embed directly into your React application, eliminating the need for redirects and giving you complete control over the user experience.

## Installation

```bash
npm install @passkeyme/react-auth
# or
yarn add @passkeyme/react-auth
# or
pnpm add @passkeyme/react-auth
```

## Quick Start

The `PasskeymeAuthPanel` component provides a complete authentication experience with passkeys, OAuth, and password support:

```tsx
import { PasskeymeAuthPanel } from '@passkeyme/react-auth';

function App() {
  const handleAuthSuccess = (user) => {
    console.log('User authenticated:', user);
    // Store user state, redirect, etc.
  };

  return (
    <div className="app">
      <h1>Welcome to My App</h1>
      <PasskeymeAuthPanel
        appId="your-app-id"
        onSuccess={handleAuthSuccess}
        onError={(error) => console.error('Auth error:', error)}
        theme={{ container: { backgroundColor: '#ffffff' } }}
        layout="vertical"
      />
    </div>
  );
}
```

## PasskeymeAuthPanel Component

The primary component for adding authentication to your React app.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `appId` | `string` | ✅ | Your PasskeyMe application ID |
| `onSuccess` | `(user: User) => void` | ✅ | Called when authentication succeeds |
| `onError` | `(error: Error) => void` | | Called when authentication fails |
| `theme` | `'light' \| 'dark' \| 'auto'` | | Visual theme (default: 'auto') |
| `layout` | `'card' \| 'inline' \| 'modal'` | | Component layout style (default: 'card') |
| `providers` | `string[]` | | Enabled OAuth providers |
| `showPasswordAuth` | `boolean` | | Enable password authentication (default: true) |
| `customStyles` | `object` | | Custom CSS-in-JS styles |
| `className` | `string` | | Additional CSS class names |

### Basic Usage

```tsx
import { PasskeymeAuthPanel } from '@passkeyme/react-auth';

function LoginPage() {
  return (
    <PasskeymeAuthPanel
      appId="your-app-id"
      onSuccess={(user) => {
        // Handle successful authentication
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/dashboard';
      }}
      onError={(error) => {
        alert(`Authentication failed: ${error.message}`);
      }}
    />
  );
}
```

## Theming and Customization

### Built-in Themes

```tsx
// Light theme (uses default theme)
<PasskeymeAuthPanel 
  theme={{
    container: { backgroundColor: '#ffffff' },
    title: { color: '#111827' }
  }} 
/>

// Dark theme  
<PasskeymeAuthPanel 
  theme={{
    container: { backgroundColor: '#1f2937', color: '#ffffff' },
    title: { color: '#ffffff' },
    passkeyButton: { backgroundColor: '#7c3aed' }
  }} 
/>

// Auto theme based on system preference
<PasskeymeAuthPanel className="auto-theme" />
```

### Custom Styling

```tsx
<PasskeymeAuthPanel
  theme={{
    container: {
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      padding: '2rem',
      backgroundColor: '#ffffff'
    },
    passkeyButton: {
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: '#7c3aed',
      backgroundColorHover: '#6d28d9'
    },
    title: {
      fontSize: '24px',
      color: '#111827'
    }
  }}
/>
```

### CSS Classes

```tsx
<PasskeymeAuthPanel
  className="my-auth-panel"
/>
```

```css
.my-auth-panel {
  max-width: 400px;
  margin: 0 auto;
}

.my-auth-panel .passkeyme-button {
  background: linear-gradient(45deg, #6366f1, #8b5cf6);
}
```

## Layout Options

### Vertical Layout (Default)

```tsx
<PasskeymeAuthPanel layout="vertical" />
```

Creates a vertical stack of authentication options.

### Horizontal Layout

```tsx
<PasskeymeAuthPanel layout="horizontal" />
```

Renders authentication options in a horizontal row.

### Grid Layout

```tsx
<PasskeymeAuthPanel layout="grid" />
```

Uses a flexible grid layout for OAuth providers.

### Spacing Options

```tsx
<PasskeymeAuthPanel 
  layout="vertical"
  spacing="compact"    // "compact" | "normal" | "relaxed"
/>
```

## Authentication Providers

### OAuth Providers

```tsx
<PasskeymeAuthPanel
  providers={['google', 'github', 'microsoft', 'apple', 'facebook']}
/>
```

Available providers:
- `google` - Google OAuth
- `github` - GitHub OAuth  
- `microsoft` - Microsoft OAuth
- `apple` - Apple Sign In
- `facebook` - Facebook OAuth

### Disable Passkey Authentication

```tsx
<PasskeymeAuthPanel
  enablePasskeys={false}
  providers={['google', 'github']}
/>
```

## Event Handling

### Success Event

```tsx
const handleAuthSuccess = (user) => {
  console.log('Authenticated user:', {
    id: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    provider: user.provider,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt
  });
  
  // Store authentication state
  setUser(user);
  
  // Redirect to protected area
  navigate('/dashboard');
};

<PasskeymeAuthPanel
  onSuccess={handleAuthSuccess}
/>
```

### Error Handling

```tsx
const handleAuthError = (error) => {
  console.error('Authentication error:', error);
  
  switch (error.code) {
    case 'USER_CANCELLED':
      // User cancelled authentication
      break;
    case 'PASSKEY_NOT_SUPPORTED':
      // Device doesn't support passkeys
      showToast('Passkeys not supported on this device');
      break;
    case 'NETWORK_ERROR':
      // Network connectivity issue
      showToast('Please check your internet connection');
      break;
    default:
      showToast('Authentication failed. Please try again.');
  }
};

<PasskeymeAuthPanel
  onError={handleAuthError}
/>
```

## Advanced Usage

### Conditional Rendering

```tsx
function AuthenticatedApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <PasskeymeAuthPanel
        appId="your-app-id"
        onSuccess={(user) => {
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        }}
      />
    );
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={() => {
        setUser(null);
        localStorage.removeItem('user');
      }}>
        Logout
      </button>
    </div>
  );
}
```

### Integration with State Management

```tsx
// Redux
import { useDispatch } from 'react-redux';
import { setUser } from './authSlice';

function LoginComponent() {
  const dispatch = useDispatch();

  return (
    <PasskeymeAuthPanel
      onSuccess={(user) => dispatch(setUser(user))}
    />
  );
}
```

```tsx
// Context API
import { useAuth } from './AuthContext';

function LoginComponent() {
  const { login } = useAuth();

  return (
    <PasskeymeAuthPanel
      onSuccess={login}
    />
  );
}
```

## TypeScript Support

The React SDK includes full TypeScript definitions:

```tsx
import { PasskeymeAuthPanel, PasskeymeAuthPanelProps } from '@passkeyme/react-auth';

interface Props {
  onComplete: (user: any) => void;
}

const LoginForm: React.FC<Props> = ({ onComplete }) => {
  const handleSuccess = (user: any, method: string) => {
    console.log(`User authenticated via ${method}:`, user);
    onComplete(user);
  };

  const handleError = (error: Error) => {
    console.error('Auth error:', error.message);
  };

  return (
    <PasskeymeAuthPanel
      appId="your-app-id"
      onSuccess={handleSuccess}
      onError={handleError}
      theme={{
        container: { backgroundColor: '#ffffff' }
      }}
    />
  );
};
```

## Migration from Hosted Pages

If you're migrating from hosted authentication pages:

```tsx
// Before (hosted pages)
import { PasskeymeAuth } from '@passkeyme/auth';

const auth = new PasskeymeAuth({ appId: 'your-app-id' });
auth.redirectToLogin();

// After (inline components)
import { PasskeymeAuthPanel } from '@passkeyme/react-auth';

<PasskeymeAuthPanel
  appId="your-app-id"
  onSuccess={(user, method) => handleLogin(user, method)}
/>
```

## Best Practices

### User Experience
- Use `theme="auto"` to respect user's system preferences
- Provide clear error messages with `onError` handler
- Show loading states during authentication

### Security
- Never store sensitive user data in localStorage for production apps
- Implement proper session management
- Use HTTPS in production

### Performance
- Lazy load the auth panel if not immediately needed
- Consider using React.Suspense for component loading
- Cache user state appropriately

## Next Steps

- **[Demo Application](https://github.com/Passkeyme/passkeyme-react-demo)** - Complete React example
- **[JavaScript SDK](/docs/sdks/javascript)** - For non-React frameworks
- **[API Reference](/docs/api/authentication)** - Direct API integration
- **[Troubleshooting](/docs/troubleshooting/common-issues)** - Common issues and solutions

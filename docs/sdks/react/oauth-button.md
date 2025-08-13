---
id: oauth-button
title: PasskeymeOAuthButton
sidebar_label: PasskeymeOAuthButton
description: Individual OAuth provider buttons for custom authentication layouts
---

# 🔗 PasskeymeOAuthButton

`PasskeymeOAuthButton` provides **individual OAuth provider buttons** for complete control over your authentication layout. Perfect when you want to build custom authentication screens or integrate OAuth buttons into existing UI components.

## ✨ **Why PasskeymeOAuthButton?**

- **🎯 Granular Control** - Individual buttons for each OAuth provider
- **🎨 Custom Layouts** - Build your own authentication flows
- **📦 Lightweight** - Only load the providers you need
- **🔧 Flexible Integration** - Mix with your existing UI components
- **🎭 Brand Consistency** - Style each provider button independently
- **⚡ Optimized Performance** - Minimal bundle size impact

## 🚀 **Quick Start**

```tsx
import { PasskeymeOAuthButton } from '@passkeyme/react-auth';

function CustomLoginForm() {
  const handleAuthSuccess = (user) => {
    console.log('User authenticated:', user);
    setUser(user);
  };

  return (
    <div className="auth-container">
      <h2>Choose your sign-in method</h2>
      
      <div className="oauth-buttons">
        <PasskeymeOAuthButton
          provider="google"
          appId="your-app-id"
          onSuccess={handleAuthSuccess}
          text="Continue with Google"
        />
        
        <PasskeymeOAuthButton
          provider="github"
          appId="your-app-id"
          onSuccess={handleAuthSuccess}
          text="Continue with GitHub"
        />
        
        <PasskeymeOAuthButton
          provider="microsoft"
          appId="your-app-id"
          onSuccess={handleAuthSuccess}
          text="Continue with Microsoft"
        />
      </div>
    </div>
  );
}
```

## 📋 **Props Reference**

### **Required Props**

| Prop | Type | Description |
|------|------|-------------|
| `provider` | `'google' \| 'github' \| 'microsoft' \| 'apple' \| 'discord' \| 'facebook'` | OAuth provider to authenticate with |
| `appId` | `string` | Your PasskeyMe application ID |

### **Event Handlers**

| Prop | Type | Description |
|------|------|-------------|
| `onSuccess` | `(user: User) => void` | Called when authentication succeeds |
| `onError` | `(error: Error) => void` | Called when authentication fails |
| `onClick` | `() => void` | Called when button is clicked (before auth starts) |

### **UI Configuration**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | Provider-specific | Custom button text |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `variant` | `'default' \| 'outline' \| 'minimal'` | `'default'` | Button style variant |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Button theme |
| `showIcon` | `boolean` | `true` | Show provider icon |
| `fullWidth` | `boolean` | `false` | Make button full width |
| `disabled` | `boolean` | `false` | Disable the button |

### **Styling**

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | CSS class for button |
| `style` | `React.CSSProperties` | Inline styles for button |

### **Advanced Options**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `redirectUri` | `string` | - | Custom redirect URI |
| `state` | `string` | - | Custom state parameter |
| `debugMode` | `boolean` | `false` | Enable debug logging |

## 🎨 **Styling Variants**

### **Default Variant**

```tsx
<PasskeymeOAuthButton
  provider="google"
  appId="your-app-id"
  variant="default"
  onSuccess={handleSuccess}
/>
```

### **Outline Variant**

```tsx
<PasskeymeOAuthButton
  provider="github"
  appId="your-app-id"
  variant="outline"
  onSuccess={handleSuccess}
/>
```

### **Minimal Variant**

```tsx
<PasskeymeOAuthButton
  provider="microsoft"
  appId="your-app-id"
  variant="minimal"
  text="Microsoft"
  onSuccess={handleSuccess}
/>
```

## 📏 **Size Options**

```tsx
// Small buttons - great for compact layouts
<PasskeymeOAuthButton
  provider="google"
  appId="your-app-id"
  size="small"
  onSuccess={handleSuccess}
/>

// Medium buttons (default) - balanced size
<PasskeymeOAuthButton
  provider="github"
  appId="your-app-id"
  size="medium"
  onSuccess={handleSuccess}
/>

// Large buttons - prominent call-to-action
<PasskeymeOAuthButton
  provider="microsoft"
  appId="your-app-id"
  size="large"
  onSuccess={handleSuccess}
/>
```

## 🎯 **Provider-Specific Examples**

### **Google**

```tsx
<PasskeymeOAuthButton
  provider="google"
  appId="your-app-id"
  text="Sign in with Google"
  size="large"
  fullWidth
  onSuccess={(user) => {
    console.log('Google user:', user);
    setUser(user);
  }}
/>
```

### **GitHub**

```tsx
<PasskeymeOAuthButton
  provider="github"
  appId="your-app-id"
  text="Continue with GitHub"
  variant="outline"
  theme="dark"
  onSuccess={(user) => {
    console.log('GitHub user:', user);
    // GitHub users often are developers
    analytics.track('developer_signup', { provider: 'github' });
    setUser(user);
  }}
/>
```

### **Microsoft**

```tsx
<PasskeymeOAuthButton
  provider="microsoft"
  appId="your-app-id"
  text="Enterprise Sign In"
  onSuccess={(user) => {
    console.log('Microsoft user:', user);
    // Handle enterprise authentication
    setUser(user);
  }}
/>
```

### **Apple**

```tsx
<PasskeymeOAuthButton
  provider="apple"
  appId="your-app-id"
  text="Sign in with Apple"
  theme="dark"
  onSuccess={(user) => {
    console.log('Apple user:', user);
    setUser(user);
  }}
/>
```

## 🏗️ **Custom Layout Examples**

### **Grid Layout**

```tsx
function GridAuthLayout() {
  const providers = [
    { id: 'google', name: 'Google' },
    { id: 'github', name: 'GitHub' }, 
    { id: 'microsoft', name: 'Microsoft' },
    { id: 'apple', name: 'Apple' },
  ];

  return (
    <div className="auth-grid">
      {providers.map((provider) => (
        <PasskeymeOAuthButton
          key={provider.id}
          provider={provider.id}
          appId="your-app-id"
          text={provider.name}
          variant="outline"
          onSuccess={handleAuthSuccess}
        />
      ))}
    </div>
  );
}

// CSS
.auth-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
```

### **Horizontal Layout**

```tsx
function HorizontalAuthLayout() {
  return (
    <div className="auth-horizontal">
      <PasskeymeOAuthButton
        provider="google"
        appId="your-app-id"
        size="small"
        variant="minimal"
        text="Google"
        onSuccess={handleAuthSuccess}
      />
      
      <div className="divider">or</div>
      
      <PasskeymeOAuthButton
        provider="github"
        appId="your-app-id"
        size="small"
        variant="minimal"
        text="GitHub"
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

// CSS
.auth-horizontal {
  display: flex;
  align-items: center;
  gap: 16px;
}

.divider {
  color: #666;
  font-size: 14px;
}
```

### **Conditional Rendering**

```tsx
function ConditionalAuthLayout() {
  const [selectedProvider, setSelectedProvider] = useState(null);
  
  if (selectedProvider) {
    return (
      <div className="auth-selected">
        <h3>Signing in with {selectedProvider}</h3>
        <PasskeymeOAuthButton
          provider={selectedProvider}
          appId="your-app-id"
          text={`Continue with ${selectedProvider}`}
          size="large"
          fullWidth
          onSuccess={handleAuthSuccess}
          onError={() => setSelectedProvider(null)}
        />
        <button onClick={() => setSelectedProvider(null)}>
          Choose different provider
        </button>
      </div>
    );
  }

  return (
    <div className="auth-selection">
      <h3>Choose your sign-in method</h3>
      {['google', 'github', 'microsoft'].map((provider) => (
        <button
          key={provider}
          onClick={() => setSelectedProvider(provider)}
          className="provider-selector"
        >
          {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </button>
      ))}
    </div>
  );
}
```

## 🎭 **Custom Styling**

### **CSS Classes**

```css
/* Target specific providers */
.passkeyme-oauth-button[data-provider="google"] {
  background-color: #4285f4;
  border-color: #4285f4;
}

.passkeyme-oauth-button[data-provider="github"] {
  background-color: #333;
  border-color: #333;
}

.passkeyme-oauth-button[data-provider="microsoft"] {
  background-color: #0078d4;
  border-color: #0078d4;
}

/* Custom hover effects */
.passkeyme-oauth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Size variants */
.passkeyme-oauth-button[data-size="small"] {
  padding: 8px 12px;
  font-size: 14px;
}

.passkeyme-oauth-button[data-size="large"] {
  padding: 16px 24px;
  font-size: 18px;
}
```

### **Styled Components**

```tsx
import styled from 'styled-components';

const StyledOAuthButton = styled(PasskeymeOAuthButton)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

function CustomStyledAuth() {
  return (
    <StyledOAuthButton
      provider="google"
      appId="your-app-id"
      text="Stylish Google Login"
      onSuccess={handleSuccess}
    />
  );
}
```

## 🔄 **Event Handling**

### **Success Handling**

```tsx
const handleAuthSuccess = (user) => {
  console.log('OAuth authentication successful:', user);
  
  // Store user data
  localStorage.setItem('user', JSON.stringify(user));
  
  // Update application state
  setUser(user);
  setIsAuthenticated(true);
  
  // Redirect to dashboard
  navigate('/dashboard');
  
  // Track analytics
  analytics.track('oauth_login_success', {
    provider: user.provider,
    user_id: user.id,
  });
};
```

### **Error Handling**

```tsx
const handleAuthError = (error) => {
  console.error('OAuth authentication failed:', error);
  
  // Handle different error types
  switch (error.code) {
    case 'POPUP_BLOCKED':
      setErrorMessage('Please allow popups and try again.');
      break;
    case 'PROVIDER_ERROR':
      setErrorMessage('There was an issue with the authentication provider.');
      break;
    case 'NETWORK_ERROR':
      setErrorMessage('Please check your internet connection.');
      break;
    default:
      setErrorMessage('Authentication failed. Please try again.');
  }
  
  // Track error analytics
  analytics.track('oauth_login_error', {
    error_code: error.code,
    error_message: error.message,
  });
};
```

### **Click Tracking**

```tsx
<PasskeymeOAuthButton
  provider="google"
  appId="your-app-id"
  onClick={() => {
    // Track button clicks
    analytics.track('oauth_button_clicked', { provider: 'google' });
    
    // Show loading state
    setIsLoading(true);
  }}
  onSuccess={(user) => {
    setIsLoading(false);
    handleAuthSuccess(user);
  }}
  onError={(error) => {
    setIsLoading(false);
    handleAuthError(error);
  }}
/>
```

## 🧪 **Integration Examples**

### **With Form Validation**

```tsx
import { useForm } from 'react-hook-form';

function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [authMethod, setAuthMethod] = useState(null);

  const onSubmit = (data) => {
    // Handle form submission
    console.log('Form data:', data);
  };

  if (authMethod === 'oauth') {
    return (
      <div className="oauth-auth">
        <h3>Quick Registration</h3>
        <PasskeymeOAuthButton
          provider="google"
          appId="your-app-id"
          text="Register with Google"
          onSuccess={(user) => {
            // OAuth registration successful
            setUser(user);
            navigate('/onboarding');
          }}
        />
        <button onClick={() => setAuthMethod(null)}>
          Use email instead
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', { required: true })}
        placeholder="Email"
      />
      {errors.email && <span>Email is required</span>}
      
      <input
        {...register('password', { required: true })}
        type="password"
        placeholder="Password"
      />
      {errors.password && <span>Password is required</span>}
      
      <button type="submit">Register</button>
      
      <div className="oauth-option">
        <p>Or register quickly with:</p>
        <button
          type="button"
          onClick={() => setAuthMethod('oauth')}
        >
          Use OAuth instead
        </button>
      </div>
    </form>
  );
}
```

### **With Loading States**

```tsx
function LoadingAwareOAuthButton({ provider, ...props }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="oauth-button-container">
      <PasskeymeOAuthButton
        provider={provider}
        {...props}
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true);
          props.onClick?.();
        }}
        onSuccess={(user) => {
          setIsLoading(false);
          props.onSuccess?.(user);
        }}
        onError={(error) => {
          setIsLoading(false);
          props.onError?.(error);
        }}
      />
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <span>Authenticating...</span>
        </div>
      )}
    </div>
  );
}
```

## 🚀 **Best Practices**

### **1. Provider Selection**

```tsx
// ✅ Good: Limit providers based on your audience
const B2B_PROVIDERS = ['microsoft', 'google'];
const DEVELOPER_PROVIDERS = ['github', 'google'];
const CONSUMER_PROVIDERS = ['google', 'apple', 'facebook'];

function AuthButtons({ userType }) {
  const providers = userType === 'developer' 
    ? DEVELOPER_PROVIDERS 
    : CONSUMER_PROVIDERS;
    
  return (
    <div>
      {providers.map(provider => (
        <PasskeymeOAuthButton
          key={provider}
          provider={provider}
          appId="your-app-id"
          onSuccess={handleSuccess}
        />
      ))}
    </div>
  );
}
```

### **2. Accessibility**

```tsx
// ✅ Good: Accessible button implementation
<PasskeymeOAuthButton
  provider="google"
  appId="your-app-id"
  text="Sign in with Google"
  aria-label="Sign in with your Google account"
  onSuccess={handleSuccess}
/>
```

### **3. Error Recovery**

```tsx
// ✅ Good: Provide error recovery options
function RobustOAuthButton({ provider, ...props }) {
  const [retryCount, setRetryCount] = useState(0);

  const handleError = (error) => {
    if (retryCount < 3 && error.code === 'NETWORK_ERROR') {
      setRetryCount(prev => prev + 1);
      // Auto-retry network errors
      setTimeout(() => {
        // Trigger retry logic
      }, 1000);
    } else {
      props.onError?.(error);
    }
  };

  return (
    <PasskeymeOAuthButton
      provider={provider}
      {...props}
      onError={handleError}
    />
  );
}
```

## 🔗 **Related Components**

- **[PasskeymeAuthPanel](./auth-panel.md)** - Complete all-in-one authentication solution
- **[PasskeymeButton](./passkey-button.md)** - Hosted auth page integration
- **[usePasskeyme Hook](./use-passkeyme.md)** - Programmatic authentication control

## 📚 **Next Steps**

- **[Custom Layouts](../react.md#layout-options)** - Advanced layout techniques
- **[Theming Guide](../react.md#theming-and-customization)** - Styling OAuth buttons
- **[Error Handling](../react.md#error-handling)** - Robust error management
- **[Analytics Integration](../react.md#analytics)** - Track authentication events

---

*PasskeymeOAuthButton gives you complete control over individual OAuth providers. Perfect for custom authentication flows and advanced UI layouts.*

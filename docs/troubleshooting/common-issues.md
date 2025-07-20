---
id: common-issues
title: Common Issues & Solutions
sidebar_label: Common Issues
description: Troubleshoot and resolve common PasskeyMe integration issues
---

# 🔧 Common Issues & Solutions

This guide covers the most common issues developers encounter when integrating PasskeyMe and provides step-by-step solutions.

## Authentication Issues

### Passkeys Not Working

**Problem:** Passkeys fail to register or authenticate

**Common Causes:**
- HTTP instead of HTTPS in production
- Incompatible device or browser
- User gesture not detected
- Domain mismatch

**Solutions:**

1. **Verify HTTPS in Production**
   ```typescript
   // Check protocol
   if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
     console.error('Passkeys require HTTPS in production');
   }
   ```

2. **Check Device Compatibility**
   ```typescript
   // Check for WebAuthn support
   if (!window.PublicKeyCredential) {
     console.error('WebAuthn not supported');
   }
   
   // Check for platform authenticator
   PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
     .then(available => {
       console.log('Platform authenticator available:', available);
     });
   ```

3. **Verify Domain Configuration**
   ```typescript
   // Ensure domain matches PasskeyMe configuration
   console.log('Current domain:', window.location.hostname);
   ```

4. **Enable Debug Logging**
   ```typescript
   const auth = new PasskeymeAuth({
     appId: 'your-app-id',
     debug: true // Shows detailed passkey logs
   });
   ```

### OAuth Authentication Failures

**Problem:** OAuth login redirects fail or return errors

**Common Causes:**
- Incorrect redirect URI configuration
- OAuth app credentials missing/invalid
- CORS issues
- State parameter mismatch

**Solutions:**

1. **Verify Redirect URI Configuration**
   ```typescript
   // Check configured vs actual redirect URI
   console.log('Configured:', auth.config.redirectUri);
   console.log('Current URL:', window.location.href);
   
   // Common redirect URI patterns
   const validRedirectUris = [
     'http://localhost:3000/auth/callback',    // Development
     'https://yourapp.com/auth/callback',      // Production
     'https://staging.yourapp.com/auth/callback' // Staging
   ];
   ```

2. **Check OAuth Provider Setup**
   - Verify client ID and secret in PasskeyMe dashboard
   - Ensure OAuth app is approved/published
   - Check authorized domains in OAuth provider settings

3. **Debug OAuth Errors**
   ```typescript
   // Check URL parameters for OAuth errors
   const urlParams = new URLSearchParams(window.location.search);
   if (urlParams.get('error')) {
     console.error('OAuth error:', {
       error: urlParams.get('error'),
       description: urlParams.get('error_description'),
       state: urlParams.get('state')
     });
   }
   ```

### Token Issues

**Problem:** Access tokens expired or invalid

**Common Causes:**
- Token expired naturally
- Clock drift between client/server
- Token storage issues
- Invalid token format

**Solutions:**

1. **Check Token Expiration**
   ```typescript
   try {
     const token = await auth.getAccessToken();
     console.log('Token obtained successfully');
   } catch (error) {
     if (error.code === 'TOKEN_EXPIRED') {
       console.log('Token expired, redirecting to login');
       auth.redirectToLogin();
     }
   }
   ```

2. **Verify Token Storage**
   ```typescript
   // Check if tokens are being stored
   const storedToken = localStorage.getItem('passkeyme_access_token');
   console.log('Stored token:', storedToken ? 'Present' : 'Missing');
   
   // Try different storage mechanisms
   const auth = new PasskeymeAuth({
     appId: 'your-app-id',
     storage: 'sessionStorage' // or 'memory'
   });
   ```

3. **Manual Token Refresh**
   ```typescript
   try {
     const newToken = await auth.refreshAccessToken();
     console.log('Token refreshed successfully');
   } catch (error) {
     console.error('Refresh failed:', error);
     auth.redirectToLogin();
   }
   ```

## SDK Integration Issues

### React Hook Errors

**Problem:** React hooks not working properly

**Common Causes:**
- Missing PasskeymeProvider
- Multiple React versions
- Hook called outside component
- Stale closures

**Solutions:**

1. **Verify Provider Setup**
   ```tsx
   // Ensure PasskeymeProvider wraps your app
   function App() {
     return (
       <PasskeymeProvider config={{ appId: 'your-app-id' }}>
         <YourApp />
       </PasskeymeProvider>
     );
   }
   ```

2. **Check Hook Usage**
   ```tsx
   // ✅ Correct usage
   function MyComponent() {
     const { user, isAuthenticated } = usePasskeyme();
     return <div>{user?.email}</div>;
   }
   
   // ❌ Incorrect usage (outside component)
   const { user } = usePasskeyme(); // This will fail
   function MyComponent() {
     return <div>{user?.email}</div>;
   }
   ```

3. **Debug React Version Conflicts**
   ```bash
   npm ls react
   # Ensure only one version of React
   ```

### Next.js Issues

**Problem:** Next.js specific integration problems

**Common Causes:**
- SSR/SSG hydration mismatches
- Environment variables not loaded
- Window object accessed during SSR

**Solutions:**

1. **Fix SSR Hydration Issues**
   ```tsx
   // Use dynamic imports for client-only components
   import dynamic from 'next/dynamic';
   
   const AuthComponent = dynamic(
     () => import('./AuthComponent'),
     { ssr: false }
   );
   ```

2. **Proper Environment Variable Setup**
   ```javascript
   // next.config.js
   module.exports = {
     env: {
       NEXT_PUBLIC_PASSKEYME_APP_ID: process.env.NEXT_PUBLIC_PASSKEYME_APP_ID,
     }
   };
   ```

3. **Client-Side Only Initialization**
   ```tsx
   import { useEffect, useState } from 'react';
   
   function AuthProvider({ children }) {
     const [mounted, setMounted] = useState(false);
   
     useEffect(() => {
       setMounted(true);
     }, []);
   
     if (!mounted) return <div>Loading...</div>;
   
     return (
       <PasskeymeProvider config={{ appId: process.env.NEXT_PUBLIC_PASSKEYME_APP_ID }}>
         {children}
       </PasskeymeProvider>
     );
   }
   ```

### TypeScript Errors

**Problem:** TypeScript compilation errors

**Common Causes:**
- Missing type definitions
- Incorrect type usage
- Version mismatches

**Solutions:**

1. **Install Type Definitions**
   ```bash
   npm install @types/node @types/react
   ```

2. **Fix Common Type Issues**
   ```typescript
   // ✅ Correct typing
   const { user } = usePasskeyme();
   const email: string | undefined = user?.email;
   
   // ❌ Incorrect assumption
   const email: string = user.email; // user might be null
   ```

3. **Use Type Guards**
   ```typescript
   function isAuthenticated(user: User | null): user is User {
     return user !== null;
   }
   
   if (isAuthenticated(user)) {
     // TypeScript knows user is not null here
     console.log(user.email);
   }
   ```

## Network & CORS Issues

### CORS Errors

**Problem:** Cross-origin request blocked

**Common Causes:**
- Domain not configured in PasskeyMe dashboard
- Development vs production URL mismatch
- Subdomain issues

**Solutions:**

1. **Configure Allowed Origins**
   - Add your domain to PasskeyMe dashboard
   - Include both www and non-www versions
   - Add development URLs (localhost:3000, etc.)

2. **Check Current Origin**
   ```typescript
   console.log('Current origin:', window.location.origin);
   // Add this origin to PasskeyMe dashboard
   ```

3. **Development CORS Setup**
   ```typescript
   // For development
   const auth = new PasskeymeAuth({
     appId: 'your-app-id',
     baseUrl: 'http://localhost:3001', // Local development server
   });
   ```

### Network Timeouts

**Problem:** Requests timing out

**Common Causes:**
- Slow network connection
- Server overload
- Firewall blocking requests

**Solutions:**

1. **Increase Timeout**
   ```typescript
   const auth = new PasskeymeAuth({
     appId: 'your-app-id',
     timeout: 30000 // 30 seconds instead of default 10
   });
   ```

2. **Retry Logic**
   ```typescript
   async function authenticateWithRetry(maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await auth.handleAuthCallback();
       } catch (error) {
         if (i === maxRetries - 1) throw error;
         await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
       }
     }
   }
   ```

## Callback & Redirect Issues

### Callback Not Working

**Problem:** Authentication callback fails

**Common Causes:**
- Callback URL misconfiguration
- Missing state parameter
- Page not handling callback properly

**Solutions:**

1. **Debug Callback Parameters**
   ```typescript
   // Check callback URL parameters
   const urlParams = new URLSearchParams(window.location.search);
   console.log('Callback parameters:', {
     code: urlParams.get('code'),
     state: urlParams.get('state'),
     error: urlParams.get('error')
   });
   ```

2. **Proper Callback Page Setup**
   ```tsx
   // Dedicated callback page
   function CallbackPage() {
     const { handleAuthCallback } = usePasskeyme();
     const navigate = useNavigate();
   
     useEffect(() => {
       const processCallback = async () => {
         try {
           await handleAuthCallback();
           navigate('/dashboard');
         } catch (error) {
           console.error('Callback failed:', error);
           navigate('/login?error=callback_failed');
         }
       };
   
       processCallback();
     }, []);
   
     return <div>Processing authentication...</div>;
   }
   ```

3. **State Parameter Handling**
   ```typescript
   // Include return URL in state
   auth.redirectToLogin({
     state: JSON.stringify({ returnTo: window.location.pathname })
   });
   
   // Handle state in callback
   const result = await auth.handleAuthCallback();
   if (result.state) {
     const { returnTo } = JSON.parse(result.state);
     navigate(returnTo || '/dashboard');
   }
   ```

### Infinite Redirect Loops

**Problem:** App gets stuck in redirect loop

**Common Causes:**
- Protected route redirecting authenticated users
- Callback page not handling success properly
- State management issues

**Solutions:**

1. **Fix Route Protection Logic**
   ```tsx
   function ProtectedRoute({ children }) {
     const { isAuthenticated, loading } = usePasskeyme();
     const location = useLocation();
   
     if (loading) return <div>Loading...</div>;
   
     if (!isAuthenticated) {
       // Only redirect if not already on auth pages
       if (!location.pathname.startsWith('/auth/')) {
         return <Navigate to="/login" replace />;
       }
     }
   
     return children;
   }
   ```

2. **Prevent Double Authentication**
   ```tsx
   function LoginPage() {
     const { isAuthenticated } = usePasskeyme();
     const navigate = useNavigate();
   
     useEffect(() => {
       if (isAuthenticated) {
         navigate('/dashboard', { replace: true });
       }
     }, [isAuthenticated, navigate]);
   
     return <LoginForm />;
   }
   ```

## Performance Issues

### Slow Authentication

**Problem:** Authentication process is slow

**Common Causes:**
- Large bundle size
- Inefficient re-renders
- Network latency

**Solutions:**

1. **Optimize Bundle Size**
   ```typescript
   // Use dynamic imports for auth pages
   const LoginPage = lazy(() => import('./pages/LoginPage'));
   const CallbackPage = lazy(() => import('./pages/CallbackPage'));
   ```

2. **Memoize Components**
   ```tsx
   const AuthButton = memo(function AuthButton() {
     const { redirectToLogin, loading } = usePasskeyme();
     
     return (
       <button onClick={redirectToLogin} disabled={loading}>
         Sign In
       </button>
     );
   });
   ```

3. **Reduce Re-renders**
   ```tsx
   function App() {
     const auth = usePasskeyme();
     
     // Memoize to prevent unnecessary re-renders
     const authContextValue = useMemo(() => auth, [
       auth.user, 
       auth.isAuthenticated, 
       auth.loading
     ]);
     
     return <AuthContext.Provider value={authContextValue} />;
   }
   ```

## Browser Compatibility

### Safari Issues

**Problem:** Authentication not working in Safari

**Common Causes:**
- Strict cookie policies
- Webkit-specific bugs
- Third-party cookie blocking

**Solutions:**

1. **Configure Cookie Settings**
   ```typescript
   // Use sessionStorage for Safari compatibility
   const auth = new PasskeymeAuth({
     appId: 'your-app-id',
     storage: 'sessionStorage'
   });
   ```

2. **Check Safari Version**
   ```javascript
   const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
   if (isSafari) {
     console.log('Safari detected, using compatible settings');
   }
   ```

### Mobile Browser Issues

**Problem:** Issues on mobile browsers

**Common Causes:**
- Viewport scaling
- Touch event handling
- iOS Safari specific issues

**Solutions:**

1. **Mobile-Optimized Configuration**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
   ```

2. **Touch-Friendly UI**
   ```css
   .auth-button {
     min-height: 44px; /* iOS minimum touch target */
     touch-action: manipulation;
   }
   ```

## Debugging Tools

### Enable Debug Mode

```typescript
const auth = new PasskeymeAuth({
  appId: 'your-app-id',
  debug: true // Enables detailed logging
});

// Manual debug toggle
auth.setDebugMode(true);
```

### Browser Developer Tools

1. **Network Tab**
   - Check for failed requests
   - Verify correct headers
   - Look for CORS errors

2. **Console Tab**
   - Enable debug mode for detailed logs
   - Check for JavaScript errors
   - Monitor authentication events

3. **Application Tab**
   - Check localStorage/sessionStorage
   - Verify token storage
   - Clear storage if needed

### Testing Checklist

```typescript
// Complete debugging checklist
function debugPasskeyMe() {
  console.log('=== PasskeyMe Debug Info ===');
  console.log('Current URL:', window.location.href);
  console.log('Protocol:', window.location.protocol);
  console.log('SDK Version:', PasskeymeAuth.version);
  console.log('WebAuthn Support:', !!window.PublicKeyCredential);
  console.log('Auth State:', auth.state);
  console.log('Stored Tokens:', {
    access: !!localStorage.getItem('passkeyme_access_token'),
    refresh: !!localStorage.getItem('passkeyme_refresh_token')
  });
  console.log('========================');
}
```

## Getting Help

### Support Channels

1. **Documentation** - Check relevant guides first
2. **Community Discord** - Ask questions and get help
3. **GitHub Issues** - Report bugs and feature requests
4. **Email Support** - Direct support for enterprise customers

### Bug Reports

When reporting issues, include:

```typescript
// Debugging information to include
const debugInfo = {
  sdk: '@passkeyme/auth',
  version: PasskeymeAuth.version,
  browser: navigator.userAgent,
  url: window.location.href,
  error: error.message,
  steps: 'Steps to reproduce...'
};
```

### Feature Requests

Use our [GitHub repository](https://github.com/passkeyme/feedback) to request new features or improvements.

## Next Steps

- **[SDK Documentation](/docs/sdks/overview)** - Detailed SDK guides
- **[API Reference](/docs/api/authentication)** - Direct API usage
- **[Configuration](/docs/configuration/authentication-methods)** - Advanced configuration
- **[Community Support](https://discord.gg/passkeyme)** - Get help from the community

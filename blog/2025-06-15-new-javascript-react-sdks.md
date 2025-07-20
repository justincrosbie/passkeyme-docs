---
slug: new-javascript-react-sdks
title: Introducing PasskeyMe's New JavaScript and React SDKs - Firebase Auth for the Passkey Era
tags: [sdk, javascript, react, typescript, firebase-auth, announcement, developer-experience]
---

# Introducing PasskeyMe's New JavaScript and React SDKs 🚀

We're excited to announce the launch of PasskeyMe's completely redesigned JavaScript and React SDKs! These new SDKs bring a **Firebase Auth-like developer experience** to passkey authentication using **hosted authentication pages**, making it easier than ever to integrate secure, passwordless authentication into your web applications.

## 🆕 What's New?

### **@passkeyme/auth** - Core JavaScript/TypeScript SDK
Our new core SDK provides a complete authentication solution using PasskeyMe's hosted authentication pages:

```typescript
import { PasskeymeAuth } from '@passkeyme/auth';

const auth = new PasskeymeAuth({
  appId: 'your-app-id',
  baseUrl: 'https://auth.passkeyme.com',
  mode: 'hosted' // Uses your branded hosted auth pages
});

// Redirect to hosted auth page (all methods)
auth.redirectToLogin();

// Redirect to specific OAuth provider
auth.redirectToOAuth('google');

// Handle return from hosted auth
const user = await auth.handleAuthCallback();
```

### **@passkeyme/react-auth** - React Integration SDK
The React SDK brings hosted authentication directly into your React components with simple hooks:

```tsx
import { 
  PasskeymeProvider, 
  usePasskeyme
} from '@passkeyme/react-auth';

function App() {
  return (
    <PasskeymeProvider config={{ appId: 'your-app-id' }}>
      <AuthenticatedApp />
    </PasskeymeProvider>
  );
}

function LoginPage() {
  const { redirectToLogin, redirectToOAuth } = usePasskeyme();
  
  return (
    <div>
      <button onClick={() => redirectToLogin()}>
        🔐 Sign In (All Methods)
      </button>
      <button onClick={() => redirectToOAuth('google')}>
        🌐 Continue with Google
      </button>
    </div>
  );
}
```

## 🎯 Why Hosted Authentication?

### **The Firebase Auth Experience, But Better**

While Firebase Auth has set the gold standard for authentication SDKs, it requires complex setup for OAuth providers and lacks comprehensive passkey support. We created something that's **even simpler** while being more powerful.

### **Our Solution: Hosted Pages + Self-Hosted Control**

PasskeyMe's hosted authentication approach combines the best of all worlds:

- ✅ **Zero Configuration**: No OAuth app setup, no complex SDK configuration
- ✅ **Centralized Branding**: Your logo, colors, and styling across all apps
- ✅ **Passkey-First**: Native WebAuthn/passkey support built from the ground up  
- ✅ **Self-Hosted**: Full control over your authentication infrastructure
- ✅ **TypeScript-First**: Complete type safety and excellent developer experience
- ✅ **Framework Agnostic**: Works with React, Vue, Angular, Next.js, or vanilla JavaScript

## 🚀 Key Features

### **🎨 Hosted Authentication Pages**
Your users see beautifully designed, branded authentication pages:

```typescript
// Your app redirects to hosted auth page
auth.redirectToLogin();

// Users see YOUR branded page with:
// - Your logo and colors
// - Configured OAuth providers (Google, GitHub, etc.)
// - Passkey authentication
// - Username/password forms
// - Custom styling and messaging
```

### **🔐 Comprehensive Authentication Methods**
All methods available on your hosted pages:

```typescript
// Direct to general auth page (shows all enabled methods)
auth.redirectToLogin();

// Direct to specific OAuth provider
auth.redirectToOAuth('google');
auth.redirectToOAuth('github');

// Direct to specific auth method
auth.redirectToLogin({ authMethod: 'passkey' });
auth.redirectToLogin({ authMethod: 'password' });
```

### **Modern React Integration**
```tsx
// Authentication state management
const { user, isAuthenticated, loading, error } = usePasskeyme();

// Pre-built UI components
<PasskeymeButton>🔐 Login with Passkey</PasskeymeButton>
<PasskeymeOAuthButton provider="google">Login with Google</PasskeymeOAuthButton>
<PasskeymeUserProfile editable={true} />
<PasskeymeProtectedRoute><Dashboard /></PasskeymeProtectedRoute>
```

### **Automatic Token Management**
- Secure token storage in browser
- Automatic token refresh
- HTTP interceptors for API calls
- CSRF protection and security best practices

### **Production-Ready Features**
- Comprehensive error handling
- Loading states and user feedback
- Customizable UI components
- Mobile-responsive design
- Accessibility (WCAG) compliance

## 🔄 Easy Migration

### **From Firebase Auth**

### **⚡ Automatic Token Management**
No more manually handling JWTs:

```typescript
// Tokens stored securely and refreshed automatically
const token = await auth.getAccessToken();

// Use with any HTTP client
fetch('/api/protected', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### **🛡️ Protected Routes Made Simple**

```tsx
// React Router protection
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

// Next.js protection
function ProtectedPage() {
  const { isAuthenticated, loading } = usePasskeyme();
  
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <Dashboard />;
}
```

## 🔄 Seamless Migration

### **From Firebase Auth**

The API is intentionally similar for easy migration:

```typescript
// Firebase Auth (old)
import { signInWithEmailAndPassword } from 'firebase/auth';
await signInWithEmailAndPassword(auth, email, password);

// PasskeyMe (new)
import { PasskeymeAuth } from '@passkeyme/auth';
const auth = new PasskeymeAuth(config);
auth.redirectToLogin({ authMethod: 'password' });
```

### **From Auth0**

```tsx
// Auth0 (old)
const { user, isAuthenticated, loginWithRedirect } = useAuth0();

// PasskeyMe (new)  
const { user, isAuthenticated, redirectToLogin } = usePasskeyme();
```

The transition is seamless, but you gain hosted auth pages, native passkey support, and eliminate vendor lock-in!

## 🎨 Hosted Auth Page Customization

Your hosted authentication pages are fully customizable through the PasskeyMe dashboard:

### **🎯 Brand Your Experience**
- Upload your logo and set brand colors
- Customize fonts and styling  
- Add custom messaging and copy
- Set your own custom domain

### **⚙️ Configure Auth Methods**
- Enable/disable passkeys, OAuth providers, username/password
- Set up OAuth apps (Google, GitHub, Facebook, etc.)
- Configure passkey settings and policies
- Set password requirements

### **📱 Mobile-Optimized Design**
- Responsive design works perfectly on all devices
- Native mobile app integration via deep links
- Progressive Web App (PWA) support

## 🛡️ Security & Performance

### **🔒 Enterprise-Grade Security**
- OAuth secrets managed server-side (never exposed to client)
- Automatic security headers and CSRF protection
- SOC 2 Type II compliant infrastructure
- Regular security audits and penetration testing

### **⚡ Lightning-Fast Performance**
- CDN-hosted assets for global speed
- Minimal bundle size (< 50KB gzipped)
- Optimized for Core Web Vitals
- Automatic code splitting and lazy loading

### **Built-in Security**
- Automatic CSRF protection
- Secure token storage with encryption
- XSS protection for token handling
- Secure HTTP-only cookie support
- Token expiration and refresh management

### **Performance Optimized**
- Tree-shakable modules for minimal bundle size
- Lazy loading of authentication components
- Optimized re-rendering with React hooks
- Efficient token caching and management

## 📱 Real-World Example

Here's a complete authentication flow in just a few lines:

```tsx
import React from 'react';
import { 
  PasskeymeProvider, 
  usePasskeyme, 
  PasskeymeButton,
  PasskeymeOAuthButton,
  PasskeymeUserProfile 
} from '@passkeyme/react-auth';

const authConfig = {
  apiUrl: process.env.REACT_APP_PASSKEYME_API_URL,
  clientId: process.env.REACT_APP_PASSKEYME_CLIENT_ID,
};

function App() {
  return (
    <PasskeymeProvider config={authConfig}>
      <AuthFlow />
    </PasskeymeProvider>
  );
}

function AuthFlow() {
  const { user, isAuthenticated, loading } = usePasskeyme();

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return (
      <div>
        <h1>Welcome back!</h1>
        <UserProfile />
      </div>
    );
## 📝 Complete React Example

Here's how simple it is to add authentication to your React app:

```tsx
import { PasskeymeProvider, usePasskeyme } from '@passkeyme/react-auth';

const authConfig = {
  appId: 'your-app-id',
  baseUrl: 'https://auth.passkeyme.com',
  mode: 'hosted'
};

function App() {
  return (
    <PasskeymeProvider config={authConfig}>
      <AuthenticatedApp />
    </PasskeymeProvider>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated, redirectToLogin } = usePasskeyme();

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Welcome to My App</h1>
        <button onClick={() => redirectToLogin()}>
          🔐 Sign In
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>You're logged in!</h1>
      <Dashboard />
    </div>
  );
}
```

That's it! Your users will see your beautifully branded hosted authentication page with all configured auth methods.

## 🚀 Getting Started

### **Installation**

```bash
# Core SDK (works with any framework)
npm install @passkeyme/auth

# React SDK (includes core SDK)
npm install @passkeyme/react-auth @passkeyme/auth
```

### **Quick Setup**

1. **Configure your provider:**
```tsx
import { PasskeymeProvider } from '@passkeyme/react-auth';

<PasskeymeProvider config={{
  appId: 'your-app-id', // From PasskeyMe dashboard
  mode: 'hosted' // Uses hosted auth pages
}}>
  <App />
</PasskeymeProvider>
```

2. **Use the hook:**
```tsx
const { user, redirectToLogin, isAuthenticated } = usePasskeyme();
```

3. **Add login buttons:**
```tsx
<button onClick={() => redirectToLogin()}>Sign In</button>
```

### **5-Minute Setup Guide**

1. **Create a PasskeyMe account** at [passkeyme.com](https://passkeyme.com)
2. **Set up your app** in the dashboard (configure branding, OAuth providers)
3. **Install the SDK** and add the provider to your React app
4. **Add login buttons** that redirect to hosted auth pages
5. **Handle the callback** when users return from authentication

## 🎯 Why Choose PasskeyMe?

### **vs. Firebase Auth**
- ✅ **Native passkey support** (Firebase requires custom implementation)
- ✅ **Self-hosted** (no vendor lock-in)  
- ✅ **Hosted auth pages** (easier setup, better UX)
- ✅ **More OAuth providers** with simpler configuration

### **vs. Auth0**
- ✅ **More affordable** (especially for growing teams)
- ✅ **Passkey-first** design (Auth0 added passkeys as an afterthought)
- ✅ **Self-hosted option** (complete data control)
- ✅ **Better developer experience** (simpler APIs)

### **vs. Clerk**
- ✅ **Self-hosted infrastructure** (vs. SaaS-only)
- ✅ **More comprehensive passkey support**
- ✅ **Framework agnostic** (works with any JavaScript framework)
- ✅ **Enterprise-ready** (SOC 2, GDPR compliant)

## 🔮 What's Next?

We're just getting started! Coming soon:

- **🔄 Direct Authentication Mode**: For developers who want custom UI components without hosted pages
- **📱 React Native SDK**: Native mobile authentication with passkeys and biometrics
- **🌐 Vue.js & Angular SDKs**: First-class support for all major frameworks
- **🔌 Webhook System**: Real-time auth events for your backend systems
- **📊 Advanced Analytics**: User authentication insights and security monitoring

## 🎉 Join the Passkey Revolution

**The future of web authentication is here, and it's passwordless.** 

With PasskeyMe's new SDKs, you can give your users the security and convenience of passkeys while maintaining the familiar, reliable developer experience you expect from modern authentication libraries.

### **Ready to get started?**

- 📚 **[Read the Documentation](/docs/SDKs/sdk-intro)**
- 🚀 **[Try the Live Demo](https://demo.passkeyme.com)**
- 💬 **[Join our Developer Community](https://discord.gg/passkeyme)**
- 🔗 **[GitHub Repository](https://github.com/passkeyme/sdks)**

**The passwordless future starts today. Let's build it together!** 🚀

## 🔮 What's Next?

These new SDKs are just the beginning! Here's what's coming next:

- **@passkeyme/vue-auth** - Vue.js integration
- **@passkeyme/react-native-auth** - React Native mobile apps  
- **@passkeyme/node-auth** - Server-side Node.js integration
- **@passkeyme/flutter-auth** - Flutter mobile apps
- **Advanced UI components** - Forms, modals, onboarding flows
- **Theme system** - Pre-built design systems and themes

## 📚 Resources

- **[Documentation](https://docs.passkeyme.com/docs/SDKs/sdk-intro)** - Complete integration guides
- **[JavaScript SDK Guide](https://docs.passkeyme.com/docs/SDKs/javascript-sdk)** - Core SDK documentation
- **[React SDK Guide](https://docs.passkeyme.com/docs/SDKs/react-sdk)** - React-specific documentation
- **[GitHub Examples](https://github.com/passkeyme/examples)** - Complete example applications
- **[Live Demo](https://demo.passkeyme.com)** - Try the SDKs in action

## 🤝 Community & Support

We're building PasskeyMe to be the authentication solution that developers actually want to use. Your feedback is crucial:

- 🐛 **Found a bug?** [Report it on GitHub](https://github.com/passkeyme/issues)
- 💡 **Have a feature request?** [Let us know!](https://github.com/passkeyme/discussions)
- 🤝 **Need help integrating?** [Join our community](https://discord.gg/passkeyme)
- 📧 **Enterprise support?** [Contact us directly](mailto:support@passkeyme.com)

## 🎉 Try It Today!

The new PasskeyMe JavaScript and React SDKs are available now. Whether you're building a new application or looking to upgrade your existing authentication system, we've made it easier than ever to add secure, modern authentication to your web applications.

**Get started today and give your users the passwordless authentication experience they deserve!**

```bash
npm install @passkeyme/react-auth @passkeyme/auth
```

Happy coding! 🚀

---

*PasskeyMe - Secure authentication for the modern web*

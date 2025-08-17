---
slug: introducing-passkeyme-dev-community
title: Introducing Passkeyme to the Dev Community - The Easiest Way to Add Passkeys and OAuth
authors: [justin]
tags: [announcement, dev-community, authentication, passkeys, oauth, react, developer-experience]
---

# Making Authentication Simple and Free 🔐

After building apps with various authentication solutions, I kept running into the same challenge: **authentication setup takes way longer than it should**.

That's why I built [Passkeyme](https://passkeyme.com) — a **free** authentication platform focused on simplicity and developer experience.

<!-- truncate -->

## Why I Built This

While there are great authentication solutions out there like Firebase Auth, Auth0, and Supabase, I wanted something that:

- **Gets you started in minutes** instead of hours
- **Includes passkeys out of the box** without complex WebAuthn setup
- **Offers hosted auth pages** so you don't have to build UI
- **Stays free** for most use cases
- **Works with any framework** but has great React integration

Passkeys are becoming increasingly important for security, but implementing WebAuthn correctly is still quite complex.

## Introducing Passkeyme

Passkeyme is the authentication platform designed for developers who want to ship fast without sacrificing security. Here's what makes it different:

### ⚡ **Drop-in Components**
```jsx
import { PasskeymeAuthPanel } from '@passkeyme/react-auth';

function App() {
  return (
    <PasskeymeAuthPanel
      appId="your-app-id"
      onSuccess={(user) => console.log('Logged in:', user)}
      providers={['google', 'github', 'apple']}
      enablePasskeys={true}
    />
  );
}
```

That's it. Seriously. Full authentication with passkeys, OAuth, and traditional login in **3 lines of code**.

### 🎯 **Hook-Based API**
Prefer hooks? We've got you covered:

```jsx
import { usePasskeymeAuth } from '@passkeyme/react-auth';

function LoginButton() {
  const { login, user, isLoading } = usePasskeymeAuth({
    appId: 'your-app-id'
  });

  return (
    <button onClick={() => login('passkey')}>
      {isLoading ? 'Signing in...' : 'Sign in with Passkey'}
    </button>
  );
}
```

### 🌐 **Hosted Auth Pages**
Don't want to build UI? Use our hosted authentication pages:

```javascript
// Redirect to hosted auth
window.location.href = 'https://auth.passkeyme.com/your-app-id';

// Or use the programmatic API
import { triggerPasskeymeAuth } from '@passkeyme/react-auth';

triggerPasskeymeAuth({
  appId: 'your-app-id',
  redirectUri: 'https://yourapp.com/callback'
});
```

## What Makes Passkeyme Different

Passkeyme is designed around a few core principles: **simplicity**, **speed**, and **cost-effectiveness**.

### 🔑 **Passkeys Made Simple**
WebAuthn implementation can be tricky with browser compatibility and UX considerations. Passkeyme handles the complexity so you can focus on your app.

### 🔗 **Multiple OAuth Providers**
Support for Google, GitHub, Apple, Microsoft, Facebook — all with the same simple API. No need to manage different OAuth configurations.

### 🎨 **Flexible Integration**
- **Inline components** for custom UIs
- **Hosted pages** for rapid deployment  
- **Programmatic API** for advanced use cases
- **Full customization** of branding and flow

### 🚀 **Developer Experience**
- **TypeScript-first** with full type safety
- **Zero configuration** to get started
- **Comprehensive docs** with live examples
- **Free tier** that covers most use cases

## Real-World Example

Here's a complete authentication flow with multiple providers:

```jsx
import { PasskeymeAuthPanel } from '@passkeyme/react-auth';

function AuthDemo() {
  const handleAuthSuccess = (user) => {
    console.log('Welcome!', user);
    // User is automatically signed in
    // JWT token available in user.token
  };

  return (
    <PasskeymeAuthPanel
      appId="demo-app-123"
      onSuccess={handleAuthSuccess}
      providers={['google', 'github', 'apple', 'microsoft']}
      enablePasskeys={true}
      enableUsernamePassword={true}
      style={{
        primaryColor: '#4F46E5',
        borderRadius: '8px'
      }}
    />
  );
}
```

This gives you a complete authentication experience with:
- ✅ Passkey registration and login
- ✅ OAuth with 5 major providers  
- ✅ Traditional email/password
- ✅ Custom styling
- ✅ Automatic token management

## How It Compares

Here's how Passkeyme stacks up for common use cases:

| Feature | Traditional Setup | Passkeyme |
|---------|-------------------|-----------|
| **Setup Time** | Hours of configuration | Minutes |
| **Passkey Support** | Manual WebAuthn implementation | Built-in |
| **OAuth Providers** | Configure each separately | Unified API |
| **Hosted Pages** | Build your own | Included |
| **Cost** | Varies by usage | Free tier available |
| **Maintenance** | Ongoing security updates | Handled for you |

## Getting Started

Ready to try Passkeyme? Here's how to add authentication to your app in under 5 minutes:

1. **Install the SDK**
```bash
npm install @passkeyme/react-auth
```

2. **Get your App ID**
```bash
# Sign up at https://passkeyme.com
# Create an app and copy your App ID
```

3. **Add authentication**
```jsx
import { PasskeymeAuthPanel } from '@passkeyme/react-auth';

<PasskeymeAuthPanel appId="your-app-id" />
```

That's it! Your app now has production-ready authentication with passkeys and OAuth.

## What's Next?

I'm actively working on expanding Passkeyme with:

- 🔜 **React Native SDK** for mobile apps
- 🔜 **Vue and Svelte SDKs** for other frameworks  
- 🔜 **Enhanced user management** features
- 🔜 **Enterprise features** for larger teams

The goal is to keep the core experience simple while adding more options for teams that need them.

## Try It Yourself

- 🚀 **Live Demo**: [demo.passkeyme.com](https://demo.passkeyme.com)
- 📚 **Documentation**: [docs.passkeyme.com](https://docs.passkeyme.com)
- 💻 **GitHub**: [github.com/justincrosbie/passkeyme](https://github.com/justincrosbie/passkeyme)

---

*This post was originally shared with the Dev.to community as part of our effort to make authentication simpler for all developers. Follow our journey as we continue to build developer-first authentication tools.*

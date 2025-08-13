---
sidebar_position: 2
id: whats-new
title: What's New
description: Latest features, updates, and improvements to PasskeyMe
keywords: [passkeyme, updates, features, react sdk, javascript sdk, hosted auth]
---

# What's New 🎉

Welcome to the latest PasskeyMe features! We're constantly improving the developer experience and adding new capabilities.

## 🆕 **React SDK** - *Just Released!*

Our brand new React SDK provides the easiest way to add authentication to React applications with inline components.

### **New Components Available:**

#### `PasskeymeAuthPanel` 🎨
Complete authentication panel with built-in UI for both passkeys and OAuth providers.

```jsx
import { PasskeymeAuthPanel } from '@passkeyme/react-auth';

<PasskeymeAuthPanel
  appId="your-app-id"
  onSuccess={(user) => console.log('Authenticated:', user)}
  theme="auto"
/>
```

#### `PasskeymeOAuthButton` 🔗
Individual OAuth provider buttons for custom layouts.

```jsx
import { PasskeymeOAuthButton } from '@passkeyme/react-auth';

<PasskeymeOAuthButton
  provider="google"
  appId="your-app-id"
  onSuccess={(user) => setUser(user)}
/>
```

#### `PasskeymeButton` ⚡
Streamlined passkey authentication button.

```jsx
import { PasskeymeButton } from '@passkeyme/react-auth';

<PasskeymeButton
  appId="your-app-id"
  onSuccess={(user) => handleLogin(user)}
/>
```

### **Key React SDK Features:**
- 🎯 **TypeScript First** - Full type safety out of the box
- 🎨 **Themeable** - Light, dark, and auto themes with custom styling
- 🔄 **State Management** - Built-in loading, error, and success states
- 📱 **Responsive** - Mobile-optimized components
- 🛠️ **Developer Experience** - Hot reloading, clear error messages, debug mode

---

## 🆕 **JavaScript/TypeScript SDK** - *Just Released!*

Framework-agnostic SDK for Vue, Angular, Svelte, and vanilla JavaScript applications.

```javascript
import { PasskeymeAuth } from '@passkeyme/auth';

const auth = new PasskeymeAuth({
  appId: 'your-app-id',
});

// Simple authentication
const user = await auth.signIn();
```

### **Key JavaScript SDK Features:**
- 🌐 **Framework Agnostic** - Works with any JavaScript framework
- 🔒 **Security First** - Secure token management and validation
- 📦 **Lightweight** - Minimal bundle size impact
- 🛠️ **Promise-Based** - Modern async/await API

---

## 🆕 **Enhanced Hosted Auth Pages** - *Recently Improved!*

Our hosted authentication pages now offer even more customization and better user experience.

### **What's New in Hosted Auth:**
- 🎨 **Enhanced Branding** - Custom logos, colors, and styling
- 📱 **Mobile Optimization** - Improved mobile authentication flow
- 🔗 **Better OAuth Flow** - Streamlined provider selection
- ⚡ **Performance** - Faster page loads and authentication
- 🛡️ **Security** - Enhanced security headers and validation

### **Hosted Auth Benefits:**
- 🚀 **Zero Maintenance** - We handle updates and security
- 🎯 **Instant Setup** - Just redirect users to our auth pages
- 🔒 **Enterprise Security** - Bank-grade security infrastructure
- 📊 **Analytics** - Built-in authentication analytics

---

## 🔄 **Choose Your Integration Approach**

### **🎨 Inline Components (Recommended for React)**
Perfect for React applications wanting full control over the user experience.

**Best for:**
- React applications
- Custom user interfaces
- Advanced theming requirements
- Seamless user experience

```jsx
<PasskeymeAuthPanel appId="your-app-id" onSuccess={handleLogin} />
```

### **🌐 JavaScript SDK (Recommended for Other Frameworks)**
Ideal for Vue, Angular, Svelte, or vanilla JavaScript applications.

**Best for:**
- Non-React frameworks
- Custom authentication flows
- Programmatic control
- Existing UI components

```javascript
const user = await auth.signIn({ provider: 'google' });
```

### **🚀 Hosted Auth Pages (Simplest Setup)**
Zero-maintenance hosted pages for rapid deployment.

**Best for:**
- MVP development
- Simple applications
- Teams without UI/UX resources
- Quick prototypes

```javascript
window.location.href = 'https://auth.passkeyme.com/oauth/google/authorize?app_id=your-app-id';
```

---

## 🛠️ **Developer Experience Improvements**

### **📚 Enhanced Documentation**
- 🎯 **Framework-Specific Guides** - Tailored examples for React, Vue, Angular
- 🔧 **Migration Guides** - Easy upgrade paths from other auth providers
- 🎨 **Interactive Examples** - Live code demos you can modify
- 🐛 **Troubleshooting** - Common issues and solutions

### **🔧 Developer Tools**
- 🔍 **Debug Mode** - Detailed logging for development
- 🧪 **Testing Utilities** - Mock authentication for testing
- 📦 **TypeScript** - Full type definitions for all APIs
- ⚡ **Hot Reloading** - Instant updates during development

---

## 📈 **What's Coming Next**

### **Q3 2025 Roadmap:**
- 🔐 **Passkey Management** - User-facing passkey management UI
- 📱 **React Native SDK** - Native mobile components
- 🎯 **Advanced Analytics** - Detailed authentication insights
- 🌍 **Internationalization** - Multi-language support

### **Q4 2025 Preview:**
- 🏢 **Enterprise Features** - SSO, SCIM, and advanced admin controls
- 🔧 **Visual Auth Builder** - No-code authentication flow designer
- 📊 **Advanced Reporting** - Custom authentication reports
- 🎨 **Theme Marketplace** - Pre-built authentication themes

---

## 🚀 **Get Started Today**

Ready to try the new features? Choose your path:

### **React Developers**
```bash
npm install @passkeyme/react-auth
```
**→ [React SDK Quick Start](./getting-started/quick-start)**

### **Other Frameworks**
```bash
npm install @passkeyme/auth
```
**→ [JavaScript SDK Guide](./sdks/javascript)**

### **Hosted Auth**
No installation required - just configure your app settings.
**→ [Hosted Auth Setup](./getting-started/choosing-approach#hosted-auth-pages)**

---

## 📞 **Feedback & Support**

Have questions about the new features? We'd love to hear from you!

- 💬 **[Community Discord](https://discord.gg/passkeyme)** - Chat with other developers
- 📧 **[Email Support](mailto:support@passkeyme.com)** - Direct technical support
- 📚 **[Documentation](/)** - Comprehensive guides and API reference
- 🐛 **[GitHub Issues](https://github.com/passkeyme/passkeyme/issues)** - Report bugs or request features

---

*Last updated: August 2025*

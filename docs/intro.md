---
sidebar_position: 1
id: intro
title: Welcome to PasskeyMe
description: Get started with PasskeyMe - the simplest way to add passkey authentication to your applications
keywords: [passkeyme, passkeys, webauthn, authentication, introduction]
slug: /
---

# Welcome to PasskeyMe 🔐

**PasskeyMe** is the easiest way to add modern authentication to your applications. We provide **React components for inline authentication**, JavaScript SDKs for any framework, and hosted authentication pages as an alternative - all with a developer experience similar to Firebase Auth.

## What is PasskeyMe?

PasskeyMe offers **inline React components** that handle the complete authentication flow directly within your application. Use our `PasskeymeAuthPanel` component for a complete auth experience, or choose hosted authentication pages for simpler integration.

```mermaid
graph LR
    A[Your App] --> B[PasskeymeAuthPanel Component]
    B --> C[User Authenticates]
    C --> D[Authentication Events]
    D --> A
```

## Key Features

### 🔐 **Passkeys First**
- Modern, passwordless authentication
- Biometric login (Face ID, Touch ID, Windows Hello)
- Phishing-resistant security
- Works across all devices

### 🌐 **OAuth Integration**
- Google, GitHub, Microsoft, Apple, Discord
- Server-side secret management
- No client-side OAuth complexity
- Enterprise-grade security

### 🎨 **Inline Components & Hosted Pages**
- `PasskeymeAuthPanel` React component for inline auth
- Your branding and theming
- Hosted authentication pages as alternative
- Mobile-optimized interface
- Zero maintenance required

### 🛠️ **Developer Experience**
- React components with TypeScript support
- Framework-agnostic JavaScript SDK
- Firebase Auth-like simplicity
- Copy-paste ready examples

## Quick Start

Get up and running in under 5 minutes:

1. **Sign up** at [dashboard.passkeyme.com](https://dashboard.passkeyme.com)
2. **Install React SDK** - `npm install @passkeyme/react-auth`
3. **Add component** - `<PasskeymeAuthPanel />`
4. **Handle events** - `onSuccess={(user) => handleLogin(user)}`

```typescript
import { PasskeymeAuthPanel } from '@passkeyme/react-auth';

function App() {
  return (
    <PasskeymeAuthPanel
      appId="your-app-id"
      onSuccess={(user) => handleLogin(user)}
      theme={{ container: { backgroundColor: '#ffffff' } }}
    />
  );
}
```

[→ Complete Quick Start Guide](/docs/getting-started/quick-start)

## Choose Your Path

### 🚀 **New to PasskeyMe?**
Start with understanding why PasskeyMe is the best choice for modern authentication:
- [Why Choose PasskeyMe?](/docs/why-passkeyme) - **See our advantages**
- [Quick Start Guide](/docs/getting-started/quick-start)
- [Installation & Setup](/docs/getting-started/installation)
- [Core Concepts](/docs/getting-started/concepts)

### 🛠️ **Ready to Integrate?**
Choose your approach and start building:
- [React SDK](/docs/sdks/react) - **Recommended for React apps**
- [JavaScript/TypeScript SDK](/docs/sdks/javascript) - For other frameworks
- [SDK Overview](/docs/sdks/overview)

### 🔧 **Configure Authentication**
Customize your authentication methods and settings:
- [Authentication Methods](/docs/configuration/authentication-methods)

### 🌐 **API Integration**
Use our REST API directly:
- [Authentication API](/docs/api/authentication)

### 🔍 **Need Help?**
Find solutions to common issues:
- [Troubleshooting](/docs/troubleshooting/common-issues)

## Why Choose PasskeyMe?

### **🚀 Faster Development**
- Ready-to-use React components for inline auth
- Hosted pages available as alternative
- Pre-built, tested, and optimized flows
- Focus on your core application features

### **🔒 Enhanced Security**
- Passkeys eliminate password-related vulnerabilities
- Server-side OAuth secret management
- Enterprise-grade compliance and monitoring

### **� Better User Experience**
- Familiar, consistent authentication across all your apps
- Biometric authentication for convenience
- Mobile-optimized interface

### **� Cost Effective**
- No infrastructure to maintain
- Predictable pricing model
- Scale from prototype to enterprise

## Authentication Methods

PasskeyMe supports multiple authentication methods:

| Method | Security | Convenience | Use Case |
|--------|----------|-------------|----------|
| **� Passkeys** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Primary authentication |
| **🌐 OAuth** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Social login |
| **🔑 Password** | ⭐⭐⭐ | ⭐⭐⭐ | Fallback option |

## Getting Support

- **📖 Documentation** - Comprehensive guides and API reference
- **💬 Community Discord** - Connect with other developers
- **📧 Email Support** - Direct support from our team
- **🐛 GitHub Issues** - Report bugs and request features

## Next Steps

Ready to get started? Choose your path:

1. **[Quick Start](/docs/getting-started/quick-start)** - Build your first integration
2. **[Installation Guide](/docs/getting-started/installation)** - Detailed setup instructions
3. **[SDK Overview](/docs/sdks/overview)** - Choose the right SDK for your project

---

**Welcome to the future of authentication!** 🚀

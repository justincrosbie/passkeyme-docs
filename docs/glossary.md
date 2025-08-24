---
sidebar_position: 99
id: glossary
title: Glossary
description: Comprehensive glossary of Passkeyme terms and concepts
---

# 📖 Glossary

A comprehensive reference of Passkeyme terminology and concepts to ensure consistent understanding across all documentation.

## 🔑 Authentication Concepts

### **Passkey**
A cryptographic credential that replaces passwords, using public-key cryptography. Passkeys are phishing-resistant, unique per website, and stored securely on user devices.

### **WebAuthn (Web Authentication)**
The web standard that enables passkey authentication in browsers. Passkeyme uses WebAuthn for secure, passwordless authentication.

### **Authentication Ceremony**
The cryptographic process of creating or using a passkey. Includes:
- **Registration Ceremony**: Creating a new passkey
- **Authentication Ceremony**: Using an existing passkey to sign in

### **Relying Party (RP)**
Your application or website that relies on Passkeyme for authentication. In Passkeyme context, your app is the relying party.

## 🏗️ Passkeyme Architecture

### **Inline Components**
React components that embed authentication directly into your application UI, providing full control over styling and user experience.
- **Primary approach** for React applications
- Examples: `PasskeymeAuthPanel`, `PasskeymeOAuthButton`

### **Hosted Authentication Pages**
Pre-built authentication pages hosted by Passkeyme that handle the complete authentication flow.
- **Fallback approach** for frameworks without SDK support
- Accessed via redirect or popup

### **Framework-Specific SDKs (High-Level)**
Complete authentication solutions designed for specific frontend frameworks.
- **React SDK**: Full-featured with inline components ✅ Available
- **React Native SDK**: 🚧 Coming soon
- **Angular SDK**: 🚧 Coming soon
- **Ionic SDK**: 🚧 Coming soon

### **JavaScript SDK (Mid-Level)**
Framework-agnostic SDK for web applications, primarily used with hosted authentication pages.
- Works with any JavaScript framework
- Bridge to hosted authentication pages
- Used while awaiting framework-specific SDKs

### **Low-Level SDKs**
Platform-specific SDKs that handle only passkey ceremonies (no OAuth or hosted pages).
- **Web SDK**: Browser WebAuthn implementation
- **iOS SDK**: Native iOS passkey support
- **Android SDK**: Native Android passkey support
- **Ionic Plugin**: Capacitor-based passkey support

## 🔗 Integration Methods

### **OAuth Integration**
Social authentication using providers like Google, GitHub, and Facebook.
- Supported in React SDK inline components
- Available in hosted authentication pages
- Automatic passkey registration after OAuth

### **Smart Login**
Passkeyme's intelligent authentication flow that:
1. Checks for existing passkeys
2. Falls back to OAuth if no passkeys available
3. Automatically registers passkeys after OAuth sign-in

### **Progressive Enhancement**
Starting with basic OAuth authentication and enhancing with passkeys over time as users return to your application.

## 🛠️ Technical Components

### **PasskeymeAuthPanel**
The primary React component providing a complete authentication interface.
- Supports multiple OAuth providers
- Handles passkey registration and authentication
- Fully customizable styling and theming
- **Recommended** for React applications

### **PasskeymeOAuthButton**
Individual OAuth provider buttons for fine-grained control.
- Per-provider customization
- Event handling for custom flows
- Used when building custom authentication interfaces

### **App ID**
Your unique Passkeyme application identifier used to configure authentication settings and scope permissions.

### **Redirect URI**
The URL where users are sent after completing authentication, used for OAuth callback handling.

## 🔒 Security Concepts

### **Token-Based Authentication**
Passkeyme uses JWT tokens for maintaining authentication state:
- **Access tokens**: Short-lived for API requests
- **Refresh tokens**: Long-lived for token renewal
- Automatic token management in SDKs

### **Cross-Origin Authentication**
Passkeyme handles authentication across different domains while maintaining security:
- Secure token exchange
- Domain validation
- CORS configuration

### **Credential Storage**
How passkeys are stored and managed:
- **Platform authenticators**: Built into devices (Touch ID, Face ID, Windows Hello)
- **Cross-platform authenticators**: External security keys
- **Sync**: Some passkeys sync across user devices

## 📱 Platform Support

### **Supported Platforms**
- **Web**: All modern browsers with WebAuthn support
- **iOS**: iOS 16+ with platform authenticator support
- **Android**: Android 9+ with FIDO2 support
- **Desktop**: Windows Hello, macOS Touch ID/Face ID

### **Framework Compatibility**
- **React**: Full SDK with inline components ✅
- **React Native**: SDK in development 🚧
- **Angular/Vue/Svelte**: JavaScript SDK via hosted pages
- **Ionic**: Plugin available for Capacitor apps

## 🎯 Developer Experience Terms

### **Quick Start**
Framework-specific getting started guides designed for immediate integration success.
- **React Quick Start**: Primary guide using inline components
- **JavaScript Quick Start**: For other frameworks using hosted pages

### **Developer Decision Path**
Guided approach to choosing the right Passkeyme integration method based on:
- Framework availability
- Control vs simplicity needs
- Styling requirements
- Integration timeline

### **Demo-Driven Documentation**
Documentation approach using real, working code examples from live demo applications:
- React Demo: https://github.com/Passkeyme/passkeyme-react-demo
- Reference implementations for best practices

## 📊 Status Indicators

Throughout Passkeyme documentation, you'll see these status indicators:

- **✅ Available**: Feature is production-ready and fully supported
- **🚧 Coming Soon**: Feature is in active development
- **📋 Planned**: Feature is planned for future release
- **⚠️ Beta**: Feature is available but may have limitations
- **🔧 Maintenance**: Feature is being updated or improved

## 🔄 Migration Terms

### **Progressive Migration**
Gradually moving from JavaScript SDK + hosted pages to framework-specific SDKs:
- Start with JavaScript SDK for immediate functionality
- Migrate to React SDK when available
- Maintain existing user sessions during transition

### **Backward Compatibility**
All Passkeyme authentication methods remain supported:
- Existing JavaScript SDK integrations continue working
- Hosted pages remain available as fallback
- User passkeys work across all integration methods

---

## 🔗 Related Documentation

- **[Choosing Your Approach](./getting-started/choosing-approach.md)** - Decision guide for integration methods
- **[Framework Comparison](./getting-started/framework-comparison.md)** - Detailed feature comparison
- **[Concepts](./getting-started/concepts.md)** - Core Passkeyme concepts and architecture

---

*This glossary is maintained to ensure consistent terminology across all Passkeyme documentation. If you notice inconsistencies or missing terms, please let us know.*

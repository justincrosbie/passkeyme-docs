---
sidebar_position: 8
id: architecture
title: Architecture Overview
description: Detailed Passkeyme architecture diagrams and integration patterns
---

# 🏗️ Architecture Overview

Visual guide to Passkeyme's architecture, integration patterns, and decision flows.

## 🔄 SDK Hierarchy

```mermaid
graph TB
    subgraph "High-Level SDKs (Framework-Specific)"
        A[React SDK ✅] --> AA[PasskeymeAuthPanel]
        A --> AB[PasskeymeOAuthButton]
        B[React Native SDK 🚧] --> BA[Native Components]
        C[Angular SDK 🚧] --> CA[Angular Directives]
        D[Ionic SDK 🚧] --> DA[Ionic Components]
    end
    
    subgraph "Mid-Level SDK (Web)"
        E[JavaScript SDK] --> EA[smartLogin()]
        E --> EB[Hosted Pages]
    end
    
    subgraph "Low-Level SDKs (Platform)"
        F[Web SDK] --> FA[WebAuthn API]
        G[iOS SDK] --> GA[AuthenticationServices]
        H[Android SDK] --> HA[FIDO2 API]
        I[Ionic Plugin] --> IA[Capacitor Bridge]
    end
    
    subgraph "Passkeyme Backend"
        J[Authentication API] --> JA[OAuth Providers]
        J --> JB[Passkey Registry]
        J --> JC[Token Management]
    end
    
    AA --> J
    AB --> J
    EA --> J
    FA --> J
    GA --> J
    HA --> J
    IA --> J
    
    style A fill:#4CAF50
    style E fill:#FF9800
    style F fill:#2196F3
    style G fill:#2196F3
    style H fill:#2196F3
    style I fill:#2196F3
```

## 🎯 Developer Decision Flow

```mermaid
graph TD
    START[New Integration] --> FRAMEWORK{What framework?}
    
    FRAMEWORK -->|React| REACT[React SDK ✅]
    FRAMEWORK -->|React Native| RN[React Native SDK 🚧]
    FRAMEWORK -->|Angular| ANG[Angular SDK 🚧]
    FRAMEWORK -->|Vue/Svelte/Other| JS[JavaScript SDK]
    
    REACT --> CONTROL{Control vs Speed?}
    CONTROL -->|Maximum Control| INLINE[Inline Components]
    CONTROL -->|Rapid Setup| HOSTED[Hosted Pages]
    
    JS --> JSHOSTED[Hosted Pages Only]
    
    INLINE --> AUTHPANEL[PasskeymeAuthPanel]
    INLINE --> OAUTHBTN[PasskeymeOAuthButton]
    
    HOSTED --> SMARTLOGIN[smartLogin() function]
    JSHOSTED --> SMARTLOGIN
    
    AUTHPANEL --> SUCCESS[✅ Production Ready]
    OAUTHBTN --> SUCCESS
    SMARTLOGIN --> SUCCESS
    
    RN --> WAIT[Wait for SDK 🚧]
    ANG --> WAIT
    WAIT --> JS
    
    style REACT fill:#4CAF50
    style JS fill:#FF9800
    style SUCCESS fill:#4CAF50
    style WAIT fill:#FFC107
```

## 🔐 Authentication Architecture

```mermaid
graph TB
    subgraph "User Device"
        USER[User]
        DEVICE[Device Authenticator]
        BROWSER[Browser/App]
    end
    
    subgraph "Your Application"
        APP[Your App]
        COMPONENT[PasskeymeAuthPanel]
        SDK[Passkeyme SDK]
    end
    
    subgraph "Passkeyme Platform"
        AUTH[Authentication API]
        OAUTH[OAuth Providers]
        REGISTRY[Passkey Registry]
        TOKENS[Token Service]
    end
    
    subgraph "OAuth Providers"
        GOOGLE[Google]
        GITHUB[GitHub]
        MICROSOFT[Microsoft]
        APPLE[Apple]
    end
    
    USER --> BROWSER
    BROWSER --> COMPONENT
    COMPONENT --> SDK
    SDK --> AUTH
    
    AUTH --> OAUTH
    OAUTH --> GOOGLE
    OAUTH --> GITHUB
    OAUTH --> MICROSOFT
    OAUTH --> APPLE
    
    AUTH --> REGISTRY
    AUTH --> TOKENS
    
    DEVICE --> REGISTRY
    TOKENS --> APP
    
    style USER fill:#E1F5FE
    style COMPONENT fill:#4CAF50
    style AUTH fill:#FF9800
    style REGISTRY fill:#2196F3
```

## 🔄 Authentication Lifecycle

```mermaid
sequenceDiagram
    participant U as User
    participant A as Your App
    participant P as PasskeymeAuthPanel
    participant PM as Passkeyme API
    participant OP as OAuth Provider
    participant D as Device

    Note over U,D: First-time User Registration
    U->>A: Opens app
    A->>P: Renders <PasskeymeAuthPanel />
    P->>U: Shows OAuth options
    U->>P: Clicks "Sign in with Google"
    P->>PM: Initiates OAuth flow
    PM->>OP: Redirects to Google
    U->>OP: Authenticates with Google
    OP->>PM: Returns OAuth tokens
    PM->>PM: Creates user account
    PM->>U: Prompts for passkey creation
    U->>D: Creates passkey (biometric)
    D->>PM: Stores public key
    PM->>P: Returns user + session
    P->>A: onSuccess(user, session)
    
    Note over U,D: Returning User Authentication
    U->>A: Opens app (later visit)
    A->>P: Renders <PasskeymeAuthPanel />
    P->>PM: Checks for passkeys
    PM->>P: Found passkeys
    P->>U: Shows "Sign in with passkey"
    U->>D: Uses biometric
    D->>PM: Signs challenge
    PM->>P: Returns user + session
    P->>A: onSuccess(user, session)
```

## 🎨 Integration Patterns

### Pattern 1: Embedded Authentication

```mermaid
graph LR
    subgraph "Your React App"
        LOGIN[Login Page] --> PANEL[PasskeymeAuthPanel]
        PANEL --> HOME[Home Page]
    end
    
    subgraph "Passkeyme"
        PANEL --> API[Authentication API]
    end
    
    style PANEL fill:#4CAF50
    style API fill:#FF9800
```

### Pattern 2: Modal/Dialog Authentication

```mermaid
graph LR
    subgraph "Your React App"
        NAV[Navigation] --> MODAL[Auth Modal]
        MODAL --> PANEL[PasskeymeAuthPanel]
        PANEL --> CLOSE[Close Modal]
        CLOSE --> AUTH[Authenticated State]
    end
    
    style PANEL fill:#4CAF50
    style AUTH fill:#4CAF50
```

### Pattern 3: Hosted Pages (Non-React)

```mermaid
graph LR
    subgraph "Your App"
        BTN[Login Button] --> REDIRECT[Redirect to Passkeyme]
    end
    
    subgraph "Passkeyme"
        REDIRECT --> HOSTED[Hosted Auth Page]
        HOSTED --> CALLBACK[Callback to Your App]
    end
    
    CALLBACK --> HOME[Authenticated Home]
    
    style HOSTED fill:#FF9800
    style HOME fill:#4CAF50
```

## 🔒 Security Architecture

```mermaid
graph TB
    subgraph "Client Side"
        C1[Your Application]
        C2[Passkeyme SDK]
        C3[Device Authenticator]
    end
    
    subgraph "Passkeyme Platform"
        P1[API Gateway]
        P2[Authentication Service]
        P3[Passkey Registry]
        P4[Token Service]
        P5[OAuth Service]
    end
    
    subgraph "External"
        E1[OAuth Providers]
        E2[User's Devices]
    end
    
    C1 --> C2
    C2 --> P1
    P1 --> P2
    P2 --> P3
    P2 --> P4
    P2 --> P5
    P5 --> E1
    C3 --> P3
    P3 --> E2
    
    style P1 fill:#F44336
    style P2 fill:#F44336
    style P3 fill:#2196F3
    style C3 fill:#4CAF50
```

## 📱 Cross-Platform Support Matrix

```mermaid
graph TB
    subgraph "Web Platforms"
        W1[Chrome/Edge] --> WA[WebAuthn API]
        W2[Safari] --> WA
        W3[Firefox] --> WA
    end
    
    subgraph "Mobile Platforms"
        M1[iOS Safari] --> MA[Platform Authenticator]
        M2[Android Chrome] --> MA
        M3[iOS Apps] --> IOS[iOS SDK]
        M4[Android Apps] --> AND[Android SDK]
    end
    
    subgraph "Desktop Platforms"
        D1[Windows] --> DA[Windows Hello]
        D2[macOS] --> DB[Touch ID/Face ID]
        D3[Linux] --> DC[Security Keys]
    end
    
    subgraph "Cross-Platform Apps"
        X1[React Native] --> XA[Native Bridge]
        X2[Ionic/Capacitor] --> XB[Ionic Plugin]
        X3[Electron] --> XC[Web SDK]
    end
    
    WA --> PASSKEY[Passkey Support]
    MA --> PASSKEY
    IOS --> PASSKEY
    AND --> PASSKEY
    DA --> PASSKEY
    DB --> PASSKEY
    DC --> PASSKEY
    XA --> PASSKEY
    XB --> PASSKEY
    XC --> PASSKEY
    
    style PASSKEY fill:#4CAF50
```

---

## 🔗 Related Documentation

- **[Concepts](./concepts.md)** - Core Passkeyme concepts
- **[Choosing Your Approach](./choosing-approach.md)** - Integration decision guide
- **[Framework Comparison](./framework-comparison.md)** - Feature comparison matrix
- **[Glossary](../glossary.md)** - Terminology reference

---

*These diagrams provide a visual overview of Passkeyme's architecture and integration patterns. For implementation details, see the framework-specific documentation.*

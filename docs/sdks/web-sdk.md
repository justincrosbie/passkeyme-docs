---
id: web-sdk
title: Web SDK
sidebar_label: Web SDK
description: Low-level browser SDK for custom passkey authentication flows
---

# 🌐 Web SDK

The `passkeyme-web-sdk` provides low-level passkey ceremony implementation for web browsers. This SDK handles **only WebAuthn/FIDO2 operations** and requires backend integration for complete authentication flows.

:::info SDK Purpose
This is a **low-level SDK** for custom implementations. Most web developers should use:
- **[React SDK](/docs/sdks/react)** for React applications with inline components
- **[JavaScript SDK](/docs/sdks/javascript)** for other frameworks with hosted authentication
:::

## 📦 Installation

```bash
npm install passkeyme-web-sdk
```

## 🚀 Quick Start

### Basic Setup

```typescript
import { PasskeymeWebSDK } from 'passkeyme-web-sdk';

const sdk = new PasskeymeWebSDK({
  debug: process.env.NODE_ENV === 'development'
});
```

### Registration Flow

```typescript
// 1. Get challenge from your backend (which calls Passkeyme API)
const registrationChallenge = await fetch('/api/start-registration', {
  method: 'POST',
  body: JSON.stringify({ username: 'user@example.com' })
}).then(r => r.json());

// 2. Perform passkey registration ceremony
try {
  const result = await sdk.register({
    username: 'user@example.com',
    displayName: 'User Name',
    challenge: registrationChallenge.challenge,
    rp: registrationChallenge.rp,
    user: registrationChallenge.user,
    pubKeyCredParams: registrationChallenge.pubKeyCredParams,
    timeout: registrationChallenge.timeout,
    attestation: registrationChallenge.attestation
  });

  if (result.success) {
    // 3. Send credential to backend to complete registration
    const completion = await fetch('/api/complete-registration', {
      method: 'POST',
      body: JSON.stringify({
        credential: result.credential,
        username: 'user@example.com'
      })
    });
    
    console.log('Registration successful!');
  }
} catch (error) {
  console.error('Registration failed:', error);
}
```

### Authentication Flow

```typescript
// 1. Get challenge from your backend
const authChallenge = await fetch('/api/start-authentication', {
  method: 'POST',
  body: JSON.stringify({ username: 'user@example.com' })
}).then(r => r.json());

// 2. Perform passkey authentication ceremony
try {
  const result = await sdk.authenticate({
    username: 'user@example.com', // Optional for discoverable credentials
    challenge: authChallenge.challenge,
    rpId: authChallenge.rpId,
    allowCredentials: authChallenge.allowCredentials,
    timeout: authChallenge.timeout,
    userVerification: authChallenge.userVerification
  });

  if (result.success) {
    // 3. Send assertion to backend to complete authentication
    const completion = await fetch('/api/complete-authentication', {
      method: 'POST',
      body: JSON.stringify({
        assertion: result.assertion,
        username: 'user@example.com'
      })
    });
    
    const user = await completion.json();
    console.log('Authentication successful!', user);
  }
} catch (error) {
  console.error('Authentication failed:', error);
}
```

## 🔧 API Reference

### PasskeymeWebSDK Constructor

```typescript
interface WebSDKConfig {
  /** Enable debug logging */
  debug?: boolean;
  
  /** Custom timeout for operations (ms) */
  timeout?: number;
  
  /** User verification requirement */
  userVerification?: 'required' | 'preferred' | 'discouraged';
}

const sdk = new PasskeymeWebSDK(config);
```

### Registration Method

```typescript
interface RegistrationOptions {
  username: string;
  displayName: string;
  challenge: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: 'public-key';
    alg: number;
  }>;
  timeout?: number;
  attestation?: 'none' | 'indirect' | 'direct';
  authenticatorSelection?: {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    requireResidentKey?: boolean;
    userVerification?: 'required' | 'preferred' | 'discouraged';
  };
  excludeCredentials?: Array<{
    type: 'public-key';
    id: string;
  }>;
}

interface RegistrationResult {
  success: boolean;
  credential?: {
    id: string;
    rawId: ArrayBuffer;
    response: {
      attestationObject: ArrayBuffer;
      clientDataJSON: ArrayBuffer;
    };
    type: 'public-key';
  };
  error?: string;
}

const result = await sdk.register(options);
```

### Authentication Method

```typescript
interface AuthenticationOptions {
  username?: string; // Optional for discoverable credentials
  challenge: string;
  rpId?: string;
  allowCredentials?: Array<{
    type: 'public-key';
    id: string;
  }>;
  timeout?: number;
  userVerification?: 'required' | 'preferred' | 'discouraged';
}

interface AuthenticationResult {
  success: boolean;
  assertion?: {
    credential: {
      id: string;
      rawId: ArrayBuffer;
      response: {
        authenticatorData: ArrayBuffer;
        clientDataJSON: ArrayBuffer;
        signature: ArrayBuffer;
        userHandle?: ArrayBuffer;
      };
      type: 'public-key';
    };
  };
  error?: string;
}

const result = await sdk.authenticate(options);
```

### Utility Methods

```typescript
// Check if WebAuthn is supported
const isSupported = sdk.isSupported();

// Check if platform authenticator is available
const isPlatformAuthenticatorAvailable = await sdk.isPlatformAuthenticatorAvailable();

// Get supported algorithms
const algorithms = sdk.getSupportedAlgorithms();
```

## 🔗 Backend Integration

### Required Backend Endpoints

Your backend needs these endpoints to integrate with Passkeyme API:

```typescript
// POST /api/start-registration
app.post('/api/start-registration', async (req, res) => {
  const { username } = req.body;
  
  const response = await fetch(`${PASSKEYME_API}/webauthn/${APP_ID}/start_registration`, {
    method: 'POST',
    headers: {
      'x-api-key': PASSKEYME_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username })
  });
  
  const challenge = await response.json();
  res.json(challenge);
});

// POST /api/complete-registration
app.post('/api/complete-registration', async (req, res) => {
  const { credential, username } = req.body;
  
  const response = await fetch(`${PASSKEYME_API}/webauthn/${APP_ID}/complete_registration`, {
    method: 'POST',
    headers: {
      'x-api-key': PASSKEYME_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ credential, username })
  });
  
  const result = await response.json();
  res.json(result);
});

// POST /api/start-authentication
app.post('/api/start-authentication', async (req, res) => {
  const { username } = req.body;
  
  const response = await fetch(`${PASSKEYME_API}/webauthn/${APP_ID}/start_authentication`, {
    method: 'POST',
    headers: {
      'x-api-key': PASSKEYME_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username })
  });
  
  const challenge = await response.json();
  res.json(challenge);
});

// POST /api/complete-authentication
app.post('/api/complete-authentication', async (req, res) => {
  const { assertion, username } = req.body;
  
  const response = await fetch(`${PASSKEYME_API}/webauthn/${APP_ID}/complete_authentication`, {
    method: 'POST',
    headers: {
      'x-api-key': PASSKEYME_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ assertion, username })
  });
  
  const result = await response.json();
  res.json(result);
});
```

## 🎨 Custom UI Examples

### Registration Component

```typescript
import { PasskeymeWebSDK } from 'passkeyme-web-sdk';

class PasskeyRegistration {
  private sdk = new PasskeymeWebSDK({ debug: true });
  
  async registerPasskey(username: string, displayName: string) {
    try {
      // Show loading state
      this.showLoading('Creating your passkey...');
      
      // Get challenge from backend
      const challenge = await this.getRegistrationChallenge(username);
      
      // Update UI
      this.showLoading('Touch your authenticator...');
      
      // Perform registration
      const result = await this.sdk.register({
        username,
        displayName,
        ...challenge
      });
      
      if (result.success) {
        // Complete registration
        await this.completeRegistration(result.credential, username);
        this.showSuccess('Passkey created successfully!');
      } else {
        throw new Error(result.error || 'Registration failed');
      }
      
    } catch (error) {
      this.showError(`Registration failed: ${error.message}`);
    }
  }
  
  private async getRegistrationChallenge(username: string) {
    const response = await fetch('/api/start-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get registration challenge');
    }
    
    return response.json();
  }
  
  private async completeRegistration(credential: any, username: string) {
    const response = await fetch('/api/complete-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential, username })
    });
    
    if (!response.ok) {
      throw new Error('Failed to complete registration');
    }
    
    return response.json();
  }
  
  private showLoading(message: string) {
    // Update your UI loading state
    console.log(message);
  }
  
  private showSuccess(message: string) {
    // Update your UI success state
    console.log(message);
  }
  
  private showError(message: string) {
    // Update your UI error state
    console.error(message);
  }
}
```

### Authentication Component

```typescript
class PasskeyAuthentication {
  private sdk = new PasskeymeWebSDK({ debug: true });
  
  async authenticateWithPasskey(username?: string) {
    try {
      // Show loading state
      this.showLoading('Preparing authentication...');
      
      // Get challenge from backend
      const challenge = await this.getAuthenticationChallenge(username);
      
      // Update UI for biometric prompt
      this.showLoading('Touch your authenticator...');
      
      // Perform authentication
      const result = await this.sdk.authenticate({
        username,
        ...challenge
      });
      
      if (result.success) {
        // Complete authentication
        const user = await this.completeAuthentication(result.assertion, username);
        this.showSuccess('Welcome back!');
        return user;
      } else {
        throw new Error(result.error || 'Authentication failed');
      }
      
    } catch (error) {
      this.showError(`Authentication failed: ${error.message}`);
      throw error;
    }
  }
  
  private async getAuthenticationChallenge(username?: string) {
    const response = await fetch('/api/start-authentication', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get authentication challenge');
    }
    
    return response.json();
  }
  
  private async completeAuthentication(assertion: any, username?: string) {
    const response = await fetch('/api/complete-authentication', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assertion, username })
    });
    
    if (!response.ok) {
      throw new Error('Failed to complete authentication');
    }
    
    return response.json();
  }
  
  private showLoading(message: string) {
    // Update your UI loading state
    console.log(message);
  }
  
  private showSuccess(message: string) {
    // Update your UI success state
    console.log(message);
  }
  
  private showError(message: string) {
    // Update your UI error state
    console.error(message);
  }
}
```

## 🛡️ Security Best Practices

### API Key Protection
```typescript
// ✅ Secure - API keys only on backend
const challenge = await fetch('/api/start-auth'); // Backend has API key

// ❌ Never expose API keys in client code
const sdk = new PasskeymeWebSDK({ apiKey: 'your-key' }); // Don't do this!
```

### Challenge Validation
```typescript
// ✅ Validate challenges come from your backend
const validateChallenge = (challenge: any) => {
  if (!challenge.challenge || !challenge.rp) {
    throw new Error('Invalid challenge format');
  }
  
  if (challenge.rp.id !== window.location.hostname) {
    throw new Error('Challenge RP ID mismatch');
  }
  
  return challenge;
};

const challenge = validateChallenge(await getChallenge());
```

### Error Handling
```typescript
try {
  const result = await sdk.authenticate(options);
} catch (error) {
  if (error.name === 'NotSupportedError') {
    // Show fallback authentication method
    showPasswordLogin();
  } else if (error.name === 'NotAllowedError') {
    // User cancelled or timeout
    showMessage('Authentication cancelled. Please try again.');
  } else {
    // Other errors
    showMessage('Authentication failed. Please try again.');
  }
}
```

## 📚 Framework Integration

### React Integration

```typescript
import { useCallback, useState } from 'react';
import { PasskeymeWebSDK } from 'passkeyme-web-sdk';

const usePasskeyAuth = () => {
  const [sdk] = useState(() => new PasskeymeWebSDK({ debug: true }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const authenticate = useCallback(async (username?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const challenge = await fetch('/api/start-authentication', {
        method: 'POST',
        body: JSON.stringify({ username })
      }).then(r => r.json());
      
      const result = await sdk.authenticate({ username, ...challenge });
      
      if (result.success) {
        const user = await fetch('/api/complete-authentication', {
          method: 'POST',
          body: JSON.stringify({ assertion: result.assertion, username })
        }).then(r => r.json());
        
        return user;
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sdk]);
  
  return { authenticate, loading, error };
};

// Usage in component
const LoginButton = () => {
  const { authenticate, loading, error } = usePasskeyAuth();
  
  const handleLogin = async () => {
    try {
      const user = await authenticate();
      console.log('Logged in:', user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <div>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Authenticating...' : '🔐 Login with Passkey'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
};
```

## 🔍 Troubleshooting

### Common Issues

**WebAuthn not supported:**
```typescript
if (!sdk.isSupported()) {
  console.log('WebAuthn not supported, showing alternative login');
  showPasswordLogin();
}
```

**No platform authenticator:**
```typescript
const available = await sdk.isPlatformAuthenticatorAvailable();
if (!available) {
  console.log('No biometric authenticator available');
  // Show QR code for cross-device authentication
}
```

**Registration conflicts:**
```typescript
// Handle existing credential errors
try {
  await sdk.register(options);
} catch (error) {
  if (error.name === 'InvalidStateError') {
    console.log('Credential already exists for this user');
    // Proceed to authentication instead
  }
}
```

## 📖 Next Steps

- **[iOS SDK](/docs/sdks/ios/)** - Native iOS implementation
- **[Android SDK](/docs/sdks/android-sdk)** - Native Android implementation  
- **[Ionic Plugin](/docs/sdks/ionic-plugin)** - Cross-platform mobile
- **[API Reference](/docs/api/api-overview)** - Direct API integration

---

:::tip Need Higher-Level Integration?
Consider using **[React SDK](/docs/sdks/react)** or **[JavaScript SDK](/docs/sdks/javascript)** for easier integration with OAuth and hosted authentication pages.
:::

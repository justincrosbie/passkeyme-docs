---
id: ionic-plugin
title: Ionic Plugin
sidebar_label: Ionic Plugin
description: Capacitor plugin for passkey authentication in Ionic and hybrid mobile apps
---

# ⚡ Ionic Plugin

The `passkeyme-ionic-cap-plugin` provides passkey authentication for Ionic apps using Capacitor. This plugin bridges native Android and iOS passkey implementations for cross-platform mobile development.

:::info Plugin Purpose
This is a **Capacitor plugin** for Ionic apps. For other platforms, consider:
- **[Web SDK](/docs/sdks/web-sdk)** for web browsers
- **[React Native SDK](/docs/getting-started/framework-comparison)** (coming Q1 2025) for React Native apps
:::

## 📦 Installation

### NPM Installation

```bash
npm install @passkeyme/ionic-cap-plugin
npx cap sync
```

### Capacitor Configuration

Add to your `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.yourapp.id',
  appName: 'Your App',
  webDir: 'dist',
  plugins: {
    PasskeymeIonic: {
      debug: true, // Enable debug logging
      timeout: 60000, // Default timeout in milliseconds
    }
  }
};

export default config;
```

### iOS Setup

Add to `ios/App/Podfile`:

```ruby
target 'App' do
  capacitor_pods
  # Add this line after capacitor_pods
  pod 'PasskeymeIonic', :path => '../../node_modules/@passkeyme/ionic-cap-plugin'
end
```

Run:
```bash
npx cap sync ios
```

### Android Setup

The plugin automatically configures Android dependencies. Run:

```bash
npx cap sync android
```

## 🚀 Quick Start

### TypeScript Setup

```typescript
import { PasskeymeIonic } from '@passkeyme/ionic-cap-plugin';

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export class AuthService {
  constructor(private readonly baseUrl: string = 'https://api.yourapp.com') {}

  async isSupported(): Promise<boolean> {
    try {
      const result = await PasskeymeIonic.isSupported();
      return result.supported;
    } catch (error) {
      console.error('Error checking passkey support:', error);
      return false;
    }
  }

  async isPlatformAuthenticatorAvailable(): Promise<boolean> {
    try {
      const result = await PasskeymeIonic.isPlatformAuthenticatorAvailable();
      return result.available;
    } catch (error) {
      console.error('Error checking platform authenticator:', error);
      return false;
    }
  }
}
```

### Registration Flow

```typescript
interface RegistrationChallenge {
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
    type: string;
    alg: number;
  }>;
  timeout?: number;
  attestation?: string;
}

export class AuthService {
  async registerPasskey(email: string, displayName: string): Promise<void> {
    try {
      // 1. Get challenge from your backend
      const challenge = await this.getRegistrationChallenge(email, displayName);
      
      // 2. Perform passkey registration
      const result = await PasskeymeIonic.register({
        username: email,
        displayName: displayName,
        challenge: challenge.challenge,
        rp: challenge.rp,
        user: challenge.user,
        pubKeyCredParams: challenge.pubKeyCredParams,
        timeout: challenge.timeout,
        attestation: challenge.attestation
      });
      
      if (result.success) {
        // 3. Complete registration with backend
        await this.completeRegistration(result.credential, email);
        console.log('Registration successful!');
      } else {
        throw new Error(result.error || 'Registration failed');
      }
      
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  private async getRegistrationChallenge(email: string, displayName: string): Promise<RegistrationChallenge> {
    const response = await fetch(`${this.baseUrl}/api/start-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        displayName: displayName
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get registration challenge');
    }

    return await response.json();
  }

  private async completeRegistration(credential: any, email: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/complete-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential,
        username: email
      })
    });

    if (!response.ok) {
      throw new Error('Failed to complete registration');
    }
  }
}
```

### Authentication Flow

```typescript
interface AuthenticationChallenge {
  challenge: string;
  rpId?: string;
  allowCredentials?: Array<{
    type: string;
    id: string;
  }>;
  timeout?: number;
  userVerification?: string;
}

export class AuthService {
  async authenticateWithPasskey(email?: string): Promise<User> {
    try {
      // 1. Get challenge from your backend
      const challenge = await this.getAuthenticationChallenge(email);
      
      // 2. Perform passkey authentication
      const result = await PasskeymeIonic.authenticate({
        username: email,
        challenge: challenge.challenge,
        rpId: challenge.rpId,
        allowCredentials: challenge.allowCredentials,
        timeout: challenge.timeout,
        userVerification: challenge.userVerification
      });
      
      if (result.success) {
        // 3. Complete authentication with backend
        const user = await this.completeAuthentication(result.assertion, email);
        console.log('Authentication successful!');
        return user;
      } else {
        throw new Error(result.error || 'Authentication failed');
      }
      
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  private async getAuthenticationChallenge(email?: string): Promise<AuthenticationChallenge> {
    const response = await fetch(`${this.baseUrl}/api/start-authentication`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get authentication challenge');
    }

    return await response.json();
  }

  private async completeAuthentication(assertion: any, email?: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/complete-authentication`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assertion,
        username: email
      })
    });

    if (!response.ok) {
      throw new Error('Failed to complete authentication');
    }

    return await response.json();
  }
}
```

## 🔧 Plugin API Reference

### Core Methods

```typescript
interface PasskeymeIonicPlugin {
  isSupported(): Promise<{ supported: boolean }>;
  
  isPlatformAuthenticatorAvailable(): Promise<{ available: boolean }>;
  
  register(options: {
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
      type: string;
      alg: number;
    }>;
    timeout?: number;
    attestation?: string;
    authenticatorSelection?: {
      authenticatorAttachment?: string;
      requireResidentKey?: boolean;
      residentKey?: string;
      userVerification?: string;
    };
    excludeCredentials?: Array<{
      type: string;
      id: string;
    }>;
  }): Promise<{
    success: boolean;
    credential?: any;
    error?: string;
  }>;
  
  authenticate(options: {
    username?: string;
    challenge: string;
    rpId?: string;
    allowCredentials?: Array<{
      type: string;
      id: string;
    }>;
    timeout?: number;
    userVerification?: string;
  }): Promise<{
    success: boolean;
    assertion?: any;
    error?: string;
  }>;
}
```

### Configuration Options

```typescript
interface PasskeymeConfig {
  debug?: boolean;          // Enable debug logging
  timeout?: number;         // Default timeout in milliseconds
  userVerification?: string; // Default user verification requirement
}
```

## 🎨 Angular/Ionic Integration

### Service Implementation

```typescript
import { Injectable } from '@angular/core';
import { PasskeymeIonic } from '@passkeyme/ionic-cap-plugin';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasskeyAuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  async checkSupport(): Promise<boolean> {
    try {
      const result = await PasskeymeIonic.isSupported();
      return result.supported;
    } catch (error) {
      console.error('Error checking passkey support:', error);
      return false;
    }
  }

  async registerPasskey(email: string, displayName: string): Promise<void> {
    // Registration implementation here...
  }

  async signInWithPasskey(email?: string): Promise<User> {
    // Authentication implementation here...
  }

  async signOut(): Promise<void> {
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    // Clear stored credentials if needed
  }

  private async checkAuthStatus(): Promise<void> {
    // Check if user is already authenticated
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }
}
```

### Registration Component

```typescript
import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { PasskeyAuthService } from '../services/passkey-auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  email: string = '';
  displayName: string = '';
  isPasskeySupported: boolean = false;

  constructor(
    private passkeyAuth: PasskeyAuthService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.isPasskeySupported = await this.passkeyAuth.checkSupport();
    
    if (!this.isPasskeySupported) {
      await this.showAlert('Not Supported', 'Passkeys are not supported on this device.');
    }
  }

  async onRegister() {
    if (!this.email || !this.displayName) {
      await this.showAlert('Error', 'Please fill in all fields.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creating your passkey...',
      spinner: 'dots'
    });

    await loading.present();

    try {
      await this.passkeyAuth.registerPasskey(this.email, this.displayName);
      await loading.dismiss();
      await this.showAlert('Success!', 'Your passkey has been created successfully.');
      // Navigate to login or main app
    } catch (error) {
      await loading.dismiss();
      await this.showAlert('Error', error.message || 'Registration failed. Please try again.');
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
```

### Login Component

```typescript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { PasskeyAuthService } from '../services/passkey-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  email: string = '';
  isPasskeySupported: boolean = false;

  constructor(
    private passkeyAuth: PasskeyAuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.isPasskeySupported = await this.passkeyAuth.checkSupport();
  }

  async onLoginWithPasskey() {
    const loading = await this.loadingController.create({
      message: 'Authenticating...',
      spinner: 'dots'
    });

    await loading.present();

    try {
      const user = await this.passkeyAuth.signInWithPasskey(
        this.email.length > 0 ? this.email : undefined
      );
      await loading.dismiss();
      
      // Navigate to main app
      this.router.navigate(['/home']);
    } catch (error) {
      await loading.dismiss();
      
      if (error.message?.includes('cancelled')) {
        // User cancelled, don't show error
        return;
      }
      
      await this.showAlert('Error', error.message || 'Authentication failed. Please try again.');
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
```

### Templates

#### Register Template (`register.page.html`)

```html
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>Create Account</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true" class="ion-padding">
  <div class="container">
    <div class="header-section">
      <ion-icon name="finger-print" class="passkey-icon"></ion-icon>
      <h2>Create Your Passkey</h2>
      <p>Set up secure, passwordless authentication</p>
    </div>

    <form #registerForm="ngForm" (ngSubmit)="onRegister()">
      <ion-item>
        <ion-label position="floating">Email</ion-label>
        <ion-input 
          type="email" 
          [(ngModel)]="email" 
          name="email" 
          required
          autocomplete="email">
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">Display Name</ion-label>
        <ion-input 
          type="text" 
          [(ngModel)]="displayName" 
          name="displayName" 
          required
          autocomplete="name">
        </ion-input>
      </ion-item>

      <ion-button 
        expand="block" 
        type="submit" 
        class="register-button"
        [disabled]="!registerForm.form.valid || !isPasskeySupported">
        <ion-icon name="finger-print" slot="start"></ion-icon>
        Create Passkey
      </ion-button>
    </form>

    <div class="info-section" *ngIf="!isPasskeySupported">
      <ion-card>
        <ion-card-content>
          <ion-icon name="information-circle" color="warning"></ion-icon>
          <p>Passkeys are not supported on this device. Please use an alternative authentication method.</p>
        </ion-card-content>
      </ion-card>
    </div>
  </div>
</ion-content>
```

#### Login Template (`login.page.html`)

```html
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>Sign In</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true" class="ion-padding">
  <div class="container">
    <div class="header-section">
      <ion-icon name="finger-print" class="passkey-icon"></ion-icon>
      <h2>Welcome Back</h2>
      <p>Sign in with your passkey</p>
    </div>

    <form (ngSubmit)="onLoginWithPasskey()">
      <ion-item>
        <ion-label position="floating">Email (optional)</ion-label>
        <ion-input 
          type="email" 
          [(ngModel)]="email" 
          name="email"
          autocomplete="email">
        </ion-input>
      </ion-item>

      <ion-button 
        expand="block" 
        type="submit" 
        class="login-button"
        [disabled]="!isPasskeySupported">
        <ion-icon name="finger-print" slot="start"></ion-icon>
        Sign In with Passkey
      </ion-button>
    </form>

    <div class="alternative-methods">
      <ion-button fill="clear" size="small" routerLink="/register">
        Don't have a passkey? Create one
      </ion-button>
    </div>
  </div>
</ion-content>
```

## 🛡️ Security Best Practices

### Secure Storage

```typescript
import { Capacitor } from '@capacitor/core';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

export class SecureStorage {
  static async store(key: string, value: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await SecureStoragePlugin.set({
        key,
        value
      });
    } else {
      // Fallback for web
      localStorage.setItem(key, value);
    }
  }

  static async get(key: string): Promise<string | null> {
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await SecureStoragePlugin.get({ key });
        return result.value;
      } catch (error) {
        return null;
      }
    } else {
      // Fallback for web
      return localStorage.getItem(key);
    }
  }

  static async remove(key: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await SecureStoragePlugin.remove({ key });
    } else {
      // Fallback for web
      localStorage.removeItem(key);
    }
  }
}
```

### Error Handling

```typescript
export enum PasskeyErrorType {
  NOT_SUPPORTED = 'NOT_SUPPORTED',
  CANCELLED = 'CANCELLED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_CHALLENGE = 'INVALID_CHALLENGE',
  REGISTRATION_FAILED = 'REGISTRATION_FAILED',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

export class PasskeyError extends Error {
  constructor(
    public type: PasskeyErrorType,
    message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'PasskeyError';
  }

  static fromError(error: any): PasskeyError {
    if (error instanceof PasskeyError) {
      return error;
    }

    const message = error.message || 'Unknown error occurred';

    if (message.includes('not supported')) {
      return new PasskeyError(PasskeyErrorType.NOT_SUPPORTED, message, error);
    }
    
    if (message.includes('cancelled') || message.includes('canceled')) {
      return new PasskeyError(PasskeyErrorType.CANCELLED, message, error);
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return new PasskeyError(PasskeyErrorType.NETWORK_ERROR, message, error);
    }
    
    if (message.includes('timeout')) {
      return new PasskeyError(PasskeyErrorType.TIMEOUT, message, error);
    }

    return new PasskeyError(PasskeyErrorType.UNKNOWN, message, error);
  }
}
```

## 🔍 Platform Detection

```typescript
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';

export class PlatformService {
  static async getPlatformInfo() {
    const info = await Device.getInfo();
    
    return {
      platform: info.platform,
      isNative: Capacitor.isNativePlatform(),
      isIOS: info.platform === 'ios',
      isAndroid: info.platform === 'android',
      isWeb: info.platform === 'web',
      operatingSystem: info.operatingSystem,
      osVersion: info.osVersion
    };
  }

  static async checkPasskeySupport(): Promise<{
    supported: boolean;
    reason?: string;
  }> {
    const platformInfo = await this.getPlatformInfo();

    // Check iOS version (iOS 16.0+)
    if (platformInfo.isIOS) {
      const majorVersion = parseInt(platformInfo.osVersion.split('.')[0]);
      if (majorVersion < 16) {
        return {
          supported: false,
          reason: 'iOS 16.0 or later is required for passkeys'
        };
      }
    }

    // Check Android version (Android 9.0+ with Google Play Services)
    if (platformInfo.isAndroid) {
      const version = parseInt(platformInfo.osVersion);
      if (version < 28) { // Android 9.0 = API 28
        return {
          supported: false,
          reason: 'Android 9.0 or later is required for passkeys'
        };
      }
    }

    // Check web browser support
    if (platformInfo.isWeb) {
      if (!window.PublicKeyCredential) {
        return {
          supported: false,
          reason: 'WebAuthn is not supported in this browser'
        };
      }
    }

    try {
      const result = await PasskeymeIonic.isSupported();
      return {
        supported: result.supported,
        reason: result.supported ? undefined : 'Platform authenticator not available'
      };
    } catch (error) {
      return {
        supported: false,
        reason: 'Error checking passkey support'
      };
    }
  }
}
```

## 📚 Testing

### Unit Tests (Jasmine/Karma)

```typescript
import { TestBed } from '@angular/core/testing';
import { PasskeyAuthService } from './passkey-auth.service';

describe('PasskeyAuthService', () => {
  let service: PasskeyAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasskeyAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check passkey support', async () => {
    spyOn(PasskeymeIonic, 'isSupported').and.returnValue(
      Promise.resolve({ supported: true })
    );

    const isSupported = await service.checkSupport();
    expect(isSupported).toBe(true);
  });

  it('should handle registration errors gracefully', async () => {
    spyOn(PasskeymeIonic, 'register').and.returnValue(
      Promise.resolve({ success: false, error: 'Test error' })
    );

    try {
      await service.registerPasskey('test@example.com', 'Test User');
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).toBe('Test error');
    }
  });
});
```

### E2E Tests (Cypress)

```typescript
describe('Passkey Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should show passkey login button when supported', () => {
    cy.get('[data-cy="passkey-login-button"]')
      .should('be.visible')
      .and('not.be.disabled');
  });

  it('should handle passkey registration flow', () => {
    cy.visit('/register');
    
    cy.get('[data-cy="email-input"]')
      .type('test@example.com');
    
    cy.get('[data-cy="display-name-input"]')
      .type('Test User');
    
    cy.get('[data-cy="create-passkey-button"]')
      .click();
    
    // Mock the passkey creation
    cy.window().then((win) => {
      win.PasskeymeIonic = {
        register: () => Promise.resolve({
          success: true,
          credential: { id: 'test-credential' }
        })
      };
    });
    
    cy.get('[data-cy="success-message"]')
      .should('be.visible');
  });
});
```

## 📖 Migration Guide

### From Cordova

If migrating from a Cordova app:

1. **Remove Cordova plugins**:
   ```bash
   cordova plugin remove cordova-plugin-fido-uaf
   ```

2. **Install Capacitor**:
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   ```

3. **Install the plugin**:
   ```bash
   npm install @passkeyme/ionic-cap-plugin
   npx cap sync
   ```

4. **Update your authentication code** to use the new plugin API.

### From Native Apps

If you have separate native iOS/Android apps:

1. **Create an Ionic project**:
   ```bash
   ionic start myApp tabs --type=angular --capacitor
   ```

2. **Install the plugin** and migrate your authentication logic to use the unified API.

3. **Maintain platform-specific features** using Capacitor's native APIs when needed.

## 📖 Next Steps

- **[Web SDK](/docs/sdks/web-sdk)** - Browser implementation
- **[Android SDK](/docs/sdks/android-sdk)** - Native Android implementation  
- **[iOS SDK](/docs/sdks/ios/)** - Native iOS implementation
- **[API Reference](/docs/api/api-overview)** - Direct API integration

---

:::tip Need Different Platforms?
For platform-specific implementations:
- **[React Native SDK](/docs/getting-started/framework-comparison)** (coming Q1 2025) for React Native apps
- **[JavaScript SDK](/docs/sdks/javascript)** for web frameworks
- **[React SDK](/docs/sdks/react)** for React applications
:::

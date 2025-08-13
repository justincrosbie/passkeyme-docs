---
id: advanced-usage
title: Advanced Usage
sidebar_label: Advanced Usage
description: Advanced patterns and complex authentication scenarios
---

# 🚀 Advanced JavaScript SDK Usage

This guide covers **advanced authentication patterns, complex scenarios, and power-user features** of the PasskeyMe JavaScript SDK.

## 🏗️ **Architecture Patterns**

### **Singleton Auth Manager**

```typescript
// auth-manager.ts - Centralized authentication management
import { PasskeymeAuth, User, PasskeymeError } from '@passkeyme/auth';

class AuthManager {
  private static instance: AuthManager;
  private auth: PasskeymeAuth;
  private user: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  private constructor() {
    this.auth = new PasskeymeAuth({
      appId: process.env.PASSKEYME_APP_ID!,
      redirectUri: window.location.origin + '/auth/callback',
      debug: process.env.NODE_ENV === 'development'
    });

    this.init();
  }

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  private async init() {
    try {
      await this.auth.init();
      
      // Attempt to restore session
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser);
          this.notifyListeners();
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Auth manager initialization failed:', error);
    }
  }

  // Subscribe to auth state changes
  subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.user));
  }

  // Get current user
  getUser(): User | null {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.user !== null;
  }

  // Smart login with enhanced error handling
  async smartLogin(options?: { preferPasskey?: boolean }): Promise<User> {
    try {
      const user = await this.auth.smartLogin(options);
      this.setUser(user);
      return user;
    } catch (error) {
      console.error('Smart login failed:', error);
      throw error;
    }
  }

  // Redirect to login with context
  async redirectToLogin(context?: Record<string, any>): Promise<void> {
    const state = {
      returnTo: window.location.pathname + window.location.search,
      context,
      timestamp: Date.now()
    };

    await this.auth.redirectToLogin({
      state: JSON.stringify(state)
    });
  }

  // Handle callback with context restoration
  async handleCallback(): Promise<User> {
    try {
      const user = await this.auth.handleAuthCallback();
      this.setUser(user);
      
      // Restore context from state
      const urlParams = new URLSearchParams(window.location.search);
      const stateParam = urlParams.get('state');
      
      if (stateParam) {
        try {
          const state = JSON.parse(stateParam);
          if (state.context) {
            // Restore application context
            Object.keys(state.context).forEach(key => {
              sessionStorage.setItem(`restored_${key}`, JSON.stringify(state.context[key]));
            });
          }
        } catch (e) {
          console.warn('Failed to restore context:', e);
        }
      }
      
      return user;
    } catch (error) {
      console.error('Callback handling failed:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // Clear user state
      this.setUser(null);
      
      // Clear storage
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Optional: Call logout endpoint
      // await this.auth.logout();
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if remote logout fails
      this.setUser(null);
      localStorage.removeItem('user');
    }
  }

  private setUser(user: User | null) {
    this.user = user;
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    
    this.notifyListeners();
  }

  // Get auth instance for advanced operations
  getAuthInstance(): PasskeymeAuth {
    return this.auth;
  }
}

// Export singleton instance
export const authManager = AuthManager.getInstance();
```

### **Multi-Tenant Authentication**

```typescript
// multi-tenant-auth.ts
interface TenantConfig {
  appId: string;
  redirectUri: string;
  branding?: {
    primaryColor?: string;
    logo?: string;
  };
}

class MultiTenantAuth {
  private authInstances = new Map<string, PasskeymeAuth>();
  private currentTenant: string | null = null;

  async switchTenant(tenantId: string, config: TenantConfig): Promise<void> {
    this.currentTenant = tenantId;
    
    if (!this.authInstances.has(tenantId)) {
      const auth = new PasskeymeAuth({
        appId: config.appId,
        redirectUri: config.redirectUri,
        theme: config.branding ? {
          primaryColor: config.branding.primaryColor,
          logoUrl: config.branding.logo
        } : undefined
      });
      
      await auth.init();
      this.authInstances.set(tenantId, auth);
    }
  }

  getCurrentAuth(): PasskeymeAuth {
    if (!this.currentTenant) {
      throw new Error('No tenant selected');
    }
    
    const auth = this.authInstances.get(this.currentTenant);
    if (!auth) {
      throw new Error(`Auth instance not found for tenant: ${this.currentTenant}`);
    }
    
    return auth;
  }

  async smartLogin(options?: any): Promise<User> {
    return this.getCurrentAuth().smartLogin(options);
  }

  async redirectToLogin(options?: any): Promise<void> {
    return this.getCurrentAuth().redirectToLogin(options);
  }

  async handleAuthCallback(): Promise<User> {
    return this.getCurrentAuth().handleAuthCallback();
  }

  getCurrentTenant(): string | null {
    return this.currentTenant;
  }
}

// Usage
const multiAuth = new MultiTenantAuth();

// Switch to different tenants
await multiAuth.switchTenant('company-a', {
  appId: 'company-a-app-id',
  redirectUri: 'https://company-a.example.com/auth/callback',
  branding: {
    primaryColor: '#ff6b6b',
    logo: 'https://company-a.example.com/logo.png'
  }
});

await multiAuth.switchTenant('company-b', {
  appId: 'company-b-app-id',
  redirectUri: 'https://company-b.example.com/auth/callback',
  branding: {
    primaryColor: '#4ecdc4',
    logo: 'https://company-b.example.com/logo.png'
  }
});

// Use current tenant auth
const user = await multiAuth.smartLogin();
```

## 🎭 **Authentication Strategies**

### **Progressive Authentication**

```typescript
// progressive-auth.ts
class ProgressiveAuth {
  private auth: PasskeymeAuth;
  private authLevel: 'none' | 'basic' | 'verified' | 'privileged' = 'none';

  constructor(config: any) {
    this.auth = new PasskeymeAuth(config);
  }

  async init() {
    await this.auth.init();
    
    // Check existing auth level
    const user = this.getStoredUser();
    if (user) {
      this.authLevel = this.determineAuthLevel(user);
    }
  }

  // Step 1: Basic authentication
  async authenticateBasic(): Promise<User> {
    try {
      const user = await this.auth.smartLogin({ 
        preferPasskey: false // Start with social/email
      });
      
      this.authLevel = 'basic';
      this.storeUser(user);
      
      return user;
    } catch (error) {
      console.error('Basic authentication failed:', error);
      throw error;
    }
  }

  // Step 2: Verified authentication (email verification, etc.)
  async upgradeToVerified(): Promise<User> {
    if (this.authLevel === 'none') {
      throw new Error('Must complete basic authentication first');
    }

    try {
      // Initiate email verification or similar
      const user = await this.requestVerification();
      
      this.authLevel = 'verified';
      this.storeUser(user);
      
      return user;
    } catch (error) {
      console.error('Verification upgrade failed:', error);
      throw error;
    }
  }

  // Step 3: Privileged authentication (passkey enrollment)
  async upgradeToPrivileged(): Promise<User> {
    if (this.authLevel !== 'verified') {
      throw new Error('Must be verified before privileged authentication');
    }

    try {
      // Enroll passkey for high-security operations
      const user = await this.auth.smartLogin({ 
        preferPasskey: true,
        requirePasskey: true 
      });
      
      this.authLevel = 'privileged';
      this.storeUser(user);
      
      return user;
    } catch (error) {
      console.error('Privileged authentication failed:', error);
      throw error;
    }
  }

  // Check if current auth level meets requirement
  hasAuthLevel(required: typeof this.authLevel): boolean {
    const levels = ['none', 'basic', 'verified', 'privileged'];
    const currentIndex = levels.indexOf(this.authLevel);
    const requiredIndex = levels.indexOf(required);
    
    return currentIndex >= requiredIndex;
  }

  // Ensure minimum auth level
  async ensureAuthLevel(required: typeof this.authLevel): Promise<User> {
    if (this.hasAuthLevel(required)) {
      return this.getStoredUser()!;
    }

    // Upgrade authentication step by step
    let user = this.getStoredUser();
    
    if (this.authLevel === 'none' && required !== 'none') {
      user = await this.authenticateBasic();
    }
    
    if (this.authLevel === 'basic' && ['verified', 'privileged'].includes(required)) {
      user = await this.upgradeToVerified();
    }
    
    if (this.authLevel === 'verified' && required === 'privileged') {
      user = await this.upgradeToPrivileged();
    }
    
    return user!;
  }

  private determineAuthLevel(user: User): typeof this.authLevel {
    if (user.hasPasskey) return 'privileged';
    if (user.emailVerified) return 'verified';
    return 'basic';
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  private storeUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private async requestVerification(): Promise<User> {
    // Implementation depends on your verification system
    throw new Error('Verification not implemented');
  }
}

// Usage
const progressiveAuth = new ProgressiveAuth({
  appId: 'your-app-id',
  redirectUri: window.location.origin + '/auth/callback'
});

await progressiveAuth.init();

// For basic operations
await progressiveAuth.ensureAuthLevel('basic');

// For sensitive operations
await progressiveAuth.ensureAuthLevel('verified');

// For high-security operations
await progressiveAuth.ensureAuthLevel('privileged');
```

### **Conditional Authentication**

```typescript
// conditional-auth.ts
interface AuthCondition {
  name: string;
  check: (user: User | null, context: any) => boolean;
  handler: (auth: PasskeymeAuth, context: any) => Promise<User>;
}

class ConditionalAuth {
  private auth: PasskeymeAuth;
  private conditions: AuthCondition[] = [];

  constructor(config: any) {
    this.auth = new PasskeymeAuth(config);
    this.setupDefaultConditions();
  }

  private setupDefaultConditions() {
    // Condition 1: First-time users -> Social login
    this.addCondition({
      name: 'first-time-user',
      check: (user, context) => !user && !context.hasVisited,
      handler: async (auth, context) => {
        return auth.redirectToLogin({
          provider: 'google', // Default to social
          state: JSON.stringify({ firstTime: true })
        });
      }
    });

    // Condition 2: Returning users with passkey -> Direct passkey
    this.addCondition({
      name: 'returning-passkey-user',
      check: (user, context) => !user && context.hasPasskey,
      handler: async (auth, context) => {
        return auth.smartLogin({ preferPasskey: true });
      }
    });

    // Condition 3: High-value operation -> Require re-auth
    this.addCondition({
      name: 'high-value-operation',
      check: (user, context) => user && context.requiresFreshAuth,
      handler: async (auth, context) => {
        return auth.smartLogin({ forceReauth: true });
      }
    });
  }

  addCondition(condition: AuthCondition) {
    this.conditions.push(condition);
  }

  async authenticate(context: any = {}): Promise<User> {
    const currentUser = this.getCurrentUser();
    
    // Check conditions in order
    for (const condition of this.conditions) {
      if (condition.check(currentUser, context)) {
        console.log(`Applying auth condition: ${condition.name}`);
        return condition.handler(this.auth, context);
      }
    }

    // Default authentication
    return this.auth.smartLogin();
  }

  private getCurrentUser(): User | null {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }
}

// Usage
const conditionalAuth = new ConditionalAuth({
  appId: 'your-app-id',
  redirectUri: window.location.origin + '/auth/callback'
});

// Different contexts trigger different auth flows
await conditionalAuth.authenticate({
  hasVisited: false // First-time user
});

await conditionalAuth.authenticate({
  hasPasskey: true // Returning user with passkey
});

await conditionalAuth.authenticate({
  requiresFreshAuth: true, // High-value operation
  operation: 'transfer-funds'
});
```

## 🔄 **Session Management**

### **Advanced Session Handling**

```typescript
// session-manager.ts
interface SessionConfig {
  maxAge: number; // milliseconds
  refreshThreshold: number; // milliseconds before expiry to refresh
  storageKey: string;
}

class SessionManager {
  private config: SessionConfig;
  private auth: PasskeymeAuth;
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor(auth: PasskeymeAuth, config: Partial<SessionConfig> = {}) {
    this.auth = auth;
    this.config = {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      refreshThreshold: 60 * 60 * 1000, // 1 hour
      storageKey: 'passkeyme_session',
      ...config
    };

    this.startSessionMonitoring();
  }

  storeSession(user: User): void {
    const session = {
      user,
      createdAt: Date.now(),
      lastActivity: Date.now()
    };

    localStorage.setItem(this.config.storageKey, JSON.stringify(session));
    this.scheduleRefresh();
  }

  getSession(): { user: User; createdAt: number; lastActivity: number } | null {
    const stored = localStorage.getItem(this.config.storageKey);
    
    if (!stored) return null;

    try {
      const session = JSON.parse(stored);
      
      // Check if session is expired
      if (Date.now() - session.createdAt > this.config.maxAge) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Failed to parse session:', error);
      this.clearSession();
      return null;
    }
  }

  updateLastActivity(): void {
    const session = this.getSession();
    if (session) {
      session.lastActivity = Date.now();
      localStorage.setItem(this.config.storageKey, JSON.stringify(session));
    }
  }

  clearSession(): void {
    localStorage.removeItem(this.config.storageKey);
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  async refreshSessionIfNeeded(): Promise<boolean> {
    const session = this.getSession();
    
    if (!session) return false;

    const timeToExpiry = (session.createdAt + this.config.maxAge) - Date.now();
    
    // If within refresh threshold, attempt refresh
    if (timeToExpiry <= this.config.refreshThreshold) {
      try {
        // Attempt silent refresh (implementation depends on your backend)
        const refreshedUser = await this.silentRefresh(session.user);
        this.storeSession(refreshedUser);
        return true;
      } catch (error) {
        console.error('Session refresh failed:', error);
        this.clearSession();
        return false;
      }
    }

    return true;
  }

  private async silentRefresh(user: User): Promise<User> {
    // Implementation depends on your backend
    // This could involve refreshing tokens, checking user status, etc.
    
    // For now, return the same user (in practice, you'd call an API)
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API call
    
    return {
      ...user,
      // Updated data from API
    };
  }

  private scheduleRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const session = this.getSession();
    if (!session) return;

    const timeToRefresh = (session.createdAt + this.config.maxAge - this.config.refreshThreshold) - Date.now();
    
    if (timeToRefresh > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshSessionIfNeeded();
      }, timeToRefresh);
    }
  }

  private startSessionMonitoring(): void {
    // Update activity on user interactions
    const events = ['click', 'keypress', 'scroll', 'mousemove'];
    
    let lastActivity = Date.now();
    const throttledUpdate = this.throttle(() => {
      this.updateLastActivity();
    }, 30000); // Update at most every 30 seconds

    events.forEach(event => {
      document.addEventListener(event, throttledUpdate, true);
    });

    // Periodic session check
    setInterval(() => {
      this.refreshSessionIfNeeded();
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  private throttle(func: Function, delay: number) {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastExecTime = 0;
    
    return function(...args: any[]) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(null, args);
        lastExecTime = currentTime;
      } else {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(null, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }
}

// Usage
const sessionManager = new SessionManager(auth, {
  maxAge: 8 * 60 * 60 * 1000, // 8 hours
  refreshThreshold: 30 * 60 * 1000 // 30 minutes
});

// After successful authentication
const user = await auth.smartLogin();
sessionManager.storeSession(user);

// Check session validity
const session = sessionManager.getSession();
if (session) {
  console.log('Valid session found:', session.user);
} else {
  console.log('No valid session, need to authenticate');
}
```

## 🌐 **Cross-Origin and Security**

### **Secure Cross-Origin Authentication**

```typescript
// cross-origin-auth.ts
interface CrossOriginConfig {
  allowedOrigins: string[];
  trustedDomains: string[];
  sharedStorageKey: string;
}

class CrossOriginAuth {
  private auth: PasskeymeAuth;
  private config: CrossOriginConfig;
  private messageHandlers = new Map();

  constructor(authConfig: any, crossOriginConfig: CrossOriginConfig) {
    this.auth = new PasskeymeAuth(authConfig);
    this.config = crossOriginConfig;
    this.setupMessageHandlers();
  }

  private setupMessageHandlers() {
    window.addEventListener('message', (event) => {
      // Verify origin
      if (!this.config.allowedOrigins.includes(event.origin)) {
        console.warn('Rejected message from untrusted origin:', event.origin);
        return;
      }

      const { type, data, requestId } = event.data;
      const handler = this.messageHandlers.get(type);
      
      if (handler) {
        handler(data, event.origin, requestId);
      }
    });

    // Register message handlers
    this.messageHandlers.set('AUTH_REQUEST', this.handleAuthRequest.bind(this));
    this.messageHandlers.set('AUTH_CHECK', this.handleAuthCheck.bind(this));
    this.messageHandlers.set('LOGOUT_REQUEST', this.handleLogoutRequest.bind(this));
  }

  private async handleAuthRequest(data: any, origin: string, requestId: string) {
    try {
      const user = await this.auth.smartLogin(data.options);
      
      this.postMessageToOrigin(origin, {
        type: 'AUTH_SUCCESS',
        user,
        requestId
      });
      
      // Store in shared storage for other origins
      this.storeSharedAuth(user);
      
    } catch (error) {
      this.postMessageToOrigin(origin, {
        type: 'AUTH_ERROR',
        error: error.message,
        requestId
      });
    }
  }

  private handleAuthCheck(data: any, origin: string, requestId: string) {
    const user = this.getSharedAuth();
    
    this.postMessageToOrigin(origin, {
      type: 'AUTH_STATUS',
      user,
      isAuthenticated: !!user,
      requestId
    });
  }

  private async handleLogoutRequest(data: any, origin: string, requestId: string) {
    try {
      await this.logout();
      
      this.postMessageToOrigin(origin, {
        type: 'LOGOUT_SUCCESS',
        requestId
      });
      
    } catch (error) {
      this.postMessageToOrigin(origin, {
        type: 'LOGOUT_ERROR',
        error: error.message,
        requestId
      });
    }
  }

  private postMessageToOrigin(origin: string, message: any) {
    // Find all frames that match the origin
    const frames = [window.parent, ...Array.from(window.frames)];
    
    frames.forEach(frame => {
      try {
        frame.postMessage(message, origin);
      } catch (error) {
        // Ignore cross-origin errors
      }
    });
  }

  private storeSharedAuth(user: User) {
    const sharedData = {
      user,
      timestamp: Date.now(),
      domain: window.location.hostname
    };
    
    // Use secure storage if available
    if (window.localStorage) {
      localStorage.setItem(this.config.sharedStorageKey, JSON.stringify(sharedData));
    }
    
    // Notify other origins
    this.broadcastAuthUpdate(user);
  }

  private getSharedAuth(): User | null {
    try {
      const stored = localStorage.getItem(this.config.sharedStorageKey);
      if (!stored) return null;
      
      const data = JSON.parse(stored);
      
      // Check if too old (optional expiry)
      if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(this.config.sharedStorageKey);
        return null;
      }
      
      return data.user;
    } catch (error) {
      return null;
    }
  }

  private broadcastAuthUpdate(user: User | null) {
    this.config.allowedOrigins.forEach(origin => {
      this.postMessageToOrigin(origin, {
        type: 'AUTH_UPDATE',
        user,
        isAuthenticated: !!user
      });
    });
  }

  async logout() {
    // Clear local auth
    localStorage.removeItem(this.config.sharedStorageKey);
    
    // Notify other origins
    this.broadcastAuthUpdate(null);
    
    // Perform any additional cleanup
    await this.auth.logout?.();
  }

  // Public API for requesting auth from another origin
  async requestAuth(targetOrigin: string, options?: any): Promise<User> {
    return new Promise((resolve, reject) => {
      const requestId = Math.random().toString(36).substr(2, 9);
      
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== targetOrigin) return;
        if (event.data.requestId !== requestId) return;
        
        window.removeEventListener('message', messageHandler);
        
        if (event.data.type === 'AUTH_SUCCESS') {
          resolve(event.data.user);
        } else if (event.data.type === 'AUTH_ERROR') {
          reject(new Error(event.data.error));
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      // Send auth request
      const targetWindow = window.parent; // or find specific frame
      targetWindow.postMessage({
        type: 'AUTH_REQUEST',
        data: { options },
        requestId
      }, targetOrigin);
      
      // Timeout after 30 seconds
      setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        reject(new Error('Authentication request timeout'));
      }, 30000);
    });
  }
}

// Usage
const crossOriginAuth = new CrossOriginAuth(
  {
    appId: 'your-app-id',
    redirectUri: window.location.origin + '/auth/callback'
  },
  {
    allowedOrigins: [
      'https://app.example.com',
      'https://admin.example.com',
      'https://dashboard.example.com'
    ],
    trustedDomains: ['example.com'],
    sharedStorageKey: 'shared_auth_state'
  }
);

// From a subdomain, request auth from main domain
const user = await crossOriginAuth.requestAuth('https://app.example.com');
```

## 🔗 **Integration Patterns**

### **WebSocket Authentication**

```typescript
// websocket-auth.ts
class AuthenticatedWebSocket {
  private ws: WebSocket | null = null;
  private auth: PasskeymeAuth;
  private user: User | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(auth: PasskeymeAuth) {
    this.auth = auth;
  }

  async connect(url: string): Promise<void> {
    // Ensure authentication
    if (!this.user) {
      this.user = await this.auth.smartLogin();
    }

    // Get auth token for WebSocket
    const token = await this.getAuthToken();
    
    // Connect with authentication
    const wsUrl = `${url}?token=${encodeURIComponent(token)}`;
    this.ws = new WebSocket(wsUrl);

    return new Promise((resolve, reject) => {
      this.ws!.onopen = () => {
        console.log('WebSocket connected with authentication');
        this.reconnectAttempts = 0;
        resolve();
      };

      this.ws!.onerror = (error) => {
        console.error('WebSocket connection failed:', error);
        reject(error);
      };

      this.ws!.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        
        // Attempt reconnection for non-auth errors
        if (event.code !== 401 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect(url);
        }
      };

      this.ws!.onmessage = (event) => {
        this.handleMessage(event);
      };
    });
  }

  private async getAuthToken(): Promise<string> {
    // In practice, this would get a WebSocket-specific token
    // from your backend using the user's session
    return 'mock-websocket-token';
  }

  private handleMessage(event: MessageEvent) {
    try {
      const message = JSON.parse(event.data);
      
      if (message.type === 'AUTH_ERROR') {
        console.error('WebSocket authentication error:', message.error);
        this.reconnectWithAuth();
      }
      
      // Handle other message types
      this.onMessage?.(message);
      
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private async reconnectWithAuth() {
    try {
      // Re-authenticate
      this.user = await this.auth.smartLogin({ forceReauth: true });
      
      // Reconnect WebSocket
      // Implementation depends on your needs
      
    } catch (error) {
      console.error('Re-authentication failed:', error);
    }
  }

  private scheduleReconnect(url: string) {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    setTimeout(async () => {
      this.reconnectAttempts++;
      try {
        await this.connect(url);
      } catch (error) {
        console.error(`Reconnection attempt ${this.reconnectAttempts} failed:`, error);
      }
    }, delay);
  }

  send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      throw new Error('WebSocket not connected');
    }
  }

  close(): void {
    this.ws?.close();
  }

  onMessage?: (message: any) => void;
}

// Usage
const auth = new PasskeymeAuth({ /* config */ });
const wsAuth = new AuthenticatedWebSocket(auth);

await wsAuth.connect('wss://api.example.com/websocket');

wsAuth.onMessage = (message) => {
  console.log('Received:', message);
};

wsAuth.send({ type: 'subscribe', channel: 'notifications' });
```

## 📱 **Device and Platform Detection**

### **Smart Platform Handling**

```typescript
// platform-aware-auth.ts
class PlatformAwareAuth {
  private auth: PasskeymeAuth;
  private platform: 'mobile' | 'desktop' | 'tablet';
  private capabilities: Set<string> = new Set();

  constructor(config: any) {
    this.auth = new PasskeymeAuth(config);
    this.platform = this.detectPlatform();
    this.detectCapabilities();
  }

  private detectPlatform(): 'mobile' | 'desktop' | 'tablet' {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
    
    if (isTablet) return 'tablet';
    if (isMobile) return 'mobile';
    return 'desktop';
  }

  private detectCapabilities() {
    // WebAuthn support
    if (window.PublicKeyCredential) {
      this.capabilities.add('webauthn');
    }

    // Touch support
    if ('ontouchstart' in window) {
      this.capabilities.add('touch');
    }

    // Face ID / Touch ID on iOS
    if (/iphone|ipad/i.test(navigator.userAgent)) {
      this.capabilities.add('biometric-ios');
    }

    // Android biometric
    if (/android/i.test(navigator.userAgent)) {
      this.capabilities.add('biometric-android');
    }

    // Camera access
    if (navigator.mediaDevices?.getUserMedia) {
      this.capabilities.add('camera');
    }
  }

  async smartLogin(): Promise<User> {
    const strategy = this.getOptimalAuthStrategy();
    
    console.log(`Using ${strategy} authentication for ${this.platform} platform`);
    
    switch (strategy) {
      case 'passkey-preferred':
        return this.auth.smartLogin({ preferPasskey: true });
        
      case 'passkey-only':
        return this.auth.smartLogin({ requirePasskey: true });
        
      case 'social-preferred':
        return this.auth.redirectToLogin({ 
          provider: this.getPreferredSocialProvider() 
        });
        
      case 'hosted-redirect':
        return this.auth.redirectToLogin();
        
      default:
        return this.auth.smartLogin();
    }
  }

  private getOptimalAuthStrategy(): string {
    // Desktop with WebAuthn -> Prefer passkeys
    if (this.platform === 'desktop' && this.capabilities.has('webauthn')) {
      return 'passkey-preferred';
    }

    // iOS with biometric -> Passkey only
    if (this.capabilities.has('biometric-ios') && this.capabilities.has('webauthn')) {
      return 'passkey-only';
    }

    // Android with biometric -> Prefer passkeys
    if (this.capabilities.has('biometric-android') && this.capabilities.has('webauthn')) {
      return 'passkey-preferred';
    }

    // Mobile without WebAuthn -> Social login
    if (this.platform === 'mobile' && !this.capabilities.has('webauthn')) {
      return 'social-preferred';
    }

    // Fallback to hosted redirect
    return 'hosted-redirect';
  }

  private getPreferredSocialProvider(): string {
    // Platform-specific social preferences
    if (/iphone|ipad/i.test(navigator.userAgent)) {
      return 'apple';
    }
    
    if (/android/i.test(navigator.userAgent)) {
      return 'google';
    }
    
    return 'google'; // Default
  }

  // Get platform-specific UI hints
  getUIHints() {
    return {
      platform: this.platform,
      capabilities: Array.from(this.capabilities),
      recommendations: {
        showPasskeyOption: this.capabilities.has('webauthn'),
        preferBiometric: this.capabilities.has('biometric-ios') || this.capabilities.has('biometric-android'),
        showSocialFirst: this.platform === 'mobile' && !this.capabilities.has('webauthn'),
        enableTouchOptimizations: this.capabilities.has('touch')
      }
    };
  }
}

// Usage
const platformAuth = new PlatformAwareAuth({
  appId: 'your-app-id',
  redirectUri: window.location.origin + '/auth/callback'
});

// Get platform-specific recommendations
const hints = platformAuth.getUIHints();
console.log('Platform recommendations:', hints);

// Authenticate using optimal strategy
const user = await platformAuth.smartLogin();
```

## 🔗 **Related Documentation**

- **[Smart Login](./smart-login.md)** - Intelligent authentication initiation
- **[Redirect to Login](./redirect-to-login.md)** - Direct hosted auth redirects  
- **[Handle Auth Callback](./handle-auth-callback.md)** - Process authentication returns
- **[Main JavaScript SDK](../javascript.md)** - Complete SDK reference

---

*Advanced usage patterns enable sophisticated authentication experiences. Choose the patterns that best fit your application's complexity and security requirements.*

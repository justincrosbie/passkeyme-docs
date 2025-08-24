---
id: api-reference
title: API Reference
sidebar_label: API Reference
description: Complete API reference for iOS PasskeymeSDK
keywords: [ios, api, reference, passkey, webauthn, methods, properties]
---

# 📖 **API Reference**

Complete API reference for the PasskeymeSDK iOS framework.

:::info Framework Overview
The PasskeymeSDK provides native iOS APIs for passkey authentication using the AuthenticationServices framework and WebKit components.
:::

## **📱 PasskeymeSDK**

### **Configuration**

#### `configure(debug:timeout:)`

Configures the PasskeymeSDK with global settings.

```swift
PasskeymeSDK.configure(
    debug: Bool = false,
    timeout: TimeInterval = 60.0
)
```

**Parameters:**
- `debug`: Enable debug logging and development mode
- `timeout`: Network request timeout in seconds

**Example:**
```swift
// Production configuration
PasskeymeSDK.configure(debug: false, timeout: 30.0)

// Development configuration
PasskeymeSDK.configure(debug: true, timeout: 120.0)
```

---

## **🔐 PasskeyAuthenticator**

The main authentication class for passkey operations.

### **Initialization**

#### `init(apiBaseURL:webViewConfiguration:delegate:)`

Creates a new PasskeyAuthenticator instance.

```swift
init(
    apiBaseURL: String,
    webViewConfiguration: WKWebViewConfiguration? = nil,
    delegate: PasskeyAuthenticatorDelegate? = nil
)
```

**Parameters:**
- `apiBaseURL`: Base URL for Passkeyme API endpoints
- `webViewConfiguration`: Optional WebKit configuration
- `delegate`: Delegate for authentication events

**Example:**
```swift
let authenticator = PasskeyAuthenticator(
    apiBaseURL: "https://api.passkeyme.com",
    delegate: self
)
```

### **Properties**

#### `delegate`

```swift
weak var delegate: PasskeyAuthenticatorDelegate?
```

Delegate that receives authentication events and callbacks.

#### `isReady`

```swift
var isReady: Bool { get }
```

Returns `true` if the authenticator is ready to perform operations.

#### `currentWebView`

```swift
var currentWebView: WKWebView? { get }
```

The currently active WebView used for authentication flows.

### **Methods**

#### `register(options:)`

Initiates passkey registration for a new user.

```swift
func register(options: PasskeyRegistrationOptions) async throws -> PasskeyRegistrationResult
```

**Parameters:**
- `options`: Configuration options for registration

**Returns:** `PasskeyRegistrationResult` containing registration details

**Throws:** `PasskeyError` on failure

**Example:**
```swift
let options = PasskeyRegistrationOptions(
    userId: "user123",
    userName: "john@example.com",
    displayName: "John Doe"
)

do {
    let result = try await authenticator.register(options: options)
    print("Registration successful: \(result.credentialId)")
} catch {
    print("Registration failed: \(error)")
}
```

#### `authenticate(options:)`

Performs passkey authentication for an existing user.

```swift
func authenticate(options: PasskeyAuthenticationOptions) async throws -> PasskeyAuthenticationResult
```

**Parameters:**
- `options`: Configuration options for authentication

**Returns:** `PasskeyAuthenticationResult` containing authentication details

**Throws:** `PasskeyError` on failure

**Example:**
```swift
let options = PasskeyAuthenticationOptions(
    userId: "user123",
    challenge: "server_challenge"
)

do {
    let result = try await authenticator.authenticate(options: options)
    print("Authentication successful: \(result.userId)")
} catch {
    print("Authentication failed: \(error)")
}
```

#### `triggerPasskeymeAuth(authId:data:configuration:)`

Triggers Passkeyme hosted authentication flow.

```swift
func triggerPasskeymeAuth(
    authId: String,
    data: [String: Any]? = nil,
    configuration: PasskeymeConfiguration? = nil
) async throws -> PasskeymeAuthResult
```

**Parameters:**
- `authId`: Authentication session identifier
- `data`: Optional additional data for the authentication flow
- `configuration`: Optional configuration for the hosted flow

**Returns:** `PasskeymeAuthResult` containing authentication result

**Throws:** `PasskeyError` on failure

**Example:**
```swift
let configuration = PasskeymeConfiguration(
    domain: "your-domain.com",
    theme: .light,
    language: "en"
)

do {
    let result = try await authenticator.triggerPasskeymeAuth(
        authId: "auth_session_123",
        data: ["custom_field": "value"],
        configuration: configuration
    )
    print("Hosted auth successful: \(result.token)")
} catch {
    print("Hosted auth failed: \(error)")
}
```

#### `isUserVerifyingPlatformAuthenticatorAvailable()`

Checks if platform authenticator is available.

```swift
func isUserVerifyingPlatformAuthenticatorAvailable() async -> Bool
```

**Returns:** `true` if platform authenticator is available

**Example:**
```swift
let isAvailable = await authenticator.isUserVerifyingPlatformAuthenticatorAvailable()
if isAvailable {
    print("Passkeys are supported on this device")
} else {
    print("Passkeys not available")
}
```

#### `cancel()`

Cancels any ongoing authentication operation.

```swift
func cancel()
```

**Example:**
```swift
// Cancel ongoing operation
authenticator.cancel()
```

---

## **📋 Data Models**

### **PasskeyRegistrationOptions**

Configuration options for passkey registration.

```swift
struct PasskeyRegistrationOptions {
    let userId: String
    let userName: String
    let displayName: String
    let challenge: String?
    let timeout: TimeInterval?
    let authenticatorSelection: AuthenticatorSelection?
    let attestation: AttestationConveyancePreference?
    let extensions: AuthenticationExtensions?
}
```

**Properties:**
- `userId`: Unique identifier for the user
- `userName`: User's username (typically email)
- `displayName`: Human-readable display name
- `challenge`: Server-generated challenge (optional)
- `timeout`: Operation timeout in seconds
- `authenticatorSelection`: Authenticator selection criteria
- `attestation`: Attestation conveyance preference
- `extensions`: WebAuthn extensions

**Example:**
```swift
let options = PasskeyRegistrationOptions(
    userId: "user_12345",
    userName: "john.doe@example.com",
    displayName: "John Doe",
    challenge: nil, // SDK will generate
    timeout: 60.0,
    authenticatorSelection: AuthenticatorSelection(
        userVerification: .required,
        residentKey: .required
    ),
    attestation: .none,
    extensions: nil
)
```

### **PasskeyAuthenticationOptions**

Configuration options for passkey authentication.

```swift
struct PasskeyAuthenticationOptions {
    let userId: String?
    let challenge: String?
    let timeout: TimeInterval?
    let userVerification: UserVerificationRequirement?
    let allowCredentials: [PublicKeyCredentialDescriptor]?
    let extensions: AuthenticationExtensions?
}
```

**Properties:**
- `userId`: User identifier (optional for usernameless flow)
- `challenge`: Server-generated challenge
- `timeout`: Operation timeout in seconds
- `userVerification`: User verification requirement
- `allowCredentials`: List of allowed credentials
- `extensions`: WebAuthn extensions

**Example:**
```swift
let options = PasskeyAuthenticationOptions(
    userId: "user_12345",
    challenge: "server_challenge_string",
    timeout: 60.0,
    userVerification: .required,
    allowCredentials: nil, // Allow any credential
    extensions: nil
)
```

### **PasskeymeConfiguration**

Configuration for Passkeyme hosted authentication.

```swift
struct PasskeymeConfiguration {
    let domain: String
    let theme: PasskeymeTheme?
    let language: String?
    let customization: PasskeymeCustomization?
    let developmentMode: Bool?
}
```

**Properties:**
- `domain`: Your registered domain
- `theme`: UI theme preference
- `language`: Preferred language code
- `customization`: Custom UI elements
- `developmentMode`: Enable development mode

**Example:**
```swift
let config = PasskeymeConfiguration(
    domain: "myapp.com",
    theme: .dark,
    language: "en",
    customization: PasskeymeCustomization(
        primaryColor: "#007AFF",
        logoURL: "https://myapp.com/logo.png"
    ),
    developmentMode: false
)
```

### **Result Types**

#### `PasskeyRegistrationResult`

Result of a successful passkey registration.

```swift
struct PasskeyRegistrationResult {
    let credentialId: String
    let publicKey: String
    let attestationObject: String
    let clientDataJSON: String
    let userId: String
    let transports: [AuthenticatorTransport]
}
```

#### `PasskeyAuthenticationResult`

Result of a successful passkey authentication.

```swift
struct PasskeyAuthenticationResult {
    let credentialId: String
    let authenticatorData: String
    let signature: String
    let clientDataJSON: String
    let userId: String
    let userHandle: String?
}
```

#### `PasskeymeAuthResult`

Result of a successful Passkeyme hosted authentication.

```swift
struct PasskeymeAuthResult {
    let token: String
    let userId: String
    let email: String?
    let userData: [String: Any]?
    let authMethod: String
    let timestamp: Date
}
```

---

## **🎯 Delegate Protocol**

### **PasskeyAuthenticatorDelegate**

Delegate protocol for receiving authentication events.

```swift
protocol PasskeyAuthenticatorDelegate: AnyObject {
    func authenticator(_ authenticator: PasskeyAuthenticator, didStartOperation operation: PasskeyOperation)
    func authenticator(_ authenticator: PasskeyAuthenticator, didCompleteOperation operation: PasskeyOperation, with result: Any)
    func authenticator(_ authenticator: PasskeyAuthenticator, didFailOperation operation: PasskeyOperation, with error: PasskeyError)
    func authenticator(_ authenticator: PasskeyAuthenticator, didCancelOperation operation: PasskeyOperation)
    func authenticator(_ authenticator: PasskeyAuthenticator, didUpdateProgress progress: PasskeyProgress)
}
```

**Methods:**

#### `didStartOperation`

Called when an operation begins.

```swift
func authenticator(_ authenticator: PasskeyAuthenticator, didStartOperation operation: PasskeyOperation)
```

#### `didCompleteOperation`

Called when an operation completes successfully.

```swift
func authenticator(_ authenticator: PasskeyAuthenticator, didCompleteOperation operation: PasskeyOperation, with result: Any)
```

#### `didFailOperation`

Called when an operation fails.

```swift
func authenticator(_ authenticator: PasskeyAuthenticator, didFailOperation operation: PasskeyOperation, with error: PasskeyError)
```

#### `didCancelOperation`

Called when an operation is cancelled.

```swift
func authenticator(_ authenticator: PasskeyAuthenticator, didCancelOperation operation: PasskeyOperation)
```

#### `didUpdateProgress`

Called when operation progress updates.

```swift
func authenticator(_ authenticator: PasskeyAuthenticator, didUpdateProgress progress: PasskeyProgress)
```

**Example Implementation:**
```swift
extension ViewController: PasskeyAuthenticatorDelegate {
    func authenticator(_ authenticator: PasskeyAuthenticator, didStartOperation operation: PasskeyOperation) {
        DispatchQueue.main.async {
            self.showLoading(for: operation)
        }
    }
    
    func authenticator(_ authenticator: PasskeyAuthenticator, didCompleteOperation operation: PasskeyOperation, with result: Any) {
        DispatchQueue.main.async {
            self.hideLoading()
            self.handleSuccess(operation: operation, result: result)
        }
    }
    
    func authenticator(_ authenticator: PasskeyAuthenticator, didFailOperation operation: PasskeyOperation, with error: PasskeyError) {
        DispatchQueue.main.async {
            self.hideLoading()
            self.showError(error)
        }
    }
    
    func authenticator(_ authenticator: PasskeyAuthenticator, didCancelOperation operation: PasskeyOperation) {
        DispatchQueue.main.async {
            self.hideLoading()
        }
    }
    
    func authenticator(_ authenticator: PasskeyAuthenticator, didUpdateProgress progress: PasskeyProgress) {
        DispatchQueue.main.async {
            self.updateProgress(progress)
        }
    }
}
```

---

## **🔧 Enumerations**

### **PasskeyOperation**

Types of passkey operations.

```swift
enum PasskeyOperation {
    case registration
    case authentication
    case hostedAuth
    case availabilityCheck
}
```

### **PasskeyError**

Error types that can occur during passkey operations.

```swift
enum PasskeyError: Error, LocalizedError {
    case notSupported
    case cancelled
    case timeout
    case networkError(Error)
    case invalidConfiguration
    case authenticationFailed
    case registrationFailed
    case userVerificationFailed
    case unknownError(String)
    
    var errorDescription: String? {
        switch self {
        case .notSupported:
            return "Passkeys are not supported on this device"
        case .cancelled:
            return "Operation was cancelled by user"
        case .timeout:
            return "Operation timed out"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .invalidConfiguration:
            return "Invalid configuration provided"
        case .authenticationFailed:
            return "Authentication failed"
        case .registrationFailed:
            return "Registration failed"
        case .userVerificationFailed:
            return "User verification failed"
        case .unknownError(let message):
            return "Unknown error: \(message)"
        }
    }
}
```

### **PasskeymeTheme**

UI theme options for Passkeyme hosted authentication.

```swift
enum PasskeymeTheme {
    case light
    case dark
    case auto
}
```

### **UserVerificationRequirement**

User verification requirements for authentication.

```swift
enum UserVerificationRequirement {
    case required
    case preferred
    case discouraged
}
```

### **AuthenticatorTransport**

Available authenticator transport methods.

```swift
enum AuthenticatorTransport {
    case usb
    case nfc
    case ble
    case internal
    case hybrid
}
```

---

## **📊 Supporting Types**

### **AuthenticatorSelection**

Criteria for authenticator selection.

```swift
struct AuthenticatorSelection {
    let authenticatorAttachment: AuthenticatorAttachment?
    let userVerification: UserVerificationRequirement
    let residentKey: ResidentKeyRequirement?
}

enum AuthenticatorAttachment {
    case platform
    case crossPlatform
}

enum ResidentKeyRequirement {
    case required
    case preferred
    case discouraged
}
```

### **PublicKeyCredentialDescriptor**

Descriptor for existing credentials.

```swift
struct PublicKeyCredentialDescriptor {
    let type: String
    let id: Data
    let transports: [AuthenticatorTransport]?
}
```

### **PasskeyProgress**

Progress information for ongoing operations.

```swift
struct PasskeyProgress {
    let operation: PasskeyOperation
    let stage: ProgressStage
    let message: String?
    let progress: Float // 0.0 to 1.0
}

enum ProgressStage {
    case initializing
    case authenticating
    case processing
    case completing
}
```

### **PasskeymeCustomization**

Customization options for hosted authentication UI.

```swift
struct PasskeymeCustomization {
    let primaryColor: String?
    let logoURL: String?
    let brandName: String?
    let customCSS: String?
}
```

---

## **🧪 Testing Utilities**

### **PasskeyTestUtils**

Utilities for testing passkey functionality.

```swift
class PasskeyTestUtils {
    static func createMockRegistrationOptions() -> PasskeyRegistrationOptions
    static func createMockAuthenticationOptions() -> PasskeyAuthenticationOptions
    static func isRunningInSimulator() -> Bool
    static func mockPlatformAuthenticatorAvailability() -> Bool
}
```

**Example:**
```swift
#if DEBUG
let mockOptions = PasskeyTestUtils.createMockRegistrationOptions()
let isSimulator = PasskeyTestUtils.isRunningInSimulator()

if isSimulator {
    // Use mock implementation for simulator testing
    let mockResult = createMockRegistrationResult()
    completion(.success(mockResult))
}
#endif
```

---

## **📄 Extensions**

### **WKWebViewConfiguration Extensions**

```swift
extension WKWebViewConfiguration {
    static func passkeyConfiguration() -> WKWebViewConfiguration
    func enablePasskeySupport()
    func configureForSecureAuthentication()
}
```

### **ASAuthorizationController Extensions**

```swift
extension ASAuthorizationController {
    convenience init(passkeyRequest: ASAuthorizationPlatformPublicKeyCredentialProvider.CredentialRegistrationRequest)
    convenience init(passkeyRequest: ASAuthorizationPlatformPublicKeyCredentialProvider.CredentialAssertionRequest)
}
```

---

## **⚠️ Important Notes**

### **Platform Requirements**

- **iOS 16.0+** for full passkey support
- **iOS 15.0+** for basic WebAuthn functionality
- **Xcode 14.0+** for development
- Valid Apple Developer account for Associated Domains

### **Associated Domains**

Your app must include the Associated Domains capability with:

```
webcredentials:your-domain.com
```

### **Network Security**

All API endpoints must use HTTPS. The SDK will reject HTTP connections in production.

### **Memory Management**

The SDK uses automatic reference counting (ARC). Ensure you maintain strong references to the `PasskeyAuthenticator` instance while operations are in progress.

### **Thread Safety**

All SDK methods are thread-safe and can be called from any queue. Delegate callbacks are dispatched on the main queue.

---

This API reference provides complete documentation for integrating passkey authentication in your iOS application using the PasskeymeSDK framework.

---
id: ios-sdk
title: iOS SDK
sidebar_label: iOS SDK
description: Native iOS SDK for passkey authentication in Swift and Objective-C apps
---

# 📱 iOS SDK

The `PasskeymeSDK` provides native iOS passkey authentication using the AuthenticationServices framework. This SDK handles **only WebAuthn/FIDO2 operations** and requires backend integration for complete authentication flows.

:::info SDK Purpose
This is a **low-level SDK** for native iOS apps. For React Native apps, consider:
- **[React Native SDK](/docs/getting-started/framework-comparison)** (coming Q1 2025) for React Native apps
- **[Ionic Plugin](/docs/sdks/ionic-plugin)** for Ionic/Capacitor apps
:::

## 📦 Installation

### CocoaPods

Add to your `Podfile`:

```ruby
pod 'PasskeymeSDK', '~> 1.0'
```

Then run:

```bash
pod install
```

### Swift Package Manager

Add to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/Passkeyme/PasskeymeSDK-iOS", from: "1.0.0")
]
```

### Manual Installation

1. Download the latest release from [CocoaPods](https://cocoapods.org/pods/PasskeymeSDK)
2. Add `PasskeymeSDK.framework` to your project
3. Add to **Linked Frameworks**: `AuthenticationServices.framework`

## 🚀 Quick Start

### Import and Setup

```swift
import PasskeymeSDK
import AuthenticationServices

class AuthenticationManager: NSObject {
    private let passkeymeSDK = PasskeymeSDK(debug: true)
    
    override init() {
        super.init()
    }
}
```

### Registration Flow

```swift
func registerPasskey(username: String, displayName: String) async throws {
    // 1. Get challenge from your backend
    let challenge = try await getRegistrationChallenge(username: username)
    
    // 2. Perform passkey registration
    let result = try await passkeymeSDK.register(
        username: username,
        displayName: displayName,
        challenge: challenge.challenge,
        rp: challenge.rp,
        user: challenge.user,
        pubKeyCredParams: challenge.pubKeyCredParams,
        timeout: challenge.timeout,
        attestation: challenge.attestation
    )
    
    // 3. Complete registration with backend
    try await completeRegistration(credential: result.credential, username: username)
    
    print("Passkey registration successful!")
}

private func getRegistrationChallenge(username: String) async throws -> RegistrationChallenge {
    let url = URL(string: "\(baseURL)/api/start-registration")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let body = ["username": username]
    request.httpBody = try JSONSerialization.data(withJSONObject: body)
    
    let (data, response) = try await URLSession.shared.data(for: request)
    
    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 200 else {
        throw AuthError.networkError
    }
    
    return try JSONDecoder().decode(RegistrationChallenge.self, from: data)
}

private func completeRegistration(credential: PasskeyCredential, username: String) async throws {
    let url = URL(string: "\(baseURL)/api/complete-registration")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let body = [
        "credential": credential.toDictionary(),
        "username": username
    ]
    request.httpBody = try JSONSerialization.data(withJSONObject: body)
    
    let (_, response) = try await URLSession.shared.data(for: request)
    
    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 200 else {
        throw AuthError.registrationFailed
    }
}
```

### Authentication Flow

```swift
func authenticateWithPasskey(username: String? = nil) async throws -> User {
    // 1. Get challenge from your backend
    let challenge = try await getAuthenticationChallenge(username: username)
    
    // 2. Perform passkey authentication
    let result = try await passkeymeSDK.authenticate(
        username: username,
        challenge: challenge.challenge,
        rpId: challenge.rpId,
        allowCredentials: challenge.allowCredentials,
        timeout: challenge.timeout,
        userVerification: challenge.userVerification
    )
    
    // 3. Complete authentication with backend
    let user = try await completeAuthentication(assertion: result.assertion, username: username)
    
    print("Passkey authentication successful!")
    return user
}

private func getAuthenticationChallenge(username: String?) async throws -> AuthenticationChallenge {
    let url = URL(string: "\(baseURL)/api/start-authentication")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let body = username != nil ? ["username": username!] : [:]
    request.httpBody = try JSONSerialization.data(withJSONObject: body)
    
    let (data, response) = try await URLSession.shared.data(for: request)
    
    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 200 else {
        throw AuthError.networkError
    }
    
    return try JSONDecoder().decode(AuthenticationChallenge.self, from: data)
}

private func completeAuthentication(assertion: PasskeyAssertion, username: String?) async throws -> User {
    let url = URL(string: "\(baseURL)/api/complete-authentication")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let body: [String: Any] = [
        "assertion": assertion.toDictionary(),
        "username": username ?? NSNull()
    ]
    request.httpBody = try JSONSerialization.data(withJSONObject: body)
    
    let (data, response) = try await URLSession.shared.data(for: request)
    
    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 200 else {
        throw AuthError.authenticationFailed
    }
    
    return try JSONDecoder().decode(User.self, from: data)
}
```

## 🔧 API Reference

### PasskeymeSDK Class

```swift
public class PasskeymeSDK {
    public init(debug: Bool = false)
    
    public func register(
        username: String,
        displayName: String,
        challenge: String,
        rp: RelyingParty,
        user: UserInfo,
        pubKeyCredParams: [PublicKeyCredentialParameters],
        timeout: TimeInterval? = nil,
        attestation: AttestationConveyancePreference = .none,
        authenticatorSelection: AuthenticatorSelectionCriteria? = nil,
        excludeCredentials: [PublicKeyCredentialDescriptor]? = nil
    ) async throws -> RegistrationResult
    
    public func authenticate(
        username: String? = nil,
        challenge: String,
        rpId: String? = nil,
        allowCredentials: [PublicKeyCredentialDescriptor]? = nil,
        timeout: TimeInterval? = nil,
        userVerification: UserVerificationRequirement = .preferred
    ) async throws -> AuthenticationResult
    
    public func isSupported() -> Bool
    public func isPlatformAuthenticatorAvailable() async -> Bool
}
```

### Data Models

```swift
// Registration Models
public struct RelyingParty: Codable {
    public let name: String
    public let id: String
}

public struct UserInfo: Codable {
    public let id: String
    public let name: String
    public let displayName: String
}

public struct PublicKeyCredentialParameters: Codable {
    public let type: String // "public-key"
    public let alg: Int     // Algorithm identifier
}

public struct RegistrationResult {
    public let success: Bool
    public let credential: PasskeyCredential?
    public let error: Error?
}

public struct PasskeyCredential {
    public let id: String
    public let rawId: Data
    public let response: AuthenticatorAttestationResponse
    public let type: String // "public-key"
    
    public func toDictionary() -> [String: Any]
}

// Authentication Models
public struct PublicKeyCredentialDescriptor: Codable {
    public let type: String // "public-key"
    public let id: String
}

public struct AuthenticationResult {
    public let success: Bool
    public let assertion: PasskeyAssertion?
    public let error: Error?
}

public struct PasskeyAssertion {
    public let credential: PasskeyAuthenticationCredential
    
    public func toDictionary() -> [String: Any]
}

public struct PasskeyAuthenticationCredential {
    public let id: String
    public let rawId: Data
    public let response: AuthenticatorAssertionResponse
    public let type: String // "public-key"
}

// Enums
public enum AttestationConveyancePreference: String, Codable {
    case none = "none"
    case indirect = "indirect"
    case direct = "direct"
}

public enum UserVerificationRequirement: String, Codable {
    case required = "required"
    case preferred = "preferred"
    case discouraged = "discouraged"
}

// Error Types
public enum PasskeymeError: Error {
    case notSupported
    case cancelled
    case failed(String)
    case networkError
    case invalidChallenge
    case registrationFailed
    case authenticationFailed
}
```

## 🎨 SwiftUI Integration

### Registration View

```swift
import SwiftUI
import PasskeymeSDK

struct PasskeyRegistrationView: View {
    @State private var username = ""
    @State private var displayName = ""
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var showSuccess = false
    
    private let authManager = AuthenticationManager()
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Create Your Passkey")
                .font(.title)
                .fontWeight(.bold)
            
            VStack(spacing: 16) {
                TextField("Email", text: $username)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                
                TextField("Display Name", text: $displayName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
            }
            
            Button(action: registerPasskey) {
                HStack {
                    if isLoading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            .scaleEffect(0.8)
                    } else {
                        Image(systemName: "faceid")
                    }
                    Text(isLoading ? "Creating Passkey..." : "Create Passkey")
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.blue)
                .cornerRadius(10)
            }
            .disabled(isLoading || username.isEmpty || displayName.isEmpty)
            
            if let errorMessage = errorMessage {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .font(.caption)
            }
        }
        .padding()
        .alert("Success!", isPresented: $showSuccess) {
            Button("OK") { }
        } message: {
            Text("Your passkey has been created successfully!")
        }
    }
    
    private func registerPasskey() {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                try await authManager.registerPasskey(username: username, displayName: displayName)
                
                await MainActor.run {
                    isLoading = false
                    showSuccess = true
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                    errorMessage = error.localizedDescription
                }
            }
        }
    }
}
```

### Authentication View

```swift
struct PasskeyLoginView: View {
    @State private var username = ""
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var user: User?
    
    private let authManager = AuthenticationManager()
    
    var body: some View {
        VStack(spacing: 20) {
            if let user = user {
                // Success state
                VStack(spacing: 16) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 60))
                        .foregroundColor(.green)
                    
                    Text("Welcome back!")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text("Signed in as \(user.email)")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    Button("Sign Out") {
                        self.user = nil
                        self.username = ""
                    }
                    .padding()
                    .background(Color.gray.opacity(0.2))
                    .cornerRadius(8)
                }
            } else {
                // Login state
                Text("Sign In with Passkey")
                    .font(.title)
                    .fontWeight(.bold)
                
                TextField("Email (optional)", text: $username)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                
                Button(action: authenticateWithPasskey) {
                    HStack {
                        if isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                .scaleEffect(0.8)
                        } else {
                            Image(systemName: "faceid")
                        }
                        Text(isLoading ? "Authenticating..." : "Sign In with Passkey")
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .cornerRadius(10)
                }
                .disabled(isLoading)
                
                if let errorMessage = errorMessage {
                    Text(errorMessage)
                        .foregroundColor(.red)
                        .font(.caption)
                }
            }
        }
        .padding()
    }
    
    private func authenticateWithPasskey() {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let authenticatedUser = try await authManager.authenticateWithPasskey(
                    username: username.isEmpty ? nil : username
                )
                
                await MainActor.run {
                    isLoading = false
                    user = authenticatedUser
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                    errorMessage = error.localizedDescription
                }
            }
        }
    }
}
```

## 🔧 UIKit Integration

### Registration Controller

```swift
import UIKit
import PasskeymeSDK

class PasskeyRegistrationViewController: UIViewController {
    @IBOutlet weak var usernameTextField: UITextField!
    @IBOutlet weak var displayNameTextField: UITextField!
    @IBOutlet weak var registerButton: UIButton!
    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!
    
    private let authManager = AuthenticationManager()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        title = "Create Passkey"
        registerButton.layer.cornerRadius = 8
        activityIndicator.hidesWhenStopped = true
    }
    
    @IBAction func registerButtonTapped(_ sender: UIButton) {
        guard let username = usernameTextField.text, !username.isEmpty,
              let displayName = displayNameTextField.text, !displayName.isEmpty else {
            showAlert(message: "Please fill in all fields")
            return
        }
        
        registerPasskey(username: username, displayName: displayName)
    }
    
    private func registerPasskey(username: String, displayName: String) {
        setLoading(true)
        
        Task {
            do {
                try await authManager.registerPasskey(username: username, displayName: displayName)
                
                await MainActor.run {
                    setLoading(false)
                    showSuccessAlert()
                }
            } catch {
                await MainActor.run {
                    setLoading(false)
                    showAlert(message: error.localizedDescription)
                }
            }
        }
    }
    
    private func setLoading(_ loading: Bool) {
        registerButton.isEnabled = !loading
        usernameTextField.isEnabled = !loading
        displayNameTextField.isEnabled = !loading
        
        if loading {
            activityIndicator.startAnimating()
            registerButton.setTitle("Creating Passkey...", for: .normal)
        } else {
            activityIndicator.stopAnimating()
            registerButton.setTitle("Create Passkey", for: .normal)
        }
    }
    
    private func showAlert(message: String) {
        let alert = UIAlertController(title: "Error", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
    
    private func showSuccessAlert() {
        let alert = UIAlertController(title: "Success!", message: "Your passkey has been created successfully!", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            self.navigationController?.popViewController(animated: true)
        })
        present(alert, animated: true)
    }
}
```

## 🛡️ Security Best Practices

### Keychain Integration

```swift
import Security

class KeychainManager {
    static let shared = KeychainManager()
    
    private let service = "com.yourapp.passkeyme"
    
    func storeCredentialId(_ credentialId: String, for username: String) -> Bool {
        let data = credentialId.data(using: .utf8) ?? Data()
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: username,
            kSecValueData as String: data
        ]
        
        SecItemDelete(query as CFDictionary) // Remove existing item
        
        let status = SecItemAdd(query as CFDictionary, nil)
        return status == errSecSuccess
    }
    
    func getCredentialId(for username: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: username,
            kSecReturnData as String: true
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        guard status == errSecSuccess,
              let data = result as? Data,
              let credentialId = String(data: data, encoding: .utf8) else {
            return nil
        }
        
        return credentialId
    }
    
    func removeCredentialId(for username: String) -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: username
        ]
        
        let status = SecItemDelete(query as CFDictionary)
        return status == errSecSuccess
    }
}
```

### User Defaults for Preferences

```swift
extension UserDefaults {
    private enum Keys {
        static let lastUsername = "passkeyme_last_username"
        static let passkeyEnabled = "passkeyme_passkey_enabled"
    }
    
    var lastPasskeyUsername: String? {
        get { string(forKey: Keys.lastUsername) }
        set { set(newValue, forKey: Keys.lastUsername) }
    }
    
    var isPasskeyEnabled: Bool {
        get { bool(forKey: Keys.passkeyEnabled) }
        set { set(newValue, forKey: Keys.passkeyEnabled) }
    }
}

// Usage
func saveUserPreferences(username: String) {
    UserDefaults.standard.lastPasskeyUsername = username
    UserDefaults.standard.isPasskeyEnabled = true
}
```

## 🔍 Error Handling

### Comprehensive Error Handling

```swift
enum AuthError: Error, LocalizedError {
    case notSupported
    case cancelled
    case networkError
    case invalidChallenge
    case registrationFailed
    case authenticationFailed
    case noCredentials
    case timeout
    
    var errorDescription: String? {
        switch self {
        case .notSupported:
            return "Passkeys are not supported on this device"
        case .cancelled:
            return "Authentication was cancelled"
        case .networkError:
            return "Network error occurred. Please check your connection."
        case .invalidChallenge:
            return "Invalid authentication challenge received"
        case .registrationFailed:
            return "Failed to register passkey. Please try again."
        case .authenticationFailed:
            return "Authentication failed. Please try again."
        case .noCredentials:
            return "No passkeys found for this account"
        case .timeout:
            return "Authentication timed out. Please try again."
        }
    }
}

// Error handling in authentication
func handleAuthenticationError(_ error: Error) {
    DispatchQueue.main.async {
        let message: String
        
        if let passkeyError = error as? PasskeymeError {
            switch passkeyError {
            case .notSupported:
                message = "This device doesn't support passkeys. Please use password login."
                // Show alternative login method
                showPasswordLogin()
                return
            case .cancelled:
                message = "Authentication was cancelled. Please try again."
            case .failed(let details):
                message = "Authentication failed: \(details)"
            default:
                message = passkeyError.localizedDescription
            }
        } else {
            message = error.localizedDescription
        }
        
        showErrorAlert(message: message)
    }
}
```

## 📊 Analytics Integration

```swift
// Analytics tracking for passkey events
extension AuthenticationManager {
    private func trackEvent(_ event: String, parameters: [String: Any] = [:]) {
        // Your analytics implementation
        Analytics.track(event, parameters: parameters)
    }
    
    func registerPasskey(username: String, displayName: String) async throws {
        trackEvent("passkey_registration_started", parameters: [
            "username_provided": !username.isEmpty
        ])
        
        do {
            // Registration logic here...
            
            trackEvent("passkey_registration_success")
        } catch {
            trackEvent("passkey_registration_failed", parameters: [
                "error": error.localizedDescription
            ])
            throw error
        }
    }
    
    func authenticateWithPasskey(username: String?) async throws -> User {
        trackEvent("passkey_authentication_started", parameters: [
            "username_provided": username != nil
        ])
        
        do {
            // Authentication logic here...
            
            trackEvent("passkey_authentication_success")
            return user
        } catch {
            trackEvent("passkey_authentication_failed", parameters: [
                "error": error.localizedDescription
            ])
            throw error
        }
    }
}
```

## 📚 Testing

### Unit Tests

```swift
import XCTest
@testable import YourApp
@testable import PasskeymeSDK

class PasskeymeSDKTests: XCTestCase {
    var sdk: PasskeymeSDK!
    
    override func setUp() {
        super.setUp()
        sdk = PasskeymeSDK(debug: true)
    }
    
    func testSDKSupport() {
        // Test if SDK properly detects WebAuthn support
        let isSupported = sdk.isSupported()
        XCTAssertTrue(isSupported, "WebAuthn should be supported on iOS 16+")
    }
    
    func testPlatformAuthenticatorAvailability() async {
        // Test platform authenticator detection
        let isAvailable = await sdk.isPlatformAuthenticatorAvailable()
        // This will depend on the test device configuration
        XCTAssertNotNil(isAvailable)
    }
    
    func testRegistrationInputValidation() async {
        // Test input validation for registration
        do {
            _ = try await sdk.register(
                username: "",
                displayName: "",
                challenge: "",
                rp: RelyingParty(name: "", id: ""),
                user: UserInfo(id: "", name: "", displayName: ""),
                pubKeyCredParams: []
            )
            XCTFail("Should throw error for empty inputs")
        } catch {
            XCTAssertTrue(error is PasskeymeError)
        }
    }
}
```

## 📖 Next Steps

- **[Android SDK](/docs/sdks/android-sdk)** - Native Android implementation
- **[Web SDK](/docs/sdks/web-sdk)** - Browser implementation
- **[Ionic Plugin](/docs/sdks/ionic-plugin)** - Cross-platform mobile
- **[API Reference](/docs/api/api-overview)** - Direct API integration

---

:::tip Need Higher-Level Integration?
For simpler integration with OAuth and hosted authentication, consider:
- **[React Native SDK](/docs/getting-started/framework-comparison)** (coming Q1 2025) for React Native apps
- **[Ionic Plugin](/docs/sdks/ionic-plugin)** for Ionic/Capacitor apps
:::

---
id: integration
title: SDK Integration
sidebar_label: Integration
description: Complete iOS SDK integration guide with SwiftUI and UIKit examples
keywords: [ios, sdk, integration, swift, swiftui, uikit, passkey, authentication]
---

# 📱 **SDK Integration**

This guide shows you how to integrate the PasskeymeSDK into your iOS application with complete code examples for both SwiftUI and UIKit frameworks.

:::tip Prerequisites
Before integrating the SDK, ensure you have completed the [Configuration & Setup](/docs/sdks/ios/configuration) guide. Proper apple-app-site-association and Associated Domains configuration is required for passkeys to work.
:::

## **📦 Installation**

### **CocoaPods Installation**

Add to your `Podfile`:

```ruby
platform :ios, '16.0'

target 'YourApp' do
  use_frameworks!
  
  # PasskeymeSDK
  pod 'PasskeymeSDK'
  
  # Optional: For network requests (if not using your own HTTP client)
  pod 'Alamofire', '~> 5.8'
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '16.0'
    end
  end
end
```

### **Swift Package Manager Installation**

Add to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/passkeyme/ios-sdk.git", from: "1.0.0")
]
```

Or add via Xcode:
1. **File** → **Add Package Dependencies**
2. **Enter URL**: `https://github.com/passkeyme/ios-sdk.git`
3. **Add to target** and import

### **Manual Installation**

1. **Download** the latest release from [GitHub](https://github.com/passkeyme/ios-sdk/releases)
2. **Drag `PasskeymeSDK.xcframework`** into your Xcode project
3. **Add to target** in Build Phases → Link Binary With Libraries

## **🚀 Basic SDK Setup**

### **Import and Initialize**

```swift
import PasskeymeSDK
import AuthenticationServices

class AuthenticationManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var errorMessage: String?
    
    private let apiBaseURL = "https://api.yourapp.com"
    
    init() {
        // Configure SDK with debug mode (disable in production)
        PasskeymeSDK.configure(debug: true)
    }
}
```

### **Check Passkey Support**

```swift
extension AuthenticationManager {
    func checkPasskeySupport() -> Bool {
        if #available(iOS 16.0, *) {
            return ASAuthorizationPlatformPublicKeyCredentialProvider.isSupported
        }
        return false
    }
    
    func getPasskeySupportStatus() -> PasskeySupportStatus {
        guard #available(iOS 16.0, *) else {
            return .notSupported(reason: "iOS 16.0+ required")
        }
        
        guard ASAuthorizationPlatformPublicKeyCredentialProvider.isSupported else {
            return .notSupported(reason: "Platform authenticator not available")
        }
        
        return .supported
    }
}

enum PasskeySupportStatus {
    case supported
    case notSupported(reason: String)
    
    var canUsePasskeys: Bool {
        if case .supported = self { return true }
        return false
    }
}
```

## **🔐 Registration Flow**

### **Complete Registration Implementation**

```swift
extension AuthenticationManager {
    func registerPasskey(username: String, displayName: String) async throws -> User {
        do {
            // 1. Get registration challenge from your backend
            let challenge = try await getRegistrationChallenge(username: username, displayName: displayName)
            
            // 2. Perform passkey registration using SDK
            let credential = try await performPasskeyRegistration(challenge: challenge)
            
            // 3. Complete registration with backend
            let user = try await completeRegistration(credential: credential, username: username)
            
            DispatchQueue.main.async {
                self.currentUser = user
                self.isAuthenticated = true
                self.errorMessage = nil
            }
            
            print("Registration successful for user: \(username)")
            return user
            
        } catch {
            DispatchQueue.main.async {
                self.errorMessage = error.localizedDescription
            }
            print("Registration failed: \(error)")
            throw error
        }
    }
    
    private func getRegistrationChallenge(username: String, displayName: String) async throws -> RegistrationChallenge {
        let request = RegistrationChallengeRequest(
            username: username,
            displayName: displayName
        )
        
        // Make HTTP request to your backend
        let data = try JSONEncoder().encode(request)
        let url = URL(string: "\(apiBaseURL)/api/registration-challenge")!
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.httpBody = data
        
        let (responseData, response) = try await URLSession.shared.data(for: urlRequest)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw AuthError.networkError("Failed to get registration challenge")
        }
        
        return try JSONDecoder().decode(RegistrationChallenge.self, from: responseData)
    }
    
    private func performPasskeyRegistration(challenge: RegistrationChallenge) async throws -> PasskeyCredential {
        return try await withCheckedThrowingContinuation { continuation in
            PasskeymeSDK.passkeyRegister(challenge: challenge.challenge) { result in
                switch result {
                case .success(let credential):
                    continuation.resume(returning: credential)
                case .failure(let error):
                    continuation.resume(throwing: error)
                }
            }
        }
    }
    
    private func completeRegistration(credential: PasskeyCredential, username: String) async throws -> User {
        let request = CompleteRegistrationRequest(
            credential: credential,
            username: username
        )
        
        let data = try JSONEncoder().encode(request)
        let url = URL(string: "\(apiBaseURL)/api/complete-registration")!
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.httpBody = data
        
        let (responseData, response) = try await URLSession.shared.data(for: urlRequest)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw AuthError.networkError("Failed to complete registration")
        }
        
        return try JSONDecoder().decode(User.self, from: responseData)
    }
}
```

## **🔓 Authentication Flow**

### **Complete Authentication Implementation**

```swift
extension AuthenticationManager {
    func authenticateWithPasskey(username: String? = nil) async throws -> User {
        do {
            // 1. Get authentication challenge from backend
            let challenge = try await getAuthenticationChallenge(username: username)
            
            // 2. Perform passkey authentication using SDK
            let assertion = try await performPasskeyAuthentication(challenge: challenge)
            
            // 3. Complete authentication with backend
            let user = try await completeAuthentication(assertion: assertion, username: username)
            
            DispatchQueue.main.async {
                self.currentUser = user
                self.isAuthenticated = true
                self.errorMessage = nil
            }
            
            print("Authentication successful for user: \(user.username)")
            return user
            
        } catch {
            DispatchQueue.main.async {
                self.errorMessage = error.localizedDescription
            }
            print("Authentication failed: \(error)")
            throw error
        }
    }
    
    private func getAuthenticationChallenge(username: String?) async throws -> AuthenticationChallenge {
        let request = AuthenticationChallengeRequest(username: username)
        
        let data = try JSONEncoder().encode(request)
        let url = URL(string: "\(apiBaseURL)/api/authentication-challenge")!
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.httpBody = data
        
        let (responseData, response) = try await URLSession.shared.data(for: urlRequest)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw AuthError.networkError("Failed to get authentication challenge")
        }
        
        return try JSONDecoder().decode(AuthenticationChallenge.self, from: responseData)
    }
    
    private func performPasskeyAuthentication(challenge: AuthenticationChallenge) async throws -> PasskeyAssertion {
        return try await withCheckedThrowingContinuation { continuation in
            PasskeymeSDK.passkeyAuthenticate(challenge: challenge.challenge) { result in
                switch result {
                case .success(let assertion):
                    continuation.resume(returning: assertion)
                case .failure(let error):
                    continuation.resume(throwing: error)
                }
            }
        }
    }
    
    private func completeAuthentication(assertion: PasskeyAssertion, username: String?) async throws -> User {
        let request = CompleteAuthenticationRequest(
            assertion: assertion,
            username: username
        )
        
        let data = try JSONEncoder().encode(request)
        let url = URL(string: "\(apiBaseURL)/api/complete-authentication")!
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.httpBody = data
        
        let (responseData, response) = try await URLSession.shared.data(for: urlRequest)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw AuthError.networkError("Failed to complete authentication")
        }
        
        return try JSONDecoder().decode(User.self, from: responseData)
    }
}
```

## **🎨 SwiftUI Integration**

### **Registration View**

```swift
import SwiftUI

struct PasskeyRegistrationView: View {
    @StateObject private var authManager = AuthenticationManager()
    @State private var username = ""
    @State private var displayName = ""
    @State private var isLoading = false
    @State private var showError = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                headerSection
                inputFields
                registerButton
                errorSection
                Spacer()
            }
            .padding()
            .navigationTitle("Create Passkey")
            .navigationBarTitleDisplayMode(.large)
        }
    }
    
    private var headerSection: some View {
        VStack(spacing: 12) {
            Image(systemName: "faceid")
                .font(.system(size: 60))
                .foregroundStyle(.blue.gradient)
            
            Text("Create Your Passkey")
                .font(.title)
                .fontWeight(.bold)
            
            Text("Secure authentication using your device's biometrics")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
    }
    
    private var inputFields: some View {
        VStack(spacing: 16) {
            TextField("Email", text: $username)
                .textFieldStyle(.roundedBorder)
                .keyboardType(.emailAddress)
                .autocapitalization(.none)
                .disabled(isLoading)
            
            TextField("Display Name", text: $displayName)
                .textFieldStyle(.roundedBorder)
                .disabled(isLoading)
        }
    }
    
    private var registerButton: some View {
        Button(action: registerPasskey) {
            HStack {
                if isLoading {
                    ProgressView()
                        .scaleEffect(0.8)
                    Text("Creating Passkey...")
                } else {
                    Image(systemName: "faceid")
                    Text("Create Passkey")
                }
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(isFormValid ? .blue : .gray)
            .foregroundColor(.white)
            .cornerRadius(12)
        }
        .disabled(!isFormValid || isLoading)
    }
    
    private var errorSection: some View {
        Group {
            if let errorMessage = authManager.errorMessage {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .font(.caption)
                    .padding()
                    .background(.red.opacity(0.1))
                    .cornerRadius(8)
            }
        }
    }
    
    private var isFormValid: Bool {
        !username.isEmpty && !displayName.isEmpty && authManager.checkPasskeySupport()
    }
    
    private func registerPasskey() {
        isLoading = true
        
        Task {
            do {
                _ = try await authManager.registerPasskey(
                    username: username,
                    displayName: displayName
                )
                // Navigate to success or main app
            } catch {
                // Error is handled by AuthenticationManager
            }
            
            await MainActor.run {
                isLoading = false
            }
        }
    }
}
```

### **Authentication View**

```swift
struct PasskeyLoginView: View {
    @StateObject private var authManager = AuthenticationManager()
    @State private var username = ""
    @State private var isLoading = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                headerSection
                usernameField
                loginButton
                errorSection
                Spacer()
            }
            .padding()
            .navigationTitle("Sign In")
            .navigationBarTitleDisplayMode(.large)
        }
    }
    
    private var headerSection: some View {
        VStack(spacing: 12) {
            Image(systemName: "person.badge.key")
                .font(.system(size: 60))
                .foregroundStyle(.green.gradient)
            
            Text("Sign In with Passkey")
                .font(.title)
                .fontWeight(.bold)
            
            Text("Use your passkey to sign in securely")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
    }
    
    private var usernameField: some View {
        VStack(alignment: .leading, spacing: 8) {
            TextField("Email (optional)", text: $username)
                .textFieldStyle(.roundedBorder)
                .keyboardType(.emailAddress)
                .autocapitalization(.none)
                .disabled(isLoading)
            
            Text("Leave empty to see all available passkeys")
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
    
    private var loginButton: some View {
        Button(action: authenticatePasskey) {
            HStack {
                if isLoading {
                    ProgressView()
                        .scaleEffect(0.8)
                    Text("Authenticating...")
                } else {
                    Image(systemName: "faceid")
                    Text("Sign In with Passkey")
                }
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(authManager.checkPasskeySupport() ? .green : .gray)
            .foregroundColor(.white)
            .cornerRadius(12)
        }
        .disabled(!authManager.checkPasskeySupport() || isLoading)
    }
    
    private var errorSection: some View {
        Group {
            if let errorMessage = authManager.errorMessage {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .font(.caption)
                    .padding()
                    .background(.red.opacity(0.1))
                    .cornerRadius(8)
            }
        }
    }
    
    private func authenticatePasskey() {
        isLoading = true
        
        Task {
            do {
                _ = try await authManager.authenticateWithPasskey(
                    username: username.isEmpty ? nil : username
                )
                // Navigate to main app
            } catch {
                // Error is handled by AuthenticationManager
            }
            
            await MainActor.run {
                isLoading = false
            }
        }
    }
}
```

### **Main Authentication View**

```swift
struct AuthenticationView: View {
    @StateObject private var authManager = AuthenticationManager()
    @State private var currentView: AuthView = .main
    
    enum AuthView {
        case main, login, register
    }
    
    var body: some View {
        Group {
            switch currentView {
            case .main:
                MainAuthView(
                    onSignInTap: { currentView = .login },
                    onSignUpTap: { currentView = .register }
                )
            case .login:
                PasskeyLoginView()
            case .register:
                PasskeyRegistrationView()
            }
        }
        .environmentObject(authManager)
    }
}

struct MainAuthView: View {
    let onSignInTap: () -> Void
    let onSignUpTap: () -> Void
    @EnvironmentObject var authManager: AuthenticationManager
    
    var body: some View {
        VStack(spacing: 32) {
            appLogo
            welcomeText
            authButtons
            passkeyStatus
            Spacer()
        }
        .padding()
    }
    
    private var appLogo: some View {
        Image(systemName: "key.radiowaves.forward")
            .font(.system(size: 80))
            .foregroundStyle(.blue.gradient)
    }
    
    private var welcomeText: some View {
        VStack(spacing: 8) {
            Text("Welcome to MyApp")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            Text("Secure authentication with passkeys")
                .font(.headline)
                .foregroundColor(.secondary)
        }
    }
    
    private var authButtons: some View {
        VStack(spacing: 16) {
            Button(action: onSignInTap) {
                HStack {
                    Image(systemName: "faceid")
                    Text("Sign In with Passkey")
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(.blue)
                .foregroundColor(.white)
                .cornerRadius(12)
            }
            .disabled(!authManager.checkPasskeySupport())
            
            Button(action: onSignUpTap) {
                HStack {
                    Image(systemName: "person.badge.plus")
                    Text("Create Account with Passkey")
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(.green)
                .foregroundColor(.white)
                .cornerRadius(12)
            }
            .disabled(!authManager.checkPasskeySupport())
        }
    }
    
    private var passkeyStatus: some View {
        HStack {
            Image(systemName: authManager.checkPasskeySupport() ? "checkmark.circle.fill" : "xmark.circle.fill")
                .foregroundColor(authManager.checkPasskeySupport() ? .green : .red)
            
            Text(authManager.checkPasskeySupport() ? "Passkeys supported" : "Passkeys not available")
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}
```

## **📱 UIKit Integration**

### **Registration View Controller**

```swift
import UIKit

class PasskeyRegistrationViewController: UIViewController {
    @IBOutlet weak var usernameTextField: UITextField!
    @IBOutlet weak var displayNameTextField: UITextField!
    @IBOutlet weak var registerButton: UIButton!
    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!
    @IBOutlet weak var errorLabel: UILabel!
    
    private let authManager = AuthenticationManager()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        checkPasskeySupport()
    }
    
    private func setupUI() {
        title = "Create Passkey"
        
        registerButton.layer.cornerRadius = 12
        registerButton.setTitle("Create Passkey", for: .normal)
        registerButton.setImage(UIImage(systemName: "faceid"), for: .normal)
        
        errorLabel.isHidden = true
        activityIndicator.isHidden = true
        
        usernameTextField.addTarget(self, action: #selector(textFieldDidChange), for: .editingChanged)
        displayNameTextField.addTarget(self, action: #selector(textFieldDidChange), for: .editingChanged)
    }
    
    private func checkPasskeySupport() {
        let isSupported = authManager.checkPasskeySupport()
        registerButton.isEnabled = isSupported
        
        if !isSupported {
            showError("Passkeys are not supported on this device")
        }
    }
    
    @objc private func textFieldDidChange() {
        validateForm()
    }
    
    private func validateForm() {
        let isValid = !(usernameTextField.text?.isEmpty ?? true) &&
                     !(displayNameTextField.text?.isEmpty ?? true) &&
                     authManager.checkPasskeySupport()
        
        registerButton.isEnabled = isValid
    }
    
    @IBAction func registerButtonTapped(_ sender: UIButton) {
        guard let username = usernameTextField.text, !username.isEmpty,
              let displayName = displayNameTextField.text, !displayName.isEmpty else {
            return
        }
        
        setLoading(true)
        clearError()
        
        Task {
            do {
                _ = try await authManager.registerPasskey(
                    username: username,
                    displayName: displayName
                )
                
                await MainActor.run {
                    self.setLoading(false)
                    self.showSuccess("Passkey created successfully!")
                }
                
            } catch {
                await MainActor.run {
                    self.setLoading(false)
                    self.showError(error.localizedDescription)
                }
            }
        }
    }
    
    private func setLoading(_ loading: Bool) {
        registerButton.isEnabled = !loading
        usernameTextField.isEnabled = !loading
        displayNameTextField.isEnabled = !loading
        
        if loading {
            activityIndicator.isHidden = false
            activityIndicator.startAnimating()
            registerButton.setTitle("Creating Passkey...", for: .normal)
        } else {
            activityIndicator.isHidden = true
            activityIndicator.stopAnimating()
            registerButton.setTitle("Create Passkey", for: .normal)
        }
    }
    
    private func showError(_ message: String) {
        errorLabel.text = message
        errorLabel.textColor = .systemRed
        errorLabel.isHidden = false
    }
    
    private func clearError() {
        errorLabel.isHidden = true
    }
    
    private func showSuccess(_ message: String) {
        let alert = UIAlertController(title: "Success", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            self.navigationController?.popViewController(animated: true)
        })
        present(alert, animated: true)
    }
}
```

## **🔧 Error Handling**

### **Comprehensive Error Handling**

```swift
enum AuthError: Error, LocalizedError {
    case notSupported
    case cancelled
    case networkError(String)
    case invalidChallenge
    case noCredentials
    case serverError(Int, String)
    case unknown(String)
    
    var errorDescription: String? {
        switch self {
        case .notSupported:
            return "Passkeys are not supported on this device. Please update to iOS 16+ or use an alternative sign-in method."
        case .cancelled:
            return "Passkey authentication was cancelled. Please try again."
        case .networkError(let message):
            return "Network error: \(message). Please check your internet connection and try again."
        case .invalidChallenge:
            return "Invalid authentication request. Please try again."
        case .noCredentials:
            return "No passkeys found for this account. Please create a passkey first."
        case .serverError(let code, let message):
            return "Server error (\(code)): \(message)"
        case .unknown(let message):
            return "An unexpected error occurred: \(message)"
        }
    }
}

extension PasskeymeSDK {
    static func handleError(_ error: Error) -> AuthError {
        if let authError = error as? AuthError {
            return authError
        }
        
        // Handle ASAuthorizationError
        if let asError = error as? ASAuthorizationError {
            switch asError.code {
            case .canceled:
                return .cancelled
            case .invalidResponse:
                return .invalidChallenge
            case .notHandled:
                return .notSupported
            case .failed:
                return .unknown("Authentication failed")
            default:
                return .unknown(asError.localizedDescription)
            }
        }
        
        // Handle network errors
        if let urlError = error as? URLError {
            return .networkError(urlError.localizedDescription)
        }
        
        return .unknown(error.localizedDescription)
    }
}
```

## **📊 Usage Analytics**

### **Track Passkey Events**

```swift
extension AuthenticationManager {
    private func trackEvent(_ event: String, parameters: [String: Any] = [:]) {
        // Add your analytics tracking here
        print("📊 Analytics: \(event) - \(parameters)")
    }
    
    func registerPasskey(username: String, displayName: String) async throws -> User {
        trackEvent("passkey_registration_started", parameters: [
            "has_username": !username.isEmpty,
            "has_display_name": !displayName.isEmpty
        ])
        
        do {
            let user = try await performRegistration(username: username, displayName: displayName)
            
            trackEvent("passkey_registration_success", parameters: [
                "user_id": user.id,
                "username": username
            ])
            
            return user
        } catch {
            trackEvent("passkey_registration_failed", parameters: [
                "error_type": String(describing: type(of: error)),
                "error_message": error.localizedDescription
            ])
            throw error
        }
    }
    
    func authenticateWithPasskey(username: String?) async throws -> User {
        trackEvent("passkey_authentication_started", parameters: [
            "has_username": username != nil
        ])
        
        do {
            let user = try await performAuthentication(username: username)
            
            trackEvent("passkey_authentication_success", parameters: [
                "user_id": user.id,
                "username": user.username
            ])
            
            return user
        } catch {
            trackEvent("passkey_authentication_failed", parameters: [
                "error_type": String(describing: type(of: error)),
                "error_message": error.localizedDescription
            ])
            throw error
        }
    }
}
```

## **🧪 Testing Integration**

### **Unit Tests**

```swift
import XCTest
@testable import YourApp

class PasskeyAuthenticationTests: XCTestCase {
    var authManager: AuthenticationManager!
    
    override func setUp() {
        super.setUp()
        authManager = AuthenticationManager()
    }
    
    override func tearDown() {
        authManager = nil
        super.tearDown()
    }
    
    func testPasskeySupport() {
        let isSupported = authManager.checkPasskeySupport()
        // This will depend on the test device/simulator
        XCTAssertNotNil(isSupported)
    }
    
    func testRegistrationFlow() async throws {
        // Mock the network calls for testing
        // Test the registration flow
        let expectation = XCTestExpectation(description: "Registration completed")
        
        Task {
            do {
                let user = try await authManager.registerPasskey(
                    username: "test@example.com",
                    displayName: "Test User"
                )
                XCTAssertEqual(user.username, "test@example.com")
                expectation.fulfill()
            } catch {
                XCTFail("Registration failed: \(error)")
            }
        }
        
        await fulfillment(of: [expectation], timeout: 10.0)
    }
}
```

## **📋 Data Models**

### **Request/Response Models**

```swift
// Registration models
struct RegistrationChallengeRequest: Codable {
    let username: String
    let displayName: String
}

struct RegistrationChallenge: Codable {
    let challenge: String
    let rp: RelyingParty
    let user: UserInfo
    let pubKeyCredParams: [PublicKeyCredentialParameters]
    let timeout: TimeInterval?
    let attestation: String
    let authenticatorSelection: AuthenticatorSelectionCriteria?
    let excludeCredentials: [PublicKeyCredentialDescriptor]?
}

struct CompleteRegistrationRequest: Codable {
    let credential: PasskeyCredential
    let username: String
}

// Authentication models
struct AuthenticationChallengeRequest: Codable {
    let username: String?
}

struct AuthenticationChallenge: Codable {
    let challenge: String
    let rpId: String?
    let allowCredentials: [PublicKeyCredentialDescriptor]?
    let timeout: TimeInterval?
    let userVerification: String
}

struct CompleteAuthenticationRequest: Codable {
    let assertion: PasskeyAssertion
    let username: String?
}

// User model
struct User: Codable {
    let id: String
    let username: String
    let displayName: String
    let email: String?
    let createdAt: Date
}
```

:::tip Next Steps
Once SDK integration is complete:
1. **[Security Best Practices](/docs/sdks/ios/security)** - Implement secure patterns
2. **[API Reference](/docs/sdks/ios/api-reference)** - Detailed SDK documentation
3. Test your integration thoroughly on physical devices
:::

The iOS SDK integration provides a robust foundation for passkey authentication in your app. Follow the security best practices guide to ensure your implementation is production-ready!

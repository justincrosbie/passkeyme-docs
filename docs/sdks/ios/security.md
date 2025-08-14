---
id: security
title: Security Best Practices
sidebar_label: Security
description: Essential security best practices for iOS passkey implementation
keywords: [ios, security, passkey, webauthn, best practices, apple-app-site-association, keychain]
---

# 🔒 **Security Best Practices**

This guide outlines essential security practices for implementing passkey authentication in iOS applications using the PasskeymeSDK.

:::danger Security First
Proper security implementation is critical for passkey authentication. Following these practices ensures your users' credentials remain secure and your application meets industry standards.
:::

## **🛡️ apple-app-site-association Security**

### **Secure Association File Configuration**

```json
{
  "webcredentials": {
    "apps": [
      "ABC123DEF4.com.yourcompany.yourapp"
    ]
  }
}
```

:::warning Certificate Management
- **Never** include development App IDs in production association files
- **Always** use separate domains for development and production
- **Regularly** rotate certificates and update association files accordingly
- **Validate** App ID format: `TEAM_ID.BUNDLE_ID`
:::

### **Association File Validation**

```swift
class AssociationValidator {
    static func validateAssociationFile(for domain: String) async -> Bool {
        guard let url = URL(string: "https://\(domain)/.well-known/apple-app-site-association") else {
            return false
        }
        
        do {
            let (data, response) = try await URLSession.shared.data(from: url)
            
            guard let httpResponse = response as? HTTPURLResponse,
                  httpResponse.statusCode == 200 else {
                return false
            }
            
            // Validate JSON structure
            let json = try JSONSerialization.jsonObject(with: data) as? [String: Any]
            let webcredentials = json?["webcredentials"] as? [String: Any]
            let apps = webcredentials?["apps"] as? [String]
            
            // Check if our App ID is present
            let expectedAppID = "\(getTeamID()).\(getBundleID())"
            return apps?.contains(expectedAppID) ?? false
            
        } catch {
            print("Association file validation failed: \(error)")
            return false
        }
    }
    
    private static func getTeamID() -> String {
        // Extract Team ID from app's provisioning profile
        guard let provisioningProfile = Bundle.main.path(forResource: "embedded", ofType: "mobileprovision"),
              let profileData = NSData(contentsOfFile: provisioningProfile) else {
            return ""
        }
        
        // Parse provisioning profile to extract Team ID
        // This is a simplified example - implement proper parsing
        return "ABC123DEF4"
    }
    
    private static func getBundleID() -> String {
        return Bundle.main.bundleIdentifier ?? ""
    }
}
```

### **Content Security**

```swift
class SecureWebConfiguration {
    static func configureSecureWebView(_ webView: WKWebView) {
        let configuration = webView.configuration
        
        // Disable JavaScript if not needed
        configuration.preferences.javaScriptEnabled = false
        
        // Configure secure content
        let contentController = WKUserContentController()
        
        // Block insecure content
        let securityScript = """
            // Block mixed content
            document.addEventListener('DOMContentLoaded', function() {
                const links = document.querySelectorAll('a[href^="http:"]');
                links.forEach(link => link.remove());
            });
        """
        
        let userScript = WKUserScript(
            source: securityScript,
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: true
        )
        
        contentController.addUserScript(userScript)
        configuration.userContentController = contentController
    }
}
```

## **🔐 Secure SDK Configuration**

### **Production-Ready SDK Setup**

```swift
class SecureAuthenticationManager {
    private let apiBaseURL: String
    private let isDevelopment: Bool
    
    init(apiBaseURL: String, isDevelopment: Bool = false) {
        self.apiBaseURL = apiBaseURL
        self.isDevelopment = isDevelopment
        
        // Validate configuration
        validateSecurityConfiguration()
        
        // Configure SDK
        PasskeymeSDK.configure(
            debug: isDevelopment, // Only enable debug in development
            timeout: isDevelopment ? 120.0 : 60.0 // Shorter timeout in production
        )
    }
    
    private func validateSecurityConfiguration() {
        // Ensure HTTPS for API calls
        guard apiBaseURL.hasPrefix("https://") else {
            fatalError("API base URL must use HTTPS")
        }
        
        // Validate development mode only in debug builds
        #if !DEBUG
        guard !isDevelopment else {
            fatalError("Development mode should not be enabled in release builds")
        }
        #endif
        
        // Validate Associated Domains configuration
        validateAssociatedDomains()
    }
    
    private func validateAssociatedDomains() {
        guard let entitlements = Bundle.main.entitlements,
              let domains = entitlements["com.apple.developer.associated-domains"] as? [String] else {
            print("⚠️ Warning: No Associated Domains configured")
            return
        }
        
        let webcredentialDomains = domains.filter { $0.hasPrefix("webcredentials:") }
        guard !webcredentialDomains.isEmpty else {
            print("⚠️ Warning: No webcredential domains configured")
            return
        }
        
        print("✅ Associated Domains configured: \(webcredentialDomains)")
    }
}

extension Bundle {
    var entitlements: [String: Any]? {
        guard let path = self.path(forResource: "Entitlements", ofType: "plist"),
              let plist = NSDictionary(contentsOfFile: path) as? [String: Any] else {
            return nil
        }
        return plist
    }
}
```

### **Network Security**

```swift
class SecureNetworkManager {
    private let session: URLSession
    
    init() {
        // Configure secure URL session
        let configuration = URLSessionConfiguration.default
        
        // Security headers
        configuration.httpAdditionalHeaders = [
            "User-Agent": createSecureUserAgent(),
            "X-Requested-With": "PasskeymeSDK",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache"
        ]
        
        // Timeout configuration
        configuration.timeoutIntervalForRequest = 30.0
        configuration.timeoutIntervalForResource = 60.0
        
        // Certificate pinning (implement based on your needs)
        self.session = URLSession(
            configuration: configuration,
            delegate: SecureURLSessionDelegate(),
            delegateQueue: nil
        )
    }
    
    func secureRequest<T: Codable>(
        url: URL,
        method: HTTPMethod,
        body: T? = nil,
        responseType: T.Type
    ) async throws -> T {
        var request = URLRequest(url: url)
        request.httpMethod = method.rawValue
        
        // Add security headers
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        
        // Add request body if provided
        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }
        
        // Validate request
        try validateRequest(request)
        
        // Execute request
        let (data, response) = try await session.data(for: request)
        
        // Validate response
        try validateResponse(response, data: data)
        
        // Decode and return
        return try JSONDecoder().decode(responseType, from: data)
    }
    
    private func validateRequest(_ request: URLRequest) throws {
        guard let url = request.url,
              url.scheme == "https" else {
            throw SecurityError.insecureConnection
        }
        
        guard let body = request.httpBody,
              body.count <= 10_240 else { // 10KB limit
            throw SecurityError.requestTooLarge
        }
    }
    
    private func validateResponse(_ response: URLResponse, data: Data) throws {
        guard let httpResponse = response as? HTTPURLResponse else {
            throw SecurityError.invalidResponse
        }
        
        guard 200...299 ~= httpResponse.statusCode else {
            throw SecurityError.httpError(httpResponse.statusCode)
        }
        
        guard data.count <= 102_400 else { // 100KB limit
            throw SecurityError.responseTooLarge
        }
        
        // Validate security headers
        validateSecurityHeaders(httpResponse)
    }
    
    private func validateSecurityHeaders(_ response: HTTPURLResponse) {
        let requiredHeaders = [
            "Strict-Transport-Security",
            "X-Content-Type-Options",
            "X-Frame-Options"
        ]
        
        for header in requiredHeaders {
            if response.value(forHTTPHeaderField: header) == nil {
                print("⚠️ Warning: Missing security header: \(header)")
            }
        }
    }
    
    private func createSecureUserAgent() -> String {
        let appVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "1.0"
        let osVersion = UIDevice.current.systemVersion
        let deviceModel = UIDevice.current.model
        
        return "PasskeymeSDK/1.0.0 (\(deviceModel); iOS \(osVersion)) App/\(appVersion)"
    }
}

class SecureURLSessionDelegate: NSObject, URLSessionDelegate {
    func urlSession(
        _ session: URLSession,
        didReceive challenge: URLAuthenticationChallenge,
        completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void
    ) {
        // Implement certificate pinning here
        guard challenge.protectionSpace.authenticationMethod == NSURLAuthenticationMethodServerTrust else {
            completionHandler(.performDefaultHandling, nil)
            return
        }
        
        // For production, implement proper certificate pinning
        // This is a simplified example
        completionHandler(.performDefaultHandling, nil)
    }
}

enum HTTPMethod: String {
    case GET = "GET"
    case POST = "POST"
    case PUT = "PUT"
    case DELETE = "DELETE"
}

enum SecurityError: Error, LocalizedError {
    case insecureConnection
    case requestTooLarge
    case responseTooLarge
    case invalidResponse
    case httpError(Int)
    case certificateValidationFailed
    
    var errorDescription: String? {
        switch self {
        case .insecureConnection:
            return "Insecure connection attempted"
        case .requestTooLarge:
            return "Request payload too large"
        case .responseTooLarge:
            return "Response payload too large"
        case .invalidResponse:
            return "Invalid response received"
        case .httpError(let code):
            return "HTTP error: \(code)"
        case .certificateValidationFailed:
            return "Certificate validation failed"
        }
    }
}
```

## **🔑 Credential Storage Security**

### **Secure Local Storage**

```swift
import Security

class SecureCredentialStorage {
    private let service = "com.yourapp.passkeyme"
    private let accessGroup: String?
    
    init(accessGroup: String? = nil) {
        self.accessGroup = accessGroup
    }
    
    func storeUserSession(_ session: UserSession) throws {
        // Never store passkey credentials locally
        // Only store minimal session information
        
        let sessionData = try JSONEncoder().encode(session)
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: session.userId,
            kSecValueData as String: sessionData,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ]
        
        // Add access group if specified
        if let accessGroup = accessGroup {
            (query as NSMutableDictionary)[kSecAttrAccessGroup as String] = accessGroup
        }
        
        // Delete existing item
        SecItemDelete(query as CFDictionary)
        
        // Add new item
        let status = SecItemAdd(query as CFDictionary, nil)
        
        guard status == errSecSuccess else {
            throw KeychainError.storeFailed(status)
        }
    }
    
    func getUserSession(for userId: String) throws -> UserSession? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: userId,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        guard status == errSecSuccess,
              let data = result as? Data else {
            if status == errSecItemNotFound {
                return nil
            }
            throw KeychainError.retrieveFailed(status)
        }
        
        let session = try JSONDecoder().decode(UserSession.self, from: data)
        
        // Validate session expiry
        guard session.isValid else {
            try deleteUserSession(for: userId)
            return nil
        }
        
        return session
    }
    
    func deleteUserSession(for userId: String) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: userId
        ]
        
        let status = SecItemDelete(query as CFDictionary)
        
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw KeychainError.deleteFailed(status)
        }
    }
    
    func clearAllSessions() throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service
        ]
        
        let status = SecItemDelete(query as CFDictionary)
        
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw KeychainError.deleteFailed(status)
        }
    }
}

struct UserSession: Codable {
    let userId: String
    let sessionToken: String
    let expiresAt: Date
    let createdAt: Date
    
    init(userId: String, sessionToken: String, expirationInterval: TimeInterval = 24 * 60 * 60) {
        self.userId = userId
        self.sessionToken = sessionToken
        self.createdAt = Date()
        self.expiresAt = Date().addingTimeInterval(expirationInterval)
    }
    
    var isValid: Bool {
        return Date() < expiresAt
    }
}

enum KeychainError: Error, LocalizedError {
    case storeFailed(OSStatus)
    case retrieveFailed(OSStatus)
    case deleteFailed(OSStatus)
    
    var errorDescription: String? {
        switch self {
        case .storeFailed(let status):
            return "Failed to store in keychain: \(status)"
        case .retrieveFailed(let status):
            return "Failed to retrieve from keychain: \(status)"
        case .deleteFailed(let status):
            return "Failed to delete from keychain: \(status)"
        }
    }
}
```

### **Biometric Protection**

```swift
import LocalAuthentication

class BiometricSecurityManager {
    func isBiometricAvailable() -> BiometricStatus {
        let context = LAContext()
        var error: NSError?
        
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
            if let laError = error as? LAError {
                switch laError.code {
                case .biometryNotAvailable:
                    return .notAvailable
                case .biometryNotEnrolled:
                    return .notEnrolled
                case .biometryLockout:
                    return .lockedOut
                default:
                    return .notAvailable
                }
            }
            return .notAvailable
        }
        
        return .available(context.biometryType)
    }
    
    func authenticateWithBiometric(reason: String) async throws -> Bool {
        let context = LAContext()
        
        // Configure context
        context.localizedFallbackTitle = "Use Passcode"
        context.localizedCancelTitle = "Cancel"
        
        do {
            let result = try await context.evaluatePolicy(
                .deviceOwnerAuthenticationWithBiometrics,
                localizedReason: reason
            )
            return result
        } catch let error as LAError {
            switch error.code {
            case .userCancel, .userFallback:
                throw BiometricError.cancelled
            case .biometryLockout:
                throw BiometricError.lockedOut
            case .biometryNotAvailable:
                throw BiometricError.notAvailable
            case .biometryNotEnrolled:
                throw BiometricError.notEnrolled
            default:
                throw BiometricError.failed(error.localizedDescription)
            }
        }
    }
}

enum BiometricStatus {
    case available(LABiometryType)
    case notAvailable
    case notEnrolled
    case lockedOut
    
    var canUseBiometric: Bool {
        if case .available = self { return true }
        return false
    }
    
    var description: String {
        switch self {
        case .available(let type):
            switch type {
            case .faceID:
                return "Face ID is available"
            case .touchID:
                return "Touch ID is available"
            case .opticID:
                return "Optic ID is available"
            @unknown default:
                return "Biometric authentication is available"
            }
        case .notAvailable:
            return "Biometric authentication is not available"
        case .notEnrolled:
            return "No biometric data enrolled"
        case .lockedOut:
            return "Biometric authentication is locked out"
        }
    }
}

enum BiometricError: Error, LocalizedError {
    case cancelled
    case lockedOut
    case notAvailable
    case notEnrolled
    case failed(String)
    
    var errorDescription: String? {
        switch self {
        case .cancelled:
            return "Biometric authentication was cancelled"
        case .lockedOut:
            return "Biometric authentication is locked out. Please use your passcode."
        case .notAvailable:
            return "Biometric authentication is not available on this device"
        case .notEnrolled:
            return "No biometric data is enrolled. Please set up Face ID or Touch ID."
        case .failed(let message):
            return "Biometric authentication failed: \(message)"
        }
    }
}
```

## **📊 Security Monitoring**

### **Security Event Logging**

```swift
class SecurityMonitor {
    private let storage = SecureCredentialStorage()
    
    func logSecurityEvent(_ event: SecurityEvent) {
        let logEntry = SecurityLogEntry(
            id: UUID().uuidString,
            timestamp: Date(),
            event: event,
            deviceInfo: collectDeviceInfo(),
            appInfo: collectAppInfo()
        )
        
        // Store securely
        storeSecurityLog(logEntry)
        
        // Send to analytics (with privacy considerations)
        sendToAnalytics(event)
        
        // Alert on critical events
        if event.isCritical {
            alertSecurityTeam(event)
        }
    }
    
    private func collectDeviceInfo() -> DeviceInfo {
        return DeviceInfo(
            model: UIDevice.current.model,
            systemVersion: UIDevice.current.systemVersion,
            isJailbroken: isDeviceJailbroken(),
            biometricType: BiometricSecurityManager().isBiometricAvailable().description
        )
    }
    
    private func collectAppInfo() -> AppInfo {
        let bundle = Bundle.main
        return AppInfo(
            version: bundle.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "Unknown",
            build: bundle.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "Unknown",
            bundleId: bundle.bundleIdentifier ?? "Unknown"
        )
    }
    
    private func isDeviceJailbroken() -> Bool {
        // Basic jailbreak detection
        let jailbreakPaths = [
            "/Applications/Cydia.app",
            "/usr/sbin/sshd",
            "/bin/bash",
            "/etc/apt",
            "/private/var/lib/apt"
        ]
        
        for path in jailbreakPaths {
            if FileManager.default.fileExists(atPath: path) {
                return true
            }
        }
        
        // Check if app can write to system directories
        let testPath = "/private/test_jailbreak"
        do {
            try "test".write(toFile: testPath, atomically: true, encoding: .utf8)
            try FileManager.default.removeItem(atPath: testPath)
            return true
        } catch {
            return false
        }
    }
    
    private func storeSecurityLog(_ entry: SecurityLogEntry) {
        // Implement secure local logging
        print("🔒 Security Log: \(entry.event.type) - \(entry.timestamp)")
    }
    
    private func sendToAnalytics(_ event: SecurityEvent) {
        // Send sanitized event data to analytics
        let sanitizedData = [
            "event_type": event.type.rawValue,
            "severity": event.severity.rawValue,
            "timestamp": ISO8601DateFormatter().string(from: Date())
        ]
        
        // Your analytics implementation
        print("📊 Analytics: \(sanitizedData)")
    }
    
    private func alertSecurityTeam(_ event: SecurityEvent) {
        // Implement security alerting
        print("🚨 Critical Security Event: \(event.type)")
    }
}

struct SecurityEvent {
    let type: SecurityEventType
    let severity: SecuritySeverity
    let metadata: [String: Any]
    
    var isCritical: Bool {
        return severity == .critical
    }
}

enum SecurityEventType: String, CaseIterable {
    case passkeyRegistrationStarted = "passkey_registration_started"
    case passkeyRegistrationSuccess = "passkey_registration_success"
    case passkeyRegistrationFailed = "passkey_registration_failed"
    case passkeyAuthenticationStarted = "passkey_authentication_started"
    case passkeyAuthenticationSuccess = "passkey_authentication_success"
    case passkeyAuthenticationFailed = "passkey_authentication_failed"
    case biometricAuthenticationStarted = "biometric_authentication_started"
    case biometricAuthenticationSuccess = "biometric_authentication_success"
    case biometricAuthenticationFailed = "biometric_authentication_failed"
    case jailbreakDetected = "jailbreak_detected"
    case associationFileValidationFailed = "association_file_validation_failed"
    case insecureConnectionAttempt = "insecure_connection_attempt"
    case sessionExpired = "session_expired"
    case unauthorizedAccessAttempt = "unauthorized_access_attempt"
}

enum SecuritySeverity: String {
    case info = "info"
    case warning = "warning"
    case error = "error"
    case critical = "critical"
}

struct SecurityLogEntry {
    let id: String
    let timestamp: Date
    let event: SecurityEvent
    let deviceInfo: DeviceInfo
    let appInfo: AppInfo
}

struct DeviceInfo {
    let model: String
    let systemVersion: String
    let isJailbroken: Bool
    let biometricType: String
}

struct AppInfo {
    let version: String
    let build: String
    let bundleId: String
}
```

## **🧪 Security Testing**

### **Security Test Suite**

```swift
import XCTest
@testable import YourApp

class SecurityTests: XCTestCase {
    var authManager: SecureAuthenticationManager!
    var securityMonitor: SecurityMonitor!
    
    override func setUp() {
        super.setUp()
        authManager = SecureAuthenticationManager(
            apiBaseURL: "https://test-api.example.com",
            isDevelopment: true
        )
        securityMonitor = SecurityMonitor()
    }
    
    func testAssociationFileValidation() async {
        let isValid = await AssociationValidator.validateAssociationFile(for: "example.com")
        // This will depend on your test setup
        XCTAssertNotNil(isValid)
    }
    
    func testSecureNetworkManager() async throws {
        let networkManager = SecureNetworkManager()
        
        // Test HTTPS enforcement
        XCTAssertThrowsError(try {
            let insecureURL = URL(string: "http://example.com")!
            var request = URLRequest(url: insecureURL)
            try networkManager.validateRequest(request)
        }())
    }
    
    func testBiometricSecurity() {
        let biometricManager = BiometricSecurityManager()
        let status = biometricManager.isBiometricAvailable()
        
        XCTAssertNotNil(status)
        // Test will depend on simulator/device capabilities
    }
    
    func testSecureStorage() throws {
        let storage = SecureCredentialStorage()
        let session = UserSession(
            userId: "test-user",
            sessionToken: "test-token"
        )
        
        try storage.storeUserSession(session)
        let retrievedSession = try storage.getUserSession(for: "test-user")
        
        XCTAssertNotNil(retrievedSession)
        XCTAssertEqual(retrievedSession?.userId, "test-user")
        
        try storage.deleteUserSession(for: "test-user")
        let deletedSession = try storage.getUserSession(for: "test-user")
        XCTAssertNil(deletedSession)
    }
    
    func testSecurityEventLogging() {
        let monitor = SecurityMonitor()
        let event = SecurityEvent(
            type: .passkeyAuthenticationSuccess,
            severity: .info,
            metadata: ["test": "value"]
        )
        
        XCTAssertNoThrow(monitor.logSecurityEvent(event))
    }
    
    func testJailbreakDetection() {
        let monitor = SecurityMonitor()
        // This test will vary based on device
        // In simulator, jailbreak detection should return false
        XCTAssertNotNil(monitor.isDeviceJailbroken())
    }
}
```

## **📋 Security Checklist**

### **Pre-Production Security Audit**

- [ ] **apple-app-site-association**
  - [ ] Association file properly configured for production domain
  - [ ] Development App IDs removed from production association files
  - [ ] File accessible at `/.well-known/apple-app-site-association`
  - [ ] App ID format validated: `TEAM_ID.BUNDLE_ID`
  - [ ] Content-Type header set correctly

- [ ] **Associated Domains**
  - [ ] Associated Domains capability added in Xcode
  - [ ] Correct domain format: `webcredentials:your-domain.com`
  - [ ] Development mode parameter removed for production
  - [ ] Multiple domains configured if needed

- [ ] **Network Security**
  - [ ] All API calls use HTTPS
  - [ ] Certificate pinning implemented (if required)
  - [ ] Proper SSL/TLS configuration
  - [ ] Request/response validation implemented
  - [ ] Security headers validated

- [ ] **Data Protection**
  - [ ] No sensitive data in logs
  - [ ] Keychain storage for session data
  - [ ] No hardcoded secrets in code
  - [ ] Proper session timeout handling
  - [ ] Jailbreak detection implemented

- [ ] **Biometric Security**
  - [ ] Biometric authentication properly configured
  - [ ] Fallback authentication methods available
  - [ ] Proper error handling for biometric failures
  - [ ] LocalAuthentication framework correctly implemented

- [ ] **Code Security**
  - [ ] Code obfuscation in place (if required)
  - [ ] Debug mode disabled in production
  - [ ] Input validation implemented
  - [ ] Error messages don't leak sensitive information
  - [ ] Anti-debugging measures (if required)

- [ ] **Monitoring & Logging**
  - [ ] Security event logging implemented
  - [ ] Anomaly detection configured
  - [ ] Proper log sanitization
  - [ ] Security incident response plan

:::tip Security Reviews
Conduct regular security reviews and penetration testing of your passkey implementation. Consider engaging security professionals for comprehensive audits before production deployment.
:::

Following these security best practices ensures your iOS passkey implementation maintains the highest standards of security and user trust. Security is not a one-time configuration but an ongoing commitment to protecting user credentials and data.

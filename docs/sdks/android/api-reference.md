---
id: api-reference
title: API Reference
sidebar_label: API Reference
description: Complete Android SDK API documentation with methods, classes, and examples
keywords: [android, api, reference, passkey, webauthn, sdk, methods]
---

# 📚 **API Reference**

Complete reference documentation for the Passkeyme Android SDK. This guide covers all classes, methods, and data structures available in the SDK.

## **🚀 PasskeymeSDK**

The main SDK class for passkey operations.

### **Constructor**

```kotlin
class PasskeymeSDK(
    context: Context,
    debug: Boolean = false,
    timeout: Long = 60_000L,
    enableBiometricFallback: Boolean = true
)
```

**Parameters:**
- `context: Context` - Android application context
- `debug: Boolean` - Enable debug logging (default: false)
- `timeout: Long` - Operation timeout in milliseconds (default: 60 seconds)
- `enableBiometricFallback: Boolean` - Enable biometric fallback for authentication (default: true)

### **Methods**

#### **isSupported()**
```kotlin
suspend fun isSupported(): Boolean
```

Checks if passkeys are supported on the current device.

**Returns:** `Boolean` - true if passkeys are supported

**Example:**
```kotlin
val isSupported = passkeymeSDK.isSupported()
if (isSupported) {
    // Proceed with passkey implementation
} else {
    // Fallback to alternative authentication
}
```

#### **isPlatformAuthenticatorAvailable()**
```kotlin
suspend fun isPlatformAuthenticatorAvailable(): Boolean
```

Checks if platform authenticator (biometric/PIN) is available.

**Returns:** `Boolean` - true if platform authenticator is available

**Example:**
```kotlin
val isAvailable = passkeymeSDK.isPlatformAuthenticatorAvailable()
```

#### **register()**
```kotlin
suspend fun register(
    username: String,
    displayName: String,
    challenge: String,
    rp: RelyingParty,
    user: UserInfo,
    pubKeyCredParams: List<PublicKeyCredentialParameters>,
    timeout: Long? = null,
    attestation: AttestationConveyancePreference = AttestationConveyancePreference.NONE,
    authenticatorSelection: AuthenticatorSelectionCriteria? = null,
    excludeCredentials: List<PublicKeyCredentialDescriptor>? = null
): PasskeyResult<PasskeyCredential>
```

Registers a new passkey for the user.

**Parameters:**
- `username: String` - User's unique identifier (usually email)
- `displayName: String` - User's display name
- `challenge: String` - Base64URL-encoded challenge from server
- `rp: RelyingParty` - Relying party information
- `user: UserInfo` - User information
- `pubKeyCredParams: List<PublicKeyCredentialParameters>` - Supported key algorithms
- `timeout: Long?` - Operation timeout (optional)
- `attestation: AttestationConveyancePreference` - Attestation preference
- `authenticatorSelection: AuthenticatorSelectionCriteria?` - Authenticator selection criteria
- `excludeCredentials: List<PublicKeyCredentialDescriptor>?` - Credentials to exclude

**Returns:** `PasskeyResult<PasskeyCredential>` - Registration result

**Example:**
```kotlin
val result = passkeymeSDK.register(
    username = "user@example.com",
    displayName = "John Doe",
    challenge = "base64url-challenge",
    rp = RelyingParty(
        id = "example.com",
        name = "Example App"
    ),
    user = UserInfo(
        id = "user-id-base64url",
        name = "user@example.com",
        displayName = "John Doe"
    ),
    pubKeyCredParams = listOf(
        PublicKeyCredentialParameters(
            type = "public-key",
            alg = -7 // ES256
        )
    )
)

if (result.success && result.credential != null) {
    // Registration successful
    val credential = result.credential
} else {
    // Handle error
    val error = result.error
}
```

#### **authenticate()**
```kotlin
suspend fun authenticate(
    username: String? = null,
    challenge: String,
    rpId: String? = null,
    allowCredentials: List<PublicKeyCredentialDescriptor>? = null,
    timeout: Long? = null,
    userVerification: UserVerificationRequirement = UserVerificationRequirement.PREFERRED
): PasskeyResult<PasskeyAssertion>
```

Authenticates user with existing passkey.

**Parameters:**
- `username: String?` - Optional username hint
- `challenge: String` - Base64URL-encoded challenge from server
- `rpId: String?` - Relying party identifier
- `allowCredentials: List<PublicKeyCredentialDescriptor>?` - Allowed credentials
- `timeout: Long?` - Operation timeout
- `userVerification: UserVerificationRequirement` - User verification requirement

**Returns:** `PasskeyResult<PasskeyAssertion>` - Authentication result

**Example:**
```kotlin
val result = passkeymeSDK.authenticate(
    username = "user@example.com", // Optional
    challenge = "base64url-challenge",
    rpId = "example.com",
    userVerification = UserVerificationRequirement.REQUIRED
)

if (result.success && result.assertion != null) {
    // Authentication successful
    val assertion = result.assertion
} else {
    // Handle error
    val error = result.error
}
```

## **📊 Data Classes**

### **PasskeyResult&lt;T&gt;**

Generic result wrapper for passkey operations.

```kotlin
data class PasskeyResult<T>(
    val success: Boolean,
    val data: T? = null,
    val error: String? = null,
    val errorCode: PasskeyErrorCode? = null
) {
    // For registration results
    val credential: PasskeyCredential? get() = data as? PasskeyCredential
    
    // For authentication results
    val assertion: PasskeyAssertion? get() = data as? PasskeyAssertion
}
```

**Properties:**
- `success: Boolean` - Operation success status
- `data: T?` - Result data (credential or assertion)
- `error: String?` - Error message if operation failed
- `errorCode: PasskeyErrorCode?` - Specific error code

### **PasskeyCredential**

Represents a newly created passkey credential.

```kotlin
data class PasskeyCredential(
    val id: String,
    val rawId: String,
    val type: String = "public-key",
    val response: AuthenticatorAttestationResponse,
    val authenticatorAttachment: String? = null,
    val clientExtensionResults: Map<String, Any> = emptyMap()
) {
    fun toJson(): JSONObject
    fun toBase64(): String
}
```

**Properties:**
- `id: String` - Base64URL-encoded credential ID
- `rawId: String` - Raw credential ID
- `type: String` - Credential type (always "public-key")
- `response: AuthenticatorAttestationResponse` - Attestation response
- `authenticatorAttachment: String?` - Authenticator attachment modality
- `clientExtensionResults: Map<String, Any>` - Extension results

### **PasskeyAssertion**

Represents an authentication assertion.

```kotlin
data class PasskeyAssertion(
    val id: String,
    val rawId: String,
    val type: String = "public-key",
    val response: AuthenticatorAssertionResponse,
    val authenticatorAttachment: String? = null,
    val clientExtensionResults: Map<String, Any> = emptyMap()
) {
    fun toJson(): JSONObject
    fun toBase64(): String
}
```

**Properties:**
- `id: String` - Base64URL-encoded credential ID
- `rawId: String` - Raw credential ID
- `type: String` - Credential type (always "public-key")
- `response: AuthenticatorAssertionResponse` - Assertion response
- `authenticatorAttachment: String?` - Authenticator attachment modality
- `clientExtensionResults: Map<String, Any>` - Extension results

### **AuthenticatorAttestationResponse**

Response from authenticator during registration.

```kotlin
data class AuthenticatorAttestationResponse(
    val clientDataJSON: String,
    val attestationObject: String,
    val transports: List<String>? = null
) {
    fun getClientData(): ClientData
    fun getAttestationObject(): AttestationObject
}
```

**Properties:**
- `clientDataJSON: String` - Base64URL-encoded client data JSON
- `attestationObject: String` - Base64URL-encoded attestation object
- `transports: List<String>?` - Supported transports

### **AuthenticatorAssertionResponse**

Response from authenticator during authentication.

```kotlin
data class AuthenticatorAssertionResponse(
    val clientDataJSON: String,
    val authenticatorData: String,
    val signature: String,
    val userHandle: String? = null
) {
    fun getClientData(): ClientData
    fun getAuthenticatorData(): AuthenticatorData
}
```

**Properties:**
- `clientDataJSON: String` - Base64URL-encoded client data JSON
- `authenticatorData: String` - Base64URL-encoded authenticator data
- `signature: String` - Base64URL-encoded signature
- `userHandle: String?` - Base64URL-encoded user handle

### **RelyingParty**

Information about the relying party (your application).

```kotlin
data class RelyingParty(
    val id: String,
    val name: String,
    val icon: String? = null
)
```

**Properties:**
- `id: String` - Relying party identifier (domain)
- `name: String` - Human-readable name
- `icon: String?` - Optional icon URL

**Example:**
```kotlin
val rp = RelyingParty(
    id = "example.com",
    name = "Example Application",
    icon = "https://example.com/icon.png"
)
```

### **UserInfo**

Information about the user account.

```kotlin
data class UserInfo(
    val id: String,
    val name: String,
    val displayName: String,
    val icon: String? = null
)
```

**Properties:**
- `id: String` - Base64URL-encoded user ID
- `name: String` - User identifier (usually email)
- `displayName: String` - Human-readable display name
- `icon: String?` - Optional user icon URL

**Example:**
```kotlin
val user = UserInfo(
    id = Base64URL.encode("user-12345".toByteArray()),
    name = "user@example.com",
    displayName = "John Doe",
    icon = "https://example.com/users/johndoe.jpg"
)
```

### **PublicKeyCredentialParameters**

Supported public key algorithms.

```kotlin
data class PublicKeyCredentialParameters(
    val type: String = "public-key",
    val alg: Int
)
```

**Properties:**
- `type: String` - Credential type (always "public-key")
- `alg: Int` - COSE algorithm identifier

**Common Algorithms:**
```kotlin
// ES256 (recommended)
PublicKeyCredentialParameters(type = "public-key", alg = -7)

// RS256
PublicKeyCredentialParameters(type = "public-key", alg = -257)

// EdDSA
PublicKeyCredentialParameters(type = "public-key", alg = -8)
```

### **AuthenticatorSelectionCriteria**

Criteria for authenticator selection.

```kotlin
data class AuthenticatorSelectionCriteria(
    val authenticatorAttachment: AuthenticatorAttachment? = null,
    val requireResidentKey: Boolean = false,
    val residentKey: ResidentKeyRequirement = ResidentKeyRequirement.PREFERRED,
    val userVerification: UserVerificationRequirement = UserVerificationRequirement.PREFERRED
)
```

**Properties:**
- `authenticatorAttachment: AuthenticatorAttachment?` - Platform or cross-platform
- `requireResidentKey: Boolean` - Legacy resident key requirement
- `residentKey: ResidentKeyRequirement` - Resident key requirement
- `userVerification: UserVerificationRequirement` - User verification requirement

### **PublicKeyCredentialDescriptor**

Descriptor for existing credentials.

```kotlin
data class PublicKeyCredentialDescriptor(
    val type: String = "public-key",
    val id: String,
    val transports: List<AuthenticatorTransport>? = null
)
```

**Properties:**
- `type: String` - Credential type (always "public-key")
- `id: String` - Base64URL-encoded credential ID
- `transports: List<AuthenticatorTransport>?` - Supported transports

## **🏷️ Enums**

### **PasskeyErrorCode**

Error codes for passkey operations.

```kotlin
enum class PasskeyErrorCode {
    NOT_SUPPORTED,
    NOT_AVAILABLE,
    CANCELLED,
    TIMEOUT,
    NETWORK_ERROR,
    INVALID_STATE,
    CONSTRAINT_ERROR,
    DATA_ERROR,
    QUOTA_EXCEEDED,
    INVALID_CHALLENGE,
    UNKNOWN
}
```

### **AttestationConveyancePreference**

Attestation conveyance preferences.

```kotlin
enum class AttestationConveyancePreference {
    NONE,
    INDIRECT,
    DIRECT,
    ENTERPRISE
}
```

### **AuthenticatorAttachment**

Authenticator attachment modalities.

```kotlin
enum class AuthenticatorAttachment {
    PLATFORM,
    CROSS_PLATFORM
}
```

### **ResidentKeyRequirement**

Resident key requirements.

```kotlin
enum class ResidentKeyRequirement {
    DISCOURAGED,
    PREFERRED,
    REQUIRED
}
```

### **UserVerificationRequirement**

User verification requirements.

```kotlin
enum class UserVerificationRequirement {
    REQUIRED,
    PREFERRED,
    DISCOURAGED
}
```

### **AuthenticatorTransport**

Available authenticator transports.

```kotlin
enum class AuthenticatorTransport {
    USB,
    NFC,
    BLE,
    SMART_CARD,
    HYBRID,
    INTERNAL
}
```

## **⚠️ Exceptions**

### **PasskeymeError**

Base exception class for SDK errors.

```kotlin
sealed class PasskeymeError : Exception() {
    object NotSupported : PasskeymeError() {
        override val message = "Passkeys are not supported on this device"
    }
    
    object Cancelled : PasskeymeError() {
        override val message = "Operation was cancelled by user"
    }
    
    object Timeout : PasskeymeError() {
        override val message = "Operation timed out"
    }
    
    object NetworkError : PasskeymeError() {
        override val message = "Network error occurred"
    }
    
    object InvalidChallenge : PasskeymeError() {
        override val message = "Invalid challenge provided"
    }
    
    data class Failed(override val message: String) : PasskeymeError()
}
```

**Exception Handling:**
```kotlin
try {
    val result = passkeymeSDK.register(...)
    if (result.success) {
        // Handle success
    } else {
        // Handle failure
        when (result.errorCode) {
            PasskeyErrorCode.NOT_SUPPORTED -> {
                // Device doesn't support passkeys
            }
            PasskeyErrorCode.CANCELLED -> {
                // User cancelled operation
            }
            PasskeyErrorCode.TIMEOUT -> {
                // Operation timed out
            }
            else -> {
                // Other error
            }
        }
    }
} catch (e: PasskeymeError) {
    when (e) {
        is PasskeymeError.NotSupported -> {
            // Handle unsupported device
        }
        is PasskeymeError.Cancelled -> {
            // Handle user cancellation
        }
        is PasskeymeError.Failed -> {
            // Handle general failure
        }
        else -> {
            // Handle other errors
        }
    }
}
```

## **🔧 Utility Classes**

### **Base64URL**

Utility for Base64URL encoding/decoding.

```kotlin
object Base64URL {
    fun encode(data: ByteArray): String
    fun decode(encoded: String): ByteArray
    fun encodeToString(data: String): String
    fun decodeToString(encoded: String): String
}
```

**Example:**
```kotlin
val userId = "user-12345"
val encodedUserId = Base64URL.encodeToString(userId)
val decodedUserId = Base64URL.decodeToString(encodedUserId)
```

### **PasskeyUtils**

General utility functions for passkey operations.

```kotlin
object PasskeyUtils {
    fun generateChallenge(length: Int = 32): String
    fun validateDomain(domain: String): Boolean
    fun createOrigin(packageName: String, fingerprint: String): String
    fun isValidUserId(userId: String): Boolean
    fun sanitizeDisplayName(displayName: String): String
}
```

**Example:**
```kotlin
// Generate a secure challenge
val challenge = PasskeyUtils.generateChallenge()

// Validate domain format
val isValid = PasskeyUtils.validateDomain("example.com")

// Create Android origin URL
val origin = PasskeyUtils.createOrigin(
    packageName = "com.example.app",
    fingerprint = "AA:BB:CC:..."
)
```

## **📱 Integration Examples**

### **Complete Registration Flow**
```kotlin
class RegistrationManager(
    private val passkeymeSDK: PasskeymeSDK,
    private val apiClient: ApiClient
) {
    suspend fun registerWithPasskey(
        username: String,
        displayName: String
    ): User {
        // 1. Get challenge from server
        val challengeResponse = apiClient.getRegistrationChallenge(
            username = username,
            displayName = displayName
        )
        
        // 2. Register passkey
        val result = passkeymeSDK.register(
            username = username,
            displayName = displayName,
            challenge = challengeResponse.challenge,
            rp = challengeResponse.rp,
            user = challengeResponse.user,
            pubKeyCredParams = challengeResponse.pubKeyCredParams,
            authenticatorSelection = AuthenticatorSelectionCriteria(
                authenticatorAttachment = AuthenticatorAttachment.PLATFORM,
                residentKey = ResidentKeyRequirement.PREFERRED,
                userVerification = UserVerificationRequirement.REQUIRED
            )
        )
        
        if (!result.success || result.credential == null) {
            throw PasskeymeError.Failed(
                result.error ?: "Registration failed"
            )
        }
        
        // 3. Complete registration with server
        return apiClient.completeRegistration(
            credential = result.credential,
            username = username
        )
    }
}
```

### **Complete Authentication Flow**
```kotlin
class AuthenticationManager(
    private val passkeymeSDK: PasskeymeSDK,
    private val apiClient: ApiClient
) {
    suspend fun authenticateWithPasskey(
        username: String? = null
    ): User {
        // 1. Get challenge from server
        val challengeResponse = apiClient.getAuthenticationChallenge(username)
        
        // 2. Authenticate with passkey
        val result = passkeymeSDK.authenticate(
            username = username,
            challenge = challengeResponse.challenge,
            rpId = challengeResponse.rpId,
            allowCredentials = challengeResponse.allowCredentials,
            userVerification = UserVerificationRequirement.REQUIRED
        )
        
        if (!result.success || result.assertion == null) {
            throw PasskeymeError.Failed(
                result.error ?: "Authentication failed"
            )
        }
        
        // 3. Complete authentication with server
        return apiClient.completeAuthentication(
            assertion = result.assertion,
            username = username
        )
    }
}
```

:::tip SDK Updates
The Passkeyme Android SDK is regularly updated with new features and improvements. Check the [changelog](https://github.com/passkeyme/android-sdk/releases) for the latest updates and migration guides.
:::

This API reference provides complete documentation for integrating the Passkeyme Android SDK into your application. For additional examples and best practices, see the [Integration Guide](/docs/sdks/android/integration) and [Security Best Practices](/docs/sdks/android/security).

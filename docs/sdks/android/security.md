---
id: security
title: Security Best Practices
sidebar_label: Security
description: Essential security best practices for Android passkey implementation
keywords: [android, security, passkey, webauthn, best practices, biometric, credentials]
---

# 🔒 **Security Best Practices**

This guide outlines essential security practices for implementing passkey authentication in Android applications using the PasskeyMe SDK.

:::danger Security First
Proper security implementation is critical for passkey authentication. Following these practices ensures your users' credentials remain secure and your application meets industry standards.
:::

## **🛡️ Digital Asset Links Security**

### **Secure Asset Links Configuration**
```json
// .well-known/assetlinks.json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yourcompany.yourapp",
      "sha256_cert_fingerprints": [
        "YOUR_RELEASE_SHA256_FINGERPRINT",
        "YOUR_DEBUG_SHA256_FINGERPRINT"
      ]
    }
  }
]
```

:::warning Certificate Management
- **Never** include debug certificates in production asset links
- **Always** use separate asset links files for development and production
- **Regularly** rotate certificates and update asset links accordingly
:::

### **Certificate Pinning Validation**
```kotlin
class SecurityValidator(private val context: Context) {
    
    fun validateDigitalAssetLinks(domain: String): Boolean {
        return try {
            val url = "https://$domain/.well-known/assetlinks.json"
            val response = fetchAssetLinks(url)
            validateAssetLinksContent(response, context.packageName)
        } catch (e: Exception) {
            Log.e("SecurityValidator", "Asset links validation failed", e)
            false
        }
    }
    
    private fun validateAssetLinksContent(
        content: String, 
        expectedPackageName: String
    ): Boolean {
        val assetLinks = JSONArray(content)
        
        for (i in 0 until assetLinks.length()) {
            val link = assetLinks.getJSONObject(i)
            val target = link.getJSONObject("target")
            
            if (target.getString("package_name") == expectedPackageName) {
                val relations = link.getJSONArray("relation")
                for (j in 0 until relations.length()) {
                    if (relations.getString(j) == "delegate_permission/common.handle_all_urls") {
                        return validateCertificateFingerprints(target)
                    }
                }
            }
        }
        
        return false
    }
    
    private fun validateCertificateFingerprints(target: JSONObject): Boolean {
        val fingerprints = target.getJSONArray("sha256_cert_fingerprints")
        val appFingerprint = getAppCertificateFingerprint()
        
        for (i in 0 until fingerprints.length()) {
            if (fingerprints.getString(i).equals(appFingerprint, ignoreCase = true)) {
                return true
            }
        }
        
        return false
    }
}
```

## **🔐 Secure SDK Configuration**

### **Production-Ready SDK Setup**
```kotlin
class SecureAuthenticationManager(
    private val context: Context,
    private val apiBaseUrl: String,
    private val isDevelopment: Boolean = BuildConfig.DEBUG
) {
    private val passkeymeSDK = PasskeymeSDK(
        context = context,
        debug = isDevelopment, // Only enable debug in development
        timeout = if (isDevelopment) 120_000L else 60_000L, // Shorter timeout in production
        enableBiometricFallback = true // Always enable for better UX
    )
    
    private val secureHttpClient = OkHttpClient.Builder()
        .certificatePinner(createCertificatePinner())
        .addInterceptor(SecurityHeadersInterceptor())
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    private fun createCertificatePinner(): CertificatePinner {
        return CertificatePinner.Builder()
            .add(extractDomainFromUrl(apiBaseUrl), "sha256/YOUR_API_CERTIFICATE_PIN")
            .add("*.passkeyme.com", "sha256/PASSKEYME_CERTIFICATE_PIN")
            .build()
    }
    
    init {
        // Validate configuration on initialization
        validateSecurityConfiguration()
    }
    
    private fun validateSecurityConfiguration() {
        require(!isDevelopment || BuildConfig.DEBUG) {
            "Development mode should only be enabled in debug builds"
        }
        
        require(apiBaseUrl.startsWith("https://")) {
            "API base URL must use HTTPS"
        }
        
        if (!isDevelopment) {
            SecurityValidator(context).validateDigitalAssetLinks(
                extractDomainFromUrl(apiBaseUrl)
            )
        }
    }
}
```

### **Security Headers Interceptor**
```kotlin
class SecurityHeadersInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        
        val secureRequest = originalRequest.newBuilder()
            .addHeader("User-Agent", createSecureUserAgent())
            .addHeader("X-Requested-With", "XMLHttpRequest")
            .addHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            .addHeader("Pragma", "no-cache")
            .addHeader("Expires", "0")
            .build()
        
        val response = chain.proceed(secureRequest)
        
        // Validate security headers in response
        validateResponseHeaders(response)
        
        return response
    }
    
    private fun createSecureUserAgent(): String {
        return "PasskeyMeSDK/${BuildConfig.VERSION_NAME} " +
                "(Android ${Build.VERSION.RELEASE}; " +
                "${Build.MANUFACTURER} ${Build.MODEL})"
    }
    
    private fun validateResponseHeaders(response: Response) {
        val requiredHeaders = listOf(
            "Strict-Transport-Security",
            "X-Content-Type-Options",
            "X-Frame-Options"
        )
        
        for (header in requiredHeaders) {
            if (response.header(header).isNullOrBlank()) {
                Log.w("SecurityValidator", "Missing security header: $header")
            }
        }
    }
}
```

## **🔑 Credential Storage Security**

### **Secure Local Storage**
```kotlin
class SecureCredentialStorage(private val context: Context) {
    
    private val encryptedPrefs = EncryptedSharedPreferences.create(
        "passkey_credentials",
        MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC),
        context,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
    
    fun storeUserSession(user: User, sessionToken: String) {
        // Never store passkey credentials locally
        // Only store minimal session information
        encryptedPrefs.edit {
            putString("user_id", user.id)
            putString("session_token", sessionToken)
            putLong("session_expires", System.currentTimeMillis() + SESSION_DURATION)
            putBoolean("biometric_enabled", true)
        }
    }
    
    fun getUserSession(): UserSession? {
        val userId = encryptedPrefs.getString("user_id", null) ?: return null
        val sessionToken = encryptedPrefs.getString("session_token", null) ?: return null
        val expiresAt = encryptedPrefs.getLong("session_expires", 0)
        
        if (System.currentTimeMillis() > expiresAt) {
            clearSession()
            return null
        }
        
        return UserSession(
            userId = userId,
            sessionToken = sessionToken,
            expiresAt = expiresAt
        )
    }
    
    fun clearSession() {
        encryptedPrefs.edit { clear() }
    }
    
    companion object {
        private const val SESSION_DURATION = 24 * 60 * 60 * 1000L // 24 hours
    }
}

data class UserSession(
    val userId: String,
    val sessionToken: String,
    val expiresAt: Long
) {
    val isValid: Boolean
        get() = System.currentTimeMillis() < expiresAt
}
```

### **Biometric Protection**
```kotlin
class BiometricSecurityManager(private val context: Context) {
    
    fun isBiometricAvailable(): BiometricStatus {
        return when (BiometricManager.from(context).canAuthenticate(
            BiometricManager.Authenticators.BIOMETRIC_STRONG or 
            BiometricManager.Authenticators.DEVICE_CREDENTIAL
        )) {
            BiometricManager.BIOMETRIC_SUCCESS -> BiometricStatus.AVAILABLE
            BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE -> BiometricStatus.NO_HARDWARE
            BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE -> BiometricStatus.UNAVAILABLE
            BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> BiometricStatus.NONE_ENROLLED
            else -> BiometricStatus.UNKNOWN
        }
    }
    
    fun authenticateWithBiometric(
        fragmentActivity: FragmentActivity,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        val biometricPrompt = BiometricPrompt(
            fragmentActivity,
            ContextCompat.getMainExecutor(context),
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                    onSuccess()
                }
                
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    super.onAuthenticationError(errorCode, errString)
                    onError("Biometric authentication failed: $errString")
                }
                
                override fun onAuthenticationFailed() {
                    super.onAuthenticationFailed()
                    onError("Biometric authentication failed")
                }
            }
        )
        
        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Authenticate with Biometric")
            .setSubtitle("Use your fingerprint or face to access your account")
            .setAllowedAuthenticators(
                BiometricManager.Authenticators.BIOMETRIC_STRONG or
                BiometricManager.Authenticators.DEVICE_CREDENTIAL
            )
            .build()
        
        biometricPrompt.authenticate(promptInfo)
    }
}

enum class BiometricStatus {
    AVAILABLE,
    NO_HARDWARE,
    UNAVAILABLE,
    NONE_ENROLLED,
    UNKNOWN
}
```

## **🛡️ Network Security**

### **Request/Response Validation**
```kotlin
class SecureNetworkManager(
    private val httpClient: OkHttpClient,
    private val apiBaseUrl: String
) {
    
    suspend fun secureApiRequest(
        endpoint: String,
        requestBody: JSONObject,
        requireAuth: Boolean = true
    ): JSONObject {
        validateEndpoint(endpoint)
        validateRequestBody(requestBody)
        
        val request = buildSecureRequest(endpoint, requestBody, requireAuth)
        val response = httpClient.newCall(request).execute()
        
        validateResponse(response)
        
        val responseBody = response.body()?.string() 
            ?: throw SecurityException("Empty response body")
        
        return JSONObject(responseBody).also { responseJson ->
            validateResponseContent(responseJson)
        }
    }
    
    private fun validateEndpoint(endpoint: String) {
        require(endpoint.startsWith("/api/")) {
            "Invalid API endpoint: $endpoint"
        }
        
        require(!endpoint.contains("..")) {
            "Path traversal attempt detected: $endpoint"
        }
    }
    
    private fun validateRequestBody(requestBody: JSONObject) {
        // Validate input size to prevent DoS
        require(requestBody.toString().length <= MAX_REQUEST_SIZE) {
            "Request body too large"
        }
        
        // Sanitize string inputs
        sanitizeJsonObject(requestBody)
    }
    
    private fun sanitizeJsonObject(jsonObject: JSONObject) {
        val keys = jsonObject.keys()
        while (keys.hasNext()) {
            val key = keys.next()
            val value = jsonObject.get(key)
            
            when (value) {
                is String -> {
                    jsonObject.put(key, sanitizeString(value))
                }
                is JSONObject -> {
                    sanitizeJsonObject(value)
                }
                is JSONArray -> {
                    sanitizeJsonArray(value)
                }
            }
        }
    }
    
    private fun sanitizeString(input: String): String {
        return input
            .replace(Regex("[<>\"'&]"), "") // Remove potentially dangerous characters
            .trim()
            .take(MAX_STRING_LENGTH) // Limit length
    }
    
    private fun validateResponse(response: Response) {
        require(response.isSuccessful) {
            "API request failed with status: ${response.code()}"
        }
        
        val contentType = response.header("Content-Type")
        require(contentType?.startsWith("application/json") == true) {
            "Invalid response content type: $contentType"
        }
        
        val contentLength = response.header("Content-Length")?.toIntOrNull()
        require((contentLength ?: 0) <= MAX_RESPONSE_SIZE) {
            "Response too large: $contentLength bytes"
        }
    }
    
    private fun validateResponseContent(responseJson: JSONObject) {
        // Validate response structure
        if (responseJson.has("error")) {
            val error = responseJson.getString("error")
            throw ApiException("Server error: $error")
        }
        
        // Additional validation based on your API contract
    }
    
    companion object {
        private const val MAX_REQUEST_SIZE = 10 * 1024 // 10KB
        private const val MAX_RESPONSE_SIZE = 100 * 1024 // 100KB
        private const val MAX_STRING_LENGTH = 1000
    }
}

class ApiException(message: String) : Exception(message)
```

### **SSL/TLS Configuration**
```kotlin
class SSLConfigurationManager {
    
    fun createSecureHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectionSpecs(listOf(
                ConnectionSpec.MODERN_TLS,
                ConnectionSpec.COMPATIBLE_TLS
            ))
            .protocols(listOf(Protocol.HTTP_2, Protocol.HTTP_1_1))
            .certificatePinner(createCertificatePinner())
            .hostnameVerifier { hostname, session ->
                // Custom hostname verification if needed
                HttpsURLConnection.getDefaultHostnameVerifier()
                    .verify(hostname, session)
            }
            .build()
    }
    
    private fun createCertificatePinner(): CertificatePinner {
        return CertificatePinner.Builder()
            // Pin your API server certificate
            .add("api.yourcompany.com", "sha256/YOUR_API_CERT_PIN")
            // Pin PasskeyMe certificates
            .add("*.passkeyme.com", "sha256/PASSKEYME_CERT_PIN")
            // Pin root CA as backup
            .add("*.yourcompany.com", "sha256/ROOT_CA_CERT_PIN")
            .build()
    }
}
```

## **🔍 Security Monitoring**

### **Security Event Logging**
```kotlin
class SecurityMonitor(
    private val context: Context,
    private val analyticsClient: AnalyticsClient?
) {
    
    fun logSecurityEvent(event: SecurityEvent) {
        val secureLog = createSecureLogEntry(event)
        
        // Log to secure local storage
        writeToSecureLog(secureLog)
        
        // Send to analytics (with privacy considerations)
        analyticsClient?.trackSecurityEvent(event.type, event.metadata)
        
        // Alert on critical events
        if (event.isCritical) {
            alertSecurityTeam(event)
        }
    }
    
    private fun createSecureLogEntry(event: SecurityEvent): SecureLogEntry {
        return SecureLogEntry(
            id = UUID.randomUUID().toString(),
            timestamp = System.currentTimeMillis(),
            eventType = event.type,
            severity = event.severity,
            userId = event.userId,
            deviceId = getSecureDeviceId(),
            metadata = sanitizeMetadata(event.metadata),
            hash = calculateEventHash(event)
        )
    }
    
    private fun getSecureDeviceId(): String {
        // Use a non-identifying device fingerprint
        return Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ANDROID_ID
        ).let { androidId ->
            // Hash the Android ID for additional privacy
            MessageDigest.getInstance("SHA-256")
                .digest(androidId.toByteArray())
                .joinToString("") { "%02x".format(it) }
        }
    }
    
    private fun sanitizeMetadata(metadata: Map<String, Any>): Map<String, Any> {
        return metadata.filterKeys { key ->
            // Only allow specific, safe metadata fields
            key in ALLOWED_METADATA_KEYS
        }.mapValues { (_, value) ->
            when (value) {
                is String -> value.take(MAX_METADATA_VALUE_LENGTH)
                is Number -> value
                is Boolean -> value
                else -> value.toString().take(MAX_METADATA_VALUE_LENGTH)
            }
        }
    }
    
    fun monitorPasskeyEvents() {
        // Monitor for suspicious passkey-related activities
        logSecurityEvent(SecurityEvent(
            type = SecurityEventType.PASSKEY_OPERATION_STARTED,
            severity = SecuritySeverity.INFO,
            metadata = mapOf(
                "timestamp" to System.currentTimeMillis(),
                "app_version" to BuildConfig.VERSION_NAME
            )
        ))
    }
    
    companion object {
        private val ALLOWED_METADATA_KEYS = setOf(
            "timestamp", "app_version", "event_count", "duration_ms",
            "success", "error_type", "user_agent", "api_version"
        )
        private const val MAX_METADATA_VALUE_LENGTH = 100
    }
}

data class SecurityEvent(
    val type: SecurityEventType,
    val severity: SecuritySeverity,
    val userId: String? = null,
    val metadata: Map<String, Any> = emptyMap()
) {
    val isCritical: Boolean = severity == SecuritySeverity.CRITICAL
}

enum class SecurityEventType {
    PASSKEY_REGISTRATION_STARTED,
    PASSKEY_REGISTRATION_SUCCESS,
    PASSKEY_REGISTRATION_FAILED,
    PASSKEY_AUTHENTICATION_STARTED,
    PASSKEY_AUTHENTICATION_SUCCESS,
    PASSKEY_AUTHENTICATION_FAILED,
    BIOMETRIC_AUTHENTICATION_STARTED,
    BIOMETRIC_AUTHENTICATION_SUCCESS,
    BIOMETRIC_AUTHENTICATION_FAILED,
    INVALID_CERTIFICATE_DETECTED,
    SUSPICIOUS_NETWORK_ACTIVITY,
    ASSET_LINKS_VALIDATION_FAILED,
    SESSION_EXPIRED,
    UNAUTHORIZED_ACCESS_ATTEMPT
}

enum class SecuritySeverity {
    INFO, WARNING, ERROR, CRITICAL
}

data class SecureLogEntry(
    val id: String,
    val timestamp: Long,
    val eventType: SecurityEventType,
    val severity: SecuritySeverity,
    val userId: String?,
    val deviceId: String,
    val metadata: Map<String, Any>,
    val hash: String
)
```

## **🧪 Security Testing**

### **Security Test Suite**
```kotlin
@RunWith(AndroidJUnit4::class)
class SecurityTests {
    
    private lateinit var authManager: SecureAuthenticationManager
    private lateinit var securityMonitor: SecurityMonitor
    
    @Before
    fun setup() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        authManager = SecureAuthenticationManager(
            context = context,
            apiBaseUrl = "https://test-api.example.com",
            isDevelopment = true
        )
        securityMonitor = SecurityMonitor(context, null)
    }
    
    @Test
    fun testCertificatePinning() {
        // Test that certificate pinning is properly configured
        val sslConfig = SSLConfigurationManager()
        val httpClient = sslConfig.createSecureHttpClient()
        
        assertNotNull(httpClient.certificatePinner())
        assertTrue(httpClient.certificatePinner().pins.isNotEmpty())
    }
    
    @Test
    fun testInputSanitization() {
        val networkManager = SecureNetworkManager(
            httpClient = OkHttpClient(),
            apiBaseUrl = "https://test-api.example.com"
        )
        
        val maliciousInput = JSONObject().apply {
            put("username", "<script>alert('xss')</script>")
            put("displayName", "test\"'&<>user")
        }
        
        // Should not throw security exceptions for sanitized input
        assertDoesNotThrow {
            networkManager.validateRequestBody(maliciousInput)
        }
    }
    
    @Test
    fun testBiometricSecurity() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val biometricManager = BiometricSecurityManager(context)
        
        val status = biometricManager.isBiometricAvailable()
        assertTrue(status != BiometricStatus.UNKNOWN)
    }
    
    @Test
    fun testSecureStorage() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val storage = SecureCredentialStorage(context)
        
        val testUser = User(
            id = "test-id",
            username = "test@example.com",
            displayName = "Test User",
            email = "test@example.com"
        )
        
        storage.storeUserSession(testUser, "test-session-token")
        val session = storage.getUserSession()
        
        assertNotNull(session)
        assertEquals("test-id", session?.userId)
        assertTrue(session?.isValid == true)
        
        storage.clearSession()
        assertNull(storage.getUserSession())
    }
    
    @Test
    fun testSecurityEventLogging() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val monitor = SecurityMonitor(context, null)
        
        val event = SecurityEvent(
            type = SecurityEventType.PASSKEY_AUTHENTICATION_SUCCESS,
            severity = SecuritySeverity.INFO,
            metadata = mapOf("test" to "value")
        )
        
        // Should not throw exceptions when logging events
        assertDoesNotThrow {
            monitor.logSecurityEvent(event)
        }
    }
}
```

## **📋 Security Checklist**

### **Pre-Production Security Audit**

- [ ] **Digital Asset Links**
  - [ ] Asset links properly configured for production domain
  - [ ] Debug certificates removed from production asset links
  - [ ] Asset links accessible at `/.well-known/assetlinks.json`
  - [ ] Certificate fingerprints match app signing certificates

- [ ] **Network Security**
  - [ ] All API calls use HTTPS
  - [ ] Certificate pinning implemented
  - [ ] Proper SSL/TLS configuration
  - [ ] Request/response validation implemented
  - [ ] Security headers validated

- [ ] **Data Protection**
  - [ ] No sensitive data in logs
  - [ ] Encrypted storage for session data
  - [ ] No hardcoded secrets in code
  - [ ] Proper session timeout handling

- [ ] **Biometric Security**
  - [ ] Biometric authentication properly configured
  - [ ] Fallback authentication methods available
  - [ ] Proper error handling for biometric failures

- [ ] **Code Security**
  - [ ] ProGuard/R8 rules configured
  - [ ] Debug mode disabled in production
  - [ ] Input validation implemented
  - [ ] Error messages don't leak sensitive information

- [ ] **Monitoring & Logging**
  - [ ] Security event logging implemented
  - [ ] Anomaly detection configured
  - [ ] Proper log sanitization
  - [ ] Security incident response plan

:::tip Security Reviews
Conduct regular security reviews and penetration testing of your passkey implementation. Consider engaging security professionals for comprehensive audits before production deployment.
:::

Following these security best practices ensures your Android passkey implementation maintains the highest standards of security and user trust. Security is not a one-time configuration but an ongoing commitment to protecting user credentials and data.

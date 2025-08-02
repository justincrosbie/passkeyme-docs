---
id: android-sdk
title: Android SDK
sidebar_label: Android SDK
description: Native Android SDK for passkey authentication in Kotlin and Java apps
---

# 🤖 Android SDK

The `passkeyme-android-sdk` provides native Android passkey authentication using the AndroidX Credentials API and FIDO2 libraries. This SDK handles **only WebAuthn/FIDO2 operations** and requires backend integration for complete authentication flows.

:::info SDK Purpose
This is a **low-level SDK** for native Android apps. For React Native apps, consider:
- **[React Native SDK](/docs/getting-started/framework-comparison)** (coming Q1 2025) for React Native apps
- **[Ionic Plugin](/docs/sdks/ionic-plugin)** for Ionic/Capacitor apps
:::

## 📦 Installation

### Gradle

Add to your app-level `build.gradle`:

```gradle
dependencies {
    implementation 'com.passkeyme:android-sdk:1.0.0'
    
    // Required AndroidX dependencies
    implementation 'androidx.credentials:credentials:1.2.2'
    implementation 'androidx.credentials:credentials-play-services-auth:1.2.2'
}
```

### Manual Installation

1. Download the latest release from [GitHub](https://github.com/justincrosbie/passkeyme-android-sdk)
2. Add the AAR file to your `libs` folder
3. Add to your `build.gradle`:

```gradle
dependencies {
    implementation files('libs/passkeyme-android-sdk-1.0.0.aar')
    implementation 'androidx.credentials:credentials:1.2.2'
    implementation 'androidx.credentials:credentials-play-services-auth:1.2.2'
}
```

## 🚀 Quick Start

### Setup and Initialization

```kotlin
import com.passkeyme.android.PasskeymeSDK
import com.passkeyme.android.models.*

class AuthenticationManager(private val context: Context) {
    private val passkeymeSDK = PasskeymeSDK(context, debug = true)
    
    // Your implementation here
}
```

### Registration Flow

```kotlin
suspend fun registerPasskey(username: String, displayName: String) {
    try {
        // 1. Get challenge from your backend
        val challenge = getRegistrationChallenge(username)
        
        // 2. Perform passkey registration
        val result = passkeymeSDK.register(
            username = username,
            displayName = displayName,
            challenge = challenge.challenge,
            rp = challenge.rp,
            user = challenge.user,
            pubKeyCredParams = challenge.pubKeyCredParams,
            timeout = challenge.timeout,
            attestation = challenge.attestation
        )
        
        if (result.success) {
            // 3. Complete registration with backend
            completeRegistration(result.credential!!, username)
            Log.d("PasskeyAuth", "Registration successful!")
        } else {
            throw Exception(result.error ?: "Registration failed")
        }
        
    } catch (e: Exception) {
        Log.e("PasskeyAuth", "Registration failed", e)
        throw e
    }
}

private suspend fun getRegistrationChallenge(username: String): RegistrationChallenge {
    val client = OkHttpClient()
    val json = MediaType.get("application/json; charset=utf-8")
    
    val requestBody = JSONObject().apply {
        put("username", username)
    }
    
    val request = Request.Builder()
        .url("$baseUrl/api/start-registration")
        .post(RequestBody.create(json, requestBody.toString()))
        .build()
    
    val response = client.newCall(request).execute()
    
    if (!response.isSuccessful) {
        throw Exception("Failed to get registration challenge")
    }
    
    val responseBody = response.body()?.string() ?: throw Exception("Empty response")
    return Gson().fromJson(responseBody, RegistrationChallenge::class.java)
}

private suspend fun completeRegistration(credential: PasskeyCredential, username: String) {
    val client = OkHttpClient()
    val json = MediaType.get("application/json; charset=utf-8")
    
    val requestBody = JSONObject().apply {
        put("credential", credential.toJson())
        put("username", username)
    }
    
    val request = Request.Builder()
        .url("$baseUrl/api/complete-registration")
        .post(RequestBody.create(json, requestBody.toString()))
        .build()
    
    val response = client.newCall(request).execute()
    
    if (!response.isSuccessful) {
        throw Exception("Failed to complete registration")
    }
}
```

### Authentication Flow

```kotlin
suspend fun authenticateWithPasskey(username: String? = null): User {
    try {
        // 1. Get challenge from your backend
        val challenge = getAuthenticationChallenge(username)
        
        // 2. Perform passkey authentication
        val result = passkeymeSDK.authenticate(
            username = username,
            challenge = challenge.challenge,
            rpId = challenge.rpId,
            allowCredentials = challenge.allowCredentials,
            timeout = challenge.timeout,
            userVerification = challenge.userVerification
        )
        
        if (result.success) {
            // 3. Complete authentication with backend
            val user = completeAuthentication(result.assertion!!, username)
            Log.d("PasskeyAuth", "Authentication successful!")
            return user
        } else {
            throw Exception(result.error ?: "Authentication failed")
        }
        
    } catch (e: Exception) {
        Log.e("PasskeyAuth", "Authentication failed", e)
        throw e
    }
}

private suspend fun getAuthenticationChallenge(username: String?): AuthenticationChallenge {
    val client = OkHttpClient()
    val json = MediaType.get("application/json; charset=utf-8")
    
    val requestBody = JSONObject().apply {
        if (username != null) put("username", username)
    }
    
    val request = Request.Builder()
        .url("$baseUrl/api/start-authentication")
        .post(RequestBody.create(json, requestBody.toString()))
        .build()
    
    val response = client.newCall(request).execute()
    
    if (!response.isSuccessful) {
        throw Exception("Failed to get authentication challenge")
    }
    
    val responseBody = response.body()?.string() ?: throw Exception("Empty response")
    return Gson().fromJson(responseBody, AuthenticationChallenge::class.java)
}

private suspend fun completeAuthentication(assertion: PasskeyAssertion, username: String?): User {
    val client = OkHttpClient()
    val json = MediaType.get("application/json; charset=utf-8")
    
    val requestBody = JSONObject().apply {
        put("assertion", assertion.toJson())
        if (username != null) put("username", username)
    }
    
    val request = Request.Builder()
        .url("$baseUrl/api/complete-authentication")
        .post(RequestBody.create(json, requestBody.toString()))
        .build()
    
    val response = client.newCall(request).execute()
    
    if (!response.isSuccessful) {
        throw Exception("Failed to complete authentication")
    }
    
    val responseBody = response.body()?.string() ?: throw Exception("Empty response")
    return Gson().fromJson(responseBody, User::class.java)
}
```

## 🔧 API Reference

### PasskeymeSDK Class

```kotlin
class PasskeymeSDK(
    private val context: Context,
    private val debug: Boolean = false
) {
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
    ): RegistrationResult
    
    suspend fun authenticate(
        username: String? = null,
        challenge: String,
        rpId: String? = null,
        allowCredentials: List<PublicKeyCredentialDescriptor>? = null,
        timeout: Long? = null,
        userVerification: UserVerificationRequirement = UserVerificationRequirement.PREFERRED
    ): AuthenticationResult
    
    fun isSupported(): Boolean
    suspend fun isPlatformAuthenticatorAvailable(): Boolean
}
```

### Data Models

```kotlin
// Registration Models
data class RelyingParty(
    val name: String,
    val id: String
)

data class UserInfo(
    val id: String,
    val name: String,
    val displayName: String
)

data class PublicKeyCredentialParameters(
    val type: String = "public-key",
    val alg: Int
)

data class RegistrationResult(
    val success: Boolean,
    val credential: PasskeyCredential? = null,
    val error: String? = null
)

data class PasskeyCredential(
    val id: String,
    val rawId: ByteArray,
    val response: AuthenticatorAttestationResponse,
    val type: String = "public-key"
) {
    fun toJson(): JSONObject {
        return JSONObject().apply {
            put("id", id)
            put("rawId", Base64.encodeToString(rawId, Base64.URL_SAFE or Base64.NO_WRAP))
            put("response", response.toJson())
            put("type", type)
        }
    }
}

// Authentication Models
data class PublicKeyCredentialDescriptor(
    val type: String = "public-key",
    val id: String
)

data class AuthenticationResult(
    val success: Boolean,
    val assertion: PasskeyAssertion? = null,
    val error: String? = null
)

data class PasskeyAssertion(
    val credential: PasskeyAuthenticationCredential
) {
    fun toJson(): JSONObject {
        return JSONObject().apply {
            put("credential", credential.toJson())
        }
    }
}

data class PasskeyAuthenticationCredential(
    val id: String,
    val rawId: ByteArray,
    val response: AuthenticatorAssertionResponse,
    val type: String = "public-key"
) {
    fun toJson(): JSONObject {
        return JSONObject().apply {
            put("id", id)
            put("rawId", Base64.encodeToString(rawId, Base64.URL_SAFE or Base64.NO_WRAP))
            put("response", response.toJson())
            put("type", type)
        }
    }
}

// Enums
enum class AttestationConveyancePreference {
    NONE, INDIRECT, DIRECT
}

enum class UserVerificationRequirement {
    REQUIRED, PREFERRED, DISCOURAGED
}

// Error Types
sealed class PasskeymeError : Exception() {
    object NotSupported : PasskeymeError()
    object Cancelled : PasskeymeError()
    data class Failed(override val message: String) : PasskeymeError()
    object NetworkError : PasskeymeError()
    object InvalidChallenge : PasskeymeError()
    object RegistrationFailed : PasskeymeError()
    object AuthenticationFailed : PasskeymeError()
}
```

## 🎨 Jetpack Compose Integration

### Registration Composable

```kotlin
@Composable
fun PasskeyRegistrationScreen(
    authManager: AuthenticationManager,
    onSuccess: () -> Unit,
    onError: (String) -> Unit
) {
    var username by remember { mutableStateOf("") }
    var displayName by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    
    val coroutineScope = rememberCoroutineScope()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Create Your Passkey",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        OutlinedTextField(
            value = username,
            onValueChange = { username = it },
            label = { Text("Email") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        OutlinedTextField(
            value = displayName,
            onValueChange = { displayName = it },
            label = { Text("Display Name") },
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        Button(
            onClick = {
                coroutineScope.launch {
                    isLoading = true
                    errorMessage = null
                    
                    try {
                        authManager.registerPasskey(username, displayName)
                        onSuccess()
                    } catch (e: Exception) {
                        errorMessage = e.message
                        onError(e.message ?: "Registration failed")
                    } finally {
                        isLoading = false
                    }
                }
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading && username.isNotBlank() && displayName.isNotBlank()
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(16.dp),
                    color = MaterialTheme.colorScheme.onPrimary
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Creating Passkey...")
            } else {
                Icon(Icons.Default.Fingerprint, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Create Passkey")
            }
        }
        
        errorMessage?.let { error ->
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = error,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall
            )
        }
    }
}
```

### Authentication Composable

```kotlin
@Composable
fun PasskeyLoginScreen(
    authManager: AuthenticationManager,
    onSuccess: (User) -> Unit,
    onError: (String) -> Unit
) {
    var username by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    
    val coroutineScope = rememberCoroutineScope()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Sign In with Passkey",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        OutlinedTextField(
            value = username,
            onValueChange = { username = it },
            label = { Text("Email (optional)") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        Button(
            onClick = {
                coroutineScope.launch {
                    isLoading = true
                    errorMessage = null
                    
                    try {
                        val user = authManager.authenticateWithPasskey(
                            username.ifBlank { null }
                        )
                        onSuccess(user)
                    } catch (e: Exception) {
                        errorMessage = e.message
                        onError(e.message ?: "Authentication failed")
                    } finally {
                        isLoading = false
                    }
                }
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(16.dp),
                    color = MaterialTheme.colorScheme.onPrimary
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Authenticating...")
            } else {
                Icon(Icons.Default.Fingerprint, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Sign In with Passkey")
            }
        }
        
        errorMessage?.let { error ->
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = error,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall
            )
        }
    }
}
```

## 🔧 Traditional View Integration

### Registration Activity

```kotlin
class PasskeyRegistrationActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPasskeyRegistrationBinding
    private lateinit var authManager: AuthenticationManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPasskeyRegistrationBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        authManager = AuthenticationManager(this)
        setupUI()
    }
    
    private fun setupUI() {
        binding.registerButton.setOnClickListener {
            val username = binding.usernameEditText.text.toString()
            val displayName = binding.displayNameEditText.text.toString()
            
            if (username.isBlank() || displayName.isBlank()) {
                showError("Please fill in all fields")
                return@setOnClickListener
            }
            
            registerPasskey(username, displayName)
        }
    }
    
    private fun registerPasskey(username: String, displayName: String) {
        setLoading(true)
        
        lifecycleScope.launch {
            try {
                authManager.registerPasskey(username, displayName)
                showSuccess("Passkey created successfully!")
                finish()
            } catch (e: Exception) {
                showError(e.message ?: "Registration failed")
            } finally {
                setLoading(false)
            }
        }
    }
    
    private fun setLoading(loading: Boolean) {
        binding.registerButton.isEnabled = !loading
        binding.usernameEditText.isEnabled = !loading
        binding.displayNameEditText.isEnabled = !loading
        
        if (loading) {
            binding.progressBar.visibility = View.VISIBLE
            binding.registerButton.text = "Creating Passkey..."
        } else {
            binding.progressBar.visibility = View.GONE
            binding.registerButton.text = "Create Passkey"
        }
    }
    
    private fun showError(message: String) {
        AlertDialog.Builder(this)
            .setTitle("Error")
            .setMessage(message)
            .setPositiveButton("OK", null)
            .show()
    }
    
    private fun showSuccess(message: String) {
        AlertDialog.Builder(this)
            .setTitle("Success!")
            .setMessage(message)
            .setPositiveButton("OK") { _, _ -> finish() }
            .show()
    }
}
```

## 🛡️ Security Best Practices

### SharedPreferences for User Data

```kotlin
class PreferencesManager(private val context: Context) {
    private val preferences = context.getSharedPreferences("passkeyme_prefs", Context.MODE_PRIVATE)
    
    var lastUsername: String?
        get() = preferences.getString("last_username", null)
        set(value) = preferences.edit().putString("last_username", value).apply()
    
    var isPasskeyEnabled: Boolean
        get() = preferences.getBoolean("passkey_enabled", false)
        set(value) = preferences.edit().putBoolean("passkey_enabled", value).apply()
    
    fun clearUserData() {
        preferences.edit().clear().apply()
    }
}
```

### Encrypted SharedPreferences

```kotlin
class SecurePreferencesManager(private val context: Context) {
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()
    
    private val encryptedPreferences = EncryptedSharedPreferences.create(
        context,
        "passkeyme_secure_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
    
    fun storeCredentialId(username: String, credentialId: String) {
        encryptedPreferences.edit()
            .putString("credential_$username", credentialId)
            .apply()
    }
    
    fun getCredentialId(username: String): String? {
        return encryptedPreferences.getString("credential_$username", null)
    }
    
    fun removeCredentialId(username: String) {
        encryptedPreferences.edit()
            .remove("credential_$username")
            .apply()
    }
}
```

## 🔍 Error Handling

### Comprehensive Error Handling

```kotlin
sealed class AuthError : Exception() {
    object NotSupported : AuthError() {
        override val message = "Passkeys are not supported on this device"
    }
    
    object Cancelled : AuthError() {
        override val message = "Authentication was cancelled"
    }
    
    object NetworkError : AuthError() {
        override val message = "Network error occurred. Please check your connection."
    }
    
    object InvalidChallenge : AuthError() {
        override val message = "Invalid authentication challenge received"
    }
    
    object RegistrationFailed : AuthError() {
        override val message = "Failed to register passkey. Please try again."
    }
    
    object AuthenticationFailed : AuthError() {
        override val message = "Authentication failed. Please try again."
    }
    
    object NoCredentials : AuthError() {
        override val message = "No passkeys found for this account"
    }
    
    object Timeout : AuthError() {
        override val message = "Authentication timed out. Please try again."
    }
    
    data class Unknown(override val message: String) : AuthError()
}

// Error handling in authentication
private fun handleAuthenticationError(error: Throwable): String {
    return when (error) {
        is PasskeymeError.NotSupported -> {
            // Show alternative login method
            showPasswordLogin()
            "This device doesn't support passkeys. Please use password login."
        }
        is PasskeymeError.Cancelled -> {
            "Authentication was cancelled. Please try again."
        }
        is PasskeymeError.Failed -> {
            "Authentication failed: ${error.message}"
        }
        else -> {
            Log.e("PasskeyAuth", "Unexpected error", error)
            error.message ?: "An unexpected error occurred"
        }
    }
}
```

## 📊 Analytics Integration

```kotlin
// Analytics tracking for passkey events
class AuthenticationManager(
    private val context: Context,
    private val analytics: Analytics? = null
) {
    private val passkeymeSDK = PasskeymeSDK(context, debug = BuildConfig.DEBUG)
    
    private fun trackEvent(event: String, parameters: Map<String, Any> = emptyMap()) {
        analytics?.track(event, parameters)
    }
    
    suspend fun registerPasskey(username: String, displayName: String) {
        trackEvent("passkey_registration_started", mapOf(
            "username_provided" to username.isNotBlank()
        ))
        
        try {
            // Registration logic here...
            
            trackEvent("passkey_registration_success")
        } catch (e: Exception) {
            trackEvent("passkey_registration_failed", mapOf(
                "error" to (e.message ?: "unknown")
            ))
            throw e
        }
    }
    
    suspend fun authenticateWithPasskey(username: String?): User {
        trackEvent("passkey_authentication_started", mapOf(
            "username_provided" to (username != null)
        ))
        
        try {
            // Authentication logic here...
            
            trackEvent("passkey_authentication_success")
            return user
        } catch (e: Exception) {
            trackEvent("passkey_authentication_failed", mapOf(
                "error" to (e.message ?: "unknown")
            ))
            throw e
        }
    }
}
```

## 📚 Testing

### Unit Tests

```kotlin
@RunWith(AndroidJUnit4::class)
class PasskeymeSDKTest {
    private lateinit var context: Context
    private lateinit var sdk: PasskeymeSDK
    
    @Before
    fun setUp() {
        context = ApplicationProvider.getApplicationContext()
        sdk = PasskeymeSDK(context, debug = true)
    }
    
    @Test
    fun testSDKSupport() {
        // Test if SDK properly detects WebAuthn support
        val isSupported = sdk.isSupported()
        assertTrue("WebAuthn should be supported on API 28+", isSupported)
    }
    
    @Test
    fun testPlatformAuthenticatorAvailability() = runTest {
        // Test platform authenticator detection
        val isAvailable = sdk.isPlatformAuthenticatorAvailable()
        // This will depend on the test device configuration
        assertNotNull(isAvailable)
    }
    
    @Test
    fun testRegistrationInputValidation() = runTest {
        // Test input validation for registration
        try {
            sdk.register(
                username = "",
                displayName = "",
                challenge = "",
                rp = RelyingParty("", ""),
                user = UserInfo("", "", ""),
                pubKeyCredParams = emptyList()
            )
            fail("Should throw error for empty inputs")
        } catch (e: Exception) {
            assertTrue("Should be PasskeymeError", e is PasskeymeError)
        }
    }
}
```

### Instrumented Tests

```kotlin
@RunWith(AndroidJUnit4::class)
@LargeTest
class PasskeymeIntegrationTest {
    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)
    
    @Test
    fun testPasskeyRegistrationFlow() {
        // Test the complete registration flow
        onView(withId(R.id.register_button))
            .check(matches(isDisplayed()))
            .perform(click())
        
        // Enter test data
        onView(withId(R.id.username_edit_text))
            .perform(typeText("test@example.com"))
        
        onView(withId(R.id.display_name_edit_text))
            .perform(typeText("Test User"))
        
        // Start registration
        onView(withId(R.id.create_passkey_button))
            .perform(click())
        
        // Verify success state
        onView(withText("Success!"))
            .check(matches(isDisplayed()))
    }
    
    @Test
    fun testPasskeyAuthenticationFlow() {
        // Test the complete authentication flow
        onView(withId(R.id.login_button))
            .check(matches(isDisplayed()))
            .perform(click())
        
        // Start authentication
        onView(withId(R.id.authenticate_button))
            .perform(click())
        
        // Verify authentication result
        onView(withText("Welcome back!"))
            .check(matches(isDisplayed()))
    }
}
```

## 📖 Next Steps

- **[iOS SDK](/docs/sdks/ios-sdk)** - Native iOS implementation
- **[Web SDK](/docs/sdks/web-sdk)** - Browser implementation
- **[Ionic Plugin](/docs/sdks/ionic-plugin)** - Cross-platform mobile
- **[API Reference](/docs/api/api-overview)** - Direct API integration

---

:::tip Need Higher-Level Integration?
For simpler integration with OAuth and hosted authentication, consider:
- **[React Native SDK](/docs/getting-started/framework-comparison)** (coming Q1 2025) for React Native apps
- **[JavaScript SDK](/docs/sdks/javascript)** for web-based apps
:::

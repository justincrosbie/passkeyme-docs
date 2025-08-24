---
id: integration
title: SDK Integration
sidebar_label: Integration
description: Step-by-step Android SDK integration with code examples for passkey authentication
keywords: [android, sdk, integration, passkey, webauthn, kotlin, jetpack compose]
---

# 📱 **SDK Integration**

This guide shows you how to integrate the Passkeyme Android SDK into your application with complete code examples for both Jetpack Compose and traditional View systems.

:::tip Prerequisites
Before integrating the SDK, ensure you have completed the [Configuration & Setup](/docs/sdks/android/configuration) guide. Proper Digital Asset Links configuration is required for passkeys to work.
:::

## **📦 Installation**

### **Gradle Dependencies**
Add to your app-level `build.gradle` or `build.gradle.kts`:

```kotlin
dependencies {
    implementation 'com.passkeyme:android-sdk:1.0.0'
    
    // Required AndroidX dependencies
    implementation 'androidx.credentials:credentials:1.2.2'
    implementation 'androidx.credentials:credentials-play-services-auth:1.2.2'
    
    // Optional: For network requests (if not using your own HTTP client)
    implementation 'com.squareup.okhttp3:okhttp:4.12.0'
    implementation 'com.google.code.gson:gson:2.10.1'
}
```

### **Permissions**
Add to your `AndroidManifest.xml`:

```xml
<manifest>
    <!-- Required for network requests -->
    <uses-permission android:name="android.permission.INTERNET" />
    
    <!-- Optional: For biometric authentication -->
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <uses-permission android:name="android.permission.USE_FINGERPRINT" />
</manifest>
```

### **ProGuard/R8 Rules**
Add to your `proguard-rules.pro`:

```proguard
# Passkeyme SDK
-keep class com.passkeyme.android.** { *; }

# AndroidX Credentials
-keep class androidx.credentials.** { *; }

# GSON (if using)
-keepattributes Signature
-keep class com.google.gson.** { *; }
```

## **🚀 Basic SDK Setup**

### **Initialize the SDK**
```kotlin
import com.passkeyme.android.PasskeymeSDK
import com.passkeyme.android.models.*

class AuthenticationManager(
    private val context: Context,
    private val apiBaseUrl: String = "https://api.passkeyme.com"
) {
    private val passkeymeSDK = PasskeymeSDK(context, debug = BuildConfig.DEBUG)
    private val httpClient = OkHttpClient()
    
    // Your authentication implementation here
}
```

### **Check Passkey Support**
```kotlin
class AuthenticationManager(private val context: Context) {
    private val passkeymeSDK = PasskeymeSDK(context)
    
    suspend fun checkPasskeySupport(): PasskeySupport {
        return PasskeySupport(
            isSupported = passkeymeSDK.isSupported(),
            isPlatformAuthenticatorAvailable = passkeymeSDK.isPlatformAuthenticatorAvailable()
        )
    }
}

data class PasskeySupport(
    val isSupported: Boolean,
    val isPlatformAuthenticatorAvailable: Boolean
) {
    val canUsePasskeys: Boolean = isSupported && isPlatformAuthenticatorAvailable
}
```

## **🔐 Registration Flow**

### **Complete Registration Implementation**
```kotlin
suspend fun registerPasskey(username: String, displayName: String): User {
    try {
        // 1. Get registration challenge from your backend
        val challenge = getRegistrationChallenge(username, displayName)
        
        // 2. Perform passkey registration using SDK
        val result = passkeymeSDK.register(
            username = username,
            displayName = displayName,
            challenge = challenge.challenge,
            rp = challenge.rp,
            user = challenge.user,
            pubKeyCredParams = challenge.pubKeyCredParams,
            timeout = challenge.timeout,
            attestation = challenge.attestation,
            authenticatorSelection = challenge.authenticatorSelection,
            excludeCredentials = challenge.excludeCredentials
        )
        
        if (!result.success) {
            throw Exception(result.error ?: "Registration failed")
        }
        
        // 3. Complete registration with backend
        val user = completeRegistration(result.credential!!, username)
        
        Log.d("PasskeyAuth", "Registration successful for user: $username")
        return user
        
    } catch (e: Exception) {
        Log.e("PasskeyAuth", "Registration failed", e)
        throw e
    }
}

private suspend fun getRegistrationChallenge(
    username: String, 
    displayName: String
): RegistrationChallenge {
    val json = MediaType.get("application/json; charset=utf-8")
    
    val requestBody = JSONObject().apply {
        put("username", username)
        put("displayName", displayName)
    }
    
    val request = Request.Builder()
        .url("$apiBaseUrl/api/registration-challenge")
        .post(RequestBody.create(json, requestBody.toString()))
        .build()
    
    val response = httpClient.newCall(request).execute()
    
    if (!response.isSuccessful) {
        throw Exception("Failed to get registration challenge")
    }
    
    val responseBody = response.body()?.string() ?: throw Exception("Empty response")
    return Gson().fromJson(responseBody, RegistrationChallenge::class.java)
}

private suspend fun completeRegistration(
    credential: PasskeyCredential, 
    username: String
): User {
    val json = MediaType.get("application/json; charset=utf-8")
    
    val requestBody = JSONObject().apply {
        put("credential", credential.toJson())
        put("username", username)
    }
    
    val request = Request.Builder()
        .url("$apiBaseUrl/api/complete-registration")
        .post(RequestBody.create(json, requestBody.toString()))
        .build()
    
    val response = httpClient.newCall(request).execute()
    
    if (!response.isSuccessful) {
        throw Exception("Failed to complete registration")
    }
    
    val responseBody = response.body()?.string() ?: throw Exception("Empty response")
    return Gson().fromJson(responseBody, User::class.java)
}

// Data classes for backend communication
data class RegistrationChallenge(
    val challenge: String,
    val rp: RelyingParty,
    val user: UserInfo,
    val pubKeyCredParams: List<PublicKeyCredentialParameters>,
    val timeout: Long?,
    val attestation: AttestationConveyancePreference,
    val authenticatorSelection: AuthenticatorSelectionCriteria?,
    val excludeCredentials: List<PublicKeyCredentialDescriptor>?
)

data class User(
    val id: String,
    val username: String,
    val displayName: String,
    val email: String?
)
```

## **🔓 Authentication Flow**

### **Complete Authentication Implementation**
```kotlin
suspend fun authenticateWithPasskey(username: String? = null): User {
    try {
        // 1. Get authentication challenge from backend
        val challenge = getAuthenticationChallenge(username)
        
        // 2. Perform passkey authentication using SDK
        val result = passkeymeSDK.authenticate(
            username = username,
            challenge = challenge.challenge,
            rpId = challenge.rpId,
            allowCredentials = challenge.allowCredentials,
            timeout = challenge.timeout,
            userVerification = challenge.userVerification
        )
        
        if (!result.success) {
            throw Exception(result.error ?: "Authentication failed")
        }
        
        // 3. Complete authentication with backend
        val user = completeAuthentication(result.assertion!!, username)
        
        Log.d("PasskeyAuth", "Authentication successful for user: ${user.username}")
        return user
        
    } catch (e: Exception) {
        Log.e("PasskeyAuth", "Authentication failed", e)
        throw e
    }
}

private suspend fun getAuthenticationChallenge(username: String?): AuthenticationChallenge {
    val json = MediaType.get("application/json; charset=utf-8")
    
    val requestBody = JSONObject().apply {
        if (username != null) put("username", username)
    }
    
    val request = Request.Builder()
        .url("$apiBaseUrl/api/authentication-challenge")
        .post(RequestBody.create(json, requestBody.toString()))
        .build()
    
    val response = httpClient.newCall(request).execute()
    
    if (!response.isSuccessful) {
        throw Exception("Failed to get authentication challenge")
    }
    
    val responseBody = response.body()?.string() ?: throw Exception("Empty response")
    return Gson().fromJson(responseBody, AuthenticationChallenge::class.java)
}

private suspend fun completeAuthentication(
    assertion: PasskeyAssertion, 
    username: String?
): User {
    val json = MediaType.get("application/json; charset=utf-8")
    
    val requestBody = JSONObject().apply {
        put("assertion", assertion.toJson())
        if (username != null) put("username", username)
    }
    
    val request = Request.Builder()
        .url("$apiBaseUrl/api/complete-authentication")
        .post(RequestBody.create(json, requestBody.toString()))
        .build()
    
    val response = httpClient.newCall(request).execute()
    
    if (!response.isSuccessful) {
        throw Exception("Failed to complete authentication")
    }
    
    val responseBody = response.body()?.string() ?: throw Exception("Empty response")
    return Gson().fromJson(responseBody, User::class.java)
}

// Data class for authentication challenge
data class AuthenticationChallenge(
    val challenge: String,
    val rpId: String?,
    val allowCredentials: List<PublicKeyCredentialDescriptor>?,
    val timeout: Long?,
    val userVerification: UserVerificationRequirement
)
```

## **🎨 Jetpack Compose Integration**

### **Registration Screen**
```kotlin
@Composable
fun PasskeyRegistrationScreen(
    authManager: AuthenticationManager,
    onSuccess: (User) -> Unit,
    onError: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var username by remember { mutableStateOf("") }
    var displayName by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    
    val coroutineScope = rememberCoroutineScope()
    
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Create Your Passkey",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        OutlinedTextField(
            value = username,
            onValueChange = { username = it },
            label = { Text("Email") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading,
            singleLine = true
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        OutlinedTextField(
            value = displayName,
            onValueChange = { displayName = it },
            label = { Text("Display Name") },
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading,
            singleLine = true
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        Button(
            onClick = {
                coroutineScope.launch {
                    isLoading = true
                    errorMessage = null
                    
                    try {
                        val user = authManager.registerPasskey(username, displayName)
                        onSuccess(user)
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
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.errorContainer
                )
            ) {
                Text(
                    text = error,
                    color = MaterialTheme.colorScheme.onErrorContainer,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.padding(16.dp)
                )
            }
        }
    }
}
```

### **Authentication Screen**
```kotlin
@Composable
fun PasskeyLoginScreen(
    authManager: AuthenticationManager,
    onSuccess: (User) -> Unit,
    onError: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var username by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    
    val coroutineScope = rememberCoroutineScope()
    
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontAlignment
    ) {
        Text(
            text = "Sign In with Passkey",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        OutlinedTextField(
            value = username,
            onValueChange = { username = it },
            label = { Text("Email (optional)") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading,
            singleLine = true
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = "Leave empty to see all available passkeys",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
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
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.errorContainer
                )
            ) {
                Text(
                    text = error,
                    color = MaterialTheme.colorScheme.onErrorContainer,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.padding(16.dp)
                )
            }
        }
    }
}
```

### **Main Authentication Screen**
```kotlin
@Composable
fun AuthenticationScreen(
    authManager: AuthenticationManager,
    onAuthenticationSuccess: (User) -> Unit
) {
    var currentScreen by remember { mutableStateOf(AuthScreen.MAIN) }
    var passkeySupport by remember { mutableStateOf<PasskeySupport?>(null) }
    
    LaunchedEffect(Unit) {
        passkeySupport = authManager.checkPasskeySupport()
    }
    
    when (currentScreen) {
        AuthScreen.MAIN -> {
            MainAuthScreen(
                passkeySupport = passkeySupport,
                onSignInClick = { currentScreen = AuthScreen.LOGIN },
                onSignUpClick = { currentScreen = AuthScreen.REGISTER }
            )
        }
        AuthScreen.LOGIN -> {
            PasskeyLoginScreen(
                authManager = authManager,
                onSuccess = onAuthenticationSuccess,
                onError = { currentScreen = AuthScreen.MAIN }
            )
        }
        AuthScreen.REGISTER -> {
            PasskeyRegistrationScreen(
                authManager = authManager,
                onSuccess = onAuthenticationSuccess,
                onError = { currentScreen = AuthScreen.MAIN }
            )
        }
    }
}

@Composable
private fun MainAuthScreen(
    passkeySupport: PasskeySupport?,
    onSignInClick: () -> Unit,
    onSignUpClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Welcome to MyApp",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.height(48.dp))
        
        if (passkeySupport?.canUsePasskeys == true) {
            Button(
                onClick = onSignInClick,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(Icons.Default.Fingerprint, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Sign In with Passkey")
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            OutlinedButton(
                onClick = onSignUpClick,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(Icons.Default.PersonAdd, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Create Account with Passkey")
            }
        } else {
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        Icons.Default.Warning,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Passkeys are not available on this device",
                        style = MaterialTheme.typography.bodyMedium,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

enum class AuthScreen {
    MAIN, LOGIN, REGISTER
}
```

## **📱 Traditional View Integration**

### **Registration Activity**
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
            val username = binding.usernameEditText.text.toString().trim()
            val displayName = binding.displayNameEditText.text.toString().trim()
            
            if (username.isBlank()) {
                binding.usernameLayout.error = "Email is required"
                return@setOnClickListener
            }
            
            if (displayName.isBlank()) {
                binding.displayNameLayout.error = "Display name is required"
                return@setOnClickListener
            }
            
            clearErrors()
            registerPasskey(username, displayName)
        }
    }
    
    private fun registerPasskey(username: String, displayName: String) {
        setLoading(true)
        
        lifecycleScope.launch {
            try {
                val user = authManager.registerPasskey(username, displayName)
                showSuccess("Passkey created successfully!")
                
                // Return user data to calling activity
                val resultIntent = Intent().apply {
                    putExtra("user_id", user.id)
                    putExtra("username", user.username)
                }
                setResult(RESULT_OK, resultIntent)
                finish()
                
            } catch (e: Exception) {
                Log.e("PasskeyRegistration", "Registration failed", e)
                showError(e.message ?: "Registration failed. Please try again.")
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
    
    private fun clearErrors() {
        binding.usernameLayout.error = null
        binding.displayNameLayout.error = null
    }
    
    private fun showError(message: String) {
        AlertDialog.Builder(this)
            .setTitle("Registration Failed")
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

### **Activity Layout (XML)**
```xml
<!-- activity_passkey_registration.xml -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Create Your Passkey"
        android:textSize="24sp"
        android:textStyle="bold"
        android:gravity="center"
        android:layout_marginBottom="32dp" />

    <com.google.android.material.textfield.TextInputLayout
        android:id="@+id/usernameLayout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="16dp">

        <com.google.android.material.textfield.TextInputEditText
            android:id="@+id/usernameEditText"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Email"
            android:inputType="textEmailAddress" />

    </com.google.android.material.textfield.TextInputLayout>

    <com.google.android.material.textfield.TextInputLayout
        android:id="@+id/displayNameLayout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="24dp">

        <com.google.android.material.textfield.TextInputEditText
            android:id="@+id/displayNameEditText"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Display Name"
            android:inputType="textPersonName" />

    </com.google.android.material.textfield.TextInputLayout>

    <com.google.android.material.button.MaterialButton
        android:id="@+id/registerButton"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Create Passkey"
        android:drawableStart="@drawable/ic_fingerprint"
        android:drawablePadding="8dp" />

    <ProgressBar
        android:id="@+id/progressBar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_marginTop="16dp"
        android:visibility="gone" />

</LinearLayout>
```

## **🔧 Error Handling**

### **Comprehensive Error Handling**
```kotlin
sealed class AuthError : Exception() {
    object NotSupported : AuthError() {
        override val message = "Passkeys are not supported on this device"
    }
    
    object Cancelled : AuthError() {
        override val message = "Authentication was cancelled by user"
    }
    
    object NetworkError : AuthError() {
        override val message = "Network error. Please check your connection."
    }
    
    object InvalidChallenge : AuthError() {
        override val message = "Invalid authentication challenge"
    }
    
    object NoCredentials : AuthError() {
        override val message = "No passkeys found for this account"
    }
    
    data class ServerError(val code: Int, override val message: String) : AuthError()
    data class Unknown(override val message: String) : AuthError()
}

fun handlePasskeyError(error: Throwable): String {
    return when (error) {
        is PasskeymeError.NotSupported -> {
            "This device doesn't support passkeys. Please use an alternative sign-in method."
        }
        is PasskeymeError.Cancelled -> {
            "Passkey authentication was cancelled. Please try again."
        }
        is PasskeymeError.Failed -> {
            "Passkey authentication failed: ${error.message}"
        }
        is PasskeymeError.NetworkError -> {
            "Network error occurred. Please check your internet connection and try again."
        }
        is PasskeymeError.InvalidChallenge -> {
            "Invalid authentication request. Please try again."
        }
        else -> {
            Log.e("PasskeyAuth", "Unexpected error", error)
            error.message ?: "An unexpected error occurred. Please try again."
        }
    }
}
```

## **📊 Usage Analytics**

### **Track Passkey Events**
```kotlin
class AuthenticationManager(
    private val context: Context,
    private val analytics: Analytics? = null
) {
    private val passkeymeSDK = PasskeymeSDK(context, debug = BuildConfig.DEBUG)
    
    private fun trackEvent(event: String, parameters: Map<String, Any> = emptyMap()) {
        analytics?.track(event, parameters + mapOf(
            "timestamp" to System.currentTimeMillis(),
            "sdk_version" to BuildConfig.VERSION_NAME
        ))
    }
    
    suspend fun registerPasskey(username: String, displayName: String): User {
        trackEvent("passkey_registration_started", mapOf(
            "has_username" to username.isNotBlank(),
            "has_display_name" to displayName.isNotBlank()
        ))
        
        try {
            val user = performRegistration(username, displayName)
            
            trackEvent("passkey_registration_success", mapOf(
                "user_id" to user.id,
                "username" to username
            ))
            
            return user
        } catch (e: Exception) {
            trackEvent("passkey_registration_failed", mapOf(
                "error_type" to e::class.simpleName,
                "error_message" to (e.message ?: "unknown")
            ))
            throw e
        }
    }
    
    suspend fun authenticateWithPasskey(username: String?): User {
        trackEvent("passkey_authentication_started", mapOf(
            "has_username" to (username != null)
        ))
        
        try {
            val user = performAuthentication(username)
            
            trackEvent("passkey_authentication_success", mapOf(
                "user_id" to user.id,
                "username" to user.username
            ))
            
            return user
        } catch (e: Exception) {
            trackEvent("passkey_authentication_failed", mapOf(
                "error_type" to e::class.simpleName,
                "error_message" to (e.message ?: "unknown")
            ))
            throw e
        }
    }
}
```

## **🧪 Testing Integration**

### **Testing Registration Flow**
```kotlin
@RunWith(AndroidJUnit4::class)
class PasskeyRegistrationTest {
    
    @Test
    fun testRegistrationFlow() = runTest {
        val authManager = AuthenticationManager(
            context = ApplicationProvider.getApplicationContext(),
            apiBaseUrl = "https://test-api.example.com"
        )
        
        // Test successful registration
        val user = authManager.registerPasskey(
            username = "test@example.com",
            displayName = "Test User"
        )
        
        assertEquals("test@example.com", user.username)
        assertEquals("Test User", user.displayName)
    }
    
    @Test(expected = PasskeymeError::class)
    fun testRegistrationWithInvalidInput() = runTest {
        val authManager = AuthenticationManager(
            context = ApplicationProvider.getApplicationContext()
        )
        
        // Should throw error for empty username
        authManager.registerPasskey("", "Test User")
    }
}
```

:::tip Next Steps
Once SDK integration is complete:
1. **[Security Best Practices](/docs/sdks/android/security)** - Implement secure patterns
2. **[API Reference](/docs/sdks/android/api-reference)** - Detailed SDK documentation
3. Test your integration thoroughly on physical devices
:::

The Android SDK integration provides a robust foundation for passkey authentication in your app. Follow the security best practices guide to ensure your implementation is production-ready!

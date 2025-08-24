---
id: configuration
title: Configuration & Setup
sidebar_label: Configuration
description: Complete guide to configuring Android apps for passkey authentication with Digital Asset Links and app signing
keywords: [android, passkey, configuration, assetlinks, sha256, digital asset links, app signing]
---

# 🔧 **Configuration & Setup**

This guide walks you through the complete configuration process for Android passkey authentication. Proper configuration is **critical** for passkeys to work correctly.

:::warning Critical Setup Requirements
Android passkeys require **two-way verification**:
1. **Your app must trust the server** (via Digital Asset Links)
2. **The server must trust your app** (via Allowed Origins)

Both must be configured correctly for passkeys to function.
:::

## **📋 Setup Checklist**

Before implementing Android passkeys, complete these steps:

- [ ] Create Passkeyme Application with proper configuration
- [ ] Install passkeyme-android-sdk into your Android app
- [ ] Configure passkeyme-android-sdk with APP_ID and API-KEY
- [ ] Sign your app and update build config with signingConfig
- [ ] Generate SHA-256 certificate fingerprint from your signing key
- [ ] Create Allowed Origin URL from SHA-256 fingerprint
- [ ] Create and upload assetlinks.json to your website
- [ ] Update AndroidManifest.xml to reference your domain
- [ ] Update Passkeyme Application with Android Allowed Origin

## **🏗️ Step 1: Create Passkeyme Application**

### **Application Configuration**
Create an Application at [https://passkeyme.com](https://passkeyme.com/), making sure to populate the Relying Party and Origin info correctly:

- **Relying Party ID**: Your domain (e.g., `example.com`)
- **Origin**: Your HTTPS domain (e.g., `https://example.com`)
- **Additional Allowed Origin**: Android origin (see Step 4 below)

:::info Why This Matters
The Passkeyme server needs to know which origins (domains and Android apps) are authorized to create and use passkeys for your application.
:::

## **🔑 Step 2: Generate App Signing Key**

### **Create Release Keystore**
Generate a keystore for your app using Android Studio or command line:

**Using Android Studio:**
1. Go to **Build** → **Generate Signed Bundle/APK**
2. Choose **Android App Bundle** or **APK**
3. Click **Create new...** to create a new keystore
4. Fill in the keystore details and remember the passwords

**Using Command Line:**
```bash
keytool -genkey -v -keystore my-release-key.keystore \
    -alias my-key-alias \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000
```

### **Configure Signing in build.gradle**
```kotlin
android {
    signingConfigs {
        create("release") {
            keyAlias = "my-key-alias"
            keyPassword = "my-key-password"
            storeFile = file("path/to/my-release-key.keystore")
            storePassword = "my-store-password"
        }
    }
    
    buildTypes {
        release {
            isMinifyEnabled = true
            signingConfig = signingConfigs.getByName("release")
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            signingConfig = signingConfigs.getByName("release") // Use same key for testing
        }
    }
}
```

:::warning Production Security
- **Never commit keystores** to version control
- **Store keystore passwords** securely (environment variables, CI/CD secrets)
- **Backup your keystore** - losing it means you cannot update your app
:::

## **🔍 Step 3: Extract SHA-256 Certificate Fingerprint**

### **Get SHA-256 Fingerprint**
Extract the SHA-256 fingerprint from your keystore:

```bash
keytool -list -v -keystore /path/to/my-release-key.keystore \
    -alias my-key-alias \
    -storepass my-store-password
```

This will output something like:
```
Certificate fingerprints:
         SHA1: A1:B2:C3:D4:E5:F6:G7:H8:I9:J0:K1:L2:M3:N4:O5:P6:Q7:R8:S9:T0
         SHA256: 1F:B2:D4:A8:3C:5E:7F:9A:B1:C2:D3:E4:F5:G6:H7:I8:J9:K0:L1:M2:N3:O4:P5:Q6:R7:S8:T9:U0:V1:W2:X3:Y4
```

**Copy the SHA-256 value**: `1F:B2:D4:A8:3C:5E:7F:9A:B1:C2:D3:E4:F5:G6:H7:I8:J9:K0:L1:M2:N3:O4:P5:Q6:R7:S8:T9:U0:V1:W2:X3:Y4`

### **Alternative: Using Android Studio**
1. Open your project in Android Studio
2. Go to **Build** → **Generate Signed Bundle/APK**
3. Select your keystore and key
4. The SHA-256 fingerprint will be displayed

## **🔗 Step 4: Generate Android Allowed Origin URL**

### **Convert SHA-256 to Allowed Origin**
Android requires a special format for the Allowed Origin URL. You need to convert your SHA-256 fingerprint to Base64URL format.

**Process:**
1. **Remove colons** from SHA-256: `1FB2D4A83C5E7F9AB1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4`
2. **Convert HEX to Base64URL** using [Cryptii.com](https://cryptii.com/pipes/hex-to-base64)
3. **Create the origin URL**: `android:apk-key-hash:{BASE64URL_RESULT}`

### **Using Cryptii.com Converter**
1. Go to [https://cryptii.com/pipes/hex-to-base64](https://cryptii.com/pipes/hex-to-base64)
2. **Input**: Paste your SHA-256 without colons (HEX format)
3. **Select Base64 variant**: Choose **"Base64url"** (not regular Base64)
4. **Copy the result**: This is your Base64URL encoded fingerprint

:::tip Example Conversion
**Input (HEX)**: `1FC69A271DE53990CAC559EC654E7FFC02E45635C900B035D6BB5E8041342DD7`
**Output (Base64URL)**: `H8aaJx3lOZCaxVnsZU5__ALkVjXJALA11rtegEE0Ldc`
:::

### **Final Allowed Origin Format**
Your Android Allowed Origin will look like:
```
android:apk-key-hash:H8aaJx3lOZCaxVnsZU5__ALkVjXJALA11rtegEE0Ldc
```

:::info Base64 vs Base64URL
Make sure to use **Base64URL** (not regular Base64). Base64URL uses `-` and `_` instead of `+` and `/`, and doesn't include padding `=` characters.
:::

## **🌐 Step 5: Create Digital Asset Links (assetlinks.json)**

### **Generate assetlinks.json**
Create a `.well-known/assetlinks.json` file on your main domain. Use Google's Statement List Generator for best results:

**Google's Tool**: [https://developers.google.com/digital-asset-links/tools/generator](https://developers.google.com/digital-asset-links/tools/generator)

### **Manual assetlinks.json Creation**
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.example.yourapp",
      "sha256_cert_fingerprints": [
        "1F:B2:D4:A8:3C:5E:7F:9A:B1:C2:D3:E4:F5:G6:H7:I8:J9:K0:L1:M2:N3:O4:P5:Q6:R7:S8:T9:U0:V1:W2:X3:Y4"
      ]
    }
  }
]
```

### **Upload to Your Server**
The file must be accessible at:
```
https://yourdomain.com/.well-known/assetlinks.json
```

**Test the file** by visiting the URL in your browser. It should return the JSON content with proper `Content-Type: application/json` headers.

### **Verification**
Use Google's testing tool to verify your assetlinks.json:
[https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://yourdomain.com&relation=delegate_permission/common.handle_all_urls](https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://yourdomain.com&relation=delegate_permission/common.handle_all_urls)

## **📱 Step 6: Configure AndroidManifest.xml**

### **Add Digital Asset Links Reference**
Update your `AndroidManifest.xml` to reference your domain:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.yourapp">

    <application>
        <!-- Digital Asset Links verification -->
        <meta-data
            android:name="asset_statements"
            android:resource="@string/asset_statements" />

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <!-- Deep link for passkey authentication -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="https"
                      android:host="yourdomain.com" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### **Add Asset Statements String**
In `res/values/strings.xml`:

```xml
<resources>
    <string name="asset_statements">
        [{
            \"relation\": [\"delegate_permission/common.handle_all_urls\"],
            \"target\": {
                \"namespace\": \"web\",
                \"site\": \"https://yourdomain.com\"
            }
        }]
    </string>
</resources>
```

This tells Android where to find your assetlinks.json file.

## **⚙️ Step 7: Update Passkeyme Application Configuration**

### **Add Android Allowed Origin**
1. Go to your [Passkeyme Application settings](https://passkeyme.com/application/edit)
2. Find **"Additional Allowed Origins"** section
3. Add your Android origin URL:
   ```
   android:apk-key-hash:H8aaJx3lOZCaxVnsZU5__ALkVjXJALA11rtegEE0Ldc
   ```

### **Complete Configuration Example**
Your Passkeyme Application should have:
- **Relying Party ID**: `yourdomain.com`
- **Origin**: `https://yourdomain.com`
- **Additional Allowed Origins**: 
  - `android:apk-key-hash:H8aaJx3lOZCaxVnsZU5__ALkVjXJALA11rtegEE0Ldc`

## **🔍 Step 8: Verification & Testing**

### **Configuration Verification Checklist**
- [ ] **assetlinks.json** is accessible at `https://yourdomain.com/.well-known/assetlinks.json`
- [ ] **SHA-256 fingerprint** matches between assetlinks.json and keystore
- [ ] **Package name** matches in assetlinks.json and AndroidManifest.xml
- [ ] **Android origin** is correctly formatted and added to Passkeyme
- [ ] **App is signed** with the correct keystore
- [ ] **Deep link intent filter** is properly configured

### **Testing Your Configuration**

**1. Verify assetlinks.json:**
```bash
curl -I https://yourdomain.com/.well-known/assetlinks.json
# Should return 200 OK with Content-Type: application/json
```

**2. Test Digital Asset Links:**
Use adb to verify the association:
```bash
adb shell am start \
  -W -a android.intent.action.VIEW \
  -d "https://yourdomain.com" \
  com.example.yourapp
```

**3. Check App Linking Status:**
```bash
adb shell pm get-app-links com.example.yourapp
```

### **Common Configuration Issues**

**❌ "Domain verification failed"**
- Check assetlinks.json is accessible via HTTPS
- Verify SHA-256 fingerprint matches exactly
- Ensure package name is correct

**❌ "Invalid origin in authentication request"**
- Verify Android origin URL is correctly formatted
- Check Base64URL encoding (not regular Base64)
- Ensure origin is added to Passkeyme Application

**❌ "Passkey creation failed"**
- Verify app is signed with the correct keystore
- Check AndroidManifest.xml deep link configuration
- Ensure Digital Asset Links are properly configured

### **Debugging Tools**

**1. Android Studio App Links Assistant:**
- Tools → App Links Assistant
- Verify URL mapping and intent filter

**2. Google Digital Asset Links API:**
```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://yourdomain.com&relation=delegate_permission/common.handle_all_urls
```

**3. Chrome DevTools Network Tab:**
- Monitor requests to assetlinks.json during testing

## **🚀 Next Steps**

Once configuration is complete:

1. **[SDK Integration](/docs/sdks/android/integration)** - Add the Android SDK to your app
2. **[Security Best Practices](/docs/sdks/android/security)** - Implement secure patterns
3. **[API Reference](/docs/sdks/android/api-reference)** - Detailed SDK documentation

:::tip Testing in Development
For development testing, you can use the same signing key for both debug and release builds. This allows testing the complete passkey flow during development.
:::

:::warning Production Deployment
When deploying to production:
- Ensure assetlinks.json is served with HTTPS
- Use a secure, backed-up signing key
- Test the complete flow on a physical device
- Monitor for Digital Asset Links verification errors
:::

Proper configuration is the foundation of Android passkey authentication. Take time to verify each step before proceeding to SDK integration!

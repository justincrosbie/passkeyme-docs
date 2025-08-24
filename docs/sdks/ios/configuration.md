---
id: configuration
title: Configuration and Setup
sidebar_label: Configuration
description: Complete iOS configuration including apple-app-site-association and Associated Domains setup
keywords: [ios, configuration, apple-app-site-association, associated domains, xcode, team id]
---

# **Configuration and Setup**

This guide covers the essential configuration steps for iOS passkey authentication, including the critical apple-app-site-association file and Associated Domains setup that are required for passkeys to work properly.

:::danger Critical Configuration Required
iOS passkey authentication **will not work** without proper apple-app-site-association and Associated Domains configuration. These steps are mandatory, not optional.
:::

## **📋 Setup Checklist**

Before implementing the SDK, ensure you have completed these essential setup steps:

- [ ] Create and configure Passkeyme Application
- [ ] Obtain Apple Team ID and Bundle ID from Apple Developer Portal
- [ ] Create and host apple-app-site-association file on your domain
- [ ] Add Associated Domain capability to your Xcode project
- [ ] Configure Passkeyme application with correct domain and origin
- [ ] Install and configure PasskeymeSDK in your iOS project

## **🏗️ Passkeyme Application Setup**

### **1. Create Passkeyme Application**

1. **Sign up/Login** to [Passkeyme Console](https://passkeyme.com)
2. **Create New Application** with these settings:
   - **Application Name**: Your iOS app name
   - **Application Type**: Native iOS Application
   - **Environment**: Development or Production

### **2. Configure Relying Party Information**

Set up your relying party details to match your app's domain:

```json
{
  "rpId": "your-domain.com",
  "rpName": "Your App Name",
  "rpIcon": "https://your-domain.com/icon.png"
}
```

:::warning Domain Matching
The RP ID **must exactly match** the domain where you host your apple-app-site-association file. If your domain is `example.com`, your RP ID must be `example.com`.
:::

### **3. Configure Origins**

Add your allowed origins in the Passkeyme console:

```json
{
  "origins": [
    "https://your-domain.com"
  ]
}
```

## **🍎 Apple Developer Portal Setup**

### **Get Your Apple Team ID**

1. **Login** to [Apple Developer Portal](https://developer.apple.com/account)
2. **Navigate** to Account → Membership
3. **Copy your Team ID** (10-character identifier like `ABC123DEF4`)

### **Get Your Bundle Identifier**

1. **Open Xcode** → Your Project → Target
2. **Go to General tab** → Identity section
3. **Copy Bundle Identifier** (e.g., `com.yourcompany.yourapp`)

### **App ID Format**
Your complete App ID will be: `{TEAM_ID}.{BUNDLE_ID}`

**Example**: `ABC123DEF4.com.yourcompany.yourapp`

## **🌐 apple-app-site-association Configuration**

### **Create the Association File**

Create a file named `apple-app-site-association` (no file extension) with the following structure:

```json
{
  "webcredentials": {
    "apps": [
      "ABC123DEF4.com.yourcompany.yourapp"
    ]
  }
}
```

:::tip Multiple Apps
If you have multiple iOS apps for the same domain, include all App IDs:

```json
{
  "webcredentials": {
    "apps": [
      "ABC123DEF4.com.yourcompany.yourapp",
      "ABC123DEF4.com.yourcompany.anotherapp"
    ]
  }
}
```
:::

### **Host the Association File**

1. **Upload the file** to your web server at:
   ```
   https://your-domain.com/.well-known/apple-app-site-association
   ```

2. **Ensure proper headers** are set:
   ```
   Content-Type: application/json
   ```

3. **File must be accessible** without redirects at:
   ```
   https://your-domain.com/.well-known/apple-app-site-association
   ```

### **Validation**

Test your association file:

```bash
curl -v https://your-domain.com/.well-known/apple-app-site-association
```

**Expected response:**
- **Status**: `200 OK`
- **Content-Type**: `application/json` or `application/pkcs7-mime`
- **Body**: Your JSON configuration

## **📱 Xcode Associated Domains Configuration**

### **Add Associated Domains Capability**

1. **Open your project** in Xcode
2. **Select your app target** in the project navigator
3. **Go to Signing & Capabilities** tab
4. **Click "+ Capability"** button
5. **Search and add "Associated Domains"**

### **Configure Associated Domain Entry**

Add the following domain entry:

**For Production:**
```
webcredentials:your-domain.com
```

**For Development/Testing:**
```
webcredentials:your-domain.com?mode=developer
```

:::info Development Mode
The `?mode=developer` parameter allows testing with development builds that may not be properly signed. Remove this for production releases.
:::

### **Multiple Domains**

If your app needs to work with multiple domains:

```
webcredentials:your-domain.com
webcredentials:api.your-domain.com
webcredentials:auth.your-domain.com
```

## **🔧 Passkeyme Console Configuration**

### **Configure iOS Application**

In your Passkeyme application settings:

1. **Go to Application Settings** → iOS Configuration
2. **Set Bundle ID**: `com.yourcompany.yourapp`
3. **Set Team ID**: `ABC123DEF4`
4. **Set Domain**: `your-domain.com`
5. **Enable iOS Platform**: Toggle on

### **Origin Validation**

Ensure your origin URL is properly configured:

```json
{
  "platform": "ios",
  "origin": "https://your-domain.com",
  "bundleId": "com.yourcompany.yourapp",
  "teamId": "ABC123DEF4"
}
```

## **📝 Advanced Configuration**

### **Subdomain Support**

To support subdomains, configure your association file:

```json
{
  "webcredentials": {
    "apps": [
      "ABC123DEF4.com.yourcompany.yourapp"
    ]
  },
  "applinks": {
    "details": [
      {
        "appIDs": ["ABC123DEF4.com.yourcompany.yourapp"],
        "components": [
          {
            "/": "/*"
          }
        ]
      }
    ]
  }
}
```

### **CDN Considerations**

If using a CDN, ensure:

1. **Direct access** to `/.well-known/apple-app-site-association`
2. **No caching** of the association file
3. **Proper Content-Type** headers preserved

### **Development vs Production**

**Development Configuration:**
```json
{
  "webcredentials": {
    "apps": [
      "ABC123DEF4.com.yourcompany.yourapp"
    ]
  }
}
```

**Production Configuration:**
```json
{
  "webcredentials": {
    "apps": [
      "ABC123DEF4.com.yourcompany.yourapp"
    ]
  }
}
```

## **🔍 Troubleshooting Configuration**

### **Common Issues**

**1. Association File Not Found (404)**
- Verify file is uploaded to correct path
- Check web server configuration
- Ensure no redirects are occurring

**2. Invalid Content-Type**
- Set `Content-Type: application/json`
- Some servers may require `application/pkcs7-mime`

**3. Associated Domain Not Working**
- Verify Team ID and Bundle ID are correct
- Check Xcode capability is properly added
- Ensure app is signed with correct provisioning profile

**4. Passkey Creation Fails**
- Verify RP ID matches domain exactly
- Check origin URL configuration
- Ensure apple-app-site-association includes correct App ID

### **Validation Commands**

**Test Association File:**
```bash
curl -I https://your-domain.com/.well-known/apple-app-site-association
```

**Validate JSON:**
```bash
curl https://your-domain.com/.well-known/apple-app-site-association | jq '.'
```

**Check App ID Format:**
```bash
# Should be: TEAM_ID.BUNDLE_ID
echo "ABC123DEF4.com.yourcompany.yourapp"
```

## **✅ Configuration Verification Checklist**

Before proceeding to SDK integration, verify:

- [ ] **Passkeyme Application** created and configured
- [ ] **Apple Team ID** and Bundle ID obtained
- [ ] **apple-app-site-association** file created with correct App ID
- [ ] **Association file** hosted at correct URL and accessible
- [ ] **Associated Domains** capability added in Xcode
- [ ] **Domain entry** added with correct format
- [ ] **RP ID and Origin** match domain exactly
- [ ] **File returns 200 OK** with proper Content-Type

:::tip Next Steps
Once configuration is complete, proceed to:
1. **[SDK Integration](/docs/sdks/ios/integration)** - Install and integrate the PasskeymeSDK
2. **[Security Best Practices](/docs/sdks/ios/security)** - Implement secure patterns
:::

Proper configuration is the foundation of successful iOS passkey authentication. Take time to verify each step before proceeding to implementation!

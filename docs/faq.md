---
id: faq
title: Frequently Asked Questions
sidebar_label: FAQ
---

# Frequently Asked Questions

Welcome to the FAQ page! Here you will find answers to the most commonly asked questions about Passkeyme.

## General Questions

### What is Passkeyme?

Passkeyme is a SaaS platform that allows developers to easily integrate passkeys into their web or mobile applications, providing a secure and user-friendly authentication alternative to traditional passwords.

It saves the developer the time and effort with implementing Passkeys from scratch, and gives them the confidene knowing that they have implemented passkeys in their app securely and with best practices.

### Who is Passkeyme for?

Passkeyme is primarily designed for boutique web and mobile app developers who already have an existing authentication framework and want to add the convenience and security of passkeys for their users.

However, we're open to exploring any use-cases - get in touch to discuss!

### How do Passkeys improve security?

Passkeys are a more secure alternative to traditional passwords because they leverage public-key cryptography, reducing the risk of phishing, credential stuffing, and other common attacks associated with passwords.

### How do Passkeys benefit the user?

Passkeys deliver a much better onboarding and authentication User-Experience - users no longer have to remember passwords.
Studies have shown that customer churn occurs at the onboardingstep - any friction here and you potentially lose the customer's interest.
With passkeys, the onboarding is frictionless.

### What happens when a user loses their device?

Passkeys are stored on the cloud service of the user's device - for Apple, its the keychain of their iCloud account, and for Android its the Google Password Manager. So if a user loses their device, once they can log in to their cloud account they have access to their passkey.

## Technical Questions

### How do I integrate Passkeyme into my application?

To integrate Passkeyme into your application, you need to use our SDKs and APIs. Detailed documentation for each SDK is available:
- [JavaScript SDK](SDKs/javascript-sdk)
- [iOS SDK](SDKs/swift-sdk)
- [Android SDK](SDKs/android-sdk)

### What is the registration flow for Passkeyme?

The registration flow involves the following steps:
1. User opens the app frontend to sign up.
2. The app frontend calls the app backend.
3. The app backend calls the Passkeyme `start_registration` API.
4. Passkeyme responds with a challenge.
5. The app backend sends the challenge to the app frontend.
6. The app frontend calls the Passkeyme SDK function `registerPasskey` with the challenge.
7. `registerPasskey` returns the credential.
8. The app frontend calls the app backend with the credential.
9. The app backend calls the Passkeyme `complete_registration` API.
10. If successful, the passkey is saved, and registration is complete.

### How do I handle authentication with Passkeyme?

The authentication flow is similar to the registration flow:
1. User opens the app frontend to log in.
2. The app frontend calls the app backend.
3. The app backend calls the Passkeyme `start_authentication` API.
4. Passkeyme responds with a challenge.
5. The app backend sends the challenge to the app frontend.
6. The app frontend calls the Passkeyme SDK function `authenticatePasskey` with the challenge.
7. `authenticatePasskey` returns the credential.
8. The app frontend calls the app backend with the credential.
9. The app backend calls the Passkeyme `complete_authentication` API.
10. If successful, the user is authenticated, and the app backend can return an authenticated session, via a minted JWT or cookie.

## Troubleshooting

### I am having trouble with the integration. Where can I get help?

If you encounter any issues with the integration, please check our [documentation](/docs) for detailed guides and troubleshooting steps. You can also reach out to our support team via the contact form in the app.

### How can I report bugs or request features?

You can report bugs or request features using the contact form in the app. We also recommend submitting feature requests through our [Feddback form](https://passkeyme.feedbackchimp.space/board/1002-feature-requests) so that other users can upvote and discuss them.

## Security and Privacy

## Miscellaneous

### How do I get started with Passkeyme?

To get started with Passkeyme, sign up for an account on our website. You can then follow the integration guides in our [documentation](/docs) to set up Passkeys for your application.

### Can I use Passkeyme with other authentication providers?

Yes, Passkeyme can be integrated with other authentication providers. It is designed to complement your existing authentication framework, providing an additional layer of security with passkeys.

If you have any other questions or need further assistance, please don't hesitate to contact us!

---

**Note:** This page is continuously updated with new information. Please check back regularly for the latest updates.
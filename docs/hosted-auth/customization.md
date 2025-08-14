---
id: customization
title: Customization Guide
sidebar_label: Customization
description: Advanced branding and styling options for PasskeyMe hosted authentication pages
keywords: [passkeyme, hosted auth, customization, branding, css, styling, themes, responsive]
---

# 🎨 **Customization Guide**

PasskeyMe's Hosted Authentication Pages offer extensive customization options to match your brand perfectly. This guide covers everything from basic branding to advanced CSS customization.

:::tip Live Preview
All customization changes are applied instantly to your hosted auth pages. Test your changes with a live authentication flow to see how they look in practice.
:::

## **1. Basic Branding Configuration**

Configure basic branding through the PasskeyMe Admin Console:

### **Company Information**
```javascript
// Example branding configuration
const brandingConfig = {
  companyName: 'Your Company',           // Displayed at top of auth pages
  logoUrl: 'https://yourapp.com/logo.png', // Company logo
  favicon: 'https://yourapp.com/favicon.ico' // Browser tab icon
};
```

### **Logo Requirements**
- **Format**: PNG, JPG, or SVG
- **Recommended Size**: 200x60px (auto-scaled)
- **Max File Size**: 1MB for optimal performance
- **URL**: Must be publicly accessible HTTPS URL
- **Background**: Transparent PNG recommended for best results

## **2. Color Customization**

### **Primary Color**
The primary color affects buttons, links, and accent elements:

```css
/* Your primary color will be applied to: */
.auth-button-primary {
  background-color: #your-primary-color;
  border-color: #your-primary-color;
}

.auth-link {
  color: #your-primary-color;
}

.auth-checkbox:checked {
  background-color: #your-primary-color;
}
```

### **Background Colors**
Customize the page background:

```javascript
const colorConfig = {
  primaryColor: '#007bff',      // Brand blue
  backgroundColor: '#ffffff',   // White background
  textColor: '#2d3748',        // Dark gray text
  borderColor: '#e2e8f0'       // Light gray borders
};
```

### **Color Palette Examples**

**Tech Startup Theme:**
```css
:root {
  --primary: #6366f1;     /* Indigo */
  --background: #ffffff;   /* White */
  --text: #1f2937;        /* Dark gray */
  --border: #e5e7eb;      /* Light gray */
}
```

**Financial Theme:**
```css
:root {
  --primary: #059669;     /* Green */
  --background: #f9fafb;  /* Off-white */
  --text: #111827;        /* Near black */
  --border: #d1d5db;      /* Medium gray */
}
```

**Creative Theme:**
```css
:root {
  --primary: #ec4899;     /* Pink */
  --background: #fef7ff;  /* Light pink */
  --text: #581c87;        /* Purple */
  --border: #e879f9;      /* Medium pink */
}
```

## **3. Advanced CSS Customization**

### **Container Styling**
Customize the main authentication container:

```css
/* Example custom CSS for hosted auth pages */
.auth-container {
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 420px;
  margin: 2rem auto;
  padding: 2.5rem;
}

.auth-title {
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 700;
  font-size: 1.875rem;
  line-height: 2.25rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.auth-subtitle {
  font-size: 1rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
}
```

### **Button Customization**
Style authentication buttons:

```css
.auth-button {
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.875rem 1.5rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 
              0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid transparent;
  width: 100%;
  margin-bottom: 1rem;
}

.auth-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.auth-button:active {
  transform: translateY(0);
}

/* Provider-specific button styles */
.provider-google {
  background: #4285f4;
  color: white;
}

.provider-google:hover {
  background: #3367d6;
}

.provider-github {
  background: #24292e;
  color: white;
}

.provider-github:hover {
  background: #1b1f23;
}

.provider-microsoft {
  background: #0078d4;
  color: white;
}

.provider-microsoft:hover {
  background: #106ebe;
}

.provider-apple {
  background: #000000;
  color: white;
}

.provider-apple:hover {
  background: #1d1d1f;
}
```

### **Form Element Styling**
Customize input fields and form elements:

```css
.auth-input {
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  width: 100%;
  margin-bottom: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.auth-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.auth-checkbox {
  border-radius: 4px;
  border: 2px solid #e5e7eb;
  width: 1.125rem;
  height: 1.125rem;
}

.auth-checkbox:checked {
  background-color: #6366f1;
  border-color: #6366f1;
}

.auth-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  display: block;
}
```

## **4. Responsive Design**

Ensure your customizations work across all devices:

```css
/* Mobile-first responsive design */
.auth-container {
  margin: 1rem;
  padding: 1.5rem;
}

/* Tablet styles */
@media (min-width: 768px) {
  .auth-container {
    margin: 2rem auto;
    padding: 2.5rem;
    max-width: 420px;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .auth-container {
    max-width: 480px;
    padding: 3rem;
  }
  
  .auth-title {
    font-size: 2.25rem;
  }
}

/* Large screens */
@media (min-width: 1280px) {
  .auth-container {
    max-width: 520px;
  }
}
```

## **5. Dark Mode Support**

Implement dark mode theming:

```css
/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .auth-container {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;
  }
  
  .auth-title {
    color: #f9fafb;
  }
  
  .auth-subtitle {
    color: #9ca3af;
  }
  
  .auth-input {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }
  
  .auth-input:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  .auth-label {
    color: #d1d5db;
  }
}

/* Manual dark mode toggle */
[data-theme="dark"] .auth-container {
  background: #0f172a;
  border-color: #1e293b;
  color: #f1f5f9;
}

[data-theme="dark"] .auth-title {
  color: #f1f5f9;
}

[data-theme="dark"] .auth-input {
  background: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}
```

## **6. Animation & Transitions**

Add smooth animations to enhance user experience:

```css
/* Page entrance animation */
@keyframes slideInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.auth-container {
  animation: slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Button hover effects */
.auth-button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Loading state animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-loading {
  animation: spin 1s linear infinite;
}

/* Form validation animations */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.auth-input.error {
  animation: shake 0.5s ease-in-out;
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

## **7. Typography Customization**

Use custom fonts to match your brand:

```css
/* Import custom fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Apply custom typography */
.auth-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.auth-title {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.auth-subtitle {
  font-weight: 400;
  line-height: 1.5;
}

.auth-button {
  font-family: inherit;
  font-weight: 600;
  letter-spacing: 0.025em;
}

/* Font size scale */
.auth-title {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
}

.auth-subtitle {
  font-size: clamp(0.875rem, 2vw, 1rem);
}

.auth-button {
  font-size: clamp(0.875rem, 2vw, 1rem);
}
```

## **8. Custom Layouts**

Create unique layouts for different use cases:

### **Side-by-Side Layout**
```css
/* Two-column layout for desktop */
@media (min-width: 1024px) {
  .auth-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    max-width: 800px;
    padding: 3rem;
  }
  
  .auth-form {
    order: 2;
  }
  
  .auth-branding {
    order: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
```

### **Centered Modal Layout**
```css
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.auth-modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  margin: 1rem;
  max-width: 420px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}
```

## **9. Testing Your Customizations**

### **Cross-Browser Testing**
Test your customizations across different browsers:
- **Chrome** - Latest version
- **Firefox** - Latest version  
- **Safari** - macOS and iOS
- **Edge** - Latest version

### **Device Testing**
Ensure responsive design works on:
- **Mobile** - 320px to 768px width
- **Tablet** - 768px to 1024px width
- **Desktop** - 1024px and above

### **Accessibility Testing**
Verify your customizations maintain accessibility:
- **Color contrast** - Minimum 4.5:1 ratio
- **Keyboard navigation** - All elements focusable
- **Screen readers** - Proper ARIA labels
- **High contrast mode** - Visible in Windows high contrast

## **10. Performance Considerations**

### **CSS Optimization**
```css
/* Use efficient selectors */
.auth-button { /* Good - class selector */ }
div.auth-button { /* Avoid - compound selector */ }

/* Minimize repaints */
.auth-button {
  will-change: transform; /* Hint for animations */
}

/* Use CSS custom properties for themes */
:root {
  --primary-color: #6366f1;
  --border-radius: 8px;
}

.auth-button {
  background-color: var(--primary-color);
  border-radius: var(--border-radius);
}
```

### **Image Optimization**
- **WebP format** - Better compression than PNG/JPG
- **Responsive images** - Multiple sizes for different screens
- **CDN delivery** - Fast global loading

## **11. Troubleshooting Common Issues**

### **CSS Not Applying**
1. **Clear browser cache** - Force refresh with Ctrl+F5
2. **Check CSS syntax** - Validate CSS for errors
3. **Specificity conflicts** - Use more specific selectors
4. **Content Security Policy** - Ensure CSS is allowed

### **Mobile Layout Issues**
1. **Viewport meta tag** - Ensure proper mobile scaling
2. **Touch targets** - Minimum 44px touch targets
3. **Text legibility** - Sufficient font sizes
4. **Horizontal scrolling** - Avoid overflow

### **Performance Issues**
1. **CSS size** - Keep custom CSS under 50KB
2. **Font loading** - Use font-display: swap
3. **Animation performance** - Use transform and opacity
4. **Image optimization** - Compress and resize images

:::tip Best Practices
- **Start simple** - Begin with basic branding, then add complexity
- **Test thoroughly** - Verify on multiple devices and browsers
- **Performance first** - Prioritize load times over complex animations
- **Accessibility matters** - Ensure your design is inclusive
:::

Your hosted authentication pages can now perfectly match your brand while maintaining security and performance!

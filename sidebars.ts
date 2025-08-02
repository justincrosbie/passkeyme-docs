import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * PasskeyMe Documentation Sidebar
 * 
 * Organized for optimal developer experience:
 * - Progressive disclosure from welcome to advanced topics
 * - Clear categorization of related content
 * - Easy navigation with visual emojis
 * - Framework-specific guidance prominent
 * - Decision-making tools for developers
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    // 🏠 Welcome & Introduction
    {
      type: 'category',
      label: '🏠 Welcome',
      collapsed: false,
      items: [
        'intro',
        'why-passkeyme',
        'why-passkeys',
      ],
    },

    // 🚀 Getting Started
    {
      type: 'category',
      label: '🚀 Getting Started',
      collapsed: false,
      items: [
        'getting-started/quick-start',
        'getting-started/choosing-approach',
        'getting-started/framework-comparison',
        'getting-started/installation',
        'getting-started/concepts',
        'getting-started/architecture',
      ],
    },

    // 🛠️ High-Level SDKs (Framework-Specific)
    {
      type: 'category',
      label: '🛠️ High-Level SDKs',
      collapsed: false,
      items: [
        'sdks/overview',
        'sdks/react',
        'sdks/javascript',
      ],
    },

    // 🔧 Low-Level SDKs (Platform-Specific)
    {
      type: 'category',
      label: '🔧 Low-Level SDKs',
      items: [
        'sdks/low-level-overview',
        'sdks/web-sdk',
        'sdks/ios-sdk',
        'sdks/android-sdk',
        'sdks/ionic-plugin',
      ],
    },

    // 🌐 API Reference
    {
      type: 'category',
      label: '🌐 API Reference',
      items: [
        'api/api-overview',
        'api/authentication-flows',
        'api/token-management',
        'api/authentication',
      ],
    },

    // 🔧 Configuration
    {
      type: 'category',
      label: '⚙️ Configuration',
      items: [
        'configuration/authentication-methods',
      ],
    },

    // 🔍 Troubleshooting
    {
      type: 'category',
      label: '🔍 Troubleshooting',
      items: [
        'troubleshooting/common-issues',
      ],
    },

    // 📖 Reference
    {
      type: 'doc',
      id: 'glossary',
      label: '📖 Glossary',
    },
  ],
};

export default sidebars;

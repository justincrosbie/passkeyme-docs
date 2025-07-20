import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * PasskeyMe Documentation Sidebar
 * 
 * Organized for optimal developer experience:
 * - Progressive disclosure from welcome to advanced topics
 * - Clear categorization of related content
 * - Easy navigation with visual emojis
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
        'why-passkeys',
      ],
    },

    // � Getting Started
    {
      type: 'category',
      label: '🚀 Getting Started',
      collapsed: false,
      items: [
        'getting-started/quick-start',
        'getting-started/installation',
        'getting-started/concepts',
      ],
    },

    // 🛠️ SDKs & Integration
    {
      type: 'category',
      label: '🛠️ SDKs & Integration',
      items: [
        'sdks/overview',
        'sdks/javascript',
        'sdks/react',
      ],
    },

    // 🔧 Configuration
    {
      type: 'category',
      label: '🔧 Configuration',
      items: [
        'configuration/authentication-methods',
      ],
    },

    // 🌐 API Reference
    {
      type: 'category',
      label: '🌐 API Reference',
      items: [
        'api/authentication',
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
  ],
};

export default sidebars;

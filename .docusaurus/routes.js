import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/blog',
    component: ComponentCreator('/blog', '240'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '182'),
    exact: true
  },
  {
    path: '/blog/discoverable',
    component: ComponentCreator('/blog/discoverable', 'da4'),
    exact: true
  },
  {
    path: '/blog/dogfood',
    component: ComponentCreator('/blog/dogfood', '7c0'),
    exact: true
  },
  {
    path: '/blog/introduction-to-passkeyme',
    component: ComponentCreator('/blog/introduction-to-passkeyme', '266'),
    exact: true
  },
  {
    path: '/blog/new-javascript-react-sdks',
    component: ComponentCreator('/blog/new-javascript-react-sdks', '3f5'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '287'),
    exact: true
  },
  {
    path: '/blog/tags/analytics',
    component: ComponentCreator('/blog/tags/analytics', '671'),
    exact: true
  },
  {
    path: '/blog/tags/announcement',
    component: ComponentCreator('/blog/tags/announcement', 'ed8'),
    exact: true
  },
  {
    path: '/blog/tags/authentication',
    component: ComponentCreator('/blog/tags/authentication', 'f1a'),
    exact: true
  },
  {
    path: '/blog/tags/charts',
    component: ComponentCreator('/blog/tags/charts', 'a4a'),
    exact: true
  },
  {
    path: '/blog/tags/developer-experience',
    component: ComponentCreator('/blog/tags/developer-experience', 'f22'),
    exact: true
  },
  {
    path: '/blog/tags/discoverable',
    component: ComponentCreator('/blog/tags/discoverable', 'b6e'),
    exact: true
  },
  {
    path: '/blog/tags/dogfood',
    component: ComponentCreator('/blog/tags/dogfood', '642'),
    exact: true
  },
  {
    path: '/blog/tags/firebase-auth',
    component: ComponentCreator('/blog/tags/firebase-auth', '790'),
    exact: true
  },
  {
    path: '/blog/tags/introduction',
    component: ComponentCreator('/blog/tags/introduction', '09b'),
    exact: true
  },
  {
    path: '/blog/tags/javascript',
    component: ComponentCreator('/blog/tags/javascript', 'a23'),
    exact: true
  },
  {
    path: '/blog/tags/passkeyme',
    component: ComponentCreator('/blog/tags/passkeyme', 'ce1'),
    exact: true
  },
  {
    path: '/blog/tags/passkeys',
    component: ComponentCreator('/blog/tags/passkeys', 'dd2'),
    exact: true
  },
  {
    path: '/blog/tags/react',
    component: ComponentCreator('/blog/tags/react', 'd8f'),
    exact: true
  },
  {
    path: '/blog/tags/resident-key',
    component: ComponentCreator('/blog/tags/resident-key', 'fe1'),
    exact: true
  },
  {
    path: '/blog/tags/saas',
    component: ComponentCreator('/blog/tags/saas', '21f'),
    exact: true
  },
  {
    path: '/blog/tags/sdk',
    component: ComponentCreator('/blog/tags/sdk', 'bb1'),
    exact: true
  },
  {
    path: '/blog/tags/security',
    component: ComponentCreator('/blog/tags/security', '1e2'),
    exact: true
  },
  {
    path: '/blog/tags/synchronised',
    component: ComponentCreator('/blog/tags/synchronised', '11f'),
    exact: true
  },
  {
    path: '/blog/tags/typescript',
    component: ComponentCreator('/blog/tags/typescript', 'a3a'),
    exact: true
  },
  {
    path: '/blog/tags/usage',
    component: ComponentCreator('/blog/tags/usage', 'fcd'),
    exact: true
  },
  {
    path: '/blog/usage-charts',
    component: ComponentCreator('/blog/usage-charts', '8a6'),
    exact: true
  },
  {
    path: '/blog/why-passkeys-are-important',
    component: ComponentCreator('/blog/why-passkeys-are-important', 'f0b'),
    exact: true
  },
  {
    path: '/framework-selector',
    component: ComponentCreator('/framework-selector', '4f7'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'e6a'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'c52'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '857'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', '12a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/api-overview',
                component: ComponentCreator('/docs/api/api-overview', '886'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/authentication',
                component: ComponentCreator('/docs/api/authentication', 'c45'),
                exact: true
              },
              {
                path: '/docs/api/authentication-flows',
                component: ComponentCreator('/docs/api/authentication-flows', 'd67'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/registration',
                component: ComponentCreator('/docs/api/registration', '4a9'),
                exact: true
              },
              {
                path: '/docs/api/token-management',
                component: ComponentCreator('/docs/api/token-management', 'b1b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/user-management',
                component: ComponentCreator('/docs/api/user-management', '097'),
                exact: true
              },
              {
                path: '/docs/configuration/authentication-methods',
                component: ComponentCreator('/docs/configuration/authentication-methods', '2ef'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/faq',
                component: ComponentCreator('/docs/faq', 'a89'),
                exact: true
              },
              {
                path: '/docs/getting-started/architecture',
                component: ComponentCreator('/docs/getting-started/architecture', '04b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/choosing-approach',
                component: ComponentCreator('/docs/getting-started/choosing-approach', 'ccc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/concepts',
                component: ComponentCreator('/docs/getting-started/concepts', '1dd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/framework-comparison',
                component: ComponentCreator('/docs/getting-started/framework-comparison', '909'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/hosted-auth',
                component: ComponentCreator('/docs/getting-started/hosted-auth', '3bd'),
                exact: true
              },
              {
                path: '/docs/getting-started/installation',
                component: ComponentCreator('/docs/getting-started/installation', 'ef0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/quick-start',
                component: ComponentCreator('/docs/getting-started/quick-start', '551'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/setup',
                component: ComponentCreator('/docs/getting-started/setup', '734'),
                exact: true
              },
              {
                path: '/docs/glossary',
                component: ComponentCreator('/docs/glossary', '356'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/hosted-auth/',
                component: ComponentCreator('/docs/hosted-auth/', 'cae'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/hosted-auth/configuration',
                component: ComponentCreator('/docs/hosted-auth/configuration', 'ea7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/hosted-auth/customization',
                component: ComponentCreator('/docs/hosted-auth/customization', 'fe4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/hosted-auth/implementation',
                component: ComponentCreator('/docs/hosted-auth/implementation', '0f1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/hosted-auth/security',
                component: ComponentCreator('/docs/hosted-auth/security', 'fb5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/SDKs/1.5 - sdk-installation-guide',
                component: ComponentCreator('/docs/SDKs/1.5 - sdk-installation-guide', 'ea9'),
                exact: true
              },
              {
                path: '/docs/sdks/android-sdk',
                component: ComponentCreator('/docs/sdks/android-sdk', '8dd'),
                exact: true
              },
              {
                path: '/docs/sdks/android/',
                component: ComponentCreator('/docs/sdks/android/', '2d5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/android/api-reference',
                component: ComponentCreator('/docs/sdks/android/api-reference', '11a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/android/configuration',
                component: ComponentCreator('/docs/sdks/android/configuration', 'c61'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/android/integration',
                component: ComponentCreator('/docs/sdks/android/integration', '7ca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/android/security',
                component: ComponentCreator('/docs/sdks/android/security', 'f32'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/ionic',
                component: ComponentCreator('/docs/sdks/ionic', 'b24'),
                exact: true
              },
              {
                path: '/docs/sdks/ionic-plugin',
                component: ComponentCreator('/docs/sdks/ionic-plugin', '0c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/ios-legacy',
                component: ComponentCreator('/docs/sdks/ios-legacy', '06f'),
                exact: true
              },
              {
                path: '/docs/sdks/ios-sdk',
                component: ComponentCreator('/docs/sdks/ios-sdk', 'd51'),
                exact: true
              },
              {
                path: '/docs/sdks/ios/',
                component: ComponentCreator('/docs/sdks/ios/', '96c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/ios/api-reference',
                component: ComponentCreator('/docs/sdks/ios/api-reference', '1e8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/ios/configuration',
                component: ComponentCreator('/docs/sdks/ios/configuration', '39d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/ios/integration',
                component: ComponentCreator('/docs/sdks/ios/integration', 'b92'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/ios/security',
                component: ComponentCreator('/docs/sdks/ios/security', '3b8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/javascript',
                component: ComponentCreator('/docs/sdks/javascript', '13d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/javascript-complex',
                component: ComponentCreator('/docs/sdks/javascript-complex', 'd18'),
                exact: true
              },
              {
                path: '/docs/SDKs/javascript-sdk',
                component: ComponentCreator('/docs/SDKs/javascript-sdk', 'fa2'),
                exact: true
              },
              {
                path: '/docs/sdks/javascript-simple',
                component: ComponentCreator('/docs/sdks/javascript-simple', '788'),
                exact: true
              },
              {
                path: '/docs/sdks/javascript/advanced-usage',
                component: ComponentCreator('/docs/sdks/javascript/advanced-usage', '82f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/javascript/handle-auth-callback',
                component: ComponentCreator('/docs/sdks/javascript/handle-auth-callback', '84f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/javascript/redirect-to-login',
                component: ComponentCreator('/docs/sdks/javascript/redirect-to-login', '5ce'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/javascript/smart-login',
                component: ComponentCreator('/docs/sdks/javascript/smart-login', '8d2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/low-level-overview',
                component: ComponentCreator('/docs/sdks/low-level-overview', '420'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/overview',
                component: ComponentCreator('/docs/sdks/overview', '9fe'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/react',
                component: ComponentCreator('/docs/sdks/react', 'c50'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/SDKs/react-sdk',
                component: ComponentCreator('/docs/SDKs/react-sdk', '2c8'),
                exact: true
              },
              {
                path: '/docs/SDKs/react-sdk-fixed',
                component: ComponentCreator('/docs/SDKs/react-sdk-fixed', 'b17'),
                exact: true
              },
              {
                path: '/docs/sdks/react/auth-panel',
                component: ComponentCreator('/docs/sdks/react/auth-panel', 'ba1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/react/oauth-button',
                component: ComponentCreator('/docs/sdks/react/oauth-button', 'ea2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/react/passkey-button',
                component: ComponentCreator('/docs/sdks/react/passkey-button', 'af3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/react/use-passkeyme',
                component: ComponentCreator('/docs/sdks/react/use-passkeyme', 'ae0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/SDKs/sdk-intro',
                component: ComponentCreator('/docs/SDKs/sdk-intro', '916'),
                exact: true
              },
              {
                path: '/docs/sdks/web-sdk',
                component: ComponentCreator('/docs/sdks/web-sdk', '96a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/troubleshooting/common-issues',
                component: ComponentCreator('/docs/troubleshooting/common-issues', 'dd4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/whats-new',
                component: ComponentCreator('/docs/whats-new', '290'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/why-passkeyme',
                component: ComponentCreator('/docs/why-passkeyme', '775'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/why-passkeys',
                component: ComponentCreator('/docs/why-passkeys', '233'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];

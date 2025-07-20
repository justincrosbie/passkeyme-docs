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
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '358'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'ff0'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '422'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', 'c51'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/authentication',
                component: ComponentCreator('/docs/api/authentication', 'eb1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/overview',
                component: ComponentCreator('/docs/api/overview', '24d'),
                exact: true
              },
              {
                path: '/docs/api/registration',
                component: ComponentCreator('/docs/api/registration', '4a9'),
                exact: true
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
                component: ComponentCreator('/docs/faq', '22e'),
                exact: true
              },
              {
                path: '/docs/getting-started/concepts',
                component: ComponentCreator('/docs/getting-started/concepts', '4f1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/installation',
                component: ComponentCreator('/docs/getting-started/installation', 'ef0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/quick-start',
                component: ComponentCreator('/docs/getting-started/quick-start', '8ae'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/setup',
                component: ComponentCreator('/docs/getting-started/setup', '734'),
                exact: true
              },
              {
                path: '/docs/SDKs/1.5 - sdk-installation-guide',
                component: ComponentCreator('/docs/SDKs/1.5 - sdk-installation-guide', 'ea9'),
                exact: true
              },
              {
                path: '/docs/sdks/android',
                component: ComponentCreator('/docs/sdks/android', '414'),
                exact: true
              },
              {
                path: '/docs/sdks/ionic',
                component: ComponentCreator('/docs/sdks/ionic', 'b24'),
                exact: true
              },
              {
                path: '/docs/sdks/ios',
                component: ComponentCreator('/docs/sdks/ios', '094'),
                exact: true
              },
              {
                path: '/docs/sdks/javascript',
                component: ComponentCreator('/docs/sdks/javascript', 'c2e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/SDKs/javascript-sdk',
                component: ComponentCreator('/docs/SDKs/javascript-sdk', 'fa2'),
                exact: true
              },
              {
                path: '/docs/sdks/overview',
                component: ComponentCreator('/docs/sdks/overview', '5b3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sdks/react',
                component: ComponentCreator('/docs/sdks/react', '9d4'),
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
                path: '/docs/SDKs/sdk-intro',
                component: ComponentCreator('/docs/SDKs/sdk-intro', '916'),
                exact: true
              },
              {
                path: '/docs/troubleshooting/common-issues',
                component: ComponentCreator('/docs/troubleshooting/common-issues', 'dd4'),
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

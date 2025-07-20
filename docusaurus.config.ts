import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'PasskeyMe Developer Documentation',
  tagline: 'Authentication made simple with passkeys and OAuth',
  favicon: 'img/passkeyme-logo-short-removebg-preview.ico',

  // Set the production url of your site here
  url: 'https://docs.passkeyme.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'passkeyme',
  projectName: 'passkeyme-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/passkeyme/passkeyme/tree/main/docs/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          breadcrumbs: true,
          sidebarCollapsible: true,
          sidebarCollapsed: false,
        },
        blog: {
          path: './blog',
          routeBasePath: 'blog',
          include: ['*.md', '*.mdx'],
          blogTitle: 'PasskeyMe Developer Blog',
          blogDescription: 'Updates, tutorials, and insights about passkey authentication and OAuth integration',
          showReadingTime: true,
          postsPerPage: 10,
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All posts',
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} PasskeyMe, Inc.`,
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/passkeyme-logo-short-green-removebg-preview.png',
    
    // Enhanced navbar
    navbar: {
      title: 'PasskeyMe',
      logo: {
        alt: 'PasskeyMe Logo',
        src: 'img/passkeyme-logo-short-green-removebg-preview.png',
        srcDark: 'img/passkeyme-logo-short-green-removebg-preview.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {to: 'blog', label: 'Blog', position: 'left'},
        {to: 'https://passkeyme.com/apidocs', label: 'API Reference', position: 'left'},
        {
          href: 'https://passkeyme.com/dashboard',
          label: 'Dashboard',
          position: 'right',
        },
        {
          href: 'https://passkeyme.com',
          label: 'Main Site',
          position: 'right',
        },
        {
          href: 'https://github.com/passkeyme/passkeyme',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    
    // Enhanced footer
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started/quick-start',
            },
            {
              label: 'API Reference',
              href: 'https://passkeyme.com/apidocs',
            },
            {
              label: 'SDKs',
              to: '/docs/sdks/overview',
            },
          ],
        },
        {
          title: 'Product',
          items: [
            {
              label: 'Dashboard',
              href: 'https://passkeyme.com/dashboard',
            },
            {
              label: 'Main Site',
              href: 'https://passkeyme.com',
            },
            {
              label: 'Pricing',
              href: 'https://passkeyme.com/pricing',
            },
          ],
        },
        {
          title: 'Support',
          items: [
            {
              label: 'Contact',
              href: 'https://passkeyme.com/contact',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/passkeyme/passkeyme',
            },
            {
              label: 'Status',
              href: 'https://status.passkeyme.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PasskeyMe, Inc. Built with Docusaurus.`,
    },
    
    // Enhanced syntax highlighting
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'javascript', 'typescript', 'jsx', 'tsx'],
    },
    
    // Enhanced color mode
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  
};

export default config;

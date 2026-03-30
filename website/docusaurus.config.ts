import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'BluesMinds API Docs',
  tagline: 'OpenAI-compatible LLMs with Anthropic/Gemini layers + management plane',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://bluesminds-docs.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'bluesminds',
  projectName: 'api-docs',

  onBrokenLinks: 'warn',

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
          routeBasePath: 'docs',
          sidebarCollapsed: false,
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
      navbar: {
        title: 'BluesMinds',
        logo: {
          alt: 'BluesMinds Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/',
            label: 'Pricing',
            position: 'left',
          },
          {
            href: 'https://api.bluesminds.com/console',
            label: 'Console',
            position: 'right',
          },
          {
            href: 'https://t.me/apibluesminds',
            label: 'Community',
            position: 'right',
          },
          {
            href: 'mailto:hello@bluesminds.com',
            label: 'Support',
            position: 'right',
          },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: '/docs/bluesminds-api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
             {
               label: 'Community (Telegram)',
               href: 'https://t.me/apibluesminds',
             },
             {
               label: 'Console',
               href: 'https://api.bluesminds.com/console',
             },
             {
               label: 'Marketplace',
               href: 'https://api.bluesminds.com/#/model-marketplace',
             },
          ],
        },
        {
          title: 'Support',
          items: [
            {
              label: 'Email: hello@bluesminds.com',
              href: 'mailto:hello@bluesminds.com',
            },
            {
              label: 'Telegram: @vaibhavg000',
              href: 'https://t.me/vaibhavg000',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Platform Repo',
              href: 'https://github.com/QuantumNous/new-api',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} BluesMinds. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

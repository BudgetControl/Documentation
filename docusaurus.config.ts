// docusaurus.config.js
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'BudgetControl',
  tagline: 'official documentation',
  favicon: 'img/favicon.ico',

  url: 'https://docs.budgetcontrol.cloud',
  baseUrl: '/',

  organizationName: 'mlab',
  projectName: 'budget control - docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      "docusaurus-preset-openapi",
      /** @type {import('docusaurus-preset-openapi').Options} */
      ({
        api: {
          path: "api",
          routeBasePath: "api",
        },
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl:
            "https://github.com/BudgetControl/Documentation",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '',
      logo: {
        alt: 'BudgetControl Logo',
        src: 'img/logo-type.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'default',
          position: 'left',
          label: 'Documentation',
        },
        {to: '/api', label: 'API', position: 'left'}, // Link alla documentazione API
        {
          href: 'https://github.com/BudgetControl/Documentation',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Links',
          items: [
            {
              label: 'Docs',
              to: '/docs/intro',
            },
            {
              label: 'API',
              to: '/api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/profile.php?id=61564453328542',
            },
            {
              label: 'Linkedin',
              href: 'https://www.linkedin.com/company/budgetcontrol/',
            },
            {
              label: 'Twitter',
              href: 'https://x.com/BudgetControl24',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/TtMTeUbSpW',
            },
          ],
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} BudgetControl, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

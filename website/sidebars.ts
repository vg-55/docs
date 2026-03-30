import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Overview',
      collapsed: false,
      items: [
        'intro',
        'quickstart',
        'faq',
        'principles',
        'models',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      collapsed: false,
      items: [
        'features/privacy-logging',
        'features/provider-routing',
        'features/tool-calling',
        'features/message-transforms',
        'features/web-search',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      collapsed: false,
      items: [
        'integrations/claude-code',
        'integrations/codex-cli',
        'integrations/openclaw',
      ],
    },
    {
      type: 'doc',
      id: 'bluesminds-api',
      label: 'Full API Reference',
    },
  ],
};

export default sidebars;

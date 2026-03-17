import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          BluesMinds API Docs
        </Heading>
        <p className="hero__subtitle">OpenAI-compatible LLMs with Anthropic/Gemini layers + management plane</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/bluesminds-api">
            Read the API Guide
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="BluesMinds API Docs"
      description="BluesMinds OpenAI-compatible LLM API, Anthropic/Gemini layers, management plane, models, pricing, and SDK examples">
      <HomepageHeader />
      <main />
    </Layout>
  );
}

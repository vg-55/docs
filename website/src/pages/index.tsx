import { useState } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

/* ─── RPM Pricing with Volume Discounts ──────────────────── */

// Returns the cost for the Nth extra block (1-indexed), applying volume discounts
function blockCost(baseCostPer5: number, blockIndex: number): number {
  // Block 1: full price, Block 2: 10% off, Block 3: 20% off, Block 4+: 30% off
  if (blockIndex <= 1) return baseCostPer5;
  if (blockIndex === 2) return +(baseCostPer5 * 0.9).toFixed(2);
  if (blockIndex === 3) return +(baseCostPer5 * 0.8).toFixed(2);
  return +(baseCostPer5 * 0.7).toFixed(2);
}

// Total added cost for N extra blocks
function totalExtraCost(baseCostPer5: number, blocks: number): number {
  let total = 0;
  for (let i = 1; i <= blocks; i++) {
    total += blockCost(baseCostPer5, i);
  }
  return +total.toFixed(2);
}

// What flat pricing would have been (no discount)
function flatCost(baseCostPer5: number, blocks: number): number {
  return baseCostPer5 * blocks;
}

type RpmSelectorProps = {
  rpm: number;
  baseRpm: number;
  maxRpm: number;
  extraCostPer5: number;
  period: string;
  onChange: (rpm: number) => void;
};

function RpmSelector({ rpm, baseRpm, maxRpm, extraCostPer5, period, onChange }: RpmSelectorProps) {
  const extraBlocks = (rpm - baseRpm) / 5;
  const addedCost = totalExtraCost(extraCostPer5, extraBlocks);
  const withoutDiscount = flatCost(extraCostPer5, extraBlocks);
  const saved = +(withoutDiscount - addedCost).toFixed(2);
  const currentBlockRate = extraBlocks > 0 ? blockCost(extraCostPer5, extraBlocks) : extraCostPer5;
  const nextBlockRate = blockCost(extraCostPer5, extraBlocks + 1);
  const nextDiscount = extraBlocks >= 0 ? Math.round((1 - nextBlockRate / extraCostPer5) * 100) : 0;
  // Progress bar percentage
  const progress = ((rpm - baseRpm) / (maxRpm - baseRpm)) * 100;

  return (
    <div className={styles.rpmSection}>
      <div className={styles.rpmLabelRow}>
        <span className={styles.rpmLabel}>Rate Limit (RPM)</span>
        <span className={styles.rpmInfo} title="Requests Per Minute — the max API calls per minute for this key. Add more and save!">ⓘ</span>
      </div>

      {/* Progress bar */}
      <div className={styles.rpmProgress}>
        <div className={styles.rpmProgressFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.rpmControls}>
        <button
          className={styles.rpmBtn}
          onClick={() => rpm > baseRpm && onChange(rpm - 5)}
          disabled={rpm <= baseRpm}
          aria-label="Decrease RPM">
          −
        </button>
        <span className={styles.rpmValue}>{rpm} RPM</span>
        <button
          className={styles.rpmBtn}
          onClick={() => rpm < maxRpm && onChange(rpm + 5)}
          disabled={rpm >= maxRpm}
          aria-label="Increase RPM">
          +
        </button>
      </div>

      {/* Pricing breakdown */}
      {addedCost > 0 && (
        <div className={styles.rpmBreakdown}>
          <p className={styles.rpmExtra}>
            + ${addedCost.toFixed(2)} for +{rpm - baseRpm} RPM / {period}
          </p>
          {saved > 0 && (
            <span className={styles.rpmSaved}>You save ${saved.toFixed(2)}!</span>
          )}
        </div>
      )}

      {/* Per-block rate hint */}
      {rpm === baseRpm && (
        <p className={styles.rpmExtraNote}>
          Starting at ${extraCostPer5} per 5 RPM — add more to unlock discounts!
        </p>
      )}
      {rpm > baseRpm && rpm < maxRpm && nextDiscount > 0 && (
        <p className={styles.rpmNextDiscount}>
          Next +5 RPM only ${nextBlockRate.toFixed(2)} ({nextDiscount}% off)
        </p>
      )}
      {rpm >= maxRpm && (
        <p className={styles.rpmMaxNote}>
          Max RPM reached — contact us for higher limits
        </p>
      )}

      {/* Discount tiers visual */}
      {rpm === baseRpm && (
        <div className={styles.rpmTiers}>
          <div className={styles.rpmTierItem}>
            <span className={styles.rpmTierBadge}>+5</span>
            <span className={styles.rpmTierPrice}>${extraCostPer5}</span>
          </div>
          <div className={styles.rpmTierItem}>
            <span className={styles.rpmTierBadge} data-discount="10%">+10</span>
            <span className={styles.rpmTierPrice}>${(extraCostPer5 * 0.9).toFixed(0)}</span>
          </div>
          <div className={styles.rpmTierItem}>
            <span className={styles.rpmTierBadge} data-discount="20%">+15</span>
            <span className={styles.rpmTierPrice}>${(extraCostPer5 * 0.8).toFixed(0)}</span>
          </div>
          <div className={styles.rpmTierItem}>
            <span className={styles.rpmTierBadge} data-discount="30%">+20+</span>
            <span className={styles.rpmTierPrice}>${(extraCostPer5 * 0.7).toFixed(0)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Types ────────────────────────────────────────────────── */

type Feature = {
  text: string;
  included: boolean;
  note?: string;
};

type PricingTierConfig = {
  name: string;
  badge?: string;
  basePrice: number;       // USD
  period: string;
  description: string;
  highlight?: boolean;
  features: Feature[];
  cta: string;
  ctaHref: string;
  ctaSecondary?: boolean;
  hasRpmSelector?: boolean;
  baseRpm?: number;
  maxRpm?: number;
  extraCostPer5?: number;
  isCustom?: boolean;
  isFree?: boolean;
};

const tierConfigs: PricingTierConfig[] = [
  {
    name: 'Free',
    basePrice: 0,
    period: 'forever',
    isFree: true,
    description: 'Get 500 pi credits on signup. Use them to test any model — no credit card required.',
    features: [
      { text: '500 pi credits on signup', included: true },
      { text: '20 RPM Rate Limit', included: true },
      { text: 'Access to all standard models', included: true },
      { text: 'Limited Context (Approx. 50%)', included: true },
      { text: 'Coding Tool Compatibility', included: false },
      { text: 'Access to Premium / VIP Models', included: false },
    ],
    cta: 'Get Started Free',
    ctaHref: 'https://api.bluesminds.com/console',
    ctaSecondary: true,
  },
  {
    name: 'Trial Pack',
    badge: '⚡ 24 hrs',
    basePrice: 5,
    period: '24 hours',
    description: 'Kick the tyres — full premium access for 24 hours at a flat rate.',
    features: [
      { text: 'Access to Good Quality Models', included: true },
      { text: '15 RPM Rate Limit', included: true },
      { text: 'Unlimited Requests (24 hrs)', included: true },
      { text: 'Full Context Window', included: true },
      { text: 'Coding Tool Compatibility', included: true },
      { text: 'Access to VIP / Premium Models', included: false },
    ],
    cta: 'Get Trial Pack',
    ctaHref: 'https://api.bluesminds.com/console',
  },
  {
    name: '10-Day Pass',
    basePrice: 25,
    period: '10 days',
    description: 'Perfect for short-term projects or trying out premium models.',
    hasRpmSelector: true,
    baseRpm: 15,
    maxRpm: 40,
    extraCostPer5: 5,
    features: [
      { text: 'Access to Good Quality Models', included: true },
      { text: 'Unlimited Requests', included: true },
      { text: '90% Uptime Guarantee', included: true },
      { text: 'Standard Support', included: true },
      { text: 'Original Context Window', included: true },
      { text: 'Coding Tool Compatibility', included: true },
    ],
    cta: 'Buy 10-Day Pass',
    ctaHref: 'https://api.bluesminds.com/console',
  },
  {
    name: 'Unlimited',
    badge: 'Most Popular',
    basePrice: 60,
    period: 'month',
    description:
      'Best for developers and power users needing reliable, unrestricted AI access all month.',
    highlight: true,
    hasRpmSelector: true,
    baseRpm: 15,
    maxRpm: 60,
    extraCostPer5: 10,
    features: [
      { text: 'Access to All Available Models', included: true },
      { text: 'Unlimited Requests', included: true },
      { text: '90% Uptime Guarantee', included: true },
      { text: 'Standard Support', included: true },
      { text: 'Original Context Window', included: true },
      { text: 'Coding Tool Compatibility', included: true },
    ],
    cta: 'Subscribe Now',
    ctaHref: 'https://api.bluesminds.com/console',
  },
  {
    name: 'Enterprise',
    basePrice: 0,
    period: 'pricing',
    isCustom: true,
    description:
      'For growing businesses and teams needing higher limits and personalized AI solutions.',
    features: [
      { text: 'All Models with Priority Access', included: true },
      { text: 'Custom RPM & Usage Limits', included: true },
      { text: 'Direct Support Channel', included: true },
      { text: 'Usage Analytics & Insights', included: true },
      { text: 'Custom Billing Arrangements', included: true },
      { text: 'API Customizations', included: true },
      { text: 'SLA Guarantee', included: true },
    ],
    cta: 'Contact Us',
    ctaHref: 'https://t.me/apibluesminds',
    ctaSecondary: true,
  },
];

/* ─── Feature Item ─────────────────────────────────────────── */

function FeatureItem({ text, included, note }: Feature) {
  return (
    <li className={clsx(styles.featureItem, !included && styles.featureItemDisabled)}>
      <span className={styles.featureIcon}>{included ? '✓' : '✕'}</span>
      <span>
        {text}
        {note && <span className={styles.featureNote}> — {note}</span>}
      </span>
    </li>
  );
}

/* ─── Pricing Card ─────────────────────────────────────────── */

function PricingCard({ tier }: { tier: PricingTierConfig }) {
  const [rpm, setRpm] = useState(tier.baseRpm ?? 0);

  const extraBlocks = tier.hasRpmSelector ? (rpm - (tier.baseRpm ?? 0)) / 5 : 0;
  const totalPrice = tier.basePrice + totalExtraCost(tier.extraCostPer5 ?? 0, extraBlocks);

  const displayPrice = tier.isFree ? '$0' : tier.isCustom ? 'Custom' : `$${totalPrice}`;

  return (
    <div className={clsx(styles.card, tier.highlight && styles.cardHighlight)}>
      {tier.badge && <div className={styles.badge}>{tier.badge}</div>}
      <div className={styles.cardHeader}>
        <Heading as="h3" className={styles.tierName}>
          {tier.name}
        </Heading>
        <div className={styles.priceRow}>
          <span className={styles.price}>{displayPrice}</span>
          <span className={styles.period}>{tier.period}</span>
        </div>
        <p className={styles.description}>{tier.description}</p>
      </div>

      {/* RPM Selector for paid plans */}
      {tier.hasRpmSelector && (
        <RpmSelector
          rpm={rpm}
          baseRpm={tier.baseRpm!}
          maxRpm={tier.maxRpm!}
          extraCostPer5={tier.extraCostPer5!}
          period={tier.period}
          onChange={setRpm}
        />
      )}

      <ul className={styles.featureList}>
        {tier.features.map((f, i) => (
          <FeatureItem key={i} {...f} />
        ))}
        {tier.isCustom && (
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>✓</span>
            <span>Custom RPM configured on request</span>
          </li>
        )}
      </ul>

      <div className={styles.cardFooter}>
        <Link
          className={clsx(
            'button button--lg',
            tier.ctaSecondary
              ? 'button--outline button--primary'
              : 'button--primary',
            styles.ctaButton
          )}
          href={tier.ctaHref}>
          {tier.cta}
        </Link>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function PricingPage(): ReactNode {
  return (
    <Layout
      title="Pricing — BluesMinds API"
      description="Simple, transparent pricing for BluesMinds API. Free tier, 10-Day Pass at $25, Unlimited at $60/month, Enterprise custom pricing. Adjustable RPM.">
      <div className={styles.hero}>
        <div className="container">
          <Heading as="h1" className={styles.heroTitle}>
            Simple, transparent pricing
          </Heading>
          <p className={styles.heroSubtitle}>
            Get access to hundreds of AI models through one standard API.
            <br />
            No hidden fees. Adjust RPM to match your exact needs.
          </p>
        </div>
      </div>

      <main className={clsx('container', styles.mainContent)}>
        <div className={styles.grid}>
          {tierConfigs.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>

        {/* pi credits section */}
        <section className={styles.creditsSection}>
          <Heading as="h2" className={styles.faqTitle}>
            pi Credit Pricing
          </Heading>
          <p className={styles.creditsSubtitle}>
            The Free plan comes with <strong>500 pi credits</strong>. Each API request deducts credits
            based on the model used. Credits do not expire.
          </p>
          <p className={styles.creditsNote}>
            Model credit costs vary — see{' '}
            <Link href="https://api.bluesminds.com/pricing">api.bluesminds.com/pricing</Link>{' '}
            for current rates.
          </p>
        </section>

        {/* FAQ */}
        <section className={styles.faqSection}>
          <Heading as="h2" className={styles.faqTitle}>
            Pricing FAQ
          </Heading>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <Heading as="h4">What is RPM?</Heading>
              <p>
                RPM = Requests Per Minute. It's the maximum number of API calls your key can make
                in a 60-second window. Use the selector above to add extra RPM to any paid plan.
              </p>
            </div>
            <div className={styles.faqItem}>
              <Heading as="h4">What counts as a request?</Heading>
              <p>
                Every call to an endpoint (chat completions, image generation, TTS, etc.) counts
                as one request, regardless of token length.
              </p>
            </div>
            <div className={styles.faqItem}>
              <Heading as="h4">Can I upgrade mid-cycle?</Heading>
              <p>
                Yes. You can upgrade from the 10-Day Pass to Unlimited at any time. Unused days
                are not refunded, but you gain immediate access to the higher tier.
              </p>
            </div>
            <div className={styles.faqItem}>
              <Heading as="h4">Is there a free trial?</Heading>
              <p>
                Yes — the <strong>Trial Pack</strong> gives you 24 hours of full premium access
                (15 RPM, unlimited requests, full context) for just <strong>$5</strong>. The
                permanent Free plan is also available forever with 20 RPM and 300 requests/day.
              </p>
            </div>
            <div className={styles.faqItem}>
              <Heading as="h4">What payment methods are accepted?</Heading>
              <p>
                Credit/debit cards and crypto. Enterprise customers can contact us for custom
                invoicing via{' '}
                <Link href="https://t.me/apibluesminds">Telegram</Link>.
              </p>
            </div>
            <div className={styles.faqItem}>
              <Heading as="h4">How do I get an API key?</Heading>
              <p>
                Sign in to the{' '}
                <Link href="https://api.bluesminds.com/console">BluesMinds Console</Link>,
                navigate to Tokens, and create a new key (starts with <code>sk-</code>).
              </p>
            </div>
          </div>
        </section>

        {/* Compare table */}
        <section className={styles.compareSection}>
          <Heading as="h2" className={styles.faqTitle}>
            Plan Comparison
          </Heading>
          <div className={styles.tableWrapper}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Free</th>
                  <th>Trial Pack ⚡</th>
                  <th>10-Day Pass</th>
                  <th className={styles.highlightCol}>Unlimited</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Price</td>
                  <td>$0</td>
                  <td>$5 / 24 hrs</td>
                  <td>$25 / 10 days</td>
                  <td className={styles.highlightCol}>$60 / month</td>
                  <td>Custom</td>
                </tr>
                <tr>
                  <td>Base RPM</td>
                  <td>20</td>
                  <td>15</td>
                  <td>15</td>
                  <td className={styles.highlightCol}>15</td>
                  <td>Custom</td>
                </tr>
                <tr>
                  <td>Extra RPM</td>
                  <td>—</td>
                  <td>—</td>
                  <td>$5–$3.50 / 5 RPM</td>
                  <td className={styles.highlightCol}>$10–$7 / 5 RPM</td>
                  <td>Negotiated</td>
                </tr>
                <tr>
                  <td>Request Limit</td>
                  <td>300 / day</td>
                  <td>Unlimited (24 hrs)</td>
                  <td>Unlimited</td>
                  <td className={styles.highlightCol}>Unlimited</td>
                  <td>Custom</td>
                </tr>
                <tr>
                  <td>Model Access</td>
                  <td>Limited</td>
                  <td>Good Quality</td>
                  <td>Good Quality</td>
                  <td className={styles.highlightCol}>All Available</td>
                  <td>All + Priority</td>
                </tr>
                <tr>
                  <td>Context Window</td>
                  <td>~50%</td>
                  <td>Full</td>
                  <td>Full</td>
                  <td className={styles.highlightCol}>Full</td>
                  <td>Full</td>
                </tr>
                <tr>
                  <td>Uptime SLA</td>
                  <td>—</td>
                  <td>—</td>
                  <td>90%</td>
                  <td className={styles.highlightCol}>90%</td>
                  <td>Custom SLA</td>
                </tr>
                <tr>
                  <td>Coding Tools (Cursor, etc.)</td>
                  <td>✕</td>
                  <td>✓</td>
                  <td>✓</td>
                  <td className={styles.highlightCol}>✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>Analytics & Insights</td>
                  <td>✕</td>
                  <td>✕</td>
                  <td>✕</td>
                  <td className={styles.highlightCol}>✕</td>
                  <td>✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <Heading as="h2">Ready to start?</Heading>
          <p>Sign up free, no credit card required. Upgrade whenever you need more.</p>
          <div className={styles.ctaButtons}>
            <Link
              className="button button--primary button--lg"
              href="https://api.bluesminds.com/console">
              Get Started Free
            </Link>
            <Link
              className="button button--outline button--secondary button--lg"
              to="/docs/quickstart">
              Read the Docs
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}

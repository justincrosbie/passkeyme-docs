import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './framework-selector.module.css';

interface Framework {
  id: string;
  name: string;
  logo: string;
  status: 'available' | 'coming-soon' | 'beta';
  description: string;
  quickStartLink: string;
  docsLink: string;
  features: string[];
  setupTime: string;
  popularity: number;
}

const frameworks: Framework[] = [
  {
    id: 'react',
    name: 'React',
    logo: '⚛️',
    status: 'available',
    description: 'Complete authentication components with PasskeymeAuthPanel',
    quickStartLink: '/docs/getting-started/quick-start#react-quick-start',
    docsLink: '/docs/sdks/react',
    features: ['Rich UI Components', 'OAuth + Passkeys', 'TypeScript Support', 'Custom Theming'],
    setupTime: '5 minutes',
    popularity: 95
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    logo: '🟨',
    status: 'available',
    description: 'Universal SDK for Angular, Vue, Svelte, and vanilla JS',
    quickStartLink: '/docs/getting-started/quick-start#javascript-quick-start',
    docsLink: '/docs/sdks/javascript',
    features: ['Framework Agnostic', 'OAuth + Passkeys', 'Hosted Pages', 'Simple Integration'],
    setupTime: '10 minutes',
    popularity: 85
  },
  {
    id: 'angular',
    name: 'Angular',
    logo: '🅰️',
    status: 'coming-soon',
    description: 'Native Angular components and services (Q2 2025)',
    quickStartLink: '/docs/getting-started/choosing-approach',
    docsLink: '/docs/getting-started/framework-comparison',
    features: ['Angular Components', 'Reactive Forms', 'Dependency Injection', 'TypeScript First'],
    setupTime: '5 minutes',
    popularity: 80
  },
  {
    id: 'vue',
    name: 'Vue.js',
    logo: '💚',
    status: 'coming-soon',
    description: 'Vue 3 Composition API components (Q2 2025)',
    quickStartLink: '/docs/getting-started/choosing-approach',
    docsLink: '/docs/getting-started/framework-comparison',
    features: ['Composition API', 'Reactive Components', 'Vue 3 Support', 'TypeScript Ready'],
    setupTime: '5 minutes',
    popularity: 75
  },
  {
    id: 'react-native',
    name: 'React Native',
    logo: '📱',
    status: 'coming-soon',
    description: 'Cross-platform mobile authentication (Q1 2025)',
    quickStartLink: '/docs/getting-started/choosing-approach',
    docsLink: '/docs/getting-started/framework-comparison',
    features: ['Cross-Platform', 'Native Performance', 'Biometric Auth', 'React Components'],
    setupTime: '10 minutes',
    popularity: 70
  },
  {
    id: 'svelte',
    name: 'Svelte',
    logo: '🔥',
    status: 'coming-soon',
    description: 'Lightweight Svelte components (Q3 2025)',
    quickStartLink: '/docs/getting-started/choosing-approach',
    docsLink: '/docs/getting-started/framework-comparison',
    features: ['Zero Runtime', 'Reactive', 'Small Bundle', 'Simple Syntax'],
    setupTime: '5 minutes',
    popularity: 65
  }
];

const platformSDKs = [
  {
    id: 'web-sdk',
    name: 'Web SDK',
    logo: '🌐',
    description: 'Browser WebAuthn implementation for custom UIs',
    link: '/docs/sdks/web-sdk',
    language: 'JavaScript/TypeScript'
  },
  {
    id: 'ios-sdk',
    name: 'iOS SDK',
    logo: '🍎',
    description: 'Native iOS passkey implementation',
    link: '/docs/sdks/ios-sdk',
    language: 'Swift/Objective-C'
  },
  {
    id: 'android-sdk',
    name: 'Android SDK',
    logo: '🤖',
    description: 'Native Android passkey implementation',
    link: '/docs/sdks/android-sdk',
    language: 'Kotlin/Java'
  },
  {
    id: 'ionic-plugin',
    name: 'Ionic Plugin',
    logo: '⚡',
    description: 'Capacitor plugin for cross-platform mobile',
    link: '/docs/sdks/ionic-plugin',
    language: 'TypeScript'
  }
];

function StatusBadge({ status }: { status: Framework['status'] }) {
  const badges = {
    available: { text: '✅ Available', className: styles.statusAvailable },
    'coming-soon': { text: '🚧 Coming Soon', className: styles.statusComingSoon },
    beta: { text: '🧪 Beta', className: styles.statusBeta }
  };
  
  const badge = badges[status];
  return <span className={`${styles.statusBadge} ${badge.className}`}>{badge.text}</span>;
}

function FrameworkCard({ framework }: { framework: Framework }) {
  return (
    <div className={`${styles.frameworkCard} ${framework.status !== 'available' ? styles.comingSoon : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.frameworkLogo}>{framework.logo}</div>
        <div>
          <h3 className={styles.frameworkName}>{framework.name}</h3>
          <StatusBadge status={framework.status} />
        </div>
      </div>
      
      <p className={styles.frameworkDescription}>{framework.description}</p>
      
      <div className={styles.features}>
        {framework.features.map((feature, index) => (
          <span key={index} className={styles.feature}>{feature}</span>
        ))}
      </div>
      
      <div className={styles.cardFooter}>
        <div className={styles.setupTime}>⏱️ {framework.setupTime}</div>
        <div className={styles.popularity}>
          <div className={styles.popularityBar}>
            <div 
              className={styles.popularityFill} 
              style={{ width: `${framework.popularity}%` }}
            />
          </div>
          <span>{framework.popularity}%</span>
        </div>
      </div>
      
      <div className={styles.cardActions}>
        {framework.status === 'available' ? (
          <>
            <Link 
              to={framework.quickStartLink}
              className="button button--primary button--sm"
            >
              Quick Start
            </Link>
            <Link 
              to={framework.docsLink}
              className="button button--secondary button--sm"
            >
              Full Docs
            </Link>
          </>
        ) : (
          <>
            <Link 
              to={framework.quickStartLink}
              className="button button--secondary button--sm"
            >
              Use JavaScript SDK
            </Link>
            <Link 
              to={framework.docsLink}
              className="button button--secondary button--sm"
            >
              See Timeline
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function PlatformSDKCard({ sdk }: { sdk: typeof platformSDKs[0] }) {
  return (
    <div className={styles.platformCard}>
      <div className={styles.platformHeader}>
        <span className={styles.platformLogo}>{sdk.logo}</span>
        <h4 className={styles.platformName}>{sdk.name}</h4>
      </div>
      <p className={styles.platformDescription}>{sdk.description}</p>
      <div className={styles.platformLanguage}>{sdk.language}</div>
      <Link 
        to={sdk.link}
        className="button button--outline button--sm"
        style={{ marginTop: '1rem' }}
      >
        View Docs
      </Link>
    </div>
  );
}

export default function FrameworkSelector(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [filter, setFilter] = useState<'all' | 'available' | 'coming-soon'>('all');

  const filteredFrameworks = frameworks.filter(framework => 
    filter === 'all' || framework.status === filter || 
    (filter === 'coming-soon' && framework.status !== 'available')
  );

  return (
    <Layout
      title="Choose Your Framework"
      description="Select the best PasskeyMe SDK for your framework and get started quickly"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>🎯 Choose Your Framework</h1>
          <p className={styles.subtitle}>
            Select the best PasskeyMe integration for your project and start building 
            passwordless authentication in minutes.
          </p>
        </header>

        <section className={styles.quickDecision}>
          <div className={styles.decisionCard}>
            <h2>🚀 Quick Decision</h2>
            <div className={styles.decisionFlow}>
              <div className={styles.decisionStep}>
                <strong>Using React?</strong>
                <br />
                <Link to="/docs/getting-started/quick-start#react-quick-start" className="button button--primary">
                  ✅ Start with React SDK
                </Link>
              </div>
              <div className={styles.decisionStep}>
                <strong>Using other frameworks?</strong>
                <br />
                <Link to="/docs/getting-started/quick-start#javascript-quick-start" className="button button--secondary">
                  📦 Use JavaScript SDK
                </Link>
              </div>
              <div className={styles.decisionStep}>
                <strong>Need maximum control?</strong>
                <br />
                <Link to="/docs/sdks/low-level-overview" className="button button--outline">
                  🔧 Platform SDKs
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.frameworkSection}>
          <div className={styles.sectionHeader}>
            <h2>🛠️ High-Level SDKs (Framework-Specific)</h2>
            <p>Complete authentication solutions with OAuth and passkey support</p>
            
            <div className={styles.filters}>
              <button 
                className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
                onClick={() => setFilter('all')}
              >
                All Frameworks
              </button>
              <button 
                className={`${styles.filterButton} ${filter === 'available' ? styles.active : ''}`}
                onClick={() => setFilter('available')}
              >
                Available Now
              </button>
              <button 
                className={`${styles.filterButton} ${filter === 'coming-soon' ? styles.active : ''}`}
                onClick={() => setFilter('coming-soon')}
              >
                Coming Soon
              </button>
            </div>
          </div>

          <div className={styles.frameworkGrid}>
            {filteredFrameworks.map((framework) => (
              <FrameworkCard key={framework.id} framework={framework} />
            ))}
          </div>
        </section>

        <section className={styles.platformSection}>
          <div className={styles.sectionHeader}>
            <h2>🔧 Low-Level SDKs (Platform-Specific)</h2>
            <p>Passkey-only implementations for maximum control and customization</p>
          </div>

          <div className={styles.platformGrid}>
            {platformSDKs.map((sdk) => (
              <PlatformSDKCard key={sdk.id} sdk={sdk} />
            ))}
          </div>
        </section>

        <section className={styles.helpSection}>
          <div className={styles.helpCard}>
            <h2>🤔 Still Not Sure?</h2>
            <p>
              Need help choosing the right approach for your project? 
              Check our detailed comparison guides or get personalized recommendations.
            </p>
            <div className={styles.helpActions}>
              <Link to="/docs/getting-started/choosing-approach" className="button button--primary">
                📋 Decision Guide
              </Link>
              <Link to="/docs/getting-started/framework-comparison" className="button button--secondary">
                📊 Framework Comparison
              </Link>
              <Link to="https://discord.gg/passkeyme" className="button button--outline">
                💬 Get Help on Discord
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}


import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy Integration',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Passkeyme provides a seamless way to integrate Passkeys into your web and mobile applications, making the process simple and efficient.
      </>
),
  },
  {
    title: 'Cross-Platform Support',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Our SDKs support multiple platforms including Web, iOS, and Android, ensuring a consistent authentication experience across all your applications.
      </>
),
  },
  {
    title: 'Enhanced Security',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Utilizing advanced public-key cryptography, Passkeyme ensures that your applications are protected against common security threats such as phishing and password breaches.
      </>
),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

// import React from 'react';
// import clsx from 'clsx';
// import styles from './styles.module.css';
// import { useThemeConfig } from '@docusaurus/theme-common';

// type FeatureItem = {
//   title: string;
//   Svg: React.ComponentType<React.ComponentProps<'svg'>>;
//   description: JSX.Element;
// };

// const FeatureList: FeatureItem[] = [
//   {
//     title: 'Easy Integration',
//     Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
//     description: (
//       <>
//         Passkeyme provides a seamless way to integrate Passkeys into your web and mobile applications, making the process simple and efficient.
//       </>
//     ),
//   },
//   {
//     title: 'Cross-Platform Support',
//     Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
//     description: (
//       <>
//         Our SDKs support multiple platforms including Web, iOS, and Android, ensuring a consistent authentication experience across all your applications.
//       </>
//     ),
//   },
//   {
//     title: 'Enhanced Security',
//     Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
//     description: (
//       <>
//         Utilizing advanced public-key cryptography, Passkeyme ensures that your applications are protected against common security threats such as phishing and password breaches.
//       </>
//     ),
//   },
// ];

// function Feature({title, Svg, description}: FeatureItem) {
//   return (
//     <div className={clsx('col col--4')}>
//       <div className="text--center">
//         <Svg className={styles.featureSvg} role="img" />
//       </div>
//       <div className="text--center padding-horiz--md">
//         <h3>{title}</h3>
//         <p>{description}</p>
//       </div>
//     </div>
//   );
// }

// export default function HomepageFeatures(): JSX.Element {
//   const {frontPage: {features} = {features: FeatureList}} = useThemeConfig();
//   return (
//     <section className={styles.features}>
//       <div className="container">
//         <div className="row">
//           {features.map((props, idx) => (
//             <Feature key={idx} {...props} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

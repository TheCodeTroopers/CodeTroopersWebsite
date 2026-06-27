import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from '../components/Animated';
import { clubInfo, coreValues } from '../data/staticContent';
import styles from './About.module.css';

const valueIcons = {
  learning: '📚', ownership: '🎯', collaboration: '🤝',
  innovation: '💡', professionalism: '⭐', leadership: '🚀'
};

export default function About() {
  return (
    <>
      <SEOHead title="About" description="Learn about Code Troopers — our vision, mission, core values, and golden rules." path="/about" />
      <PageHeader label="About Us" title="About Code Troopers" subtitle="A student-driven technical community fostering innovation and excellence." />

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className={styles.intro}>
              <h2>Club Introduction</h2>
              <p>{clubInfo.introduction}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="grid-2">
            <FadeIn>
              <HoverCard className={styles.card}>
                <div className={styles.cardIcon}>🎯</div>
                <h3>Vision</h3>
                <p>{clubInfo.vision}</p>
              </HoverCard>
            </FadeIn>
            <FadeIn delay={1}>
              <HoverCard className={styles.card}>
                <div className={styles.cardIcon}>🚀</div>
                <h3>Mission</h3>
                <ul>{clubInfo.mission.map((m, i) => <li key={i}>{m}</li>)}</ul>
              </HoverCard>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <span className="section-label">What We Stand For</span>
              <h2 className="section-title">Core Values</h2>
            </div>
          </FadeIn>
          <StaggerContainer className="grid-3">
            {coreValues.map(v => (
              <StaggerItem key={v.title}>
                <HoverCard className={styles.valueCard}>
                  <span className={styles.valueIcon}>{valueIcons[v.icon]}</span>
                  <h3>{v.title}</h3>
                  <p>{v.description}</p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <span className="section-label">Our Motto</span>
              <h2 className="section-title">{clubInfo.motto[0]}</h2>
              <p className="section-subtitle">{clubInfo.motto[1]}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <span className="section-label">Guiding Principles</span>
              <h2 className="section-title">Golden Rules</h2>
            </div>
          </FadeIn>
          <div className={styles.rulesGrid}>
            {clubInfo.goldenRules.map((rule, i) => (
              <FadeIn key={i} delay={i}>
                <div className={styles.rule}>
                  <span className={styles.ruleNum}>{String(i + 1).padStart(2, '0')}</span>
                  <p>{rule}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

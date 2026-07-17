import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from '../components/Animated';
import { clubInfo, coreValues } from '../data/staticContent';
import styles from './About.module.css';
import { LuBookOpen, LuShieldCheck, LuUsers, LuLightbulb, LuBriefcase, LuCrown } from 'react-icons/lu';


const valueIcons = {
  learning: <LuBookOpen size={34} stroke="url(#blueGrad)" strokeWidth={1.8} />,
  ownership: <LuShieldCheck size={34} stroke="url(#greenGrad)" strokeWidth={1.8} />,
  collaboration: <LuUsers size={34} stroke="url(#goldGrad)" strokeWidth={1.8} />,
  innovation: <LuLightbulb size={34} stroke="url(#yellowGrad)" strokeWidth={1.8} />,
  professionalism: <LuBriefcase size={34} stroke="url(#purpleGrad)" strokeWidth={1.8} />,
  leadership: <LuCrown size={34} stroke="url(#redGrad)" strokeWidth={1.8} />
};

export default function About() {
  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="yellowGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <linearGradient id="purpleGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="redGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
      </svg>
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
                <h3>Vision</h3>
                <p>{clubInfo.vision}</p>
              </HoverCard>
            </FadeIn>
            <FadeIn delay={1}>
              <HoverCard className={styles.card}>
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
                  <div className={`${styles.valueIcon} ${styles[v.icon]}`}>{valueIcons[v.icon]}</div>
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

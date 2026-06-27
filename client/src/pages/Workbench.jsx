import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import { FadeIn, HoverCard, StaggerContainer, StaggerItem } from '../components/Animated';
import { workbenchContent } from '../data/staticContent';
import styles from './Workbench.module.css';

export default function Workbench() {
  const wb = workbenchContent;

  return (
    <>
      <SEOHead title="Workbench" description="Code Troopers Workbench — learning ecosystem, policies, and roadmaps." path="/workbench" />
      <PageHeader label="Platform" title="Workbench" subtitle="Our internal learning ecosystem powering member growth and development." />

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className={styles.overview}>
              <p>{wb.overview}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <h2 className={styles.sectionTitle}>{wb.technicalRoadmap.title}</h2>
          </FadeIn>
          <div className={styles.roadmapGrid}>
            {wb.technicalRoadmap.phases.map((phase, i) => (
              <FadeIn key={i} delay={i}>
                <HoverCard className={styles.roadmapCard}>
                  <span className={styles.phaseNum}>Phase {i + 1}</span>
                  <h3>{phase.phase.split('—')[1]?.trim() || phase.phase}</h3>
                  <ul>{phase.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <h2 className={styles.sectionTitle}>{wb.learningRoadmap.title}</h2>
          </FadeIn>
          <StaggerContainer className="grid-2">
            {wb.learningRoadmap.tracks.map(track => (
              <StaggerItem key={track.track}>
                <HoverCard className={styles.trackCard}>
                  <h3>{track.track}</h3>
                  <div className={styles.levels}>
                    {track.levels.map((level, i) => (
                      <div key={i} className={styles.level}>
                        <span className={styles.levelNum}>{i + 1}</span>
                        <span>{level}</span>
                      </div>
                    ))}
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="grid-2">
            <FadeIn>
              <HoverCard className={styles.policyCard}>
                <h3>{wb.githubPolicy.title}</h3>
                <ul>{wb.githubPolicy.rules.map((r, i) => <li key={i}>{r}</li>)}</ul>
                <div className={styles.branchList}>
                  <h4>Branch Structure</h4>
                  {wb.githubPolicy.branchStructure.map((b, i) => (
                    <code key={i}>{b}</code>
                  ))}
                </div>
              </HoverCard>
            </FadeIn>
            <FadeIn delay={1}>
              <HoverCard className={styles.policyCard}>
                <h3>{wb.projectGovernance.title}</h3>
                <h4>Proposal Requirements</h4>
                <ul>{wb.projectGovernance.proposalRequirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
                <h4>Project Lifecycle</h4>
                <div className={styles.lifecycle}>
                  {wb.projectGovernance.lifecycle.map((step, i) => (
                    <span key={i}>{step}{i < wb.projectGovernance.lifecycle.length - 1 && ' → '}</span>
                  ))}
                </div>
              </HoverCard>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <h2 className={styles.sectionTitle}>{wb.contributionPoints.title}</h2>
          </FadeIn>
          <div className={styles.pointsTable}>
            {wb.contributionPoints.activities.map((a, i) => (
              <FadeIn key={i} delay={i % 4}>
                <div className={styles.pointRow}>
                  <span>{a.activity}</span>
                  <span className={styles.points}>{a.points}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <h2 className={styles.sectionTitle}>{wb.promotionPolicy.title}</h2>
          </FadeIn>
          <FadeIn>
            <div className={styles.promotionPath}>
              {wb.promotionPolicy.path.map((step, i) => (
                <div key={i} className={styles.promotionStep}>
                  <span>{step}</span>
                  {i < wb.promotionPolicy.path.length - 1 && <span className={styles.arrow}>↓</span>}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2">
            <FadeIn>
              <HoverCard className={styles.policyCard}>
                <h3>{wb.communicationPolicy.title}</h3>
                <div className={styles.platformTags}>
                  {wb.communicationPolicy.platforms.map(p => (
                    <span key={p} className={styles.platform}>{p}</span>
                  ))}
                </div>
                <p className={styles.policyNote}>{wb.communicationPolicy.rule}</p>
              </HoverCard>
            </FadeIn>
            <FadeIn delay={1}>
              <HoverCard className={styles.policyCard}>
                <h3>{wb.meetingPolicy.title}</h3>
                {wb.meetingPolicy.meetings.map((m, i) => (
                  <div key={i} className={styles.meetingRow}>
                    <strong>{m.type}</strong>
                    <span>{m.frequency}</span>
                    <span className={styles.attendees}>{m.attendees}</span>
                  </div>
                ))}
              </HoverCard>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}

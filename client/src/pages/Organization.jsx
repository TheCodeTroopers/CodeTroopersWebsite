import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import { FadeIn, HoverCard } from '../components/Animated';
import { organizationStructure } from '../data/staticContent';
import styles from './Organization.module.css';

function TeamCard({ team, isLeadership = false }) {
  return (
    <HoverCard className={styles.teamCard}>
      <div className={styles.teamHeader}>
        <h3>{team.name || team.title}</h3>
        {team.role && <span className={styles.role}>{team.role}</span>}
      </div>
      {team.objective && (
        <div className={styles.section}>
          <h4>Objective</h4>
          <p>{team.objective}</p>
        </div>
      )}
      {team.responsibilities && (
        <div className={styles.section}>
          <h4>Responsibilities</h4>
          <ul>{team.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </div>
      )}
      {team.kpis && (
        <div className={styles.section}>
          <h4>KPIs</h4>
          <div className={styles.kpiTags}>
            {team.kpis.map((k, i) => <span key={i} className={styles.kpi}>{k}</span>)}
          </div>
        </div>
      )}
    </HoverCard>
  );
}

export default function Organization() {
  return (
    <>
      <SEOHead title="Organization Structure" description="Code Troopers organizational structure — teams, responsibilities, and KPIs." path="/organization" />
      <PageHeader label="Structure" title="Organization Structure" subtitle="How Code Troopers is organized for maximum impact." />

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className={styles.timeline}>
              <div className={styles.timelineLine} />
              {organizationStructure.map((org, idx) => (
                <div key={org.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <FadeIn delay={idx}>
                    <div className={styles.orgBlock}>
                      <h2 className={styles.orgTitle}>{org.title}</h2>
                      {org.teams ? (
                        <div className="grid-2">
                          {org.teams.map(team => (
                            <TeamCard key={team.name} team={team} isLeadership />
                          ))}
                        </div>
                      ) : (
                        <TeamCard team={org} />
                      )}
                    </div>
                  </FadeIn>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import { FadeIn, HoverCard, StaggerContainer, StaggerItem } from '../components/Animated';
import { workbenchContent } from '../data/staticContent';
import styles from './Workbench.module.css';
import {
  LuLayers,
  LuCpu,
  LuGraduationCap,
  LuCode,
  LuUsers,
  LuGitBranch,
  LuRocket,
  LuUserCheck,
  LuGitPullRequest,
  LuPresentation,
  LuAward,
  LuZap,
  LuHeart,
  LuTrophy,
  LuFolderGit2,
  LuTrendingUp,
  LuNetwork,
  LuCheck
} from 'react-icons/lu';

const whatIsIcons = [<LuLayers size={24} />, <LuCpu size={24} />, <LuGraduationCap size={24} />];

const projectIcons = {
  code: <LuCode size={24} />,
  users: <LuUsers size={24} />,
  git: <LuGitBranch size={24} />,
  rocket: <LuRocket size={24} />
};

const mentorshipIcons = [<LuUserCheck size={24} />, <LuGitPullRequest size={24} />, <LuPresentation size={24} />, <LuAward size={24} />];

const whyJoinIcons = [
  <LuZap size={22} />,
  <LuHeart size={22} />,
  <LuTrophy size={22} />,
  <LuFolderGit2 size={22} />,
  <LuTrendingUp size={22} />,
  <LuNetwork size={22} />
];

export default function Workbench() {
  const wb = workbenchContent;

  return (
    <>
      <SEOHead
        title="Workbench"
        description="Code Troopers Workbench — learning ecosystem, learning tracks, project-based learning, mentorship, and member benefits."
        path="/workbench"
      />

      {/* 1. Workbench Hero Header */}
      <PageHeader
        label="Platform"
        title="Workbench"
        subtitle="Our internal learning ecosystem powering member growth and development."
      />

      {/* 2. What is Workbench? */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <span className="section-label">ECOSYSTEM</span>
              <h2 className="section-title">{wb.whatIsWorkbench.title}</h2>
              <p className="section-subtitle">{wb.whatIsWorkbench.subtitle}</p>
            </div>
            <div className={styles.overviewText}>
              <p>{wb.whatIsWorkbench.description}</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid-3" style={{ marginTop: '2.5rem' }}>
            {wb.whatIsWorkbench.features.map((feature, i) => (
              <StaggerItem key={i}>
                <HoverCard className={styles.featureCard}>
                  <div className={styles.featureHeader}>
                    <div className={styles.featureIcon}>{whatIsIcons[i]}</div>
                    <span className={styles.featureNumber}>0{i + 1}</span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 3. Learning Tracks */}
      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <span className="section-label">PATHWAYS</span>
              <h2 className="section-title">{wb.learningRoadmap.title}</h2>
              <p className="section-subtitle">{wb.learningRoadmap.subtitle}</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid-2" style={{ marginTop: '2.5rem' }}>
            {wb.learningRoadmap.tracks.map((track, trackIdx) => (
              <StaggerItem key={track.track}>
                <HoverCard className={styles.trackCard}>
                  <div className={styles.trackBadge}>Track 0{trackIdx + 1}</div>
                  <h3>{track.track}</h3>
                  <p className={styles.trackDesc}>{track.description}</p>
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

      {/* 4. Project Based Learning */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <span className="section-label">HANDS-ON</span>
              <h2 className="section-title">{wb.projectBasedLearning.title}</h2>
              <p className="section-subtitle">{wb.projectBasedLearning.subtitle}</p>
            </div>
            <div className={styles.overviewText}>
              <p>{wb.projectBasedLearning.description}</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid-2" style={{ marginTop: '2.5rem' }}>
            {wb.projectBasedLearning.highlights.map((item, i) => (
              <StaggerItem key={i}>
                <HoverCard className={styles.projectCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.projectIcon}>{projectIcons[item.icon]}</div>
                    <h3>{item.title}</h3>
                  </div>
                  <p>{item.description}</p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 5. Mentorship */}
      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <span className="section-label">GUIDANCE</span>
              <h2 className="section-title">{wb.mentorship.title}</h2>
              <p className="section-subtitle">{wb.mentorship.subtitle}</p>
            </div>
            <div className={styles.overviewText}>
              <p>{wb.mentorship.description}</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid-2" style={{ marginTop: '2.5rem' }}>
            {wb.mentorship.pillars.map((pillar, i) => (
              <StaggerItem key={i}>
                <HoverCard className={styles.mentorshipCard}>
                  <div className={styles.pillarHeader}>
                    <div className={styles.mentorshipIcon}>{mentorshipIcons[i]}</div>
                    <span className={styles.pillarBadge}>Pillar 0{i + 1}</span>
                  </div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 6. Why Join CodeTroopers? */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <span className="section-label">BENEFITS</span>
              <h2 className="section-title">{wb.whyJoin.title}</h2>
              <p className="section-subtitle">{wb.whyJoin.subtitle}</p>
            </div>
          </FadeIn>
          <StaggerContainer className="grid-3" style={{ marginTop: '2.5rem' }}>
            {wb.whyJoin.reasons.map((reason, i) => (
              <StaggerItem key={i}>
                <HoverCard className={styles.whyJoinCard}>
                  <div className={styles.whyJoinHeader}>
                    <div className={styles.whyJoinIcon}>{whyJoinIcons[i]}</div>
                    <div className={styles.checkBadge}>
                      <LuCheck size={14} />
                    </div>
                  </div>
                  <h3>{reason.title}</h3>
                  <p>{reason.description}</p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}



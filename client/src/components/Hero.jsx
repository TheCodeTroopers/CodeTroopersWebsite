import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiUserGroup } from 'react-icons/hi';
import { clubInfo } from '../data/staticContent';
import styles from './Hero.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }
  })
};

/* Slow, gentle floating — logo feels alive */
const floatAnim = {
  animate: {
    y: [0, -14, 0],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

/* Subtle pulse on ambient glows */
const pulseGlow = {
  animate: {
    scale: [1, 1.06, 1],
    opacity: [0.55, 0.85, 0.55],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

/* Offset glow pulse for visual variety */
const pulseGlowOffset = {
  animate: {
    scale: [1, 1.08, 1],
    opacity: [0.45, 0.7, 0.45],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2
    }
  }
};

const heroCode = `const buildExperience = {
  mission: "Learn. Build. Lead.",
  stack: ["React", "Node", "Design"],
  impact: () => "Industry-ready builders"
};

buildExperience.impact();`;

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bgPattern} />
      <div className={styles.bgGrid} />
      
      <div className={styles.container}>
        {/* ── Left: Text Content ───────────────────────── */}
        <motion.div className={styles.content} initial="hidden" animate="visible">
          <motion.span className={styles.kicker} variants={fadeUp} custom={0.1}>
            We don't just code
            <span>We create impact.</span>
          </motion.span>

          <motion.h1 className={styles.statement} variants={fadeUp} custom={0.2}>
            <span>Ideate.</span>
            <span>Code.</span>
            <span>Debug.</span>
          </motion.h1>

          <motion.div className={styles.divider} variants={fadeUp} custom={0.28}>
            <span>&lt;/&gt;</span>
          </motion.div>

          <motion.p className={styles.subtitle} variants={fadeUp} custom={0.36}>
            {clubInfo.name} is the technical club of problem solvers, innovators and builders. We learn, build and lead together to create a better tomorrow.
          </motion.p>

          <motion.p className={styles.tagline} variants={fadeUp} custom={0.44}>
            {clubInfo.tagline}
          </motion.p>

          <motion.div className={styles.actions} variants={fadeUp} custom={0.5}>
            <Link to="/about" className="btn btn-white">
              Explore More <HiArrowRight />
            </Link>
            <Link to="/contact" className={`btn btn-outline ${styles.outlineBtn}`}>
              Join Us
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Right: Visual Showcase ────────────────────── */}
        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, x: 36, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.82, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Ambient Glows ── */}
          <motion.div 
            className={styles.glowMaroon} 
            variants={pulseGlow}
            animate="animate"
            aria-hidden="true" 
          />
          <motion.div 
            className={styles.glowGold} 
            variants={pulseGlowOffset}
            animate="animate"
            aria-hidden="true" 
          />

          {/* ── Orbit Rings ── */}
          <motion.div
            className={styles.orbitOuter}
            aria-hidden="true"
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className={styles.orbitMid}
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className={styles.orbitInner}
            aria-hidden="true"
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />

          {/* ── Decorative Geometric Corner Elements ── */}
          <div className={styles.geoTL} aria-hidden="true" />
          <div className={styles.geoTR} aria-hidden="true" />
          <div className={styles.geoBL} aria-hidden="true" />
          <div className={styles.geoBR} aria-hidden="true" />

          {/* ── Ambient Particles ── */}
          <div className={styles.particlesContainer} aria-hidden="true">
            <span className={styles.particle} />
            <span className={styles.particle} />
            <span className={styles.particle} />
            <span className={styles.particle} />
            <span className={styles.particle} />
            <span className={styles.particle} />
          </div>

          {/* ── Code Editor Centerpiece ── */}
          <motion.div
            className={styles.editorStage}
            variants={floatAnim}
            animate="animate"
          >
            <div className={styles.editorAtmosphere} aria-hidden="true" />
            <div className={styles.codeBlockHero}>
              <div className={styles.codeHeader}>
                <span /><span /><span />
                <span className={styles.codeTitle}>src/hero.tsx</span>
                <span className={styles.codeStatus}>LIVE</span>
              </div>
              <div className={styles.editorBody}>
                <div className={styles.lineNumbers} aria-hidden="true">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                </div>
                <pre className={styles.code}>{`const community = {
  mission: "Learn • Build • Lead",
  focus: ["AI", "Web", "Open Source"],
  impact: "Real-world solutions"
};

function ship() {
  return "Build with intent";
}`}</pre>
              </div>
              <div className={styles.editorFooter}>
                <span>React</span>
                <span>TypeScript</span>
                <span>UI Systems</span>
              </div>
            </div>
          </motion.div>

          {/* ── Floating UI Cards ── */}
          <div className={styles.communityCard}>
            <HiUserGroup />
            <p>A community of <strong>thinkers, builders</strong> and dreamers.</p>
            <span />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { clubInfo } from '../data/staticContent';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bgPattern} />
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className={styles.badge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Academic Year 2026–27
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {clubInfo.name}
          </motion.h1>

          <motion.p className={styles.tagline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {clubInfo.tagline}
          </motion.p>

          <motion.p className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {clubInfo.secondaryTagline}
          </motion.p>

          <motion.div className={styles.actions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/about" className="btn btn-white">
              Explore Club <HiArrowRight />
            </Link>
            <Link to="/contact" className={`btn btn-outline ${styles.outlineBtn}`}>
              Join Us
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span /><span /><span />
              <span className={styles.codeTitle}>codetroopers.js</span>
            </div>
            <pre className={styles.code}>
{`const troopers = {
  mission: "Learn. Build. Lead.",
  values: [
    "Learning",
    "Ownership",
    "Collaboration",
    "Innovation"
  ],
  build: () => {
    return "Industry-Ready Developers";
  }
};

troopers.build(); // ✓ Success`}
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

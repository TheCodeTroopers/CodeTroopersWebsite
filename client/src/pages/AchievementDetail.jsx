import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import { getAchievements } from '../services/api';
import { achievementCategories } from '../data/staticContent';
import styles from './AchievementDetail.module.css';

export default function AchievementDetail() {
  const { id } = useParams();
  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAchievements()
      .then((r) => {
        const found = r.data.items.find((item) => item.id === id);
        setAchievement(found || null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.loadingSpinner}>Loading details...</div>
      </div>
    );
  }

  if (!achievement) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <h2>Achievement Not Found</h2>
        <p>The achievement you are looking for does not exist or has been removed.</p>
        <Link to="/achievements" className="btn btn-primary">
          Back to Achievements
        </Link>
      </div>
    );
  }

  const categoryLabel = achievementCategories.find((c) => c.slug === achievement.category)?.label || achievement.category;
  const isGyanBit = achievement.id === 'ach-001';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const imageSectionVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const textSectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const highlightListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.4
      }
    }
  };

  const highlightItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 200, damping: 18 }
    }
  };

  return (
    <>
      <SEOHead
        title={achievement.title}
        description={achievement.description.slice(0, 150)}
        path={`/achievements/${id}`}
      />

      <div className={styles.containerWrapper}>
        {/* Animated Glow Blobs */}
        <div className={styles.glowBlob1}></div>
        <div className={styles.glowBlob2}></div>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/achievements" className={styles.backBtn}>
              <span className={styles.arrow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </span>
              Back to Achievements
            </Link>
          </motion.div>

          <motion.div
            className={styles.detailWrapper}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className={styles.headerArea} variants={headerVariants}>
              <div className={styles.metaRow}>
                <span className={styles.category}>{categoryLabel}</span>
                <span className={styles.date}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {new Date(achievement.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h1 className={styles.title}>{achievement.title}</h1>

              {achievement.tags && achievement.tags.length > 0 && (
                <div className={styles.tagsCloud}>
                  {achievement.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      className={styles.tagPill}
                      whileHover={{ scale: 1.05 }}
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              )}
            </motion.div>

            <div className={styles.contentGrid}>
              <motion.div className={styles.imageSection} variants={imageSectionVariants}>
                <div className={styles.imageStack}>
                  {Array.isArray(achievement.image) ? (
                    achievement.image.map((imgUrl, i) => (
                      <div key={i} className={`${styles.imgWrapper} ${isGyanBit ? styles.gyanBitWrapper : ''}`}>
                        <img
                          src={imgUrl}
                          alt={`${achievement.title} - ${i + 1}`}
                          className={isGyanBit ? (i === 1 ? styles.gyanBitImg2 : styles.gyanBitImg1) : ''}
                        />
                      </div>
                    ))
                  ) : (
                    <div className={styles.imgWrapper}>
                      <img src={achievement.image} alt={achievement.title} />
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div className={styles.descriptionSection} variants={textSectionVariants}>
                <div className={styles.card}>
                  <h3>About the Achievement</h3>
                  <p className={styles.descriptionText}>{achievement.description}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import { FadeIn, HoverCard } from '../components/Animated';
import { achievementCategories } from '../data/staticContent';
import { getAchievements } from '../services/api';
import styles from './Achievements.module.css';

export default function Achievements() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAchievements().then(r => setItems(r.data.items)).catch(() => {});
  }, []);

  useEffect(() => {
    if (id) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [id]);

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);
  const activeItem = id ? items.find(item => item.id === id) : null;

  return (
    <>
      <SEOHead title="Achievements" description="Code Troopers achievements — hackathon wins, projects, certifications, and awards." path="/achievements" />
      <PageHeader label="Recognition" title="Our Achievements" subtitle="Celebrating milestones, wins, and the impact we create together." />

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className={styles.filters}>
              <button className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>All</button>
              {achievementCategories.map(c => (
                <button key={c.slug} className={`${styles.filterBtn} ${filter === c.slug ? styles.active : ''}`} onClick={() => setFilter(c.slug)}>
                  {c.label}
                </button>
              ))}
            </div>
          </FadeIn>

          <div className={styles.grid}>
            {filtered.map((a, i) => (
              <FadeIn key={a.id} delay={i % 4}>
                <Link to={`/achievements/${a.id}`} className={styles.cardLink}>
                  <HoverCard className={styles.card}>
                    <div className={styles.imageWrap}>
                      {Array.isArray(a.image) ? (
                        <div className={styles.multiImage}>
                          {a.image.map((imgUrl, idx) => (
                            <img key={idx} src={imgUrl} alt={`${a.title} - ${idx + 1}`} loading="lazy" />
                          ))}
                        </div>
                      ) : (
                        <img src={a.image} alt={a.title} loading="lazy" />
                      )}
                      <span className={styles.category}>
                        {achievementCategories.find(c => c.slug === a.category)?.label || a.category}
                      </span>
                    </div>
                    <div className={styles.body}>
                      <h3>{a.title}</h3>
                      <p>{a.description}</p>
                    </div>
                  </HoverCard>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Navigated Overlay Detail View */}
      <AnimatePresence>
        {id && activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={styles.overlayBackdrop}
            onClick={() => navigate('/achievements')}
          >
            <div className={styles.overlayLayoutWrapper} onClick={(e) => e.stopPropagation()}>
              
              {/* Main Center Detail Area */}
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={styles.detailCard}
              >
                {/* Close Button inside details area for better mobile support too */}
                <button className={styles.closeBtn} onClick={() => navigate('/achievements')} aria-label="Close details">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                {/* Top Image Stack */}
                <div className={styles.detailImageStack}>
                  {Array.isArray(activeItem.image) ? (
                    <div className={styles.detailMultiImageGrid}>
                      {activeItem.image.map((imgUrl, idx) => (
                        <div key={idx} className={styles.detailImageWrapper}>
                          <img src={imgUrl} alt={`${activeItem.title} - ${idx + 1}`} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.detailImageWrapper}>
                      <img src={activeItem.image} alt={activeItem.title} />
                    </div>
                  )}
                </div>

                {/* Bottom Details Content */}
                <div className={styles.detailCardBody}>
                  <div className={styles.detailHeaderMeta}>
                    <span className={styles.detailCategoryBadge}>
                      {achievementCategories.find(c => c.slug === activeItem.category)?.label || activeItem.category}
                    </span>
                    <span className={styles.detailDateText}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {new Date(activeItem.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  <h2 className={styles.detailTitle}>{activeItem.title}</h2>
                  
                  <p className={styles.detailDescriptionText}>
                    {activeItem.description}
                  </p>

                  {activeItem.tags && activeItem.tags.length > 0 && (
                    <div className={styles.detailTagsGroup}>
                      {activeItem.tags.map((tag, idx) => (
                        <span key={idx} className={styles.detailTag}>#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Right Sidebar - Other Cards */}
              <div className={styles.sidebar}>
                <h3 className={styles.sidebarTitle}>Achievements</h3>
                <div className={styles.sidebarList}>
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      to={`/achievements/${item.id}`}
                      className={`${styles.sidebarItemCard} ${item.id === id ? styles.sidebarItemActive : ''}`}
                    >
                      <div className={styles.sidebarItemThumb}>
                        {Array.isArray(item.image) ? (
                          <img src={item.image[0]} alt={item.title} />
                        ) : (
                          <img src={item.image} alt={item.title} />
                        )}
                      </div>
                      <div className={styles.sidebarItemContent}>
                        <h4>{item.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}



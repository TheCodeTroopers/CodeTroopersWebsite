import { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import { FadeIn, HoverCard } from '../components/Animated';
import { getGallery } from '../services/api';
import styles from './Gallery.module.css';

const categories = [
  { slug: 'all', label: 'All' },
  { slug: 'workshops', label: 'Workshops' },
  { slug: 'hackathons', label: 'Hackathons' },
  { slug: 'competitions', label: 'Competitions' },
  { slug: 'technical-talks', label: 'Technical Talks' },
  { slug: 'guest-lectures', label: 'Guest Lectures' },
  { slug: 'general', label: 'General' }
];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getGallery().then(r => setItems(r.data.items)).catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

  return (
    <>
      <SEOHead title="Gallery" description="Code Troopers photo gallery — events, workshops, hackathons, and more." path="/gallery" />
      <PageHeader label="Memories" title="Gallery" subtitle="Capturing the moments that define our journey." />

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className={styles.filters}>
              {categories.map(c => (
                <button key={c.slug} className={`${styles.filterBtn} ${filter === c.slug ? styles.active : ''}`} onClick={() => setFilter(c.slug)}>
                  {c.label}
                </button>
              ))}
            </div>
          </FadeIn>

          <div className={styles.grid}>
            {filtered.map((item, i) => (
              <FadeIn key={item.id} delay={i % 6}>
                <HoverCard>
                  <div className={styles.item} onClick={() => setLightbox(item)}>
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <div className={styles.overlay}>
                      <span>{item.title}</span>
                    </div>
                  </div>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button className={styles.closeBtn} onClick={() => setLightbox(null)} aria-label="Close">
              <HiX />
            </button>
            <motion.div
              className={styles.lightboxContent}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              <img src={lightbox.image} alt={lightbox.title} />
              <p>{lightbox.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

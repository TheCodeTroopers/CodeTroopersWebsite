import { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import { FadeIn, HoverCard } from '../components/Animated';
import { achievementCategories } from '../data/staticContent';
import { getAchievements } from '../services/api';
import styles from './Achievements.module.css';

export default function Achievements() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAchievements().then(r => setItems(r.data.items)).catch(() => {});
  }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

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
                <HoverCard className={styles.card}>
                  <div className={styles.imageWrap}>
                    <img src={a.image} alt={a.title} loading="lazy" />
                    <span className={styles.category}>
                      {achievementCategories.find(c => c.slug === a.category)?.label || a.category}
                    </span>
                  </div>
                  <div className={styles.body}>
                    <h3>{a.title}</h3>
                    <p>{a.description}</p>
                    <span className={styles.date}>
                      {new Date(a.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

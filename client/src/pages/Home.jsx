import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import SEOHead from '../components/SEOHead';
import Hero from '../components/Hero';
import EventCard, { EventCardCompact } from '../components/EventCard';
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from '../components/Animated';
import { clubInfo, stats, coreValues } from '../data/staticContent';
import { getEvents, getAchievements, getGallery, getTestimonials } from '../services/api';
import styles from './Home.module.css';

const valueIcons = {
  learning: '📚', ownership: '🎯', collaboration: '🤝',
  innovation: '💡', professionalism: '⭐', leadership: '🚀'
};

export default function Home() {
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getEvents().then(r => setEvents(r.data.events.filter(e => e.status === 'upcoming').slice(0, 3))).catch(() => {});
    getAchievements().then(r => setAchievements(r.data.items.slice(0, 4))).catch(() => {});
    getGallery().then(r => setGallery(r.data.items.slice(0, 6))).catch(() => {});
    getTestimonials().then(r => setTestimonials(r.data.testimonials)).catch(() => {});
  }, []);

  return (
    <>
      <SEOHead title="Home" description="Code Troopers — Learn. Build. Lead. Join our student developer community." path="/" />
      <Hero />

      <section className={`section ${styles.aboutPreview}`}>
        <div className="container">
          <FadeIn>
            <div className={styles.aboutGrid}>
              <div>
                <span className="section-label">About Us</span>
                <h2 className="section-title">Who We Are</h2>
                <p>{clubInfo.introduction}</p>
                <Link to="/about" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                  Learn More <HiArrowRight />
                </Link>
              </div>
              <div className={styles.aboutVisual}>
                <div className={styles.aboutCard}>
                  <span className={styles.aboutIcon}>&lt;/&gt;</span>
                  <h3>Student-Driven</h3>
                  <p>Built by students, for students — fostering real-world skills.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <span className="section-label">Our Purpose</span>
              <h2 className="section-title">Vision & Mission</h2>
            </div>
          </FadeIn>
          <div className="grid-2">
            <FadeIn delay={1}>
              <HoverCard className={styles.visionCard}>
                <h3>Vision</h3>
                <p>{clubInfo.vision}</p>
              </HoverCard>
            </FadeIn>
            <FadeIn delay={2}>
              <HoverCard className={styles.missionCard}>
                <h3>Mission</h3>
                <ul>{clubInfo.mission.map((m, i) => <li key={i}>{m}</li>)}</ul>
              </HoverCard>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className={`section ${styles.stats}`}>
        <div className="container">
          <StaggerContainer className="grid-4">
            {stats.map((s, i) => (
              <StaggerItem key={i}>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <span className="section-label">Events</span>
              <h2 className="section-title">Featured Events</h2>
            </div>
          </FadeIn>
          <div className="grid-3">
            {events.map(e => <FadeIn key={e.id}><EventCard event={e} /></FadeIn>)}
          </div>
          <FadeIn>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/events/workshops" className="btn btn-outline">View All Events</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <span className="section-label">Recognition</span>
              <h2 className="section-title">Achievements</h2>
            </div>
          </FadeIn>
          <div className="grid-2">
            {achievements.map(a => (
              <FadeIn key={a.id}>
                <HoverCard className={styles.achievementCard}>
                  <img src={a.image} alt={a.title} />
                  <div>
                    <h4>{a.title}</h4>
                    <p>{a.description.slice(0, 100)}...</p>
                  </div>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/achievements" className="btn btn-primary">All Achievements</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <span className="section-label">Gallery</span>
              <h2 className="section-title">Moments That Matter</h2>
            </div>
          </FadeIn>
          <div className={styles.galleryGrid}>
            {gallery.map(g => (
              <FadeIn key={g.id}>
                <HoverCard className={styles.galleryItem}>
                  <img src={g.image} alt={g.title} loading="lazy" />
                  <div className={styles.galleryOverlay}><span>{g.title}</span></div>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/gallery" className="btn btn-outline">View Gallery</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <FadeIn>
            <div className="section-header">
              <span className="section-label">Testimonials</span>
              <h2 className="section-title">What People Say</h2>
            </div>
          </FadeIn>
          <div className="grid-2">
            {testimonials.map(t => (
              <FadeIn key={t.id}>
                <HoverCard className={styles.testimonial}>
                  <p className={styles.quote}>"{t.quote}"</p>
                  <div className={styles.testimonialAuthor}>
                    <span className={styles.avatar}>{t.avatar}</span>
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.join}`}>
        <div className="container">
          <FadeIn>
            <div className={styles.joinContent}>
              <h2>Join Code Troopers</h2>
              <p>Ready to learn, build, and lead? Become part of our developer community and transform your career.</p>
              <Link to="/contact" className="btn btn-white">Get Started <HiArrowRight /></Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

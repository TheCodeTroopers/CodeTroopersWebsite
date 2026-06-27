import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';
import EventCard from '../components/EventCard';
import { FadeIn } from '../components/Animated';
import { eventTypes } from '../data/staticContent';
import { getEvents } from '../services/api';
import styles from './Events.module.css';

export default function Events() {
  const location = useLocation();
  const type = location.pathname.replace('/events/', '');
  const eventType = eventTypes.find(t => t.slug === type) || eventTypes[0];
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    getEvents(type)
      .then(r => setEvents(r.data.events || r.data))
      .catch(() => {});
  }, [type]);

  const { upcoming, past } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const list = Array.isArray(events) ? events : events.events || [];
    return {
      upcoming: list.filter(e => e.date >= today || e.status === 'upcoming'),
      past: list.filter(e => e.date < today && e.status !== 'upcoming')
    };
  }, [events]);

  const displayed = tab === 'upcoming' ? upcoming : past;

  return (
    <>
      <SEOHead title={eventType.label} description={`Code Troopers ${eventType.label} — upcoming and past events.`} path={`/events/${type}`} />
      <PageHeader
        label="Events"
        title={eventType.label}
        subtitle={`Explore our ${eventType.label.toLowerCase()} — past highlights and upcoming sessions.`}
        breadcrumb={`Home / Events / ${eventType.label}`}
      />

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className={styles.tabs}>
              <button className={`${styles.tab} ${tab === 'upcoming' ? styles.activeTab : ''}`} onClick={() => setTab('upcoming')}>
                Upcoming ({upcoming.length})
              </button>
              <button className={`${styles.tab} ${tab === 'past' ? styles.activeTab : ''}`} onClick={() => setTab('past')}>
                Past Events ({past.length})
              </button>
            </div>
          </FadeIn>

          {displayed.length === 0 ? (
            <FadeIn>
              <p className={styles.empty}>No {tab} {eventType.label.toLowerCase()} at the moment.</p>
            </FadeIn>
          ) : (
            <div className="grid-3">
              {displayed.map(e => (
                <FadeIn key={e.id}>
                  <EventCard event={{ ...e, status: tab === 'upcoming' ? 'upcoming' : 'past' }} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

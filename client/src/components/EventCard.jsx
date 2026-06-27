import { Link } from 'react-router-dom';
import { HiCalendar, HiLocationMarker, HiClock, HiUserGroup } from 'react-icons/hi';
import { HoverCard } from './Animated';
import styles from './EventCard.module.css';

export default function EventCard({ event }) {
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <HoverCard>
      <article className={styles.card}>
        <div className={styles.banner}>
          <img src={event.banner} alt={event.title} loading="lazy" />
          <span className={`${styles.badge} ${event.status === 'upcoming' ? styles.upcoming : styles.past}`}>
            {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
          </span>
        </div>
        <div className={styles.body}>
          <h3>{event.title}</h3>
          <p className={styles.desc}>{event.description.slice(0, 120)}...</p>
          <div className={styles.meta}>
            <span><HiCalendar /> {formattedDate}</span>
            <span><HiClock /> {event.time}</span>
            <span><HiLocationMarker /> {event.venue}</span>
            <span><HiUserGroup /> {event.organizer}</span>
          </div>
        </div>
      </article>
    </HoverCard>
  );
}

export function EventCardCompact({ event }) {
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <HoverCard>
      <article className={styles.compact}>
        <div className={styles.compactDate}>
          <span className={styles.day}>{date.getDate()}</span>
          <span className={styles.month}>{date.toLocaleDateString('en-IN', { month: 'short' })}</span>
        </div>
        <div>
          <h4>{event.title}</h4>
          <p>{formattedDate} · {event.venue}</p>
        </div>
      </article>
    </HoverCard>
  );
}

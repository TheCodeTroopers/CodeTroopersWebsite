import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { HiUser } from 'react-icons/hi';
import { HoverCard } from './Animated';
import styles from './TeamCard.module.css';

export default function TeamCard({ member }) {
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <HoverCard>
      <article className={styles.card}>
        <div className={styles.avatar}>
          {member.photo ? (
            <img src={member.photo} alt={member.name} />
          ) : (
            <span className={styles.initials}><HiUser /> {initials}</span>
          )}
        </div>
        <div className={styles.info}>
          <h3>{member.name}</h3>
          <p className={styles.position}>{member.position}</p>
          {member.team && <p className={styles.team}>{member.team}</p>}
          <p className={styles.dept}>{member.department}</p>
          <div className={styles.links}>
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            )}
            {member.github && (
              <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} aria-label="Email">
                <FaEnvelope />
              </a>
            )}
          </div>
        </div>
      </article>
    </HoverCard>
  );
}

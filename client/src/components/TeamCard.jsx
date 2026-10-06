import { useState } from 'react';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { HiUser } from 'react-icons/hi';
import { HoverCard } from './Animated';
import { formatImageUrl } from '../utils/imageHelper';
import styles from './TeamCard.module.css';

function getImageUrl(url) {
  if (!url) return '';
  return formatImageUrl(url);
}

export default function TeamCard({ member }) {
  const [imgError, setImgError] = useState(false);
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const positionText = Array.isArray(member.position) ? member.position.join(' & ') : member.position;
  const isMultiTeam = (Array.isArray(member.team) && member.team.length > 1) || (typeof member.team === 'string' && (member.team.includes(',') || member.team.includes('•')));
  const teamText = Array.isArray(member.team) ? member.team.join(' • ') : member.team;

  const photoUrl = getImageUrl(member.photo);

  const isFaculty = member.category === 'faculty-coordinator' || (Array.isArray(member.category) && member.category.includes('faculty-coordinator'));

  return (
    <HoverCard>
      <article className={styles.card}>
        <div className={styles.avatar}>
          {photoUrl && !imgError ? (
            <img
              src={photoUrl}
              alt={member.name}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              style={{
                objectPosition: member.photoPosition || member.objectPosition || 'center 20%',
                objectFit: member.photoFit || member.objectFit || 'cover',
                transform: member.photoScale ? `scale(${member.photoScale})` : undefined
              }}
            />
          ) : (
            <span className={styles.initials}><HiUser /> {initials}</span>
          )}
        </div>
        <div className={styles.info}>
          <h3>{member.name}</h3>
          <p className={styles.position}>{positionText}</p>
          {teamText && (
            <p className={`${styles.team} ${isMultiTeam ? styles.multiTeam : ''}`}>{teamText}</p>
          )}
          <p className={styles.dept}>{member.department}</p>
          <div className={styles.links}>
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            )}
            {!isFaculty && member.github && (
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

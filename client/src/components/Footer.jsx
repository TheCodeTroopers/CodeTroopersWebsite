import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram, FaDiscord, FaTwitter } from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import styles from './Footer.module.css';

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  discord: FaDiscord,
  twitter: FaTwitter
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>&lt;/&gt;</span>
              <span className={styles.logoText}>CODE TROOPERS</span>
            </div>
            <p className={styles.tagline}>Learn. Build. Lead.</p>
            <p className={styles.desc}>Transforming Students into Industry-Ready Developers through innovation, collaboration, and project-based learning.</p>
            <div className={styles.social}>
              {Object.entries(socialIcons).map(([key, Icon]) => (
                <a key={key} href={`https://${key}.com/code-troopers`} target="_blank" rel="noopener noreferrer" aria-label={key}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.links}>
            <h4>Quick Links</h4>
            <Link to="/about">About</Link>
            <Link to="/team">Team</Link>
            <Link to="/events/workshops">Events</Link>
            <Link to="/achievements">Achievements</Link>
            <Link to="/workbench">Workbench</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className={styles.links}>
            <h4>Resources</h4>
            <Link to="/organization">Organization</Link>
            <Link to="/event-protocol">Event Protocol</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/events/hackathons">Hackathons</Link>
          </div>

          <div className={styles.contact}>
            <h4>Contact</h4>
            <p><HiMail /> codetroopers@college.edu</p>
            <p><HiPhone /> +91 98765 43210</p>
            <p><HiLocationMarker /> CSE Department, College Campus</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Code Troopers. All rights reserved.</p>
          <p>Academic Year 2026–27 | Version 2.0</p>
        </div>
      </div>
    </footer>
  );
}

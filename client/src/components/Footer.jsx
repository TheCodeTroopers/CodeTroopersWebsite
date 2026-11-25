import contactData from '../data/contact.json';
import { Link } from 'react-router-dom';
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTwitter,
} from 'react-icons/fa';
import {
  HiMail,
  HiLocationMarker,
} from 'react-icons/hi';

import styles from './Footer.module.css';

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  twitter: FaTwitter,
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>&lt;/&gt;</span>
              <span className={styles.logoText}>CODE TROOPERS</span>
            </div>

            <p className={styles.tagline}>Learn. Build. Lead.</p>

            <p className={styles.desc}>
              Transforming Students into Industry-Ready Developers through
              innovation, collaboration, and project-based learning.
            </p>

            <div className={styles.social}>
              {Object.entries(socialIcons).map(([key, Icon]) => (
                <a
                  key={key}
                  href={contactData.info.social[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.links}>
            <h4>Quick Links</h4>
            <Link to="/about">About</Link>
            <Link to="/team">Team</Link>
            <Link to="/events/workshops">Events</Link>
            <Link to="/achievements">Achievements</Link>
            <Link to="/workbench">Workbench</Link>
            <Link to="/contact">Contact</Link>
          </div>

          {/* Resources */}
          <div className={styles.links}>
            <h4>Resources</h4>
            <Link to="/organization">Organization</Link>
            <Link to="/event-protocol">Event Protocol</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/events/hackathons">Hackathons</Link>
          </div>

          {/* Contact */}
          <div className={styles.contact}>
            <h4>Contact</h4>

            <p>
              <HiMail /> {contactData.info.email}
            </p>

            <p>
              <HiLocationMarker /> {contactData.info.address}
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Code Troopers. All rights reserved.</p>
          <div className={styles.legal}>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span className={styles.dot}>·</span>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import logoImg from '../assets/codetrooperslogo.png';
import styles from './Navbar.module.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/organization', label: 'Organization' },
  { to: '/team', label: 'Team' },
  {
    label: 'Events',
    children: [
      { to: '/events/workshops', label: 'Workshops' },
      { to: '/events/hackathons', label: 'Hackathons' },
      { to: '/events/competitions', label: 'Competitions' },
      { to: '/events/technical-talks', label: 'Technical Talks' },
      { to: '/events/guest-lectures', label: 'Guest Lectures' }
    ]
  },
  { to: '/event-protocol', label: 'Event Protocol' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/workbench', label: 'Workbench' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src={logoImg} alt="CodeTroopers Logo" className={styles.logoImage} />
          <div>
            <span className={styles.logoText}>CodeTroopers</span>
            <span className={styles.logoTagline}>Club</span>
          </div>
        </Link>

        <ul className={styles.navLinks}>
          {navLinks.map(link =>
            link.children ? (
              <li key={link.label} className={styles.dropdown}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                onFocus={() => setDropdownOpen(true)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setDropdownOpen(false);
                }}>
                <button
                  className={styles.dropdownBtn}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  onClick={() => setDropdownOpen(open => !open)}
                >
                  {link.label} <HiChevronDown />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.ul className={styles.dropdownMenu}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}>
                      {link.children.map(child => (
                        <li key={child.to}>
                          <NavLink to={child.to} className={({ isActive }) => isActive ? styles.active : ''}>
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ) : (
              <li key={link.to}>
                <NavLink 
                  to={link.to} 
                  className={({ isActive }) => 
                    `${link.to === '/contact' ? styles.joinUsBtn : ''} ${isActive ? styles.active : ''}`
                  } 
                  end={link.to === '/'}
                >
                  {link.to === '/contact' ? 'Join Us' : link.label}
                </NavLink>
              </li>
            )
          )}
        </ul>

        <button
          className={styles.mobileToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}>
            {navLinks.map(link =>
              link.children ? (
                <div key={link.label} className={styles.mobileGroup}>
                  <span className={styles.mobileGroupLabel}>{link.label}</span>
                  {link.children.map(child => (
                    <NavLink key={child.to} to={child.to} className={({ isActive }) => isActive ? styles.active : ''}>
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              ) : (
                <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? styles.active : ''} end={link.to === '/'}>
                  {link.label}
                </NavLink>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

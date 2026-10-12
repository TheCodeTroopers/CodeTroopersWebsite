import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiMenu, 
  HiX, 
  HiChevronDown, 
  HiUser, 
  HiLogout, 
  HiViewGrid, 
  HiShieldCheck, 
  HiLogin 
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
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
  { to: '/blogs', label: 'Blogs' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

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

          {/* Desktop Authentication Button / Profile Menu */}
          {isAuthenticated ? (
            <li className={styles.userMenuContainer} ref={userMenuRef}>
              <button
                className={styles.userBtn}
                onClick={() => setUserMenuOpen(prev => !prev)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.name || 'Trooper')}`}
                  alt={user?.name}
                  className={styles.userAvatar}
                />
                <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
                {isAdmin && <span className={styles.adminMiniBadge}>ADMIN</span>}
                <HiChevronDown className={`${styles.chevron} ${userMenuOpen ? styles.rotateChevron : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    className={styles.userDropdown}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                  >
                    <div className={styles.userHeader}>
                      <div className={styles.userHeaderAvatar}>
                        <img
                          src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.name || 'Trooper')}`}
                          alt={user?.name}
                        />
                      </div>
                      <div className={styles.userHeaderInfo}>
                        <div className={styles.userHeaderName}>{user?.name}</div>
                        <div className={styles.userHeaderEmail}>{user?.email}</div>
                        <div className={styles.userHeaderRole}>
                          {isAdmin ? (
                            <span className={styles.adminBadge}><HiShieldCheck /> Administrator</span>
                          ) : (
                            <span className={styles.memberBadge}>Trooper Member</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.userMenuDivider} />

                    {isAdmin && (
                      <Link to="/admin" className={styles.adminLink} onClick={() => setUserMenuOpen(false)}>
                        <HiViewGrid className={styles.menuIcon} /> Admin Dashboard
                      </Link>
                    )}

                    <button className={styles.logoutBtn} onClick={handleLogout}>
                      <HiLogout className={styles.menuIcon} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ) : (
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => `${styles.loginNavBtn} ${isActive ? styles.activeLogin : ''}`}
              >
                <HiLogin className={styles.loginIcon} /> Login
              </NavLink>
            </li>
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
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}>
            
            {/* Mobile User Profile Header if Logged In */}
            {isAuthenticated ? (
              <div className={styles.mobileUserCard}>
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.name || 'Trooper')}`}
                  alt={user?.name}
                  className={styles.mobileUserAvatar}
                />
                <div className={styles.mobileUserInfo}>
                  <div className={styles.mobileUserName}>{user?.name}</div>
                  <div className={styles.mobileUserEmail}>{user?.email}</div>
                  <span className={isAdmin ? styles.adminBadge : styles.memberBadge}>
                    {isAdmin ? 'Administrator' : 'Trooper Member'}
                  </span>
                </div>
              </div>
            ) : null}

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

            {/* Mobile Admin / Login Actions */}
            <div className={styles.mobileAuthSection}>
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className={styles.mobileAdminBtn}>
                      <HiViewGrid /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
                    <HiLogout /> Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className={styles.mobileLoginBtn}>
                  <HiLogin /> Login / Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

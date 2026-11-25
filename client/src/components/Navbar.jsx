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
  HiLogin,
  HiDotsHorizontal,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/codetrooperslogo.png';
import styles from './Navbar.module.css';

// ─── Primary nav (always visible on desktop) ───────────────────────────────
const primaryLinks = [
  { to: '/',        label: 'Home'    },
  { to: '/about',   label: 'About'   },
  { to: '/team',    label: 'Team'    },
  { to: '/contact', label: 'Contact' },
];

// ─── Secondary / "More" links shown in the sidebar drawer ──────────────────
const moreLinks = [
  { group: 'Club',
    links: [
      { to: '/organization',  label: 'Organization'    },
      { to: '/achievements',  label: 'Achievements'    },
      { to: '/gallery',       label: 'Gallery'         },
      { to: '/workbench',     label: 'Workbench'       },
    ]
  },
  { group: 'Events',
    links: [
      { to: '/events/workshops',       label: 'Workshops'       },
      { to: '/events/hackathons',      label: 'Hackathons'      },
      { to: '/events/competitions',    label: 'Competitions'    },
      { to: '/events/technical-talks', label: 'Technical Talks' },
      { to: '/events/guest-lectures',  label: 'Guest Lectures'  },
      { to: '/event-protocol',         label: 'Event Protocol'  },
    ]
  },
  { group: 'More',
    links: [
      { to: '/blogs',   label: 'Blogs'   },
    ]
  },
];

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const location    = useLocation();
  const navigate    = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setSidebarOpen(false);
    setDropdownOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // lock body scroll when sidebar / mobile menu is open
  useEffect(() => {
    document.body.style.overflow = (sidebarOpen || mobileOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen, mobileOpen]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>

          {/* ── Logo ── */}
          <Link to="/" className={styles.logo}>
            <img src={logoImg} alt="CodeTroopers Logo" className={styles.logoImage} />
            <div>
              <span className={styles.logoText}>CodeTroopers</span>
              <span className={styles.logoTagline}>Club</span>
            </div>
          </Link>

          {/* ── Desktop primary links ── */}
          <ul className={styles.navLinks}>
            {primaryLinks.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => isActive ? styles.active : ''}
                  end={link.to === '/'}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            {/* More / sidebar trigger */}
            <li>
              <button
                className={`${styles.moreBtn} ${sidebarOpen ? styles.moreBtnActive : ''}`}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open more links"
                aria-expanded={sidebarOpen}
              >
                <HiDotsHorizontal />
                <span>More</span>
              </button>
            </li>

            {/* Join Us CTA (hidden when authenticated) */}
            {!isAuthenticated && (
              <li>
                <NavLink
                  to="/join-us"
                  className={({ isActive }) =>
                    `${styles.joinUsBtn} ${isActive ? styles.joinUsBtnActive : ''}`
                  }
                >
                  Join Us
                </NavLink>
              </li>
            )}

            {/* ── Auth: User menu or Login ── */}
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

          {/* ── Mobile hamburger ── */}
          <button
            className={styles.mobileToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* ── Mobile dropdown menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {isAuthenticated && (
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
              )}

              {/* Primary links */}
              <div className={styles.mobilePrimaryLinks}>
                {primaryLinks.map(link => (
                  <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? styles.active : ''} end={link.to === '/'}>
                    {link.label}
                  </NavLink>
                ))}
              </div>

              {/* All secondary links grouped */}
              {moreLinks.map(section => (
                <div key={section.group} className={styles.mobileGroup}>
                  <span className={styles.mobileGroupLabel}>{section.group}</span>
                  {section.links.map(link => (
                    <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? styles.active : ''}>
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              ))}

              <div className={styles.mobileAuthSection}>
                {!isAuthenticated && (
                  <NavLink to="/join-us" className={({ isActive }) => `${styles.mobileJoinBtn} ${isActive ? styles.active : ''}`}>
                    Join Us
                  </NavLink>
                )}
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

      {/* ═══════════════════════════════════════════════════════════════════
          Sidebar Drawer (desktop "More")
      ════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className={styles.sidebarBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Drawer panel */}
            <motion.aside
              className={styles.sidebar}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              {/* Drawer header */}
              <div className={styles.sidebarHeader}>
                <div className={styles.sidebarTitle}>
                  <HiDotsHorizontal className={styles.sidebarTitleIcon} />
                  Explore
                </div>
                <button
                  className={styles.sidebarClose}
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <HiX />
                </button>
              </div>

              {/* Grouped links */}
              <div className={styles.sidebarBody}>
                {moreLinks.map(section => (
                  <div key={section.group} className={styles.sidebarGroup}>
                    <span className={styles.sidebarGroupLabel}>{section.group}</span>
                    <div className={styles.sidebarGroupLinks}>
                      {section.links.map(link => (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          className={({ isActive }) =>
                            `${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`
                          }
                        >
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawer footer — Join Us shortcut if not logged in */}
              {!isAuthenticated && (
                <div className={styles.sidebarFooter}>
                  <NavLink to="/join-us" className={styles.sidebarJoinBtn}>
                    🚀 Apply to Join Us
                  </NavLink>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

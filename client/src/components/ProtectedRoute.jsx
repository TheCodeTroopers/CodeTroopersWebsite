import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiShieldExclamation, HiHome, HiArrowLeft } from 'react-icons/hi';
import styles from './ProtectedRoute.module.css';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Authenticating Trooper session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className={styles.deniedContainer}>
        <div className={styles.deniedCard}>
          <div className={styles.iconWrapper}>
            <HiShieldExclamation className={styles.deniedIcon} />
          </div>
          <span className={styles.badge}>Restricted Zone</span>
          <h2 className={styles.title}>Admin Access Required</h2>
          <p className={styles.message}>
            You are signed in as <strong>{user?.name}</strong> ({user?.email}) with role{' '}
            <span className={styles.roleTag}>{user?.role}</span>. You do not possess administrator clearance for this sector.
          </p>
          <div className={styles.actions}>
            <Link to="/" className={styles.primaryBtn}>
              <HiHome /> Return Home
            </Link>
            <Link to="/login" className={styles.secondaryBtn}>
              <HiArrowLeft /> Switch Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

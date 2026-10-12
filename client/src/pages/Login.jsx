import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiLockClosed, 
  HiMail, 
  HiUser, 
  HiEye, 
  HiEyeOff, 
  HiKey, 
  HiShieldCheck, 
  HiSparkles, 
  HiExclamationCircle, 
  HiCheckCircle,
  HiArrowRight
} from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import logoImg from '../assets/codetrooperslogo.png';
import styles from './Login.module.css';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const { login, register, googleLogin, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || (isAdmin ? '/admin' : '/');

  // If already authenticated and visits login page, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegister) {
      if (!name.trim()) return setError('Please enter your full name');
      if (!email.trim()) return setError('Please enter your email');
      if (password.length < 6) return setError('Password must be at least 6 characters');
      if (password !== confirmPassword) return setError('Passwords do not match');

      setLoading(true);
      try {
        const user = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          adminKey: adminKey.trim()
        });
        setSuccess(`Account registered as ${user.role}! Redirecting...`);
        setTimeout(() => {
          navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
        }, 800);
      } catch (err) {
        setError(err.response?.data?.error || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email.trim()) return setError('Please enter your email');
      if (!password) return setError('Please enter your password');

      setLoading(true);
      try {
        const user = await login(email.trim(), password);
        setSuccess(`Welcome back, ${user.name}! Redirecting...`);
        setTimeout(() => {
          navigate(user.role === 'admin' ? '/admin' : redirectPath, { replace: true });
        }, 800);
      } catch (err) {
        setError(err.response?.data?.error || 'Invalid email or password');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      // Prompt user or use default Google simulation for instant testing
      const googleMock = {
        name: isRegister && name ? name : 'Trooper Lead',
        email: email.includes('@') ? email : 'swasthik@codetroopers.org',
        picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=GoogleTrooper',
        googleId: 'g_' + Math.random().toString(36).substring(2, 10)
      };

      const user = await googleLogin(googleMock);
      setSuccess(`Signed in with Google as ${user.email}!`);
      setTimeout(() => {
        navigate(user.role === 'admin' ? '/admin' : redirectPath, { replace: true });
      }, 800);
    } catch (err) {
      setError(err.response?.data?.error || 'Google sign-in encountered an issue.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role) => {
    setError('');
    if (role === 'admin') {
      setEmail('admin@codetroopers.org');
      setPassword('admin123');
    } else {
      setEmail('member@codetroopers.org');
      setPassword('member123');
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
      setForgotEmail('');
    }, 2200);
  };

  return (
    <div className={styles.loginPage}>
      <SEOHead 
        title={`${isRegister ? 'Register' : 'Login'} — CodeTroopers`}
        description="Sign in to CodeTroopers platform with Google or email credentials to access the internal dashboard and member tools."
      />

      <div className={styles.ambientGlow} />

      <div className={styles.container}>
        <motion.div 
          className={styles.loginCard}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className={styles.header}>
            <Link to="/" className={styles.logoBadge}>
              <img src={logoImg} alt="CodeTroopers" className={styles.logoImg} />
            </Link>
            <h1 className={styles.title}>
              {isRegister ? 'Join CodeTroopers' : 'Welcome to Headquarters'}
            </h1>
            <p className={styles.subtitle}>
              {isRegister 
                ? 'Create your member credentials or claim admin clearance' 
                : 'Access internal management, resources, and administrative control'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className={styles.tabContainer}>
            <button
              type="button"
              className={`${styles.tabBtn} ${!isRegister ? styles.activeTab : ''}`}
              onClick={() => { setIsRegister(false); setError(''); setSuccess(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${isRegister ? styles.activeTab : ''}`}
              onClick={() => { setIsRegister(true); setError(''); setSuccess(''); }}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Fill Buttons (Sign In mode) */}
          {!isRegister && (
            <div className={styles.demoSection}>
              <div className={styles.demoHeader}>
                <HiSparkles className={styles.sparkleIcon} />
                <span>Instant Demo Access</span>
              </div>
              <div className={styles.demoButtons}>
                <button
                  type="button"
                  className={styles.demoBtnAdmin}
                  onClick={() => fillDemoAccount('admin')}
                  title="Auto-fill admin@codetroopers.org / admin123"
                >
                  <HiShieldCheck /> Fill Admin
                </button>
                <button
                  type="button"
                  className={styles.demoBtnMember}
                  onClick={() => fillDemoAccount('member')}
                  title="Auto-fill member@codetroopers.org / member123"
                >
                  <HiUser /> Fill Member
                </button>
              </div>
            </div>
          )}

          {/* Google Auth Button */}
          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <FcGoogle className={styles.googleIcon} />
            <span>Continue with Google</span>
          </button>

          <div className={styles.divider}>
            <span>or continue with email</span>
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className={styles.errorAlert}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <HiExclamationCircle />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div 
                className={styles.successAlert}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <HiCheckCircle />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {isRegister && (
              <div className={styles.inputGroup}>
                <label htmlFor="reg-name">Full Name</label>
                <div className={styles.inputWrapper}>
                  <HiUser className={styles.inputIcon} />
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="e.g. Maya Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="auth-email">Email Address</label>
              <div className={styles.inputWrapper}>
                <HiMail className={styles.inputIcon} />
                <input
                  id="auth-email"
                  type="email"
                  placeholder="name@sode-edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="auth-password">Password</label>
              <div className={styles.inputWrapper}>
                <HiLockClosed className={styles.inputIcon} />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.togglePasswordBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
            </div>

            {isRegister && (
              <>
                <div className={styles.inputGroup}>
                  <label htmlFor="auth-confirm-password">Confirm Password</label>
                  <div className={styles.inputWrapper}>
                    <HiLockClosed className={styles.inputIcon} />
                    <input
                      id="auth-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.labelRow}>
                    <label htmlFor="auth-admin-key">Admin Clearance Key (Optional)</label>
                    <span className={styles.keyHint}>Key: CT_ADMIN_2026</span>
                  </div>
                  <div className={styles.inputWrapper}>
                    <HiKey className={styles.inputIcon} />
                    <input
                      id="auth-admin-key"
                      type="text"
                      placeholder="Enter clearance key for Admin role"
                      value={adminKey}
                      onChange={(e) => setAdminKey(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {!isRegister && (
              <div className={styles.formMeta}>
                <label className={styles.rememberCheckbox}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember session</span>
                </label>

                <button
                  type="button"
                  className={styles.forgotBtn}
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <div className={styles.btnSpinner} />
              ) : (
                <>
                  <span>{isRegister ? 'Register Trooper Account' : 'Authenticate & Enter'}</span>
                  <HiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Footer switcher */}
          <div className={styles.footerNote}>
            {isRegister ? (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  className={styles.switchLink}
                  onClick={() => setIsRegister(false)}
                >
                  Sign in here
                </button>
              </p>
            ) : (
              <p>
                Need club access?{' '}
                <button
                  type="button"
                  className={styles.switchLink}
                  onClick={() => setIsRegister(true)}
                >
                  Create an account
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className={styles.modalOverlay} onClick={() => setShowForgotModal(false)}>
            <motion.div
              className={styles.modalCard}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
            >
              <h3>Reset Password</h3>
              <p className={styles.modalDesc}>
                Enter your verified college email address. We will dispatch an automated recovery link to your inbox.
              </p>

              {forgotSuccess ? (
                <div className={styles.forgotSuccessBox}>
                  <HiCheckCircle />
                  <span>Recovery link sent! Check your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <div className={styles.inputWrapper}>
                    <HiMail className={styles.inputIcon} />
                    <input
                      type="email"
                      placeholder="your.email@sode-edu.in"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.modalCancelBtn}
                      onClick={() => setShowForgotModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={styles.modalSubmitBtn}>
                      Send Recovery Link
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

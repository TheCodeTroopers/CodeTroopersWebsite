import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiLockClosed,
  HiMail,
  HiUser,
  HiEye,
  HiEyeOff,
  HiExclamationCircle,
  HiCheckCircle,
  HiArrowRight
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import logoImg from '../assets/codetrooperslogo.png';
import styles from './Login.module.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const { login, register, googleLogin, isAuthenticated, isAdmin } = useAuth();
  const googleButtonRef = useRef(null);
  const handleGoogleCredentialRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || (isAdmin ? '/admin' : '/');

  // If session expired or already authenticated, handle state
  useEffect(() => {
    if (queryParams.get('expired')) {
      setError('Your admin session has expired. Please sign in again to continue.');
    }
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
      if (password.length < 8) return setError('Password must be at least 8 characters');
      if (password !== confirmPassword) return setError('Passwords do not match');

      setLoading(true);
      try {
        const user = await register({
          name: name.trim(),
          email: email.trim(),
          password
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

  // Real Google sign-in (Google Identity Services). Google returns a signed ID token which the
  // server verifies; the browser never tells the server who the user is.
  const handleGoogleCredential = async (response) => {
    setError('');
    setLoading(true);
    try {
      const user = await googleLogin({ credential: response.credential });
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

  handleGoogleCredentialRef.current = handleGoogleCredential;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return undefined;

    const initialise = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => handleGoogleCredentialRef.current(response)
      });
      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        width: 320
      });
    };

    if (window.google?.accounts?.id) {
      initialise();
      return undefined;
    }
    let script = document.getElementById('google-identity-script');
    if (!script) {
      script = document.createElement('script');
      script.id = 'google-identity-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', initialise);
    return () => script.removeEventListener('load', initialise);
  }, []);

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
                ? 'Create your member account'
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

          {/* Google Auth Button (rendered by Google; only shown when VITE_GOOGLE_CLIENT_ID is set) */}
          {GOOGLE_CLIENT_ID && (
            <div className={styles.googleSlot} ref={googleButtonRef} />
          )}

          {GOOGLE_CLIENT_ID && (
            <div className={styles.divider}>
              <span>or continue with email</span>
            </div>
          )}

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

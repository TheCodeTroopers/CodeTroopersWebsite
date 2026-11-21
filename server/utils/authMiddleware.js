const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * JWT secret handling.
 *
 * The secret is resolved lazily so a missing value breaks only authentication, not public pages.
 * There is intentionally NO hardcoded fallback secret: a fallback that lives in a public
 * repository lets anyone forge an admin token. In production a missing JWT_SECRET is a
 * startup error. In local development we generate a random per-process secret (sessions
 * simply reset when the dev server restarts).
 */
let cachedSecret = null;

function getJwtSecret() {
  if (cachedSecret) return cachedSecret;
  cachedSecret = resolveJwtSecret();
  return cachedSecret;
}

function resolveJwtSecret() {
  const fromEnv = process.env.JWT_SECRET;
  if (fromEnv && fromEnv.length >= 32) return fromEnv;

  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  if (isProduction) {
    throw new Error(
      'JWT_SECRET is missing or too short. Set a random value of at least 32 characters ' +
      '(e.g. `node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"`) ' +
      'in the Vercel Environment Variables.'
    );
  }

  console.warn('[auth] JWT_SECRET not set (or < 32 chars): using a random development-only secret.');
  return crypto.randomBytes(48).toString('hex');
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  let secret;
  try {
    secret = getJwtSecret();
  } catch (err) {
    console.error('[auth]', err.message);
    return res.status(500).json({ error: 'Server authentication is not configured' });
  }
  try {
    req.user = jwt.verify(token, secret, { algorithms: ['HS256'] });
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  });
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
    } catch {
      // Ignore invalid optional token
    }
  }
  next();
}

module.exports = {
  getJwtSecret,
  verifyToken,
  requireAdmin,
  optionalAuth
};

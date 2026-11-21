const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const store = require('../utils/store');
const { fail } = require('../utils/respond');
const { getJwtSecret } = require('../utils/authMiddleware');

const MIN_PASSWORD_LENGTH = 8;

// Compared against when the email is unknown so "no such user" and "wrong password"
// take about the same time (avoids revealing which emails have accounts).
const DUMMY_HASH = bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 10);

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    },
    getJwtSecret(),
    { expiresIn: '7d', algorithm: 'HS256' }
  );
}

function sanitizeUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

/** Emails that become admin on first Google sign-in. Configured only via env, never hardcoded. */
function adminEmails() {
  return (process.env.ADMIN_EMAIL || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await store.users.findByEmail(String(email).trim());
    const hash = user && user.passwordHash ? user.passwordHash : DUMMY_HASH;
    const isMatch = await bcrypt.compare(String(password), hash);

    if (!user || !user.passwordHash || !isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      message: 'Logged in successfully',
      token: generateToken(user),
      user: sanitizeUser(user)
    });
  } catch (err) {
    fail(res, err);
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    if (String(password).length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (await store.users.findByEmail(normalizedEmail)) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Admin sign-up is possible ONLY if ADMIN_REGISTRATION_KEY is set in the server environment
    // (min 16 chars). There is no default key, and no email address is granted admin automatically.
    let role = 'member';
    const configuredKey = process.env.ADMIN_REGISTRATION_KEY;
    if (adminKey && configuredKey && configuredKey.length >= 16 && safeEqual(adminKey, configuredKey)) {
      role = 'admin';
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const newUser = await store.users.insert({
      id: `usr-${uuidv4().slice(0, 8)}`,
      name: String(name).trim().slice(0, 120),
      email: normalizedEmail,
      passwordHash,
      role,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(String(name).trim())}`,
      provider: 'local'
    });

    res.status(201).json({
      message: 'Account created successfully',
      token: generateToken(newUser),
      user: sanitizeUser(newUser)
    });
  } catch (err) {
    fail(res, err);
  }
};

/**
 * Google sign-in. The browser sends the Google-issued ID token (`credential`); the server
 * verifies its signature and audience with Google. The email/name in the request body are
 * NEVER trusted: they come from the verified token.
 */
exports.googleAuth = async (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ error: 'Google sign-in is not configured on this server' });
    }

    const { credential } = req.body;
    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    let payload;
    try {
      const client = new google.auth.OAuth2(clientId);
      const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
      payload = ticket.getPayload();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid Google sign-in. Please try again.' });
    }

    if (!payload || !payload.email || payload.email_verified !== true) {
      return res.status(401).json({ error: 'Your Google account email is not verified' });
    }

    const email = payload.email.toLowerCase();
    const allowedDomains = (process.env.GOOGLE_ALLOWED_DOMAINS || '')
      .split(',')
      .map(d => d.trim().toLowerCase())
      .filter(Boolean);
    if (allowedDomains.length && !allowedDomains.includes(email.split('@')[1]) && !adminEmails().includes(email)) {
      return res.status(403).json({ error: 'Please sign in with your college Google account' });
    }

    let user = await store.users.findByEmail(email);
    if (!user) {
      user = await store.users.insert({
        id: `usr-g-${uuidv4().slice(0, 8)}`,
        name: payload.name || email.split('@')[0],
        email,
        role: adminEmails().includes(email) ? 'admin' : 'member',
        avatar: payload.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        provider: 'google',
        googleId: payload.sub
      });
    } else if (!user.googleId || (!user.avatar && payload.picture)) {
      user = (await store.users.update(user.id, {
        googleId: user.googleId || payload.sub,
        avatar: user.avatar || payload.picture
      })) || user;
    }

    res.json({
      message: 'Google login successful',
      token: generateToken(user),
      user: sanitizeUser(user)
    });
  } catch (err) {
    fail(res, err);
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await store.users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    fail(res, err);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await store.users.list();
    res.json({ users: users.map(sanitizeUser) });
  } catch (err) {
    fail(res, err);
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin or member.' });
    }

    // Safety check: Prevent admin from demoting their own active session account
    if (req.user && req.user.id === id && role !== 'admin') {
      return res.status(400).json({ error: 'Action denied: You cannot revoke administrator clearance from your own account.' });
    }

    const updated = await store.users.update(id, { role });
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: `Role updated to ${role}`,
      user: sanitizeUser(updated)
    });
  } catch (err) {
    fail(res, err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Safety check: Prevent admin from deleting their own active session account
    if (req.user && req.user.id === id) {
      return res.status(400).json({ error: 'Action denied: You cannot delete your own active administrator account.' });
    }

    const deleted = await store.users.remove(id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: `User ${deleted.name} (${deleted.email}) deleted successfully`,
      removed: sanitizeUser(deleted)
    });
  } catch (err) {
    fail(res, err);
  }
};

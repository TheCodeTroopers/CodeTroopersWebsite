const { readJSON, writeJSON } = require('../utils/jsonStore');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/authMiddleware');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function sanitizeUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const data = await readJSON('users.json');
    const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Logged in successfully',
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const data = await readJSON('users.json');
    const existing = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Role assignment based on admin key or designated root email
    const ADMIN_REG_KEY = process.env.ADMIN_REGISTRATION_KEY || 'CT_ADMIN_2026';
    let role = 'member';
    if (adminKey && adminKey === ADMIN_REG_KEY) {
      role = 'admin';
    } else if (email.toLowerCase() === 'admin@codetroopers.org') {
      role = 'admin';
    }

    const newUser = {
      id: `usr-${uuidv4().slice(0, 8)}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      provider: 'local',
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);
    await writeJSON('users.json', data);

    const token = generateToken(newUser);
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Google authentication requires email' });
    }

    const data = await readJSON('users.json');
    let user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Restrict default admin access strictly to designated admin accounts
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@codetroopers.org';
      const isDesignatedAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || email.toLowerCase() === 'swasthik@codetroopers.org';
      const role = isDesignatedAdmin ? 'admin' : 'member';

      user = {
        id: `usr-g-${uuidv4().slice(0, 8)}`,
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        role,
        avatar: picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || email)}`,
        provider: 'google',
        googleId: googleId || '',
        createdAt: new Date().toISOString()
      };

      data.users.push(user);
      await writeJSON('users.json', data);
    } else {
      // Update avatar if not present
      if (!user.avatar && picture) {
        user.avatar = picture;
        await writeJSON('users.json', data);
      }
    }

    const token = generateToken(user);
    res.json({
      message: 'Google login successful',
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const data = await readJSON('users.json');
    const user = data.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const data = await readJSON('users.json');
    const sanitized = data.users.map(u => sanitizeUser(u));
    res.json({ users: sanitized });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

    const data = await readJSON('users.json');
    const userIndex = data.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    data.users[userIndex].role = role;
    await writeJSON('users.json', data);

    res.json({
      message: `Role updated to ${role}`,
      user: sanitizeUser(data.users[userIndex])
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Safety check: Prevent admin from deleting their own active session account
    if (req.user && req.user.id === id) {
      return res.status(400).json({ error: 'Action denied: You cannot delete your own active administrator account.' });
    }

    const data = await readJSON('users.json');
    const userIndex = data.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const deleted = data.users.splice(userIndex, 1)[0];
    await writeJSON('users.json', data);

    res.json({
      message: `User ${deleted.name} (${deleted.email}) deleted successfully`,
      removed: sanitizeUser(deleted)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

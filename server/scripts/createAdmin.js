#!/usr/bin/env node
/**
 * Create (or reset the password of) an admin account directly in Supabase.
 *
 *   node scripts/createAdmin.js you@college.edu "Your Name"
 *
 * The password is read from the ADMIN_PASSWORD environment variable, or typed at a hidden
 * prompt. It is never accepted as a command-line argument (which would land in shell history).
 */
const path = require('path');
const readline = require('readline');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const store = require('../utils/store');

function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(question)) process.stdout.write(s); };
    rl.question(question, (answer) => { rl.close(); process.stdout.write('\n'); resolve(answer); });
  });
}

async function main() {
  const [email, name = 'CodeTroopers Admin'] = process.argv.slice(2);
  if (!email || !email.includes('@')) {
    console.error('Usage: node scripts/createAdmin.js <email> ["Display Name"]');
    process.exit(1);
  }

  const password = process.env.ADMIN_PASSWORD || (await promptHidden('New admin password (min 12 chars): '));
  if (!password || password.length < 12) {
    console.error('Password must be at least 12 characters.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await store.users.findByEmail(email);

  if (existing) {
    await store.users.update(existing.id, { passwordHash, role: 'admin' });
    console.log(`Updated existing user ${existing.email}: password reset, role = admin.`);
  } else {
    await store.users.insert({
      id: `usr-${uuidv4().slice(0, 8)}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      provider: 'local'
    });
    console.log(`Created admin ${email.toLowerCase()}.`);
  }
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * One-time migration of existing images (/uploads/...) to Supabase Storage.
 *
 *   npm install --no-save sharp                 # once, for compression (optional but recommended)
 *   node scripts/migrateImages.js --dry-run     # list what would be uploaded
 *   node scripts/migrateImages.js               # compress + upload + rewrite paths in the database
 *
 * Run it AFTER scripts/importContent.js. Safe to re-run: uploads overwrite, and rows whose
 * paths were already rewritten are left alone. Original files are never modified or deleted.
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { getSupabaseClient, isSupabaseConfigured } = require('../utils/supabase');
const { IMAGE_BUCKET } = require('../utils/store');

const dryRun = process.argv.includes('--dry-run');
const TABLES = ['gallery_items', 'events', 'blogs', 'achievements', 'team_members'];
const SEARCH_DIRS = [
  path.join(__dirname, '..', 'uploads'),
  path.join(__dirname, '..', '..', 'client', 'public', 'uploads')
];
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };
const MAX_BYTES = 5 * 1024 * 1024; // bucket limit

let sharp = null;
try { sharp = require('sharp'); } catch { /* optional */ }

function collectPaths(value, found) {
  if (typeof value === 'string') {
    if (value.startsWith('/uploads/')) found.add(value);
  } else if (Array.isArray(value)) {
    value.forEach(v => collectPaths(v, found));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach(v => collectPaths(v, found));
  }
}

function replacePaths(value, map) {
  if (typeof value === 'string') return map.has(value) ? map.get(value) : value;
  if (Array.isArray(value)) return value.map(v => replacePaths(v, map));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replacePaths(v, map)]));
  }
  return value;
}

function findLocalFile(urlPath) {
  const rel = decodeURIComponent(urlPath.replace(/^\/uploads\//, ''));
  for (const dir of SEARCH_DIRS) {
    const candidate = path.join(dir, rel);
    // refuse paths that escape the uploads folder
    if (candidate.startsWith(dir + path.sep) && fs.existsSync(candidate)) return { file: candidate, rel };
  }
  return null;
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

async function main() {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured. Put SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env');
    process.exit(1);
  }
  if (!sharp) {
    console.warn('! "sharp" is not installed: images will be uploaded UNCOMPRESSED (files over 5 MB will fail).');
    console.warn('  Fix: run  npm install --no-save sharp  in the server folder, then run this again.\n');
  }
  const client = getSupabaseClient();

  // 1. Load every row and collect referenced local image paths
  const rowsByTable = {};
  const wanted = new Set();
  for (const table of TABLES) {
    const { data, error } = await client.from(table).select('id, data');
    if (error) throw new Error(`${table}: ${error.message} (did you run the SQL schema and importContent.js?)`);
    rowsByTable[table] = data;
    data.forEach(row => collectPaths(row.data, wanted));
  }
  console.log(`${dryRun ? '[DRY RUN] ' : ''}Found ${wanted.size} distinct local image paths in the database.\n`);

  // 2. Upload each one
  const urlMap = new Map();
  let totalBefore = 0;
  let totalAfter = 0;
  const failures = [];

  for (const urlPath of [...wanted].sort()) {
    const local = findLocalFile(urlPath);
    if (!local) { failures.push(`${urlPath}: file not found in uploads folders`); continue; }

    try {
      const original = fs.readFileSync(local.file);
      let body = original;
      let contentType = MIME[path.extname(local.rel).toLowerCase()] || 'application/octet-stream';
      let dest = `legacy/${local.rel}`;

      if (sharp) {
        body = await sharp(original)
          .rotate() // respect camera orientation
          .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();
        contentType = 'image/webp';
        dest = `legacy/${local.rel}.webp`;
      } else if (body.length > MAX_BYTES) {
        failures.push(`${urlPath}: ${kb(body.length)} exceeds 5 MB and sharp is not installed`);
        continue;
      }

      totalBefore += original.length;
      totalAfter += body.length;
      console.log(`  ${urlPath.padEnd(58)} ${kb(original.length).padStart(8)} -> ${kb(body.length).padStart(7)}`);

      if (dryRun) continue;
      const { error } = await client.storage.from(IMAGE_BUCKET).upload(dest, body, {
        contentType,
        cacheControl: '31536000',
        upsert: true
      });
      if (error) { failures.push(`${urlPath}: upload failed: ${error.message}`); continue; }
      urlMap.set(urlPath, client.storage.from(IMAGE_BUCKET).getPublicUrl(dest).data.publicUrl);
    } catch (err) {
      failures.push(`${urlPath}: ${err.message}`);
    }
  }

  console.log(`\nImage weight: ${(totalBefore / 1048576).toFixed(1)} MB -> ${(totalAfter / 1048576).toFixed(1)} MB`);

  // 3. Rewrite the paths in the database
  if (!dryRun) {
    let updated = 0;
    for (const table of TABLES) {
      for (const row of rowsByTable[table]) {
        const next = replacePaths(row.data, urlMap);
        if (JSON.stringify(next) === JSON.stringify(row.data)) continue;
        const { error } = await client.from(table).update({ data: next }).eq('id', row.id);
        if (error) failures.push(`${table}/${row.id}: ${error.message}`);
        else updated++;
      }
    }
    console.log(`Rewrote image URLs in ${updated} database rows.`);
  }

  if (failures.length) {
    console.log(`\n${failures.length} problem(s):`);
    failures.forEach(f => console.log('  - ' + f));
    process.exitCode = 1;
  } else {
    console.log(dryRun ? '\nDry run complete, nothing was uploaded.' : '\nDone. Check the site, then you can delete server/uploads and client/public/uploads.');
  }
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});

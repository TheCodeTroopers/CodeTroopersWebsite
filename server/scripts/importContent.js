#!/usr/bin/env node
/**
 * One-time import of the JSON content files in server/data/ into Supabase.
 *
 *   node scripts/importContent.js --dry-run     # show what would be imported
 *   node scripts/importContent.js               # import (existing rows are left untouched)
 *   node scripts/importContent.js --overwrite   # re-import and REPLACE rows that already exist
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env, and that
 * data/supabase_content_schema.sql has been run in the Supabase SQL editor.
 *
 * Users are intentionally NOT imported (the repo's demo accounts have publicly known
 * passwords). Create your admin with:  node scripts/createAdmin.js
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { getSupabaseClient, isSupabaseConfigured } = require('../utils/supabase');
const { readJSON } = require('../utils/jsonStore');

const dryRun = process.argv.includes('--dry-run');
const overwrite = process.argv.includes('--overwrite');

const COLLECTIONS = [
  { file: 'gallery.json', key: 'items', table: 'gallery_items' },
  { file: 'events.json', key: 'events', table: 'events' },
  { file: 'blogs.json', key: 'blogs', table: 'blogs' },
  { file: 'achievements.json', key: 'items', table: 'achievements' },
  { file: 'team.json', key: 'members', table: 'team_members' }
];

// The API lists newest-first by created_at. The JSON files are already in display order,
// so give the first item the newest timestamp to preserve that order exactly.
function toRows(items, idPrefix) {
  const base = Date.now();
  return items.map((item, index) => {
    const { id, ...data } = item;
    return {
      id: String(id || `${idPrefix}-${index + 1}`),
      data,
      created_at: new Date(base - index * 1000).toISOString()
    };
  });
}

async function upsertRows(client, table, rows) {
  const { error } = await client
    .from(table)
    .upsert(rows, { onConflict: 'id', ignoreDuplicates: !overwrite });
  if (error) throw new Error(`${table}: ${error.message}`);
}

async function main() {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured. Put SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env');
    process.exit(1);
  }
  const client = getSupabaseClient();
  console.log(`${dryRun ? '[DRY RUN] ' : ''}Importing content (${overwrite ? 'overwrite existing' : 'skip existing'})\n`);

  for (const { file, key, table } of COLLECTIONS) {
    const json = await readJSON(file);
    const rows = toRows(json[key] || [], table);
    console.log(`  ${table.padEnd(20)} ${rows.length} rows`);
    if (!dryRun && rows.length) await upsertRows(client, table, rows);
  }

  // Contact page info (single document) + stored inquiries
  const contact = await readJSON('contact.json');
  console.log(`  ${'contact_info'.padEnd(20)} 1 row`);
  if (!dryRun) {
    await upsertRows(client, 'contact_info', [
      { id: 'main', data: { info: contact.info || {}, faq: contact.faq || [] } }
    ]);
  }
  const subs = toRows(contact.submissions || [], 'sub');
  console.log(`  ${'contact_submissions'.padEnd(20)} ${subs.length} rows`);
  if (!dryRun && subs.length) await upsertRows(client, 'contact_submissions', subs);

  console.log(`\n${dryRun ? 'Dry run complete, nothing was written.' : 'Import complete.'}`);
}

main().catch((err) => {
  console.error('Import failed:', err.message);
  process.exit(1);
});

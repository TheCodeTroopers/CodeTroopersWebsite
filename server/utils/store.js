const { getSupabaseClient, isSupabaseConfigured } = require('./supabase');

/**
 * Supabase-backed content store.
 *
 * Replaces utils/jsonStore.js for site content. The JSON store writes to the local disk,
 * which is READ-ONLY on Vercel serverless (EROFS), so admin edits could never persist.
 *
 * Each collection is a table with (id, data jsonb, created_at, updated_at). Items keep the
 * exact same shape the frontend already uses: `{ id, ...data }`.
 */

function notConfigured() {
  const err = new Error(
    'Database is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the server environment.'
  );
  err.status = 503;
  return err;
}

function db() {
  if (!isSupabaseConfigured()) throw notConfigured();
  return getSupabaseClient();
}

function dbError(error, action) {
  const err = new Error(`Database ${action} failed: ${error.message}`);
  err.status = 500;
  err.code = error.code;
  return err;
}

function rowToItem(row) {
  return { ...(row.data || {}), id: row.id };
}

function itemToData(item) {
  const { id, ...rest } = item;
  return rest;
}

function createCollection(table) {
  return {
    table,

    /** All items, newest first. */
    async list() {
      const { data, error } = await db()
        .from(table)
        .select('id, data, created_at')
        .order('created_at', { ascending: false });
      if (error) throw dbError(error, `read of ${table}`);
      return data.map(rowToItem);
    },

    /** One item by id, or null. */
    async get(id) {
      const { data, error } = await db()
        .from(table)
        .select('id, data')
        .eq('id', String(id))
        .maybeSingle();
      if (error) throw dbError(error, `read of ${table}`);
      return data ? rowToItem(data) : null;
    },

    /** Insert a new item (item.id required). Returns the saved item. */
    async insert(item) {
      const { data, error } = await db()
        .from(table)
        .insert([{ id: String(item.id), data: itemToData(item) }])
        .select('id, data')
        .single();
      if (error) throw dbError(error, `insert into ${table}`);
      return rowToItem(data);
    },

    /** Insert or replace an item (used by the import script). */
    async upsert(item, createdAt) {
      const row = { id: String(item.id), data: itemToData(item), updated_at: new Date().toISOString() };
      if (createdAt) row.created_at = createdAt;
      const { data, error } = await db()
        .from(table)
        .upsert([row], { onConflict: 'id' })
        .select('id, data')
        .single();
      if (error) throw dbError(error, `upsert into ${table}`);
      return rowToItem(data);
    },

    /** Merge `patch` into an existing item. Returns the updated item, or null if missing. */
    async update(id, patch) {
      const current = await this.get(id);
      if (!current) return null;
      const merged = { ...current, ...patch, id: current.id };
      const { data, error } = await db()
        .from(table)
        .update({ data: itemToData(merged), updated_at: new Date().toISOString() })
        .eq('id', current.id)
        .select('id, data')
        .single();
      if (error) throw dbError(error, `update of ${table}`);
      return rowToItem(data);
    },

    /** Delete an item. Returns the removed item, or null if missing. */
    async remove(id) {
      const { data, error } = await db()
        .from(table)
        .delete()
        .eq('id', String(id))
        .select('id, data');
      if (error) throw dbError(error, `delete from ${table}`);
      return data && data.length ? rowToItem(data[0]) : null;
    }
  };
}

// ---- Collections ------------------------------------------------------------------
const gallery = createCollection('gallery_items');
const events = createCollection('events');
const blogs = createCollection('blogs');
const achievements = createCollection('achievements');
const team = createCollection('team_members');
const contactInfo = createCollection('contact_info');
const contactSubmissions = createCollection('contact_submissions');

// ---- Users (dedicated columns) ----------------------------------------------------
function rowToUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash || undefined,
    role: row.role,
    avatar: row.avatar || '',
    provider: row.provider,
    googleId: row.google_id || '',
    createdAt: row.created_at
  };
}

function userToRow(user) {
  const row = {
    id: user.id,
    name: user.name,
    email: String(user.email).toLowerCase(),
    role: user.role || 'member',
    avatar: user.avatar || null,
    provider: user.provider || 'local',
    google_id: user.googleId || null
  };
  if (user.passwordHash) row.password_hash = user.passwordHash;
  if (user.createdAt) row.created_at = user.createdAt;
  return row;
}

const users = {
  async list() {
    const { data, error } = await db().from('site_users').select('*').order('created_at', { ascending: false });
    if (error) throw dbError(error, 'read of site_users');
    return data.map(rowToUser);
  },

  async findById(id) {
    const { data, error } = await db().from('site_users').select('*').eq('id', id).maybeSingle();
    if (error) throw dbError(error, 'read of site_users');
    return rowToUser(data);
  },

  async findByEmail(email) {
    const { data, error } = await db()
      .from('site_users')
      .select('*')
      .ilike('email', String(email).replace(/[%_\\]/g, '\\$&'))
      .maybeSingle();
    if (error) throw dbError(error, 'read of site_users');
    return rowToUser(data);
  },

  async insert(user) {
    const { data, error } = await db().from('site_users').insert([userToRow(user)]).select('*').single();
    if (error) {
      if (error.code === '23505') {
        const dup = new Error('User with this email already exists');
        dup.status = 409;
        throw dup;
      }
      throw dbError(error, 'insert into site_users');
    }
    return rowToUser(data);
  },

  async upsert(user) {
    const { data, error } = await db()
      .from('site_users')
      .upsert([userToRow(user)], { onConflict: 'id' })
      .select('*')
      .single();
    if (error) throw dbError(error, 'upsert into site_users');
    return rowToUser(data);
  },

  async update(id, patch) {
    const row = {};
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.role !== undefined) row.role = patch.role;
    if (patch.avatar !== undefined) row.avatar = patch.avatar;
    if (patch.googleId !== undefined) row.google_id = patch.googleId;
    if (patch.passwordHash !== undefined) row.password_hash = patch.passwordHash;
    const { data, error } = await db().from('site_users').update(row).eq('id', id).select('*');
    if (error) throw dbError(error, 'update of site_users');
    return data && data.length ? rowToUser(data[0]) : null;
  },

  async remove(id) {
    const { data, error } = await db().from('site_users').delete().eq('id', id).select('*');
    if (error) throw dbError(error, 'delete from site_users');
    return data && data.length ? rowToUser(data[0]) : null;
  }
};

// ---- Image storage ----------------------------------------------------------------
const IMAGE_BUCKET = 'site-images';

/**
 * Upload an image buffer to the public Supabase Storage bucket.
 * @returns {Promise<{ path: string, url: string }>} public CDN URL of the stored image
 */
async function uploadImage({ buffer, path, contentType }) {
  const client = db();
  const { error } = await client.storage
    .from(IMAGE_BUCKET)
    .upload(path, buffer, { contentType, cacheControl: '31536000', upsert: false });
  if (error) {
    const err = new Error(`Image upload failed: ${error.message}`);
    err.status = 500;
    throw err;
  }
  const { data } = client.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

module.exports = {
  gallery,
  events,
  blogs,
  achievements,
  team,
  contactInfo,
  contactSubmissions,
  users,
  uploadImage,
  IMAGE_BUCKET,
  createCollection
};

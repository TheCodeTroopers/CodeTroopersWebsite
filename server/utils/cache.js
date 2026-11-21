/**
 * HTTP caching for the API.
 *
 * Vercel serverless functions have cold starts and every read hits Supabase, so uncached pages feel
 * slow. Public content (team, events, gallery, achievements, published blogs, contact info) is
 * identical for every visitor, so Vercel's CDN may serve it for a short time:
 *   - fresh for 60 s, then served instantly while a new copy is fetched in the background (up to 5 min).
 * Edits made in the admin panel therefore show up for visitors within about a minute.
 *
 * SAFETY: a request that carries an Authorization header (admin dashboard) may receive data visitors
 * must not see (e.g. draft blogs), so those responses are never cacheable ("private, no-store").
 */
const PUBLIC_CACHE = 'public, s-maxage=60, stale-while-revalidate=300';
const NO_STORE = 'private, no-store';

/** Default for everything under /api: never cache (auth, uploads, writes, errors...). */
function noStoreByDefault(req, res, next) {
  res.set('Cache-Control', NO_STORE);
  next();
}

/** Opt a GET route into CDN caching, but only for anonymous requests. */
function cachePublic(req, res, next) {
  if (req.method === 'GET' && !req.headers.authorization) {
    res.set('Cache-Control', PUBLIC_CACHE);
  }
  next();
}

module.exports = { noStoreByDefault, cachePublic, PUBLIC_CACHE, NO_STORE };

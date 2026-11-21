/**
 * Send a consistent error response. Errors thrown by the store carry an HTTP `status`
 * (e.g. 503 when the database is not configured); everything else is a 500.
 * Internal details are logged, not leaked, for unexpected errors.
 */
function fail(res, err) {
  const status = err && err.status ? err.status : 500;
  if (status >= 500) console.error(err);
  const message = status >= 500 && !err.status ? 'Internal server error' : err.message;
  return res.status(status).json({ error: message });
}

module.exports = { fail };

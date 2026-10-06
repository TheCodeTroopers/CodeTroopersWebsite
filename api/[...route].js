const app = require('../server/app');

const apiRoutes = new Set([
  'achievements',
  'contact',
  'contact-info',
  'events',
  'gallery',
  'health',
  'team'
]);

module.exports = (req, res) => {
  const originalUrl = req.url || '/';

  if (originalUrl.startsWith('/api/uploads/')) {
    req.url = originalUrl.replace(/^\/api\/uploads/, '/uploads');
  } else if (!originalUrl.startsWith('/api/') && !originalUrl.startsWith('/uploads/')) {
    const firstSegment = originalUrl.split(/[/?#]/)[1];
    if (apiRoutes.has(firstSegment)) {
      req.url = `/api${originalUrl}`;
    }
  }

  return app(req, res);
};

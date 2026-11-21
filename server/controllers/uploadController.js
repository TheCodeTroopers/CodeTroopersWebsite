const crypto = require('crypto');
const store = require('../utils/store');
const { fail } = require('../utils/respond');

// Folders the admin UI may upload into (keeps the bucket organised, blocks path tricks).
const ALLOWED_FOLDERS = new Set(['gallery', 'events', 'blogs', 'achievements', 'team', 'misc']);

// Identify the real image type from the file's first bytes instead of trusting the
// client-supplied Content-Type / file name.
function sniffImage(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: 'jpg', type: 'image/jpeg' };
  if (buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { ext: 'png', type: 'image/png' };
  }
  if (buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') {
    return { ext: 'webp', type: 'image/webp' };
  }
  if (buf.slice(0, 3).toString('ascii') === 'GIF') return { ext: 'gif', type: 'image/gif' };
  return null;
}

// POST /api/upload  (admin only) multipart field "image", optional body field "folder"
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file received (expected form field "image")' });
    }

    const detected = sniffImage(req.file.buffer);
    if (!detected) {
      return res.status(400).json({ error: 'Only JPEG, PNG, WebP or GIF images are allowed' });
    }

    const requestedFolder = String(req.body.folder || 'misc').toLowerCase();
    const folder = ALLOWED_FOLDERS.has(requestedFolder) ? requestedFolder : 'misc';
    const month = new Date().toISOString().slice(0, 7); // e.g. 2026-11
    const path = `${folder}/${month}/${crypto.randomBytes(8).toString('hex')}.${detected.ext}`;

    const { url } = await store.uploadImage({
      buffer: req.file.buffer,
      path,
      contentType: detected.type
    });

    res.status(201).json({ url, path, size: req.file.size });
  } catch (err) {
    fail(res, err);
  }
};

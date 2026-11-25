const express = require('express');
const multer = require('multer');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { requireAdmin } = require('../utils/authMiddleware');

// Vercel serverless functions reject request bodies over ~4.5 MB, so the admin UI
// compresses images in the browser first. 4 MB is the server-side ceiling.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024, files: 1 }
});

router.post(
  '/',
  requireAdmin, // authenticate BEFORE reading the file body
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (!err) return next();
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'Image is too large (max 4 MB). Please use a smaller image.' });
      }
      return res.status(400).json({ error: err.message || 'Upload failed' });
    });
  },
  uploadController.uploadImage
);

module.exports = router;

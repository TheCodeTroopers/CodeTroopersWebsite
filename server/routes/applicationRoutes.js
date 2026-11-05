const express = require('express');
const multer = require('multer');
const applicationController = require('../controllers/applicationController');

const router = express.Router();

// Store files in memory so they can be streamed directly to Google Drive
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for resume upload!'));
    }
  }
});

// POST /api/applications
router.post('/', upload.single('resume'), applicationController.submit);

module.exports = router;


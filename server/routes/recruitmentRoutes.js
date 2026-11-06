const express = require('express');
const multer = require('multer');
const router = express.Router();
const recruitmentController = require('../controllers/recruitmentController');
const applicationController = require('../controllers/applicationController');
const { requireAdmin } = require('../utils/authMiddleware');

// Store resume in memory so it can be streamed directly to Google Drive
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

// ==========================================
// Public Recruitment Form Submission
// ==========================================
// Supports POST /api/applications and POST /api/recruitment/applications
router.post('/applications', upload.single('resume'), applicationController.submit);
router.post('/', upload.single('resume'), applicationController.submit);

// ==========================================
// Protected Admin Recruitment Routes (JWT Auth)
// ==========================================
// Recruitment stats
router.get('/stats', requireAdmin, recruitmentController.getStats);

// Application list and detail
router.get('/applications', requireAdmin, recruitmentController.getAll);
router.get('/applications/:id', requireAdmin, recruitmentController.getById);

// Base route aliases for direct /api/applications mounting
router.get('/', requireAdmin, recruitmentController.getAll);
router.get('/:id', requireAdmin, recruitmentController.getById);

// Status updates (both PATCH and PUT)
router.patch('/applications/:id/status', requireAdmin, recruitmentController.updateStatus);
router.put('/applications/:id/status', requireAdmin, recruitmentController.updateStatus);
router.patch('/:id/status', requireAdmin, recruitmentController.updateStatus);
router.put('/:id/status', requireAdmin, recruitmentController.updateStatus);

// Delete application
router.delete('/applications/:id', requireAdmin, recruitmentController.remove);
router.delete('/:id', requireAdmin, recruitmentController.remove);

module.exports = router;

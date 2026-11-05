const express = require('express');
const router = express.Router();
const recruitmentController = require('../controllers/recruitmentController');
const { requireAdmin } = require('../utils/authMiddleware');

/**
 * All recruitment routes are protected and require admin clearance.
 * When the frontend makes requests, it passes the Bearer JWT token in the Authorization header.
 */

// Route to get recruitment summary statistics
router.get('/stats', requireAdmin, recruitmentController.getStats);

// Application list and detail
router.get('/applications', requireAdmin, recruitmentController.getAll);
router.get('/applications/:id', requireAdmin, recruitmentController.getById);

// Also support base route for direct /api/applications mounting
router.get('/', requireAdmin, recruitmentController.getAll);
router.get('/:id', requireAdmin, recruitmentController.getById);

// Status updates
router.patch('/applications/:id/status', requireAdmin, recruitmentController.updateStatus);
router.put('/applications/:id/status', requireAdmin, recruitmentController.updateStatus);
router.patch('/:id/status', requireAdmin, recruitmentController.updateStatus);
router.put('/:id/status', requireAdmin, recruitmentController.updateStatus);

// Delete application
router.delete('/applications/:id', requireAdmin, recruitmentController.remove);
router.delete('/:id', requireAdmin, recruitmentController.remove);

module.exports = router;


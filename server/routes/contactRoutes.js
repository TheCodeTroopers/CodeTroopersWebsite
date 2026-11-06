const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { requireAdmin } = require('../utils/authMiddleware');

router.post('/', contactController.submit);
router.get('/submissions', requireAdmin, contactController.getSubmissions);
router.delete('/submissions/:id', requireAdmin, contactController.deleteSubmission);

module.exports = router;

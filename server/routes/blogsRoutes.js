const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogsController');
const { requireAdmin, optionalAuth } = require('../utils/authMiddleware');

// optionalAuth lets admins (valid token) see drafts; the public only sees published posts.
router.get('/', optionalAuth, blogsController.getAll);
router.get('/:id', optionalAuth, blogsController.getById);
router.post('/', requireAdmin, blogsController.create);
router.put('/:id', requireAdmin, blogsController.update);
router.delete('/:id', requireAdmin, blogsController.remove);

module.exports = router;

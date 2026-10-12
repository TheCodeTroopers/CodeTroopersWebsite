const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogsController');
const { requireAdmin } = require('../utils/authMiddleware');

router.get('/', blogsController.getAll);
router.get('/:id', blogsController.getById);
router.post('/', requireAdmin, blogsController.create);
router.put('/:id', requireAdmin, blogsController.update);
router.delete('/:id', requireAdmin, blogsController.remove);

module.exports = router;

const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { requireAdmin } = require('../utils/authMiddleware');

router.get('/', galleryController.getAll);
router.get('/:id', galleryController.getById);
router.post('/', requireAdmin, galleryController.create);
router.put('/:id', requireAdmin, galleryController.update);
router.delete('/:id', requireAdmin, galleryController.remove);

module.exports = router;

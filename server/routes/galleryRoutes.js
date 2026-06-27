const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

router.get('/', galleryController.getAll);
router.post('/', galleryController.create);
router.delete('/:id', galleryController.remove);

module.exports = router;

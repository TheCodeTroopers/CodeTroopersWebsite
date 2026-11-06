const express = require('express');
const router = express.Router();
const achievementsController = require('../controllers/achievementsController');
const { requireAdmin } = require('../utils/authMiddleware');

router.get('/', achievementsController.getAll);
router.get('/:id', achievementsController.getById);
router.post('/', requireAdmin, achievementsController.create);
router.put('/:id', requireAdmin, achievementsController.update);
router.delete('/:id', requireAdmin, achievementsController.remove);

module.exports = router;

const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { requireAdmin } = require('../utils/authMiddleware');

router.get('/', teamController.getAll);
router.get('/:id', teamController.getById);
router.post('/', requireAdmin, teamController.create);
router.put('/:id', requireAdmin, teamController.update);
router.delete('/:id', requireAdmin, teamController.remove);

module.exports = router;

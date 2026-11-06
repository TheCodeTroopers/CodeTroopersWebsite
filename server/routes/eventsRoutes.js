const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const { requireAdmin } = require('../utils/authMiddleware');

router.get('/', eventsController.getAll);
router.get('/:id', eventsController.getById);
router.post('/', requireAdmin, eventsController.create);
router.put('/:id', requireAdmin, eventsController.update);
router.delete('/:id', requireAdmin, eventsController.remove);

module.exports = router;

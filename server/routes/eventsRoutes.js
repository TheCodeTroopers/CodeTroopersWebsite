const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

router.get('/', eventsController.getAll);
router.post('/', eventsController.create);
router.put('/:id', eventsController.update);
router.delete('/:id', eventsController.remove);

module.exports = router;

const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.getAll);
router.post('/', teamController.create);
router.put('/:id', teamController.update);
router.delete('/:id', teamController.remove);

module.exports = router;

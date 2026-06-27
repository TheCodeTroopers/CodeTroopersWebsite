const express = require('express');
const router = express.Router();
const achievementsController = require('../controllers/achievementsController');

router.get('/', achievementsController.getAll);
router.post('/', achievementsController.create);
router.delete('/:id', achievementsController.remove);

module.exports = router;

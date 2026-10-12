const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, requireAdmin } = require('../utils/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/google', authController.googleAuth);
router.get('/me', verifyToken, authController.getMe);
router.get('/users', requireAdmin, authController.getUsers);
router.put('/users/:id/role', requireAdmin, authController.updateUserRole);

module.exports = router;

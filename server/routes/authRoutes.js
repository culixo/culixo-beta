const express = require('express');
const router = express.Router();
const { signup, login, verifyToken } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify', authMiddleware, verifyToken); // Add this line

module.exports = router;
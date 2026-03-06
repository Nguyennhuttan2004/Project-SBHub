const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

/**
 * Authentication Routes
 * POST /api/auth/register - Register a new user
 * POST /api/auth/login    - Login an existing user
 */
router.post('/register', register);
router.post('/login', login);

module.exports = router;

const express = require('express');
const authController = require('./auth.controller');
const { validateRegister, validateLogin } = require('./auth.validator');
const authenticate = require('../../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, (req, res, next) => authController.register(req, res, next));
router.post('/login', validateLogin, (req, res, next) => authController.login(req, res, next));

// Protected routes
router.get('/me', authenticate, (req, res, next) => authController.getMe(req, res, next));

module.exports = router;

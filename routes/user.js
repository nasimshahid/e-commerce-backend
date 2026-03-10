
const express = require('express');
const router = express.Router();

const { login, signup, verifyEmail, forgotPassword, resetPassword } = require('../controllers/user');
const { validate } = require('../middleware/validation');

// User Authentication Routes
router.post("/signup", validate('signup'), signup);
router.post("/login", validate('login'), login);
router.post("/verify-email", validate('verifyEmail'), verifyEmail);

// Password Reset Routes
router.post("/forgot-password", validate('forgotPassword'), forgotPassword);
router.post("/reset-password", validate('resetPassword'), resetPassword);

module.exports = router;
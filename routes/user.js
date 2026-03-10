
const express = require('express');
const router = express.Router();

const { login, signup, verifyEmail, forgotPassword, resetPassword } = require('../controllers/user');
const { validate } = require('../middleware/validation');

// User Authentication Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email",  verifyEmail);
// Password Reset Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password",  resetPassword);

module.exports = router;

const express = require('express');
const router = express.Router();

const { login, signup, verifyEmail } = require('../conrollers.js/user');

// User login  

router.post("/login", login)
router.post("/signup", signup    )
router.post("/verify-email", verifyEmail    )

module.exports = router;
module.exports = router;
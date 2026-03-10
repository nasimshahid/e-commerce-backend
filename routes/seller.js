const express = require('express');
const { addProduct } = require('../controllers/seller');
const { authSeller } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.post('/add-product', authSeller, addProduct);

module.exports = router;
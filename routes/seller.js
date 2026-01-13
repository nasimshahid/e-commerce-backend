const express = require('express');
const { addProduct } = require('../conrollers.js/seller');
const { authSeller } = require('../middleware/auth');

const router = express.Router();



// router.post('/add-category', addCategory);
router.post('/add-product', authSeller,addProduct);




module.exports = router;
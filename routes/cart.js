const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateCart, removeItem, clearCart } = require('../controllers/cart');
const { authUser } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

router.post('/add', authUser, validate('addToCart'), addToCart);
router.get('/getCart', authUser, getCart);
router.put('/update', authUser, validate('updateCart'), updateCart);
router.delete('/remove/:productId', authUser, removeItem);
router.delete('/clear', authUser, clearCart);

module.exports = router;

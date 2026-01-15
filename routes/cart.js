const express = require('express');


const router = express.Router();
const { addToCart, getCart, updateCart, removeItem, clearCart } = require('../conrollers.js/cart');



router.post('/add',  addToCart);
router.get('/getCart',  getCart);
router.put('/update',  updateCart);
router.delete('/remove/:productId',  removeItem);
router.delete('/clear',  clearCart);

module.exports = router;

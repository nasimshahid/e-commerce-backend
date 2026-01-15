const { placeOrder, myOrders, orderDetail, cancelOrder, allOrders, updateStatus } = require('../conrollers.js/order');

const router = require('express').Router();

router.post('/place',  placeOrder);
router.get('/my-orders',  myOrders);
router.get('/:id',  orderDetail);
router.put('/cancel/:id',  cancelOrder);

// Admin
router.get('/admin/all',  allOrders);
router.put('/admin/status/:id',  updateStatus);

module.exports = router;

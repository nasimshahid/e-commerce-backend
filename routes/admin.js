
const express = require('express');
const { createAdminUser, addCategory, createSeller, createDeliveryBoy, assignDeliveryBoy } = require('../conrollers.js/admin');
const { authAdmin } = require('../middleware/auth');
const router = express.Router();


router.post('/create-admin', createAdminUser);
// router.post('/add-category', addCategory);
router.post('/add-category', authAdmin,addCategory);
router.post('/create-seller', authAdmin,createSeller);


// delivery boy api  routes
router.post("/create-delivery-boy", authAdmin, createDeliveryBoy);
router.put("/assign-delivery/:orderId", authAdmin, assignDeliveryBoy);


module.exports = router;
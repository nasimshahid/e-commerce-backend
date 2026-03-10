
const express = require('express');
const { createAdminUser, addCategory, createSeller, createDeliveryBoy, assignDeliveryBoy } = require('../controllers/admin');
const { authAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const router = express.Router();

router.post('/create-admin', createAdminUser);
router.post('/add-category', authAdmin,  addCategory);
router.post('/create-seller', authAdmin,  createSeller);
router.post("/create-delivery-boy", authAdmin,  createDeliveryBoy);
router.put("/assign-delivery/:orderId", authAdmin,  assignDeliveryBoy);

module.exports = router;
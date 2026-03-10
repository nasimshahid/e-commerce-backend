
const express = require('express');
const { createAdminUser, addCategory, createSeller, createDeliveryBoy, assignDeliveryBoy } = require('../controllers/admin');
const { authAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const router = express.Router();

router.post('/create-admin', createAdminUser);
router.post('/add-category', authAdmin, validate('addCategory'), addCategory);
router.post('/create-seller', authAdmin, validate('createSeller'), createSeller);
router.post("/create-delivery-boy", authAdmin, validate('createDeliveryBoy'), createDeliveryBoy);
router.put("/assign-delivery/:orderId", authAdmin, validate('assignDeliveryBoy'), assignDeliveryBoy);

module.exports = router;
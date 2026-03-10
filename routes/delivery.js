
const express = require('express');
const router = express.Router();
const { getMyDeliveryOrders, outForDelivery, verifyDeliveryOTP } = require("../controllers/delivery");
const { authDeliveryBot } = require("../middleware/auth");
const { validate } = require("../middleware/validation");

router.get("/my-delivery", authDeliveryBot, getMyDeliveryOrders);
router.put("/out-for-delivery/:orderId", authDeliveryBot, outForDelivery);
router.put("/verify-delivery/:orderId", authDeliveryBot, verifyDeliveryOTP);

module.exports = router;

const express = require('express');


const router = express.Router();
const { getMyDeliveryOrders, outForDelivery, verifyDeliveryOTP,  } = require("../conrollers.js/delivery");

router.get("/my-delivery",  getMyDeliveryOrders);
router.put("/out-for-delivery/:orderId",  outForDelivery);
router.put("/verify-delivery/:orderId",  verifyDeliveryOTP);

module.exports = router;
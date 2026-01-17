const express = require("express");
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById, cancelOrder, getSellerOrders, getAllOrders, updateOrderStatus } = require('../conrollers.js/order');

// USER
router.post("/place", placeOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", getOrderById);
router.put("/cancel/:id", cancelOrder);

// SELLER
router.get("/seller/orders", getSellerOrders);

// ADMIN
router.get("/admin/all", getAllOrders);
router.put("/admin/status/:id", updateOrderStatus);

module.exports = router;

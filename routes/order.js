const express = require("express");
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById, cancelOrder, getSellerOrders, getAllOrders, updateOrderStatus } = require('../controllers/order');
const { authUser, authSeller, authAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// USER — static routes MUST come before the dynamic /:id route
router.post("/place", authUser, validate('placeOrder'), placeOrder);
router.get("/my-orders", authUser, getMyOrders);
router.put("/cancel/:id", authUser, cancelOrder);

// SELLER — static routes MUST come before the dynamic /:id route
router.get("/seller/orders", authSeller, getSellerOrders);

// ADMIN — static routes MUST come before the dynamic /:id route
router.get("/admin/all", authAdmin, getAllOrders);
router.put("/admin/status/:id", authAdmin, updateOrderStatus);

// Dynamic route LAST — otherwise it would swallow all the routes above
router.get("/:id", authUser, getOrderById);

module.exports = router;

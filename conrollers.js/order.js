const Cart = require("../models/cart");
const Order = require("../models/order");
const Product = require("../models/product");


// 🔹 Generate Order Number
const generateOrderNumber = () => {
  return "ORD" + Date.now();
};

// ============================
// PLACE ORDER (Cart → Order)
// ============================
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { paymentMethod, shippingAddress } = req.body;

    // 1️⃣ Get cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    let orderItems = [];

    // 2️⃣ Prepare order items
    for (let item of cart.items) {
      const product = item.product;

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        seller: product.seller,
        quantity: item.quantity,
        price: product.price
      });
    }

    // 3️⃣ Create order
    const order = new Order({
      orderNumber: generateOrderNumber(),
      user: userId,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      shippingAddress
    });

    await order.save();

    // 4️⃣ Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET MY ORDERS (USER)
// ============================
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .populate("items.seller")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET SINGLE ORDER
// ============================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("items.seller")
      .populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// CANCEL ORDER (USER)
// ============================
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Order cannot be cancelled now"
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// SELLER: GET OWN ORDERS
// ============================
exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find({
      "items.seller": sellerId
    }).populate("items.product");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// ADMIN: ALL ORDERS
// ============================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product")
      .populate("items.seller")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// ADMIN: UPDATE ORDER STATUS
// ============================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

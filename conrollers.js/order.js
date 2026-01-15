const Cart = require("../models/cart");
const Order = require("../models/order");


exports.placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    const orderItems = cart.items.map(item => {
      total += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      };
    });

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount: total,
      shippingAddress,
      paymentMethod
    });

    cart.items = [];
    await cart.save();

    res.json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate("items.product");
  res.json(orders);
};

exports.orderDetail = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.product");
  res.json(order);
};

exports.cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order.status !== "pending") {
    return res.status(400).json({ message: "Cannot cancel now" });
  }

  order.status = "cancelled";
  await order.save();

  res.json({ message: "Order cancelled", order });
};

// Admin
exports.allOrders = async (req, res) => {
  const orders = await Order.find().populate("user");
  res.json(orders);
};

exports.updateStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(order);
};

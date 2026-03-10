const Cart = require('../models/cart');

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json({ message: "Added to cart", cart });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get my cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update quantity
exports.updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove product
exports.removeItem = async (req, res) => {

  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();

    res.json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ message: "Cart cleared" });
};







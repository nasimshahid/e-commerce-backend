const Cart = require('../models/cart');

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // const userId = req.user.id;
    const userId = "69748e0d33eabb5fb2eecda9"  // temp hardcoded;

    let cart = await Cart.findOne({ user: userId });
    console.log(cart, "first");
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    console.log(cart, "2nd");
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    console.log(itemIndex, "itemIndex");
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
    // const cart = await Cart.findOne({ user: req.user.id })
    const cart = await Cart.findOne({ user: "69689fcec6cdba6db2107070" })
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

    const cart = await Cart.findOne({ user: req.user.id });

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

    const cart = await Cart.findOne({ user: req.user.id });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();

    res.json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
  res.json({ message: "Cart cleared" });
};







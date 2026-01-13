const Product = require("../models/product");




exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    const product = new Product({
      name,
      price,
      description,
      category,
      seller: req.user._id
    });

    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



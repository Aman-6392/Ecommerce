const Product = require("../models/product");

// ================= ADD PRODUCT =================
const addProduct = async (req, res) => {
  try {
    const { name, price, category, description, stock, company } = req.body;

    if (!name || !price || !category || !company) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const newProduct = new Product({
      name,
      price,
      category,
      description,
      stock,
      company
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE PRODUCT =================
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addProduct, deleteProduct };
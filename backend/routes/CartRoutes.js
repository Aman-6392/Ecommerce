const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/product");
const { protect } = require("../middleware/authMiddleware");


// ================= GET USER CART =================
router.get("/", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate("items.product");

        if (!cart) {
            return res.json([]);
        }

        res.json(cart.items);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


// ================= ADD TO CART =================
router.post("/", protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: []
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            const newQuantity = cart.items[itemIndex].quantity + quantity;

            if (newQuantity > product.stock) {
                return res.status(400).json({ message: "Exceeds available stock" });
            }

            cart.items[itemIndex].quantity = newQuantity;

        } else {
            cart.items.push({
                product: productId,
                quantity
            });
        }

        await cart.save();

        const updatedCart = await Cart.findOne({ user: req.user.id })
            .populate("items.product");

        res.json(updatedCart.items);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


// ================= UPDATE QUANTITY =================
router.put("/", protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        const product = await Product.findById(productId);

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        item.quantity = quantity;

        await cart.save();

        const updatedCart = await Cart.findOne({ user: req.user.id })
            .populate("items.product");

        res.json(updatedCart.items);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


// ================= REMOVE ITEM =================
router.delete("/:productId", protect, async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        const updatedCart = await Cart.findOne({ user: req.user.id })
            .populate("items.product");

        res.json(updatedCart.items);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


// ================= CLEAR CART =================
router.delete("/", protect, async (req, res) => {
    try {
        await Cart.findOneAndDelete({ user: req.user.id });
        res.json({ message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
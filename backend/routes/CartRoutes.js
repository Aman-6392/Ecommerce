const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/product");
const { protect } = require("../middleware/authMiddleware");


// ================= GET USER CART =================
router.get("/", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

        if (!cart) {
            return res.json([]);
        }

        res.json(cart.items);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= ADD TO CART =================
router.post("/", protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: []
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity
            });
        }

        await cart.save();

        const updatedCart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

        res.json(updatedCart.items);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= UPDATE QUANTITY =================
router.put("/", protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        item.quantity = quantity;

        await cart.save();

        const updatedCart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

        res.json(updatedCart.items);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= REMOVE ITEM =================
router.delete("/:productId", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );

        await cart.save();

        const updatedCart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

        res.json(updatedCart.items);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= CLEAR CART =================
router.delete("/", protect, async (req, res) => {
    try {
        await Cart.findOneAndDelete({ user: req.user._id });
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
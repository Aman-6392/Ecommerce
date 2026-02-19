const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/product");
const { protect, adminOnly } = require("../middleware/authMiddleware");


// ================= GET ALL ORDERS (ADMIN) =================
router.get("/all", protect, adminOnly, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const orders = await Order.find()
            .populate("userId", "name email")
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Order.countDocuments();

        res.json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            orders
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


// ================= PLACE ORDER (SAFE WITH TRANSACTION) =================
router.post("/", protect, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { items, totalAmount } = req.body;

        if (!items || items.length === 0 || !totalAmount) {
            return res.status(400).json({ message: "Invalid order data" });
        }

        for (let item of items) {

            if (!mongoose.Types.ObjectId.isValid(item._id)) {
                throw new Error("Invalid product ID");
            }

            const product = await Product.findById(item._id).session(session);

            if (!product) {
                throw new Error("Product not found");
            }

            if (product.stock < item.quantity) {
                throw new Error(`${product.name} out of stock`);
            }

            product.stock -= item.quantity;
            await product.save({ session });
        }

        const newOrder = new Order({
            userId: req.user.id,
            items,
            totalAmount,
            status: "Pending"
        });

        await newOrder.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Order placed successfully",
            order: newOrder
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });
    }
});


// ================= USER ORDERS =================
router.get("/", protect, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


// ================= UPDATE ORDER STATUS (ADMIN) =================
router.put("/update-status/:id", protect, adminOnly, async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const allowedStatus = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

        if (!allowedStatus.includes(req.body.status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        order.status = req.body.status;
        await order.save();

        res.json({
            message: "Status updated successfully",
            order
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
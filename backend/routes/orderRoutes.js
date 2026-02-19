const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ✅ FIXED IMPORT
const { protect, adminOnly } = require("../middleware/authMiddleware");

const Product = require("../models/product");


// ================= GET ALL ORDERS (ADMIN ONLY) =================
router.get(
    "/all",
    protect,
    adminOnly,
    async (req, res) => {
        try {
            const orders = await Order.find()
                .populate("userId", "name email");

            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);


// ================= PLACE ORDER =================
router.post("/", protect, async (req, res) => {
    try {

        const { items, totalAmount } = req.body;

        // Reduce stock
        for (let item of items) {

            const product = await Product.findById(item._id);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `${product.name} out of stock`
                });
            }

            product.stock -= item.quantity;
            await product.save();
        }

        const newOrder = new Order({
            userId: req.user.id,
            items,
            totalAmount
        });

        await newOrder.save();

        res.json({ message: "Order placed successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ================= USER ORDERS =================
router.get("/", protect, async (req, res) => {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
});

// Update Order Status
router.put("/update-status/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status;
    await order.save();

    res.json({ message: "Status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


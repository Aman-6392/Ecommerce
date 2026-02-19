const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

// ✅ FIXED IMPORT
const { protect } = require("../middleware/authMiddleware");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// ================= CREATE ORDER FOR PAYMENT =================
router.post("/create-order", protect, async (req, res) => {

    try {

        const options = {
            amount: req.body.amount * 100, // amount in paisa
            currency: "INR",
            receipt: "receipt_order_" + Date.now()
        };

        const order = await razorpay.orders.create(options);

        res.json(order);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

module.exports = router;
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        status: {
            type: String,
            default: "Pending",
            enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
        },

        paymentStatus: {
            type: String,
            default: "Paid",
        },

        paymentId: String,

        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                name: String,
                price: Number,
                quantity: Number,
            },
        ],

        shippingAddress: {
            name: String,
            phone: String,
            street: String,
            city: String,
            state: String,
            pincode: String,
        },

        totalAmount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true } // ✅ this automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Order", orderSchema);
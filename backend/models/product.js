const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
    company: {
        type: String,
        required: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: "",
        trim: true
    },

    stock: {
        type: Number,
        default: 0,
        min: [0, "Stock cannot be negative"]
    }
},
{ timestamps: true }
);

// 🔎 Indexes for faster filtering/search
productSchema.index({ name: "text", company: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
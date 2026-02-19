const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {          // ✅ Add this if not present
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
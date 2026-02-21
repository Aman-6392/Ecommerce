const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ================= GET PRODUCTS WITH FILTER + PAGINATION =================
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10, category, company, search } = req.query;

        let filter = {};

        if (category) filter.category = category;
        if (company) filter.company = company;

        if (search) {
            filter.$text = { $search: search };
        }

        const products = await Product.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(filter);

        res.json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            products
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ================= RANDOM PRODUCTS =================
router.get("/random", async (req, res) => {
    try {
        const products = await Product.aggregate([{ $sample: { size: 8 } }]);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ================= GET SINGLE PRODUCT =================
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ================= ADD PRODUCT =================
router.post(
    "/",
    protect,
    adminOnly,
    async (req, res) => {
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
            res.status(201).json(newProduct);

        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

// ================= UPDATE PRODUCT =================
router.put(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {
        try {

            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid product ID" });
            }

            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            const fields = ["name", "price", "category", "description", "stock", "company"];

            fields.forEach(field => {
                if (req.body[field] !== undefined) {
                    product[field] = req.body[field];
                }
            });

            await product.save();
            res.json(product);

        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

// ================= DELETE PRODUCT =================
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const deleted = await Product.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
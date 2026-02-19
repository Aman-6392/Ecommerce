const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");


// ================= GET ALL PRODUCTS =================
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ================= RANDOM PRODUCTS =================
router.get("/random", async (req, res) => {
    try {
        const products = await Product.find().limit(20);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ================= SEARCH PRODUCTS =================
router.get("/search", async (req, res) => {
    try {
        const query = req.query.q;

        const products = await Product.find({
            name: { $regex: query, $options: "i" }
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ================= GET SINGLE PRODUCT =================
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ================= ADD PRODUCT =================
router.post(
    "/",
    protect,
    adminOnly,
    upload.single("image"),
    async (req, res) => {
        try {

            if (!req.file) {
                return res.status(400).json({ message: "Image required" });
            }

            const newProduct = new Product({
                name: req.body.name,
                price: req.body.price,
                category: req.body.category,
                description: req.body.description,
                stock: req.body.stock,
                company: req.body.company,      // ✅ ADDED
                image: `/uploads/${req.file.filename}`
            });

            await newProduct.save();
            res.json(newProduct);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);


// ================= UPDATE PRODUCT =================
router.put(
    "/:id",
    protect,
    adminOnly,
    upload.single("image"),
    async (req, res) => {
        try {

            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            product.name = req.body.name || product.name;
            product.price = req.body.price || product.price;
            product.category = req.body.category || product.category;
            product.description = req.body.description || product.description;
            product.stock = req.body.stock || product.stock;
            product.company = req.body.company || product.company;   // ✅ ADDED

            if (req.file) {
                product.image = `/uploads/${req.file.filename}`;
            }

            await product.save();
            res.json(product);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);


// ================= DELETE PRODUCT =================
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
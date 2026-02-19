import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Admin.css";

function Admin() {

    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");

    const API = process.env.REACT_APP_API_URL;
    // 🔥 NEW FILTER STATES
    const [companyFilter, setCompanyFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [stockFilter, setStockFilter] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
        stock: "",
        company: ""
    });

    const [image, setImage] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        axios.get(`${API}/api/products`)
            .then(res => setProducts(res.data))
            .catch(err => console.log(err));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddNew = () => {
        setEditingId(null);
        setFormData({
            name: "",
            price: "",
            category: "",
            description: "",
            stock: "",
            company: ""
        });
        setImage(null);
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setEditingId(product._id);
        setFormData({
            name: product.name || "",
            price: product.price || "",
            category: product.category || "",
            description: product.description || "",
            stock: product.stock ?? 0,
            company: product.company || ""
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        if (image) data.append("image", image);

        try {

            if (editingId) {
                await axios.put(
                    `${API}/api/products/${editingId}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                alert("Product Updated");
            } else {
                await axios.post(
                    `${API}/api/products`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                alert("Product Added");
            }

            setFormData({
                name: "",
                price: "",
                category: "",
                description: "",
                stock: "",
                company: ""
            });

            setImage(null);
            setEditingId(null);
            setShowModal(false);
            loadProducts();

        } catch (error) {
            alert("Error saving product");
        }
    };

    const handleDelete = async (id) => {
        await axios.delete(
            `${API}/api/products/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        loadProducts();
    };

    // 🔥 UNIQUE VALUES FOR FILTER
    const uniqueCompanies = [...new Set(products.map(p => p.company))];
    const uniqueCategories = [...new Set(products.map(p => p.category))];

    // 🔥 FILTER LOGIC
    const filteredProducts = products.filter(product => {

        const matchSearch =
            product.name?.toLowerCase().includes(search.toLowerCase()) ||
            product.category?.toLowerCase().includes(search.toLowerCase()) ||
            product.company?.toLowerCase().includes(search.toLowerCase());

        const matchCompany =
            companyFilter === "" || product.company === companyFilter;

        const matchCategory =
            categoryFilter === "" || product.category === categoryFilter;

        const matchStock =
            stockFilter === "" ||
            (stockFilter === "in" && product.stock > 0) ||
            (stockFilter === "out" && product.stock === 0);

        return matchSearch && matchCompany && matchCategory && matchStock;
    });

    return (
        <div className="admin-container">

            {/* ================= HEADER ================= */}
            <div className="admin-header">
                <div>
                    <h2 className="admin-title">Admin Panel</h2>
                    <p className="admin-subtitle">
                        Manage products efficiently
                    </p>
                </div>

                <div className="admin-actions">
                    <Link to="/admin/orders" className="orders-btn">
                        📦 View Orders
                    </Link>

                    <button onClick={handleAddNew} className="add-btn">
                        + Add Product
                    </button>
                </div>
            </div>

            {/* ================= SEARCH ================= */}
            <input
                type="text"
                placeholder="Search by name, category or company..."
                className="admin-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* ================= FILTERS ================= */}
            <div className="admin-filters">

                <select
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                >
                    <option value="">All Companies</option>
                    {uniqueCompanies.map((company, index) => (
                        <option key={index} value={company}>
                            {company}
                        </option>
                    ))}
                </select>

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {uniqueCategories.map((cat, index) => (
                        <option key={index} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                >
                    <option value="">All Stock</option>
                    <option value="in">In Stock</option>
                    <option value="out">Out of Stock</option>
                </select>

                <button
                    className="clear-filter-btn"
                    onClick={() => {
                        setCompanyFilter("");
                        setCategoryFilter("");
                        setStockFilter("");
                    }}
                >
                    Clear Filters
                </button>

            </div>

            <h3>All Products</h3>

            {/* ================= PRODUCT LIST ================= */}
            {filteredProducts.map(product => (
                <div key={product._id} className="admin-product">

                    <img
                        src={`${API}${product.image}`}
                        alt={product.name}
                    />

                    <div className="admin-info">
                        <h4>{product.name}</h4>
                        <p><strong>Company:</strong> {product.company}</p>
                        <p>₹{product.price}</p>
                        <p>{product.category}</p>
                        <p>{product.description}</p>
                        <p>Stock: {product.stock}</p>
                    </div>

                    <div>
                        <button
                            onClick={() => handleEdit(product)}
                            className="edit-btn"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => handleDelete(product._id)}
                            className="delete-btn"
                        >
                            Delete
                        </button>
                    </div>

                </div>
            ))}

            {/* ================= MODAL ================= */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">

                        <h3>{editingId ? "Edit Product" : "Add Product"}</h3>

                        <form onSubmit={handleSubmit}>

                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name"
                                required
                            />

                            <input
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Company Name"
                                required
                            />

                            <input
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Price"
                                required
                            />

                            <input
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Category"
                                required
                            />

                            <input
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="Stock"
                                required
                            />

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                                required
                            />

                            <input
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                                required={!editingId}
                            />

                            <div className="modal-buttons">
                                <button type="submit" className="save-btn">
                                    {editingId ? "Update" : "Add"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}

export default Admin;
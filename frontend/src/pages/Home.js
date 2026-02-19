import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {

    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // ✅ Filter States
    const [companyFilter, setCompanyFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    // ================= FETCH PRODUCTS =================
    useEffect(() => {
        axios.get("http://localhost:5000/api/products")
            .then(res => setProducts(res.data))
            .catch(err => console.log(err));
    }, []);

    // ================= SEARCH SUGGESTIONS =================
    useEffect(() => {
        const delay = setTimeout(() => {

            if (search.trim() !== "") {
                axios.get(`http://localhost:5000/api/products/search?q=${search}`)
                    .then(res => setSuggestions(res.data))
                    .catch(err => console.log(err));
            } else {
                setSuggestions([]);
            }

        }, 300);

        return () => clearTimeout(delay);

    }, [search]);

    // 🔥 Redirect on suggestion click
    const handleSuggestionClick = (product) => {
        setSearch("");
        setSuggestions([]);
        navigate(`/product/${product._id}`);
    };

    // ================= UNIQUE FILTER VALUES =================
    const uniqueCompanies = [...new Set(products.map(p => p.company))];
    const uniqueCategories = [...new Set(products.map(p => p.category))];

    // ================= FILTER LOGIC =================
    const filteredProducts = products.filter(product => {

        const matchSearch =
            product.name.toLowerCase().includes(search.toLowerCase());

        const matchCompany =
            companyFilter === "" || product.company === companyFilter;

        const matchCategory =
            categoryFilter === "" || product.category === categoryFilter;

        return matchSearch && matchCompany && matchCategory;
    });

    return (
        <div className="container">

           

            {/* ================= SEARCH SECTION ================= */}
            <div className="search-wrapper">

                <input
                    className="search-box"
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {suggestions.length > 0 && (
                    <div className="suggestions">
                        {suggestions.map(item => (
                            <div
                                key={item._id}
                                className="suggestion-item"
                                onClick={() => handleSuggestionClick(item)}
                            >
                                <img
                                    src={`http://localhost:5000${item.image}`}
                                    alt={item.name}
                                    className="suggestion-img"
                                />

                                <div>
                                    <p><strong>{item.name}</strong></p>
                                    <p className="company-name">
                                        {item.company}
                                    </p>
                                    <p className="suggestion-price">
                                        ₹{item.price}
                                    </p>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* ================= FILTER SECTION ================= */}
            <div className="filter-section">

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

                <button
                    className="clear-btn"
                    onClick={() => {
                        setCompanyFilter("");
                        setCategoryFilter("");
                    }}
                >
                    Clear
                </button>

            </div>

            {/* ================= PRODUCTS ================= */}
            <h2 className="section-title">
                Featured Products
            </h2>

            <div className="product-grid">

                {filteredProducts.length === 0 && (
                    <p>No products found.</p>
                )}

                {filteredProducts.map(product => (

                    <div
                        key={product._id}
                        className="product-card"
                        onClick={() => navigate(`/product/${product._id}`)}
                        style={{ cursor: "pointer" }}
                    >

                        <img
                            src={`http://localhost:5000${product.image}`}
                            alt={product.name}
                        />

                        <h4>{product.name}</h4>

                        <p className="company-name">
                            {product.company}
                        </p>

                        <p className="price">
                            ₹{product.price}
                        </p>

                        {product.stock > 0 ? (
                            <span className="in-stock">In Stock</span>
                        ) : (
                            <span className="out-stock">Out of Stock</span>
                        )}

                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // prevent redirect
                                addToCart(product);
                            }}
                            disabled={product.stock === 0}
                        >
                            Add to Cart
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Home;
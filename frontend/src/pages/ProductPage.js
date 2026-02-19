import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "./ProductPage.css";

function ProductPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.log(err));
    }, [id]);

    if (!product) {
        return <h2 className="loading">Loading Product...</h2>;
    }

    return (
        <div className="product-page">

            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="product-container">

                {/* LEFT IMAGE SECTION */}
                <div className="product-image-section">
                    <img
                        src={`http://localhost:5000${product.image}`}
                        alt={product.name}
                    />
                </div>

                {/* RIGHT DETAILS SECTION */}
                <div className="product-info-section">

                    <h1 className="product-title">
                        {product.name}
                    </h1>

                    <p className="meta">
                        Brand: <strong>{product.company}</strong>
                    </p>

                    <p className="meta">
                        Category: <strong>{product.category}</strong>
                    </p>

                    <h2 className="product-price">
                        ₹{product.price}
                    </h2>

                    {product.stock > 0 ? (
                        <span className="stock-badge in-stock">
                            In Stock
                        </span>
                    ) : (
                        <span className="stock-badge out-stock">
                            Out of Stock
                        </span>
                    )}

                    {/* Quantity Selector */}
                    <div className="quantity-box">
                        <button
                            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        >
                            -
                        </button>

                        <span>{quantity}</span>

                        <button
                            onClick={() =>
                                quantity < product.stock &&
                                setQuantity(quantity + 1)
                            }
                        >
                            +
                        </button>
                    </div>

                    {/* Buttons */}
                    <div className="action-buttons">

                        <button
                            className="add-cart"
                            onClick={() =>
                                addToCart({ ...product, quantity })
                            }
                            disabled={product.stock === 0}
                        >
                            Add to Cart
                        </button>

                        <button
                            className="buy-now"
                            onClick={() => {
                                addToCart({ ...product, quantity });
                                navigate("/cart");
                            }}
                            disabled={product.stock === 0}
                        >
                            Buy Now
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ProductPage;
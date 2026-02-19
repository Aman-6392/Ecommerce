import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "./ProductPage.css";

function ProductPage() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const API =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // ================= FETCH PRODUCT =================
  useEffect(() => {

    axios.get(`${API}/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
      })
      .catch(err => {
        console.error("Product Load Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [id]);

  if (loading) {
    return <h2 className="loading">Loading Product...</h2>;
  }

  if (!product) {
    return <h2 className="loading">Product not found</h2>;
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="product-page">

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="product-container">

        {/* IMAGE */}
        <div className="product-image-section">
          <img
            src={`${API}/${product.image?.replace(/^\/+/, "")}`}
            alt={product.name}
          />
        </div>

        {/* DETAILS */}
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

          {/* QUANTITY */}
          <div className="quantity-box">

            <button
              onClick={() =>
                quantity > 1 &&
                setQuantity(quantity - 1)
              }
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

          {/* ACTION BUTTONS */}
          <div className="action-buttons">

            <button
              className="add-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>

            <button
              className="buy-now"
              onClick={() => {
                handleAddToCart();
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
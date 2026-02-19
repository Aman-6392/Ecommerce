import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Cart.css";
import StepIndicator from "../components/StepIndicator";
import { useNavigate } from "react-router-dom";

function Cart() {
  const API =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

  const { cart, addToCart, decreaseQuantity, removeFromCart, getTotal } =
    useContext(CartContext);

  const navigate = useNavigate();

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="cart-page">

      {cart.length > 0 && <StepIndicator currentStep={1} />}

      <div className="cart-container">

        <div className="cart-left-section">
          <h2>Your Shopping Cart</h2>

          {cart.length === 0 && (
            <p className="empty-cart">Your cart is empty.</p>
          )}

          {cart.map(item => (
            <div key={item._id} className="cart-item">

              <img
                src={`${API}/${item.image?.replace(/^\/+/, "")}`}
                alt={item.name}
                className="cart-image"
              />

              <div className="cart-details">
                <h4>{item.name}</h4>

                <div className="cart-price-qty">
                  <p className="item-price">
                    ₹{item.price}
                  </p>

                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        decreaseQuantity(item._id)
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <p className="item-subtotal">
                  Subtotal: ₹
                  {Number(item.price) * item.quantity}
                </p>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFromCart(item._id)
                  }
                >
                  Remove
                </button>

              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="cart-summary">

            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Total Items:</span>
              <span>{totalItems}</span>
            </div>

            <div className="summary-row">
              <strong>Total:</strong>
              <strong>₹{getTotal()}</strong>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/address")}
            >
              Proceed to Checkout
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default Cart;
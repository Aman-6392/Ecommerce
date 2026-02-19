import React, { useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "./Cart.css";
import StepIndicator from "../components/StepIndicator";
import { useNavigate } from "react-router-dom";
function Cart() {

    const { cart, addToCart, removeFromCart, getTotal } =
        useContext(CartContext);


    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const decreaseQty = (item) => {
        if (item.quantity > 1) {
            removeFromCart(item._id);
            for (let i = 1; i < item.quantity; i++) {
                addToCart(item);
            }
        } else {
            removeFromCart(item._id);
        }
    };

    const handlePayment = async () => {
        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/payment/create-order",
                { amount: getTotal() },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const options = {
                key: "rzp_test_SH7TnETx1QeAgG",
                amount: data.amount,
                currency: data.currency,
                order_id: data.id,
                name: "Ganesh Electric Shop",
                description: "Purchase Payment",
                handler: async function () {

                    await axios.post(
                        "http://localhost:5000/api/orders",
                        {
                            items: cart,
                            totalAmount: getTotal()
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    alert("Payment Successful & Order Placed!");
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch {
            alert("Payment failed");
        }
    };

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
                                src={`http://localhost:5000${item.image}`}
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
                                        <button onClick={() => decreaseQty(item)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => addToCart(item)}>+</button>
                                    </div>
                                </div>

                                <p className="item-subtotal">
                                    Subtotal: ₹{item.price * item.quantity}
                                </p>

                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromCart(item._id)}
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
                            <span>{cart.length}</span>
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
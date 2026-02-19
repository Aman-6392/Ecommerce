import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import StepIndicator from "../components/StepIndicator";
import styles from "./Payment.module.css";

function Payment() {
    const { cart, getTotal } = useContext(CartContext);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);

            const { data } = await axios.post(
                "http://localhost:5000/api/payment/create-order",
                { amount: getTotal() },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const options = {
                key: "rzp_test_SHxAq8IQpJMOGL",
                amount: data.amount,
                currency: data.currency,
                order_id: data.id,
                name: "Ganesh Electric and Electronics",
                description: "Order Payment",

                handler: async function (response) {
                    const address = JSON.parse(localStorage.getItem("shippingAddress"));

                    await axios.post(
                        "http://localhost:5000/api/orders",
                        {
                            items: cart,
                            totalAmount: getTotal(),
                            shippingAddress: address,
                            paymentId: response.razorpay_payment_id,
                            paymentStatus: "Paid",
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    alert("Payment Successful!");
                    navigate("/");
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert("Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.paymentPage}>
            <StepIndicator currentStep={4} />

            <div className={styles.paymentWrapper}>
                {/* LEFT SIDE */}
                <div className={styles.paymentCard}>
                    <h2 className={styles.title}>Confirm & Pay</h2>

                    <div className={styles.infoBox}>
                        <p>You are about to complete your order.</p>
                        <p>Please verify the total before proceeding.</p>
                    </div>

                    <div className={styles.amountBox}>
                        <span>Total Amount</span>
                        <h3>₹{getTotal()}</h3>
                    </div>

                    <div className={styles.paymentButtons}>
                        <button
                            className={styles.backBtn}
                            onClick={() => navigate("/review")}
                        >
                            ← Back to Review
                        </button>

                        <button
                            className={styles.payBtn}
                            onClick={handlePayment}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Pay Now →"}
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className={styles.summaryCard}>
                    <h3>Order Summary</h3>

                    {cart.map((item) => (
                        <div key={item._id} className={styles.summaryItem}>
                            <span>
                                {item.name} × {item.quantity}
                            </span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>
                    ))}

                    <div className={styles.divider}></div>

                    <div className={styles.summaryTotal}>
                        <span>Total</span>
                        <span>₹{getTotal()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
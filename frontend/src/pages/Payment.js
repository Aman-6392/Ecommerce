import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import StepIndicator from "../components/StepIndicator";
import styles from "./Payment.module.css";
 const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
function Payment() {

  const RAZORPAY_KEY =
    process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_xxxxx";

  const { cart, getTotal, clearCart } =
    useContext(CartContext);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // ================= PROTECTION =================
  useEffect(() => {

    if (!token) {
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      navigate("/");
      return;
    }

    const address =
      localStorage.getItem("shippingAddress");

    if (!address) {
      navigate("/address");
    }

  }, [token, cart.length, navigate]);

  // ================= PAYMENT =================
  const handlePayment = async () => {

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${API}/api/payment/create-order`,
        { amount: getTotal() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      const options = {
        key: RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: "Ganesh Electric and Electronics",
        description: "Order Payment",

        handler: async function (response) {

          try {

            const address = JSON.parse(
              localStorage.getItem("shippingAddress")
            );

            await axios.post(
              `${API}/api/orders`,
              {
                items: cart,
                totalAmount: getTotal(),
                shippingAddress: address,
                paymentId:
                  response.razorpay_payment_id,
                paymentStatus: "Paid",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                },
                withCredentials: true
              }
            );

            clearCart();
            localStorage.removeItem("shippingAddress");

            alert("Payment Successful!");
            navigate("/");

          } catch (err) {
            console.error(
              "Order Save Error:",
              err.response?.data || err
            );
            alert("Order saving failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(
        "Payment Error:",
        err.response?.data || err
      );
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

          <h2 className={styles.title}>
            Confirm & Pay
          </h2>

          <div className={styles.infoBox}>
            <p>
              You are about to complete your order.
            </p>
            <p>
              Please verify the total before proceeding.
            </p>
          </div>

          <div className={styles.amountBox}>
            <span>Total Amount</span>
            <h3>₹{getTotal()}</h3>
          </div>

          <div className={styles.paymentButtons}>

            <button
              className={styles.backBtn}
              onClick={() =>
                navigate("/review")
              }
            >
              ← Back to Review
            </button>

            <button
              className={styles.payBtn}
              onClick={handlePayment}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : "Pay Now →"}
            </button>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className={styles.summaryCard}>

          <h3>Order Summary</h3>

          {cart.map((item) => (
            <div
              key={item._id}
              className={styles.summaryItem}
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>
                ₹
                {Number(item.price) *
                  item.quantity}
              </span>
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
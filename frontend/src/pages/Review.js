import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import StepIndicator from "../components/StepIndicator";
import styles from "./Review.module.css";

function Review() {
  const navigate = useNavigate();
  const { cart, getTotal } = useContext(CartContext);
  const address = JSON.parse(localStorage.getItem("shippingAddress"));

  return (
    <div className={styles.reviewPage}>
      <div className={styles.stepWrapper}>
        <StepIndicator currentStep={3} />
      </div>

      <div className={styles.reviewWrapper}>

        {/* LEFT SECTION */}
        <div className={styles.reviewLeft}>

          <div className={styles.reviewCard}>
            <h3>Shipping Address</h3>
            <div className={styles.addressDetails}>
              <p className={styles.name}>{address?.name}</p>
              <p>{address?.street}</p>
              <p>
                {address?.city}, {address?.state} - {address?.pincode}
              </p>
              <p>📞 {address?.phone}</p>
            </div>
          </div>

          <div className={styles.reviewCard}>
            <h3>Order Items</h3>

            {cart.map((item) => (
              <div key={item._id} className={styles.reviewItem}>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name}</p>
                  <span className={styles.itemQty}>
                    Qty: {item.quantity}
                  </span>
                </div>

                <div className={styles.itemPrice}>
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className={styles.reviewSummary}>
          <h3>Order Summary</h3>

          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{getTotal()}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span className={styles.free}>FREE</span>
          </div>

          <div className={styles.divider}></div>

          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>₹{getTotal()}</span>
          </div>

          <button
            className={`${styles.primaryBtn} ${styles.fullBtn}`}
            onClick={() => navigate("/payment")}
          >
            Proceed to Payment →
          </button>

          <button
            className={styles.backLink}
            onClick={() => navigate("/address")}
          >
            ← Back to Address
          </button>
        </div>

      </div>
    </div>
  );
}

export default Review;
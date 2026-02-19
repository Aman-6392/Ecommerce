import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Address.module.css";
import StepIndicator from "../components/StepIndicator";
import { useEffect } from "react";
function Address() {
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
      navigate("/");
    }
  }, []);
  const navigate = useNavigate();

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
    "Jammu and Kashmir", "Ladakh",
    "Lakshadweep", "Puducherry"
  ];

  const [address, setAddress] = useState(() => {
    const saved = localStorage.getItem("shippingAddress");
    return saved
      ? JSON.parse(saved)
      : {
        name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      };
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinue = () => {
    if (Object.values(address).some(value => !value.trim())) {
      setError("Please fill all fields");
      return;
    }
    const { name, phone, street, city, state, pincode } = address;

    if (!name || !phone || !street || !city || !state || !pincode) {
      setError("Please fill all fields");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Phone number must be 10 digits");
      return;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      setError("Pincode must be 6 digits");
      return;
    }

    setError("");
    localStorage.setItem("shippingAddress", JSON.stringify(address));
    navigate("/review");
  };

  return (
    <div className={styles.checkoutPage}>
      <StepIndicator currentStep={2} />

      <div className={styles.checkoutWrapper}>
        <div className={styles.checkoutCard}>
          <h2 className={styles.title}>Shipping Address</h2>
          <p className={styles.subtitle}>
            Please enter your delivery details carefully
          </p>

          {error && <p className={styles.formError}>{error}</p>}

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                className={styles.inputField}
                name="name"
                value={address.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <input
              className={styles.inputField}
              name="phone"
              value={address.phone}
              onChange={(e) =>
                setAddress({
                  ...address,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
              placeholder="10-digit mobile number"
              maxLength="10"
            />

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Street Address</label>
              <input
                className={styles.inputField}
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="House no, Building, Area"
              />
            </div>

            <div className={styles.formGroup}>
              <label>City</label>
              <input
                className={styles.inputField}
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

            <div className={styles.formGroup}>
              <label>State</label>
              <select
                className={styles.stateSelect}
                name="state"
                value={address.state}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                {indianStates.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <input
              className={styles.inputField}
              name="pincode"
              value={address.pincode}
              onChange={(e) =>
                setAddress({
                  ...address,
                  pincode: e.target.value.replace(/\D/g, ""),
                })
              }
              placeholder="6-digit pincode"
              maxLength="6"
            />
          </div>

          <div className={styles.btnGroup}>
            <button
              className={styles.backBtn}
              onClick={() => navigate("/cart")}
            >
              ← Back to Cart
            </button>

            <button
              className={styles.primaryBtn}
              onClick={handleContinue}
            >
              Continue to Review →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Address;
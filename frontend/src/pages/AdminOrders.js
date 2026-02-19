import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./AdminOrders.module.css";

function AdminOrders() {
  const navigate = useNavigate();

  const API =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= AUTH CHECK =================
  useEffect(() => {
    if (!token || role?.toLowerCase() !== "admin") {
      navigate("/login");
      return;
    }

    fetchOrders();
  }, []);

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${API}/api/orders/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      setOrders(res.data);

    } catch (error) {
      console.error("Orders Fetch Error:", error.response?.data || error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API}/api/orders/update-status/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

    } catch (error) {
      console.error("Status Update Error:", error.response?.data || error);
      alert("Status update failed");
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className={styles.ordersContainer}>
        <h2 className={styles.ordersTitle}>Loading Orders...</h2>
      </div>
    );
  }

  // ================= EMPTY =================
  if (!orders || orders.length === 0) {
    return (
      <div className={styles.ordersContainer}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/admin")}
        >
          ← Back to Admin
        </button>

        <div className={styles.noOrdersBox}>
          <div className={styles.noOrdersIcon}>📦</div>
          <h3>No Orders Yet</h3>
          <p>All new customer orders will appear here.</p>
        </div>
      </div>
    );
  }

  // ================= MAIN =================
  return (
    <div className={styles.ordersContainer}>

      <button
        className={styles.backBtn}
        onClick={() => navigate("/admin")}
      >
        ← Back to Admin
      </button>

      <h2 className={styles.ordersTitle}>All Orders</h2>

      {orders.map(order => (
        <div key={order._id} className={styles.orderCard}>

          {/* HEADER */}
          <div className={styles.orderHeader}>
            <div>
              <h4>{order.userId?.name}</h4>
              <p>{order.userId?.email}</p>
            </div>

            <select
              className={`${styles.statusDropdown} ${
                styles[order.status?.toLowerCase()]
              }`}
              value={order.status}
              onChange={(e) =>
                updateStatus(order._id, e.target.value)
              }
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* DATE */}
          <div className={styles.orderDate}>
            🕒 {new Date(order.createdAt).toLocaleString()}
          </div>

          {/* PAYMENT */}
          <div className={styles.paymentInfo}>
            <p><strong>Payment ID:</strong> {order.paymentId}</p>
            <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
          </div>

          {/* SHIPPING */}
          <div className={styles.shippingBox}>
            <h5>Shipping Address</h5>
            <p><strong>{order.shippingAddress?.name}</strong></p>
            <p>{order.shippingAddress?.street}</p>
            <p>
              {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.state} -{" "}
              {order.shippingAddress?.pincode}
            </p>
            <p>📞 {order.shippingAddress?.phone}</p>
          </div>

          {/* TOTAL */}
          <div className={styles.orderTotal}>
            Total: ₹{order.totalAmount}
          </div>

          {/* ITEMS */}
          <div className={styles.orderItems}>
            {order.items?.map((item, index) => (
              <div key={index} className={styles.orderItem}>
                <span>{item.name}</span>
                <span>
                  {item.quantity} × ₹{item.price}
                </span>
              </div>
            ))}
          </div>

        </div>
      ))}

    </div>
  );
}

export default AdminOrders;
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
  }, [location]); // update when route changes

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("guestCart");

    setCart([]);
    setToken(null);
    setRole(null);

    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo" onClick={() => navigate("/")}>
          Ganesh Electric And Electronics
        </div>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/cart"
            className={`cart-link ${
              location.pathname === "/cart" ? "active" : ""
            }`}
            onClick={closeMenu}
          >
            🛒
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>

          {!token && (
            <Link
              to="/login"
              className={location.pathname === "/login" ? "active" : ""}
              onClick={closeMenu}
            >
              Login
            </Link>
          )}

          {token && role && role.toLowerCase() === "admin" && (
            <Link
              to="/admin"
              className={location.pathname === "/admin" ? "active" : ""}
              onClick={closeMenu}
            >
              Admin
            </Link>
          )}

          {token && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
    const { cart, setCart } = useContext(CartContext); // ✅ need setCart
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const handleLogout = () => {
        // Remove only auth info
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        // Clear frontend cart state
        setCart([]);

        // Clear guest cart storage
        localStorage.removeItem("guestCart");

        navigate("/");
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="nav-container">

                {/* Logo */}
                <div className="logo" onClick={() => navigate("/")}>
                    Ganesh Electric And Electronics
                </div>

                {/* Links */}
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
                        className={`cart-link ${location.pathname === "/cart" ? "active" : ""
                            }`}
                        onClick={closeMenu}
                    >
                        🛒
                        {totalItems > 0 && (
                            <span className="cart-badge">
                                {totalItems}
                            </span>
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

                    {token && role === "admin" && (
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
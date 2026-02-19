import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
function Login() {
    const navigate = useNavigate();



    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await axios.post(
                `${API}/api/auth/login`,
                { email, password },
                { withCredentials: true } // important for CORS
            );

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);

            if (res.data.role?.toLowerCase() === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (err) {
            console.error("Login Error:", err);
            alert(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleLogin}>
                <h2>Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p style={{ marginTop: "15px", color: "#fff" }}>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
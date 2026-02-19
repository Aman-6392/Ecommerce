import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();   // ✅ important for form submit

        try {
            setLoading(true);

            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);

            if (res.data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <form onSubmit={handleLogin}>  {/* ✅ form added */}

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
                    type="submit"   // ✅ submit type
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
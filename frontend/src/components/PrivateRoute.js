import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./RouteLoader.css";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    // small delay for smooth loader effect
    const timer = setTimeout(() => {
      setChecking(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [location]);

  if (checking) {
    return (
      <div className="route-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
};

export default PrivateRoute;
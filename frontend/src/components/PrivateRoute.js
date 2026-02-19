import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./RouteLoader.css";

const PrivateRoute = ({ children }) => {

    const token = localStorage.getItem("token");
    const location = useLocation();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setChecking(false);
        }, 300);
    }, []);

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
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If no token → redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If logged in but not admin → redirect to home
    if (role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
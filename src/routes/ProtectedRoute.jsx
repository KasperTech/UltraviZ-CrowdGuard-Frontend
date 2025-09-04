import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { publicRoutes } from ".";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
        }
      } catch (error) {
        console.error("Token validation failed", error);
        logout();
      }
    } else {
      toast.error("Logging out. Token validation failed");
      logout();
    }
  }, [location.pathname]); // Re-run on every route change

  if (loading) {
    return <Loader />;
  }

  if (!user?.name) {
    return <Navigate to={publicRoutes.login} />; // Redirect if user is not authenticated
  }

  return children;
};

export default ProtectedRoute;

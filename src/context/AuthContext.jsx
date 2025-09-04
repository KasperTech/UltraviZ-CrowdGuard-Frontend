import { useState, useEffect, createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { loginService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { publicRoutes } from "../routes";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("admin-token");
    if (savedToken) {
      const decodedToken = jwtDecode(savedToken);
      if (decodedToken.exp * 1000 > Date.now()) {
        setToken(savedToken);
        setUser(decodedToken);
      } else {
        localStorage.removeItem("admin-token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (creds) => {
    setLoading(true);
    try {
      const data = await loginService(creds);
      localStorage.setItem("admin-token", data.token);
      const decodedToken = jwtDecode(data.token);
      setToken(data.token);
      setUser(decodedToken);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage on logout
    localStorage.removeItem("admin-token");
    setToken(null);
    setUser(null);
    navigate(publicRoutes.login);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

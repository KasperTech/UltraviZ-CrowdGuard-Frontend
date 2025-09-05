import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = axios.create({
  baseURL: "http://localhost:5050/api/v1",
});

// Request Interceptor - To add token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin-token");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 > Date.now()) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        localStorage.removeItem("admin-token");
      }
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - To handle expired token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin-token");
    }

    return Promise.reject(error);
  }
);

export default API;

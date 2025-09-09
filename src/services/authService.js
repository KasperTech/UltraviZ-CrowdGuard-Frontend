import API from "./axiosConfig";
import { toast } from "react-hot-toast";

export const loginService = async (creds) => {
  try {
    const response = await API.post("/admin/auth/login", creds);
    return response.data.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};



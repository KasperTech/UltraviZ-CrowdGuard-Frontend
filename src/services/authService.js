import API from "./axiosConfig";

export const loginService = async (creds) => {
  console.log("creds", creds);
  try {
    const response = await API.post("/admin/auth/login", creds);
    console.log(response)
    return response.data.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};



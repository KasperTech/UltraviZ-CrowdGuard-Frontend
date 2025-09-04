import API from "./axiosConfig";

export const loginService = async (creds) => {
  try {
    // const response = await API.post("/admin/login", creds);
    // return response.data.data;
    const dummyData = {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwibmFtZSI6IktyaXNobmEgT2poYSIsImlhdCI6MTUxNjIzOTAyMn0.Bt8QchsNgPPsLxZdTjkWdKsNWP1XNa4kajeD09eea9s",
    };
    return dummyData;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

import API from "./axiosConfig";

export const getUsers = async (page, limit, name, email, phoneNo) => {
    try {
        const response = await API.get(`/admin/users?page=${page}&limit=${limit}&name=${name}&email=${email}&phoneNo=${phoneNo}`);
        return response.data.data;
    } catch (error) {
        
        console.error("Get users failed", error);
        throw error;
    }
};

export const getUser = async (id) => {
    try {
        const response = await API.get(`/admin/users/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Get user failed", error);
        throw error;
    }
};

export const createUser = async (user) => {
    try {
        const response = await API.post("/admin/auth/register", user);
        return response.data.data;
    } catch (error) {
        console.error("Create user failed", error);
        throw error;
    }
};

export const updateUser = async (id, user) => {
    try {
        const response = await API.put(`/admin/users/${id}`, user);
        return response.data.data;
    } catch (error) {
        console.error("Update user failed", error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await API.delete(`/admin/users/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Delete user failed", error);
        throw error;
    }
};

export const restoreUser = async (id) => {
    try {
        const response = await API.put(`/admin/users/${id}/restore`);
        return response.data.data;
    } catch (error) {
        console.error("Restore user failed", error);
        throw error;
    }
};
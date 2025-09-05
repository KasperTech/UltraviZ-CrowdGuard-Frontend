import API from "./axiosConfig";

export const getEntrances = async (page, limit, isDeleted) => {
    try {
        const response = await API.get(`/admin/entrance?page=${page}&limit=${limit}&isDeleted=${isDeleted}`);
        return response.data.data;
    } catch (error) {
        console.error("Get entrances failed", error);
        throw error;
    }
};

export const getEntrance = async (id) => {
    try {
        const response = await API.get(`/admin/entrance/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Get entrance failed", error);
        throw error;
    }
};

export const createEntrance = async (entrance) => {
    try {
        const response = await API.post("/admin/entrance", entrance);
        return response.data.data;
    } catch (error) {
        console.error("Create entrance failed", error);
        throw error;
    }
};

export const updateEntrance = async (id, entrance) => {
    try {
        const response = await API.put(`/admin/entrance/${id}`, entrance);
        return response.data.data;
    } catch (error) {
        console.error("Update entrance failed", error);
        throw error;
    }
};

export const deleteEntrance = async (id) => {
    try {
        const response = await API.delete(`/admin/entrance/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Delete entrance failed", error);
        throw error;
    }
};

export const restoreEntrance = async (id) => {
    try {
        const response = await API.put(`/admin/entrance/${id}/restore`);
        return response.data.data;
    } catch (error) {
        console.error("Restore entrance failed", error);
        throw error;
    }
};
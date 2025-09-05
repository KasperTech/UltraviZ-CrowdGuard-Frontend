import API from "./axiosConfig";

export const getAlerts = async (page, limit, entranceId, isDeleted, isResolved) => {
    try {
        const response = await API.get(`/admin/alert?page=${page}&limit=${limit}&entranceId=${entranceId}&isDeleted=${isDeleted}&isResolved=${isResolved}`);
        return response.data.data;
    } catch (error) {
        console.error("Get cameras failed", error);
        throw error;
    }
};

export const getAlert = async (id) => {
    try {
        const response = await API.get(`/admin/alert/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Get alert failed", error);
        throw error;
    }
};

export const createAlert = async (alert) => {
    try {
        const response = await API.post("/admin/alert", alert);
        return response.data.data;
    } catch (error) {
        console.error("Create alert failed", error);
        throw error;
    }
};

export const updateAlert = async (id, alert) => {
    try {
        const response = await API.put(`/admin/alert/${id}`, alert);
        return response.data.data;
    } catch (error) {
        console.error("Update alert failed", error);
        throw error;
    }
};

export const deleteAlert = async (id) => {
    try {
        const response = await API.delete(`/admin/alert/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Delete alert failed", error);
        throw error;
    }
};

export const restoreAlert = async (id) => {
    try {
        const response = await API.put(`/admin/alert/${id}/restore`);
        return response.data.data;
    } catch (error) {
        console.error("Restore alert failed", error);
        throw error;
    }
};
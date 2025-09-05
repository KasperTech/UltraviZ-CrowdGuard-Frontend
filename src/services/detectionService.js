import API from "./axiosConfig";

export const getDetections = async (page, limit, cameraId, entranceId, isDeleted ) => {
    try {
        const response = await API.get(`/admin/detection?page=${page}&limit=${limit}&cameraId=${cameraId}&entranceId=${entranceId}&isDeleted=${isDeleted}`);
        return response.data.data;
    } catch (error) {
        console.error("Get detections failed", error);
        throw error;
    }
};

export const getDetection = async (id) => {
    try {
        const response = await API.get(`/admin/detection/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Get detection failed", error);
        throw error;
    }
};

export const createDetection = async (data) => {
    try {
        const response = await API.post("/admin/detection", data);
        return response.data.data;
    } catch (error) {
        console.error("Create detection failed", error);
        throw error;
    }
};

export const updateDetection = async (id, data) => {
    try {
        const response = await API.put(`/admin/detection/${id}`, data);
        return response.data.data;
    } catch (error) {
        console.error("Update detection failed", error);
        throw error;
    }
};

export const deleteDetection = async (id) => {
    try {
        const response = await API.delete(`/admin/detection/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Delete detection failed", error);
        throw error;
    }
};

export const restoreDetection = async (id) => {
    try {
        const response = await API.put(`/admin/detection/${id}/restore`);
        return response.data.data;
    } catch (error) {
        console.error("Restore detection failed", error);
        throw error;
    }
};
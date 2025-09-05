import API from "./axiosConfig";

export const getCameras = async (page, limit, location, entranceId, isActive) => {
    try {
        const response = await API.get(`/admin/camera?page=${page}&limit=${limit}&location=${location}&entranceId=${entranceId}&isActive=${isActive}`);
        return response.data.data;
    } catch (error) {
        console.error("Get cameras failed", error);
        throw error;
    }
};

export const getCamera = async (id) => {
    try {
        const response = await API.get(`/admin/camera/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Get camera failed", error);
        throw error;
    }
};

export const createCamera = async (camera) => {
    try {
        const response = await API.post("/admin/camera", camera);
        return response.data.data;
    } catch (error) {
        console.error("Create camera failed", error);
        throw error;
    }
};

export const updateCamera = async (id, camera) => {
    try {
        const response = await API.put(`/admin/camera/${id}`, camera);
        return response.data.data;
    } catch (error) {
        console.error("Update camera failed", error);
        throw error;
    }
};

export const deleteCamera = async (id) => {
    try {
        const response = await API.delete(`/admin/camera/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Delete camera failed", error);
        throw error;
    }
};

export const restoreCamera = async (id) => {
    try {
        const response = await API.put(`/admin/camera/${id}/restore`);
        return response.data.data;
    } catch (error) {
        console.error("Restore camera failed", error);
        throw error;
    }
};
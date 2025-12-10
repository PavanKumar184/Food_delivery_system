import axiosClient from "./axiosClient";

const BASE = "http://localhost:8083/api/delivery";

export const deliveryApi = {
    // Customer
    getDelivery(id) {
        return axiosClient.get(`${BASE}/${id}`);
    },

    // Admin: list all
    listDeliveries() {
        return axiosClient.get(BASE);
    },

    // Admin: create delivery
    createDelivery(data) {
        return axiosClient.post(BASE, data);
    },

    // Admin: update status
    updateStatus(deliveryId, status) {
        return axiosClient.put(`${BASE}/${deliveryId}/status`, { status });
    },

    // Admin: delete delivery
    deleteDelivery(deliveryId) {
        return axiosClient.delete(`${BASE}/${deliveryId}`);
    },
};

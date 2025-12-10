import axiosClient from "./axiosClient";

const BASE = "http://localhost:8082/api/orders";

export const orderApi = {
    // Customer usage
    createOrder(data) {
        return axiosClient.post(BASE, data);
    },

    getOrder(id) {
        return axiosClient.get(`${BASE}/${id}`);
    },

    // Admin: list / filter
    listOrders(params = {}) {
        // params may include customerPhone, restaurantId
        return axiosClient.get(BASE, { params });
    },

    // Admin: update status
    updateStatus(orderId, status) {
        return axiosClient.put(`${BASE}/${orderId}/status`, { status });
    },

    // Admin: delete order
    deleteOrder(orderId) {
        return axiosClient.delete(`${BASE}/${orderId}`);
    },
};

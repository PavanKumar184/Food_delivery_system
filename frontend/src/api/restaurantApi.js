import axiosClient from "./axiosClient";

const BASE = "http://localhost:8081/api/restaurants";

export const restaurantApi = {
    // ===== Restaurants =====
    getRestaurants(params = {}) {
        // params can include city, cuisine
        return axiosClient.get(BASE, { params });
    },

    getRestaurant(id) {
        return axiosClient.get(`${BASE}/${id}`);
    },

    createRestaurant(data) {
        return axiosClient.post(BASE, data);
    },

    updateRestaurant(id, data) {
        return axiosClient.put(`${BASE}/${id}`, data);
    },

    deleteRestaurant(id) {
        return axiosClient.delete(`${BASE}/${id}`);
    },

    // ===== Menu =====
    getMenu(restaurantId) {
        return axiosClient.get(`${BASE}/${restaurantId}/menu`);
    },

    addMenuItem(restaurantId, data) {
        return axiosClient.post(`${BASE}/${restaurantId}/menu`, data);
    },

    updateMenuItem(restaurantId, itemId, data) {
        return axiosClient.put(`${BASE}/${restaurantId}/menu/${itemId}`, data);
    },

    deleteMenuItem(restaurantId, itemId) {
        return axiosClient.delete(`${BASE}/${restaurantId}/menu/${itemId}`);
    },
};

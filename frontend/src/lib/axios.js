import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5003/api" : "/api";
const api = axios.create({
    baseURL : BASE_URL,
    withCredentials: true,
})

// Thêm interceptor để tự động gửi access token
api.interceptors.request.use((config) => {
    // Lấy token từ localStorage hoặc store
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api; 
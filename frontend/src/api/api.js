import axios from 'axios';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'projenitor_token';

const api = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 — clear session and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove(TOKEN_KEY);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem('projenitor_user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

import axios from 'axios';

// Create an Axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Check if unauthorized, meaning token is invalid/expired
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // We could trigger a navigation here or a global event
        }
        return Promise.reject(error);
    }
);

export default api;

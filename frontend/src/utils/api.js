import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.message === 'Network Error') {
            const attemptedUrl = error.config ? error.config.baseURL : 'Unknown';
            alert(`Network Error: The frontend could not connect to the backend.\n\nIt tried to connect to:\n${attemptedUrl}\n\nPlease check if your backend is deployed correctly and running.`);
        }
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
export default api;

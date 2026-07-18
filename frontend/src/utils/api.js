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

// Add a response interceptor for debugging Network Errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const attemptedUrl = error.config ? error.config.baseURL : 'Unknown';
        const errorMsg = error.message;
        const errorStatus = error.response ? error.response.status : 'No Status';
        
        alert(`[DEBUG] Login Failed!\n\nMessage: ${errorMsg}\nStatus: ${errorStatus}\nURL Tried: ${attemptedUrl}`);

        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
export default api;

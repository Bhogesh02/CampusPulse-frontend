import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        // We will access store via a getter or local storage fallback if not using persist in headers directly yet
        // For Redux Persist, sometimes it's easier to read from localStorage if persisted there
        // Or we inject the store instance (circular dep risk). keeping it simple with localStorage for now as persist uses it.
        // NOTE: Redux persist saves to 'persist:root'. access directly is tricky.
        // Standard approach: Let's assume we save token in localStorage separately OR parse it.
        // For now, let's keep the existing localStorage token logic as a backup or migrate strictly to state if we inject store.
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;

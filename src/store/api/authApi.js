import api from './axiosBase';

export const authEndpoints = {
    login: (credentials) => api.post('/auth/login', credentials),
    registerSuperAdmin: (data) => api.post('/auth/register/super-admin', data),
    registerStudent: (data) => api.post('/auth/register/student', data),
    registerHostelAdmin: (data) => api.post('/auth/register/hostel-admin', data),
    registerMessAdmin: (data) => api.post('/auth/register/mess-admin', data),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    resetPassword: (token, data) => api.put(`/auth/reset-password/${token}`, data),
};

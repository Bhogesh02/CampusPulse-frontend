import { createAsyncThunk } from '@reduxjs/toolkit';
import { authEndpoints } from '../api/authApi';

// Login Information
export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password, role }, { rejectWithValue }) => {
        try {
            // Pass role to backend to verify user is logging into correct portal
            const response = await authEndpoints.login({ email, password, role });
            // Expecting { user, token }
            localStorage.setItem('token', response.data.token); // Keep for axios interceptor ease
            return response.data;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

// Registration Actions
export const registerSuperAdmin = createAsyncThunk(
    'auth/registerSuperAdmin',
    async (data, { rejectWithValue }) => {
        try {
            const response = await authEndpoints.registerSuperAdmin(data);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const registerStudent = createAsyncThunk(
    'auth/registerStudent',
    async (data, { rejectWithValue }) => {
        try {
            const response = await authEndpoints.registerStudent(data);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const registerHostelAdmin = createAsyncThunk(
    'auth/registerHostelAdmin',
    async (data, { rejectWithValue }) => {
        try {
            const response = await authEndpoints.registerHostelAdmin(data);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const registerMessAdmin = createAsyncThunk(
    'auth/registerMessAdmin',
    async (data, { rejectWithValue }) => {
        try {
            const response = await authEndpoints.registerMessAdmin(data);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch }) => {
        localStorage.removeItem('token');
        return null;
    }
);

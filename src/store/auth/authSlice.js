import { createSlice } from '@reduxjs/toolkit';
import {
    loginUser,
    registerSuperAdmin,
    registerStudent,
    registerHostelAdmin,
    registerMessAdmin,
    logoutUser,
    forgotPassword,
    resetPassword
} from './authActions';

const initialState = {
    loading: false,
    userInfo: null, // { _id, name, email, role }
    token: null,
    error: null,
    success: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.userInfo = payload;
                state.token = payload.token;
                state.success = true;
            })
            .addCase(loginUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });

        // Logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;
            state.userInfo = null;
            state.token = null;
            state.error = null;
            state.success = false;
        });

        // Registration (Generic handler for all types for simplicity)
        const registerActions = [registerSuperAdmin, registerStudent, registerHostelAdmin, registerMessAdmin];
        registerActions.forEach(action => {
            builder
                .addCase(action.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(action.fulfilled, (state, { payload }) => {
                    state.loading = false;
                    state.userInfo = payload;
                    state.token = payload.token;
                    state.success = true;
                })
                .addCase(action.rejected, (state, { payload }) => {
                    state.loading = false;
                    state.error = payload;
                });
        });

        // Reset Password (Auto-login on success)
        builder
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.userInfo = payload;
                state.token = payload.token;
                state.success = true;
            })
            .addCase(resetPassword.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    },
});

export const { clearState } = authSlice.actions;
export default authSlice.reducer;

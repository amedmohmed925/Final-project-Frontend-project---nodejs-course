// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { login, register, logout, getCurrentUser } from '../../api/authApi';
import {  createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Register
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Logout
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        });

        // Get Current User
        builder.addCase(getCurrentUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getCurrentUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(getCurrentUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
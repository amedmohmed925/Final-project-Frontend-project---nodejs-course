// src/api/authApi.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/auth'; // استبدل بـ URL الخاص بالخادم

export const login = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const register = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const logout = createAsyncThunk('user/logout', async (token, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/logout`, { token });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const getCurrentUser = createAsyncThunk('user/getCurrentUser', async (token, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

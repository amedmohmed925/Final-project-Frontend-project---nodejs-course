
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/auth'; 


export const login = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      console.log(response)
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: response.data.user, 
    
      };
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


export const verifyOTP = async (email, otp) => {
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  

  export const resendOTP = async (email) => {
    try {
      const response = await axios.post(`${API_URL}/resend-otp`, { email });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { clearUser } from "../features/user/userSlice";

const API_URL = 'http://localhost:8080/auth';

// Create an Axios instance
export const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor: Add token to headers and check if token exists
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (config.url !== '/login' && config.url !== '/register') {
      // If no token and not a login/register request, throw error
      throw new Error('No access token found');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 (expired token) and clear user state
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // Attempt to refresh the token (assuming you have a refresh endpoint)
          const { data } = await axios.post(`${API_URL}/refresh`, { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          api.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest); // Retry the original request
        } catch (refreshError) {
          // If refresh fails, clear user and redirect
          return (dispatch) => {
            dispatch(clearUser());
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          };
        }
      } else {
        // No refresh token, clear user and redirect
        return (dispatch) => {
          dispatch(clearUser());
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        };
      }
    }
    return Promise.reject(error);
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', credentials);
      console.log(response);
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: response.data.user,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (token, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/logout', { token });
      dispatch(clearUser()); // Clear user state on successful logout
      return response.data;
    } catch (error) {
      dispatch(clearUser()); // Clear user state even if logout fails
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'OTP verification failed';
  }
};

export const resendOTP = async (email) => {
  try {
    const response = await api.post('/resend-otp', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Resend OTP failed';
  }
};

export const forgetPassword = async (email) => {
  const response = await api.post('/forget-password', { email });
  return response.data;
};

export const resetPassword = async (email, token, newPassword) => {
  const response = await api.post('/reset-password', { email, token, newPassword });
  return response.data;
};
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import store from '../app/store'; // استيراد الـ store من Redux
import { clearUser } from '../features/user/userSlice';

const API_URL = 'http://localhost:8080/auth'; // أو رابط Vercel الخاص بك

// إنشاء مثيل Axios
export const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor: إضافة التوكن إلى الـ Headers
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (config.url !== '/login' && config.url !== '/register') {
      throw new Error('No access token found'); // رمي خطأ إذا لم يكن هناك توكن
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: معالجة انتهاء التوكن أو عدم وجوده
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // التحقق من حالة 401 (توكن منتهي أو غير صالح)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // محاولة تجديد التوكن
          const { data } = await axios.post(`${API_URL}/refresh`, { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          api.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest); // إعادة المحاولة بالتوكن الجديد
        } catch (refreshError) {
          // فشل التجديد: تسجيل الخروج
          store.dispatch(clearUser());
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // لا يوجد Refresh Token: تسجيل الخروج
        store.dispatch(clearUser());
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// Thunks لتسجيل الدخول والتسجيل والخروج
export const login = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', credentials);
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
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await api.post('/logout', { refreshToken });
      dispatch(clearUser());
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return response.data;
    } catch (error) {
      dispatch(clearUser());
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

// وظائف إضافية (OTP وإعادة تعيين كلمة المرور)
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
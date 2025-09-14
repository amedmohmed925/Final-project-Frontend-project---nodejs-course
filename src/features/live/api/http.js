// Exactly aligned with your auth api behavior
import axios from 'axios';

// ---- Base URLs
export const API_BASE_URL = 'http://localhost:8080';

export const LIVE_API_URL = `${API_BASE_URL}/api/v1`;
export const AUTH_API_URL = `${API_BASE_URL}/api/v1/auth`;

// ---- Separate axios instances
export const liveApi = axios.create({ baseURL: LIVE_API_URL });
const authApi = axios.create({ baseURL: AUTH_API_URL });

// ---- Request: attach accessToken from localStorage
liveApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response: refresh on 401 (same logic as your auth code)
liveApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      // no refresh token -> force logout route
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      // Use raw axios/authApi to avoid interceptor loops
      const { data } = await authApi.post('/refresh', { refreshToken });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // update default header and retry original request
      liveApi.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return liveApi(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

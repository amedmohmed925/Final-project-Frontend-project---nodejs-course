// API functions for admin logs
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/v1/admin/logs';
// Helper to get token from localStorage
// جلب بيانات يوزر واحد بناءً على id (للاستخدام مع اللوجز)
export const fetchUserById = async (id) => {
  if (!id) return null;
  const API_USER = 'http://localhost:8080/api/v1/users';
  const { data } = await axios.get(`${API_USER}/${id}`, {
    headers: getAuthHeaders(),
  });
  return data.user;
};
function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}


export const fetchLogs = async (params = {}) => {
  const { data } = await axios.get(API_BASE, {
    params,
    headers: getAuthHeaders(),
  });
  return data;
};


export const fetchLog = async (id) => {
  const { data } = await axios.get(`${API_BASE}/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
};


export const deleteLog = async (id) => {
  const { data } = await axios.delete(`${API_BASE}/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
};


export const clearLogs = async () => {
  const { data } = await axios.delete(API_BASE, {
    headers: getAuthHeaders(),
  });
  return data;
};

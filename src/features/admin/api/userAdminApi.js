import axios from "axios";
import { createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = "http://localhost:8080/v1/admin/users";
const API_URL = 'http://localhost:8080/v1/users'

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// جلب جميع المعلمين
export const getAllTeachers = async () => {
  const res = await axios.get(`${BASE_URL}/teachers`, { headers: getAuthHeaders() });
  return res.data;
};


export const getAllUsers = createAsyncThunk(
  'user/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data.users; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all users');
    }
  }
);


// جلب جميع الطلاب
export const getAllStudents = async () => {
  const res = await axios.get(`${BASE_URL}/students`, { headers: getAuthHeaders() });
  return res.data;
};

// تفعيل حساب مستخدم
export const activateUser = async (id) => {
  const res = await axios.patch(`${BASE_URL}/activate/${id}`, {}, { headers: getAuthHeaders() });
  return res.data;
};

// تعطيل حساب مستخدم
export const deactivateUser = async (id) => {
  const res = await axios.patch(`${BASE_URL}/deactivate/${id}`, {}, { headers: getAuthHeaders() });
  return res.data;
};

// تغيير دور مستخدم
export const changeUserRole = async (id, role) => {
  const res = await axios.patch(`${BASE_URL}/role/${id}`, { role }, { headers: getAuthHeaders() });
  return res.data;
};

// حذف مستخدم
export const deleteUserByAdmin = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

// بحث متقدم عن المستخدمين
export const advancedUserSearch = async (params) => {
  // params: { role, isVerified, username, email }
  const res = await axios.get(`${BASE_URL}/search/advanced`, {
    headers: getAuthHeaders(),
    params,
  });
  return res.data;
};

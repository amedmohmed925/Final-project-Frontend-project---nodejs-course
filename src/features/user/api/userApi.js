import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/users';
const API_URL2 = 'http://localhost:8080/api/v1/auth'; 



export const login = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: response.data.user,
    };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const logout = createAsyncThunk('user/logout', async (_, { getState, rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post(`${API_URL}/logout`, { token: refreshToken });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

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

export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  'user/updateProfileImage',
  async ({ id, imageFile }, { rejectWithValue }) => {
    if (!id) {
      return rejectWithValue({ message: "معرف المستخدم غير متاح" });
    }
    if (!imageFile) {
      return rejectWithValue({ message: "لم يتم اختيار صورة" });
    }

    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('image', imageFile); // تأكد من أن 'image' هو اسم الحقل المتوقع في الـ backend

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      const response = await axios.put(
        `${API_URL}/${id}/profile-image`,
        formData,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getCoursesByUser = createAsyncThunk(
  'user/getCoursesByUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}/courses`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data.courses; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user courses');
    }
  }
);


export const editUserInfo = createAsyncThunk(
  'user/editUserInfo',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user info');
    }
  }
);
export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL2}/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = async (userId, password) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: { password }, // الباسوورد بيتبعت في الـ body
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete user" };
  }
};


export const getAllTeachers = async () => {
  try {
    const response =  await axios.get(`${API_URL}/teachers`); // استبدل المسار حسب إعداداتك
    const data = response.data;
    if (data.success) {
      return data.teachers.reduce((acc, teacher) => {
        acc[teacher._id] = `${teacher.firstName} ${teacher.lastName}`;
        return acc;
      }, {});
    }
    return {};
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return {};
  }
};


import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/users';
const API_URL2 = 'http://localhost:8080/auth'; 

// تحويل editUserInfo إلى createAsyncThunk
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
  
        return response.data; // إرجاع البيانات المحدثة
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
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
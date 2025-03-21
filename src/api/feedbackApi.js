// src/api/feedbackApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/feedbacks", // Confirm this matches your backend port
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getFeedbacksByCourseId = async (courseId) => {
  if (!courseId) throw new Error("Course ID is required");
  const response = await api.get(`/course/${courseId}`);
  return response.data;
};

export const addFeedback = async (feedbackData) => {
  const response = await api.post("", feedbackData);
  return response.data;
};

export const updateFeedback = async (feedbackId, feedbackData) => {
  const response = await api.put(`/${feedbackId}`, feedbackData);
  return response.data;
};

export const deleteFeedback = async (feedbackId) => {
  const response = await api.delete(`/${feedbackId}`);
  return response.data;
};



export const getAverageRating = async (courseId) => {
  try {
    const response = await api.get(`/feedback/average-rating/${courseId}`);
    return response.data.averageRating; 
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'فشل في جلب متوسط التقييم');
    } else if (error.request) {
      throw new Error('لا يوجد استجابة من السيرفر');
    } else {
      throw new Error(error.message || 'حدث خطأ ما');
    }
  }
};
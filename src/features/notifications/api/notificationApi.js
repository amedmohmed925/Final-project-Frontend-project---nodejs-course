// src/api/notificationApi.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/notifications";

export const notificationApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

notificationApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createNotification = async (data) => {
  const response = await notificationApi.post("/create", data);
  return response.data;
};

export const getUserNotifications = async () => {
  const response = await notificationApi.get("/my-notifications");
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await notificationApi.put(`/mark-read/${notificationId}`);
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const response = await notificationApi.delete(`/delete/${notificationId}`);
  return response.data;
};
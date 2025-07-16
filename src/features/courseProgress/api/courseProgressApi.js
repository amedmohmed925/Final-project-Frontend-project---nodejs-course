import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/course-progress";

export const progressApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

progressApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  console.log("token"+ token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getCourseProgress = async (courseId) => {
  const response = await progressApi.get(`/${courseId}`);
  return response.data;
};

export const updateCourseProgress = async (courseId, data) => {
  const response = await progressApi.post(`/update/${courseId}`, data);
  return response.data;
};

export const getAllProgress = async () => {
  const response = await progressApi.get("/");
  return response.data;
};
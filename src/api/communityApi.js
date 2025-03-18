import axios from "axios";

const API_URL = "http://localhost:8080/community";

export const getPosts = async (groupId, courseId) => {
  const response = await axios.get(`${API_URL}/posts`, { params: { groupId, courseId } });
  return response.data;
};

export const createPost = async (postData) => {
  const response = await axios.post(`${API_URL}/posts`, postData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return response.data;
};

export const likePost = async (postId) => {
  const response = await axios.post(`${API_URL}/posts/${postId}/like`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return response.data;
};

export const getComments = async (postId) => {
  const response = await axios.get(`${API_URL}/comments/${postId}`);
  return response.data;
};

export const createComment = async (commentData) => {
  const response = await axios.post(`${API_URL}/comments`, commentData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return response.data;
};

export const getGroups = async () => {
  const response = await axios.get(`${API_URL}/groups`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return response.data;
};

export const createGroup = async (groupData) => {
  const response = await axios.post(`${API_URL}/groups`, groupData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return response.data;
};

export const getNotifications = async () => {
  const response = await axios.get(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return response.data;
};
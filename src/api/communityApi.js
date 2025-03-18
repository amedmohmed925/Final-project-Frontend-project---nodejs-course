import axios from "axios";

const API_URL = "http://localhost:8080/community";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    return new Promise((resolve) => {
      timeoutId = setTimeout(() => resolve(func(...args)), delay);
    });
  };
};

const axiosConfig = {
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
};

export const getPosts = async (groupId, courseId) => {
  const response = await axios.get(`${API_URL}/posts`, { params: { groupId, courseId } });
  return response.data;
};

export const createPost = async (postData) => {
  const response = await axios.post(`${API_URL}/posts`, postData, axiosConfig);
  return response.data;
};

export const likePost = debounce(async (postId) => {
  const response = await axios.post(`${API_URL}/posts/${postId}/like`, {}, axiosConfig);
  return response.data;
}, 500);

export const getComments = async (postId) => {
  const response = await axios.get(`${API_URL}/comments/${postId}`, axiosConfig);
  return response.data;
};

export const createComment = debounce(async (commentData) => {
  const response = await axios.post(`${API_URL}/comments`, commentData, axiosConfig);
  return response.data;
}, 500);

export const likeComment = debounce(async (postId, commentId) => {
  const response = await axios.post(`${API_URL}/comments/${postId}/${commentId}/like`, {}, axiosConfig);
  return response.data;
}, 500);

export const getGroups = async () => {
  const response = await axios.get(`${API_URL}/groups`, axiosConfig);
  return response.data;
};

export const createGroup = async (groupData) => {
  const response = await axios.post(`${API_URL}/groups`, groupData, axiosConfig);
  return response.data;
};

export const acceptGroupInvite = async (groupId) => {
  const response = await axios.post(`${API_URL}/groups/${groupId}/accept`, {}, axiosConfig);
  return response.data;
};

export const sendGroupMessage = async (messageData) => {
  const response = await axios.post(`${API_URL}/groups/${messageData.groupId}/message`, messageData, axiosConfig);
  return response.data;
};

export const getChatRooms = async () => {
  const response = await axios.get(`${API_URL}/chatrooms`, axiosConfig);
  return response.data;
};

export const createChatRoom = async (roomData) => {
  const response = await axios.post(`${API_URL}/chatrooms`, roomData, axiosConfig);
  return response.data;
};

export const getNotifications = async () => {
  const response = await axios.get(`${API_URL}/notifications`, axiosConfig);
  return response.data;
};

export const getActivityStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, axiosConfig);
  return response.data;
};
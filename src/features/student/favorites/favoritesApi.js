import axios from 'axios';

const API_URL = 'http://localhost:8080/v1/student/favorites';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getFavorites = async () => {
  const res = await axios.get(API_URL, {
   
    headers: getAuthHeader(),
  });
  return res.data;
};

export const addFavorite = async (courseId) => {
  const res = await axios.post(
    API_URL,
    { courseId },
    {
     
      headers: getAuthHeader(),
    }
  );
  return res.data;
};

export const removeFavorite = async (courseId) => {
  const res = await axios.delete(API_URL, {
    data: { courseId },
   
    headers: getAuthHeader(),
  });
  return res.data;
};

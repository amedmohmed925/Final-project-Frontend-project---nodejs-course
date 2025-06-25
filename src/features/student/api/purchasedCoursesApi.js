import axios from 'axios';

const API_URL = 'http://localhost:8080/v1/student/purchased';

export const getPurchasedCourses = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

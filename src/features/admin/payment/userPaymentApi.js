// جلب بيانات يوزر واحد بناءً على id (للاستخدام مع البيمينت)
import axios from 'axios';

function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const fetchUserById = async (id) => {
  if (!id) return null;
  const API_USER = 'http://localhost:8080/api/v1/users';
  const { data } = await axios.get(`${API_USER}/${id}`, {
    headers: getAuthHeaders(),
  });
  return data.user;
};

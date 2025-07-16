// API functions for admin payments
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/v1/admin/payments';

function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// جلب جميع عمليات الدفع مع فلاتر بحث
export const fetchPayments = async (params = {}) => {
  const { data } = await axios.get(API_BASE, {
    params,
    headers: getAuthHeaders(),
  });
  return data;
};

// جلب عملية دفع واحدة
export const fetchPayment = async (id) => {
  const { data } = await axios.get(`${API_BASE}/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
};

// حذف عملية دفع واحدة
export const deletePayment = async (id) => {
  const { data } = await axios.delete(`${API_BASE}/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
};

// حذف جميع عمليات الدفع
export const clearPayments = async () => {
  const { data } = await axios.delete(API_BASE, {
    headers: getAuthHeaders(),
  });
  return data;
};

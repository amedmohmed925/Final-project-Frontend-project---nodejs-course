import axios from "axios";

const API_URL = "http://localhost:8080/v1/student/certificates";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchCertificates = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
};

export const fetchCertificate = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return res.data;
};

export const createCertificate = async (courseId, fileUrl) => {
  const res = await axios.post(
    API_URL,
    { courseId, fileUrl },
    { headers: getAuthHeader() }
  );
  return res.data;
};

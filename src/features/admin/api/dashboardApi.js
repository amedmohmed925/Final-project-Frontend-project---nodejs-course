import axios from "axios";

const API_URL = "http://localhost:8080/v1/admin/stats/dashboard";

export const getDashboardStats = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

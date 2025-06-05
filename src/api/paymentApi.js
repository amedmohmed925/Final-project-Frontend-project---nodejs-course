import axios from "axios";

const PAYMENT_API_URL = "http://localhost:8080/v1/payment";

export const paymentApi = axios.create({
  baseURL: PAYMENT_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

paymentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  console.log("Token being sent with request:", token); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

paymentApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 403 &&
      error.response?.data?.message === "Forbidden" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const response = await axios.post("http://localhost:8080/auth/refresh", { token: refreshToken });
          const newAccessToken = response.data.accessToken;

          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return paymentApi(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default paymentApi;
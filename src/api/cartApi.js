
import axios from "axios";

const API_URL = "http://localhost:8080/cart";

const cartApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


cartApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


cartApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 403 &&
      error.response?.data?.message === "Forbidden" &&
      !originalRequest._retry // منع التكرار اللانهائي
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // طلب تجديد الـ Access Token
          const response = await axios.post("http://localhost:8080/auth/refresh", { token: refreshToken });
          const newAccessToken = response.data.accessToken;

          // تحديث الـ Access Token في localStorage
          localStorage.setItem("accessToken", newAccessToken);

          // تحديث رأس الطلب الأصلي بالتوكن الجديد
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // إعادة إرسال الطلب الأصلي
          return cartApi(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          // لو فشل التجديد، اعمل تسجيل خروج
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        // لو مافيش Refresh Token، اعمل تسجيل خروج
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);


export const addToCart = async (courseId) => {
  const response = await cartApi.post("/add", { courseId });
  return response.data;
};

export const removeFromCart = async (courseId) => {
  const response = await cartApi.post("/remove", { courseId });
  return response.data;
};

export const getCart = async (userId) => {
  const response = await cartApi.get(`/${userId}`);
  return response.data;
};

export const applyCoupon = async (couponCode) => {
  const response = await cartApi.post("/apply-coupon", { couponCode });
  return response.data;
};

export const checkoutCart = async () => {
  const response = await cartApi.post("/checkout");
  return response.data;
};

export default cartApi;
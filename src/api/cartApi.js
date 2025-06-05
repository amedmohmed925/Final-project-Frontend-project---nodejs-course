
import axios from "axios";

const API_URL = "http://localhost:8080/v1/cart";

export const cartApi = axios.create({
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


          return cartApi(originalRequest);
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
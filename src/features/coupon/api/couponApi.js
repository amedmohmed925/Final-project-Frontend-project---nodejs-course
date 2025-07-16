// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1", // غير الـ URL حسب السيرفر بتاعك
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createCoupon = () => api.post("/coupons/create");
export const getAdvertiserCoupons = () => api.get("/coupons/advertiser");
export const getAdminCouponReport = () => api.get("/coupons/admin-report");
export const applyCoupon = (couponCode) => api.post("/cart/apply-coupon", { couponCode });
export const getCart = (userId) => api.get(`/cart/${userId}`);
export const checkout = () => api.post("/cart/checkout");
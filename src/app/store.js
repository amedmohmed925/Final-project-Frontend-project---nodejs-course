import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import cartReducer from "../features/cart/cartSlice";
import  {api}  from '../api/authApi';
import { clearUser } from "../features/user/userSlice";

// Configure the Redux store
const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
  },
});

// Pass dispatch to the API instance interceptors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearUser()); // Use store.dispatch directly
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default store;
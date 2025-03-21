import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import cartReducer from "../features/cart/cartSlice";
import { clearUser } from "../features/user/userSlice";

const authMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type.endsWith("/rejected")) {
    const error = action.payload;
    if (error?.status === 401) {
      store.dispatch(clearUser());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }

  return result;
};

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});
export default store
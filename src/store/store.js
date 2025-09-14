import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import cartReducer from "../features/cart/cartSlice";
import { clearUser } from "../features/user/userSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import favoritesReducer from "../features/student/favorites/favoritesSlice";
import certificatesReducer from "../features/student/certificates/certificatesSlice";
import liveReducer from "../features/live/liveSlice";

const authMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type.endsWith("/rejected")) {
    const error = action.payload;
    if (error?.status === 401) {
      store.dispatch(clearUser());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }
  return result;
};

const store = configureStore({
  reducer: {
    live: liveReducer,
    user: userReducer,
    cart: cartReducer,
    notifications: notificationReducer,
    favorites: favoritesReducer,
    certificates: certificatesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});
export default store;
// src/features/notifications/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    unreadCount: 0,
    isOpen: false,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find((n) => n._id === action.payload);
      if (notification) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n._id !== action.payload);
      state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
    },
    toggleNotifications: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { setNotifications, markAsRead, deleteNotification, toggleNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
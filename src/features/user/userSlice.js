import { createSlice } from '@reduxjs/toolkit';
import { login, logout } from '../../api/authApi';
import { editUserInfo, getCurrentUser } from '../../api/userApi';
import { getAllUsers } from '../../api/userApi'; // استيراد getAllUsers

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, // المستخدم الحالي
  users: [], // قائمة كل المستخدمين
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      state.users = []; // تصفير قائمة المستخدمين عند تسجيل الخروج
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    // حالات تسجيل الدخول
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // حالات تسجيل الخروج
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.users = []; // تصفير قائمة المستخدمين
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    });

    // حالات جلب معلومات المستخدم الحالي
    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    });
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // حالات تحديث معلومات المستخدم
    builder.addCase(editUserInfo.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editUserInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload; // تحديث بيانات المستخدم
      localStorage.setItem('user', JSON.stringify(action.payload)); // تحديث localStorage
    });
    builder.addCase(editUserInfo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // حالات جلب كل المستخدمين
    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload; // تخزين قائمة المستخدمين
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { setUser, clearUser } = userSlice.actions;

// تصدير editUserInfo كجزء من userSlice (اختياري، لو مش لازم ممكن تشيله)
export { editUserInfo, getAllUsers };

export default userSlice.reducer;
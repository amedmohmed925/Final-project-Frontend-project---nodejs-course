import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFavorites, addFavorite, removeFavorite } from './favoritesApi';

export const fetchFavorites = createAsyncThunk('favorites/fetchFavorites', async (_, thunkAPI) => {
  try {
    return await getFavorites();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});

export const addToFavorites = createAsyncThunk('favorites/addToFavorites', async (courseId, thunkAPI) => {
  try {
    await addFavorite(courseId);
    return courseId;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});

export const removeFromFavorites = createAsyncThunk('favorites/removeFromFavorites', async (courseId, thunkAPI) => {
  try {
    await removeFavorite(courseId);
    return courseId;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        // يمكن هنا لاحقًا إضافة الكورس مباشرة إذا كانت بياناته متوفرة
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        // حذف الكورس من القائمة محليًا
        state.items = state.items.filter((course) => course._id !== action.payload);
      });
  },
});

export default favoritesSlice.reducer;

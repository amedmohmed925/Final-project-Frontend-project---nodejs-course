import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCertificates, fetchCertificate, createCertificate } from "./certificatesApi";

export const getCertificates = createAsyncThunk("certificates/getCertificates", async (_, thunkAPI) => {
  try {
    return await fetchCertificates();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});

export const getCertificateById = createAsyncThunk("certificates/getCertificateById", async (id, thunkAPI) => {
  try {
    return await fetchCertificate(id);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});

export const addCertificate = createAsyncThunk("certificates/addCertificate", async ({ courseId, fileUrl }, thunkAPI) => {
  try {
    return await createCertificate(courseId, fileUrl);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});

const certificatesSlice = createSlice({
  name: "certificates",
  initialState: {
    items: [],
    loading: false,
    error: null,
    selected: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCertificateById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(addCertificate.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default certificatesSlice.reducer;

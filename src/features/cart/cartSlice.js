// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addToCart, removeFromCart, getCart, applyCoupon, checkoutCart } from "../../api/cartApi";

// Async thunks
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId, { rejectWithValue }) => {
  try {
    const response = await getCart(userId);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addItemToCart = createAsyncThunk("cart/addItem", async (courseId, { rejectWithValue }) => {
  try {
    const response = await addToCart(courseId);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const removeItemFromCart = createAsyncThunk("cart/removeItem", async (courseId, { rejectWithValue }) => {
  try {
    const response = await removeFromCart(courseId);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const applyCouponCode = createAsyncThunk("cart/applyCoupon", async (couponCode, { rejectWithValue }) => {
  try {
    const response = await applyCoupon(couponCode);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const checkout = createAsyncThunk("cart/checkout", async (_, { rejectWithValue }) => {
  try {
    const response = await checkoutCart();
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    discount: 0,
    finalTotal: 0,
    status: "idle",
    error: null,
    isCartOpen: false,
  },
  reducers: {
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
    closeCart(state) {
      state.isCartOpen = false;
    },
    clearCart(state) { // الـ action الجديدة
      state.items = [];
      state.total = 0;
      state.discount = 0;
      state.finalTotal = 0;
      state.status = "idle";
      state.error = null;
      state.isCartOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.discount = action.payload.discount;
        state.finalTotal = action.payload.finalTotal;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch cart";
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.finalTotal = action.payload.finalTotal;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to add item";
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.discount = action.payload.discount;
        state.finalTotal = action.payload.finalTotal;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to remove item";
      })
      .addCase(applyCouponCode.fulfilled, (state, action) => {
        state.discount = action.payload.cart.discount;
        state.finalTotal = action.payload.cart.finalTotal;
        state.error = null;
      })
      .addCase(applyCouponCode.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to apply coupon";
      })
      .addCase(checkout.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.discount = 0;
        state.finalTotal = 0;
        state.isCartOpen = false;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.error = action.payload?.message || "Checkout failed";
      });
  },
});

export const { toggleCart, closeCart, clearCart } = cartSlice.actions; // تصدير الـ clearCart
export default cartSlice.reducer;
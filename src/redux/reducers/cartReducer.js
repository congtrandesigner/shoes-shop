import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import { http } from '../../api/http';

export const CARTS = 'carts';
export const ORDER_QUANTITIES = 'orderQuantities';

const getCartFromStorage = () => {
  const data = localStorage.getItem(CARTS);
  return data ? JSON.parse(data) : [];
};

const saveOrderQuantities = (orderId, quantities) => {
  const saved = JSON.parse(localStorage.getItem(ORDER_QUANTITIES) || '{}');
  saved[orderId] = quantities;
  localStorage.setItem(ORDER_QUANTITIES, JSON.stringify(saved));
};

export const orderApi = createAsyncThunk(
  'cart/order',
  async (order, { rejectWithValue }) => {
    try {
      const res = await http.post('/Users/order', order);
      const profile = await http.post('/Users/getProfile');
      const newestOrder = _.maxBy(profile.data.content.ordersHistory, 'id');
      if (newestOrder) {
        saveOrderQuantities(
          newestOrder.id,
          order.orderDetail.map((item) => item.quantity)
        );
      }
      return res.data.content;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    arrCart: getCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exist = state.arrCart.find(
        (p) => p.id === item.id && p.size === item.size
      );
      if (exist) {
        exist.quantity += item.quantity;
      } else {
        state.arrCart.push(item);
      }
    },

    changeQuantity: (state, action) => {
      const { id, size, delta } = action.payload;
      const item = state.arrCart.find((p) => p.id === id && p.size === size);
      if (item && item.quantity + delta >= 1) {
        item.quantity += delta;
      }
    },

    removeFromCart: (state, action) => {
      const { id, size } = action.payload;
      state.arrCart = state.arrCart.filter(
        (p) => !(p.id === id && p.size === size)
      );
    },

    clearCart: (state) => {
      state.arrCart = [];
    },
  },
});

export const { addToCart, changeQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

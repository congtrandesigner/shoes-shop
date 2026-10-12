import { configureStore } from '@reduxjs/toolkit';
import productReducer from './reducers/productReducer';
import userReducer from './reducers/userReducer';
import cartReducer, { CARTS } from './reducers/cartReducer';

export const store = configureStore({
  reducer: {
    productReducer,
    userReducer,
    cartReducer,
  },
});

store.subscribe(() => {
  const { arrCart } = store.getState().cartReducer;
  localStorage.setItem(CARTS, JSON.stringify(arrCart));
});

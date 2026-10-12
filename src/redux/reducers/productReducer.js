import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '../../api/http';

export const isValidProduct = (prod) =>
  prod.image.lastIndexOf('http') === 0 && prod.image.endsWith('.png');

export const getAllProductApi = createAsyncThunk('product/getAll', async () => {
  const res = await http.get('/Product');
  return res.data.content;
});

export const getProductDetailApi = createAsyncThunk('product/getDetail', async (id) => {
  const res = await http.get(`/Product/getbyid?id=${id}`);
  return res.data.content;
});

export const searchProductApi = createAsyncThunk('product/search', async (keyword) => {
  const res = await http.get('/Product', { params: { keyword } });
  return res.data.content;
});

export const getProductByCategoryApi = createAsyncThunk(
  'product/getByCategory',
  async (categoryId) => {
    const res = await http.get('/Product/getProductByCategory', { params: { categoryId } });
    return res.data.content;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    arrProduct: [],
    productDetail: null,
    arrSearch: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProductApi.fulfilled, (state, action) => {
        state.loading = false;
        state.arrProduct = action.payload;
      })
      .addCase(getAllProductApi.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getProductDetailApi.fulfilled, (state, action) => {
        state.productDetail = action.payload;
      })
      .addCase(searchProductApi.fulfilled, (state, action) => {
        state.arrSearch = action.payload;
      })
      .addCase(searchProductApi.rejected, (state) => {
        state.arrSearch = [];
      })
      .addCase(getProductByCategoryApi.fulfilled, (state, action) => {
        state.arrSearch = action.payload;
      })
      .addCase(getProductByCategoryApi.rejected, (state) => {
        state.arrSearch = [];
      });
  },
});

export default productSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { http, TOKEN, USER_LOGIN } from '../../api/http';

const getUserFromStorage = () => {
  const data = localStorage.getItem(USER_LOGIN);
  return data ? JSON.parse(data) : null;
};

const saveLogin = (content) => {
  localStorage.setItem(TOKEN, content.accessToken);
  localStorage.setItem(USER_LOGIN, JSON.stringify(content));
};

export const registerApi = createAsyncThunk(
  'user/register',
  async (userRegister, { rejectWithValue }) => {
    try {
      const res = await http.post('/Users/signup', userRegister);
      return res.data.content;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const loginApi = createAsyncThunk(
  'user/login',
  async (userLogin, { rejectWithValue }) => {
    try {
      const res = await http.post('/Users/signin', userLogin);
      saveLogin(res.data.content);
      return res.data.content;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const loginFacebookApi = createAsyncThunk(
  'user/loginFacebook',
  async (facebookToken, { rejectWithValue }) => {
    try {
      const res = await http.post('/Users/facebooklogin', { facebookToken });
      saveLogin(res.data.content);
      return res.data.content;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const getProfileApi = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await http.post('/Users/getProfile');
      return res.data.content;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateProfileApi = createAsyncThunk(
  'user/updateProfile',
  async (infoUser, { dispatch, rejectWithValue }) => {
    try {
      const res = await http.post('/Users/updateProfile', infoUser);
      dispatch(getProfileApi());
      return res.data.content;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const getFavoriteApi = createAsyncThunk(
  'user/getFavorite',
  async (_, { rejectWithValue }) => {
    try {
      const res = await http.get('/Users/getproductfavorite');
      return res.data.content?.productsFavorite || [];
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userLogin: getUserFromStorage(),
    userProfile: null,
    favorites: [],
  },
  reducers: {
    logout: (state) => {
      state.userLogin = null;
      state.userProfile = null;
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginApi.fulfilled, (state, action) => {
        state.userLogin = action.payload;
      })
      .addCase(loginFacebookApi.fulfilled, (state, action) => {
        state.userLogin = action.payload;
      })
      .addCase(getProfileApi.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })
      .addCase(getFavoriteApi.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;

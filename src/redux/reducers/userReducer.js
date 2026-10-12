import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { http, TOKEN, USER_LOGIN } from '../../api/http';

const getUserFromStorage = () => {
  const data = localStorage.getItem(USER_LOGIN);
  return data ? JSON.parse(data) : null;
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
      const content = res.data.content;

      localStorage.setItem(TOKEN, content.accessToken);
      localStorage.setItem(USER_LOGIN, JSON.stringify(content));

      return content;
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

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userLogin: getUserFromStorage(),
    userProfile: null,
  },
  reducers: {
    logout: (state) => {
      state.userLogin = null;
      state.userProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginApi.fulfilled, (state, action) => {
        state.userLogin = action.payload;
      })
      .addCase(getProfileApi.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;

import axios from 'axios';

export const TOKEN = 'accessToken';
export const USER_LOGIN = 'userLogin';

export const http = axios.create({
  baseURL: 'https://shop.cyberlearn.vn/api',
  timeout: 30000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

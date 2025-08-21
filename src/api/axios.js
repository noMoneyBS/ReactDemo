// src/api/axios.js
import axios from "axios";

// 根据环境选择API地址
const getApiBaseURL = () => {
  if (import.meta.env.DEV) {
    // 开发环境使用ExpressDemo服务器
    return "http://localhost:5001";
  } else {
    // 生产环境使用环境变量中的API地址
    return import.meta.env.VITE_API_BASE_URL || "/api";
  }
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  withCredentials: true,
  timeout: 10000, // 10秒超时
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理401错误
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // 可以在这里重定向到登录页面
    }
    return Promise.reject(error);
  }
);

export default api;

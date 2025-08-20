// src/api/axios.js
import axios from "axios";

// 根据环境选择API地址
const getApiBaseURL = () => {
  if (import.meta.env.DEV) {
    // 开发环境使用代理
    return "/api";
  } else {
    // 生产环境使用相对路径，Vercel会自动处理
    return "/api";
  }
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  withCredentials: true, // 如果需要携带 cookie，可以加上
});

export default api;

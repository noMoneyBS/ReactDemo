// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",  // 统一走 Vite 代理
  withCredentials: true, // 如果需要携带 cookie，可以加上
});

export default api;

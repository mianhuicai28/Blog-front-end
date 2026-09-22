import axios from "axios";
import { Message } from "element-ui";
const request = axios.create({
  // 指定请求的根路径
  baseURL: process.env.VUE_APP_API_BASE_URL || "http://127.0.0.1:3000",
  timeout: 50000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  },
});
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) config.headers.Authorization = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截器;
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("store");
      Message.warning("登录状态已过期，请重新登录");
      if (window.location.hash !== "#/login") window.location.hash = "#/login";
    } else {
      const message =
        error.response?.data?.tip ||
        (error.code === "ECONNABORTED"
          ? "请求超时，请稍后重试"
          : "网络连接失败，请确认后端服务已启动");
      Message.error(message);
    }
    return Promise.reject(error);
  }
);

export default request;

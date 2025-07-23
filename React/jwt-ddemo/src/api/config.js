import axios from "axios";

axios.defaults.baseURL = "http://localhost:5173/api";

axios.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");
  // 如果有就说明有token，已登录。
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
axios.interceptors.request.use((res) => {
  console.log("请求结束");
  return res;
});
export default axios;

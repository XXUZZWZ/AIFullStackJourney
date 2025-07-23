import axios from "axios";
// mock 地址
// axios.defaults.baseURL = "http://localhost:5173";
// 线上有了真实地址
axios.defaults.baseURL = "https://api.github.com/users/XXUZZWZ";
export default axios;

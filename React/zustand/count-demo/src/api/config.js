// 配置文件
import axios from "axios";

axios.defaults.baseURL = "https://api.github.com";
// 这里可以配置生产和开发地址切换

export default axios;

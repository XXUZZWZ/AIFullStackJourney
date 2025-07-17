import axios from "axios";
// 创建axios实例
const api = axios.create({
  baseURL: "https://api.github.com/",
  timeout: 10000,
  headers: {
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  },
});

// 错误处理函数
const handleError = (error) => {
  if (error.response) {
    // 服务器返回错误状态码
    console.error("API Error:", error.response.status, error.response.data);
  } else if (error.request) {
    // 请求已发出但没有响应
    console.error("No response received:", error.request);
  } else {
    // 其他错误
    console.error("Request setup error:", error.message);
  }
  throw error;
};
export const getRepos = async (usersName) => {
  try {
    const response = await api.get(`users/${usersName}/repos`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getUserInfo = async (usersName) => {
  try {
    const response = await api.get(`users/${usersName}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getReposNum = async (usersName) => {
  try {
    const response = await api.get(`users/${usersName}/repos`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getReposDetails = async (usersName, repoName) => {
  try {
    const response = await api.get(`repos/${usersName}/${repoName}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

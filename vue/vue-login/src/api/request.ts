import axios from 'axios'

const service = axios.create({
  baseURL: 'http://localhost:5173/api',
  timeout: 10000,
})

service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(response => {
  const { data, code } = response.data;
  if (code === 200) {
    return Promise.resolve(data);
  } else {
    return Promise.reject('response data 解构失败')
  }
}, error => {
  if (error.response?.status === 401) {
    window.location.href = '/login'
  }
  return Promise.reject(error)
})

export default service;
import axios from 'axios';
import type {
  AxiosResponse, AxiosRequestConfig, AxiosError
} from 'axios';


const instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10 * 1000,
  withCredentials: true,
})

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
)

// 泛型 介绍动态类型传参
export const request = <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return instance<T>(config);
}

export default instance;
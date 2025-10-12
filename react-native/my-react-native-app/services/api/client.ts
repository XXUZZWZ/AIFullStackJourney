import { Platform } from 'react-native';

// API 配置
export const API_CONFIG = {
  // 基础 URL，根据环境配置
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com',

  // 超时时间
  TIMEOUT: 10000,

  // 重试次数
  RETRY_COUNT: 3,

  // 重试延迟
  RETRY_DELAY: 1000,
} as const;

// 请求头配置
export const getDefaultHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': `MyReactNativeApp/${Platform.OS}`,
  };

  // 如果有认证 token，添加到请求头
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// 获取认证 token（从 AsyncStorage 或其他存储中获取）
const getAuthToken = (): string | null => {
  // 这里可以从 AsyncStorage、Redux store 或其他状态管理工具中获取
  // 暂时返回 null，实际项目中需要实现
  return null;
};

// 请求选项接口
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

// 响应接口
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// 错误接口
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  data?: any;
}
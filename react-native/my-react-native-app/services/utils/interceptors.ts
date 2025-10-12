import { ApiError, RequestOptions } from '../api/client';

// 请求拦截器类型
export type RequestInterceptor = (url: string, options: RequestOptions) => Promise<{ url: string; options: RequestOptions }>;

// 响应拦截器类型
export type ResponseInterceptor<T = any> = (response: Response, url: string, options: RequestOptions) => Promise<T>;

// 错误拦截器类型
export type ErrorInterceptor = (error: ApiError, url: string, options: RequestOptions) => Promise<never>;

// 请求拦截器列表
const requestInterceptors: RequestInterceptor[] = [];

// 响应拦截器列表
const responseInterceptors: ResponseInterceptor[] = [];

// 错误拦截器列表
const errorInterceptors: ErrorInterceptor[] = [];

/**
 * 添加请求拦截器
 */
export const addRequestInterceptor = (interceptor: RequestInterceptor): void => {
  requestInterceptors.push(interceptor);
};

/**
 * 添加响应拦截器
 */
export const addResponseInterceptor = <T = any>(interceptor: ResponseInterceptor<T>): void => {
  responseInterceptors.push(interceptor as ResponseInterceptor);
};

/**
 * 添加错误拦截器
 */
export const addErrorInterceptor = (interceptor: ErrorInterceptor): void => {
  errorInterceptors.push(interceptor);
};

/**
 * 执行请求拦截器链
 */
export const executeRequestInterceptors = async (
  url: string,
  options: RequestOptions
): Promise<{ url: string; options: RequestOptions }> => {
  let currentUrl = url;
  let currentOptions = { ...options };

  for (const interceptor of requestInterceptors) {
    const result = await interceptor(currentUrl, currentOptions);
    currentUrl = result.url;
    currentOptions = result.options;
  }

  return { url: currentUrl, options: currentOptions };
};

/**
 * 执行响应拦截器链
 */
export const executeResponseInterceptors = async <T = any>(
  response: Response,
  url: string,
  options: RequestOptions
): Promise<T> => {
  let processedResponse = response;

  for (const interceptor of responseInterceptors) {
    processedResponse = await interceptor(processedResponse, url, options);
  }

  return processedResponse as T;
};

/**
 * 执行错误拦截器链
 */
export const executeErrorInterceptors = async (
  error: ApiError,
  url: string,
  options: RequestOptions
): Promise<never> => {
  let currentError = error;

  for (const interceptor of errorInterceptors) {
    try {
      await interceptor(currentError, url, options);
    } catch (newError) {
      currentError = newError as ApiError;
    }
  }

  throw currentError;
};

/**
 * 默认请求拦截器 - 添加认证信息
 */
addRequestInterceptor(async (url, options) => {
  const headers = {
    ...getDefaultHeaders(),
    ...options.headers,
  };

  return {
    url,
    options: {
      ...options,
      headers,
    },
  };
});

/**
 * 默认响应拦截器 - 处理响应数据
 */
addResponseInterceptor(async (response, url, options) => {
  if (!response.ok) {
    const error: ApiError = {
      message: `HTTP error! status: ${response.status}`,
      status: response.status,
      code: `HTTP_${response.status}`,
    };

    try {
      const errorData = await response.json();
      error.data = errorData;
      error.message = errorData.message || error.message;
    } catch {
      // 如果无法解析 JSON，使用默认错误信息
    }

    throw error;
  }

  // 根据 Content-Type 处理响应数据
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  if (contentType && contentType.includes('text/')) {
    return response.text();
  }

  return response.blob();
});

/**
 * 默认错误拦截器 - 处理网络错误
 */
addErrorInterceptor(async (error, url, options) => {
  // 网络连接错误
  if (error.message.includes('Network request failed')) {
    error.message = '网络连接失败，请检查网络设置';
    error.code = 'NETWORK_ERROR';
  }

  // 超时错误
  if (error.message.includes('timeout')) {
    error.message = '请求超时，请稍后重试';
    error.code = 'TIMEOUT_ERROR';
  }

  // 认证错误
  if (error.status === 401) {
    error.message = '登录已过期，请重新登录';
    error.code = 'AUTH_ERROR';
    // 这里可以触发重新登录逻辑
  }

  // 服务器错误
  if (error.status && error.status >= 500) {
    error.message = '服务器错误，请稍后重试';
    error.code = 'SERVER_ERROR';
  }

  throw error;
});

// 从 client.ts 导入 getDefaultHeaders
import { getDefaultHeaders } from '../api/client';
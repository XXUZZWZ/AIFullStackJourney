import { API_CONFIG, ApiResponse, ApiError, RequestOptions } from '../api/client';
import {
  executeRequestInterceptors,
  executeResponseInterceptors,
  executeErrorInterceptors,
} from './interceptors';

/**
 * 带重试机制的请求函数
 */
export const requestWithRetry = async <T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    retryCount = API_CONFIG.RETRY_COUNT,
    retryDelay = API_CONFIG.RETRY_DELAY,
    timeout = API_CONFIG.TIMEOUT,
    ...requestOptions
  } = options;

  let lastError: ApiError;

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      // 如果是重试，等待一段时间
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }

      const response = await request<T>(url, {
        ...requestOptions,
        timeout,
      });

      return response;
    } catch (error) {
      lastError = error as ApiError;

      // 如果是最后一次尝试，抛出错误
      if (attempt === retryCount) {
        break;
      }

      // 如果是网络错误或超时错误，继续重试
      const shouldRetry = ['NETWORK_ERROR', 'TIMEOUT_ERROR'].includes(
        lastError.code || ''
      );

      if (!shouldRetry) {
        break;
      }
    }
  }

  throw lastError!;
};

/**
 * 基础请求函数
 */
export const request = async <T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = API_CONFIG.TIMEOUT,
  } = options;

  try {
    // 执行请求拦截器
    const { url: processedUrl, options: processedOptions } =
      await executeRequestInterceptors(url, options);

    // 构建完整 URL
    const fullUrl = processedUrl.startsWith('http')
      ? processedUrl
      : `${API_CONFIG.BASE_URL}${processedUrl}`;

    // 创建 AbortController 用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // 准备请求配置
    const requestConfig: RequestInit = {
      method,
      headers: {
        ...getDefaultHeaders(),
        ...headers,
        ...processedOptions.headers,
      },
      signal: controller.signal,
    };

    // 添加请求体
    if (body && method !== 'GET' && method !== 'HEAD') {
      requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // 发送请求
    const response = await fetch(fullUrl, requestConfig);

    // 清除超时定时器
    clearTimeout(timeoutId);

    // 执行响应拦截器
    const data = await executeResponseInterceptors<T>(
      response,
      fullUrl,
      processedOptions
    );

    // 构建响应对象
    const apiResponse: ApiResponse<T> = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    };

    return apiResponse;
  } catch (error) {
    // 处理 AbortError（超时）
    if (error.name === 'AbortError') {
      const timeoutError: ApiError = {
        message: `Request timeout after ${timeout}ms`,
        code: 'TIMEOUT_ERROR',
      };
      return executeErrorInterceptors(timeoutError, url, options);
    }

    // 处理其他错误
    const apiError: ApiError = {
      message: error.message || 'Unknown error occurred',
      code: error.code || 'UNKNOWN_ERROR',
      data: error.data,
    };

    return executeErrorInterceptors(apiError, url, options);
  }
};

/**
 * GET 请求快捷方法
 */
export const get = <T = any>(url: string, options?: RequestOptions) =>
  request<T>(url, { ...options, method: 'GET' });

/**
 * POST 请求快捷方法
 */
export const post = <T = any>(url: string, body?: any, options?: RequestOptions) =>
  request<T>(url, { ...options, method: 'POST', body });

/**
 * PUT 请求快捷方法
 */
export const put = <T = any>(url: string, body?: any, options?: RequestOptions) =>
  request<T>(url, { ...options, method: 'PUT', body });

/**
 * DELETE 请求快捷方法
 */
export const del = <T = any>(url: string, options?: RequestOptions) =>
  request<T>(url, { ...options, method: 'DELETE' });

/**
 * PATCH 请求快捷方法
 */
export const patch = <T = any>(url: string, body?: any, options?: RequestOptions) =>
  request<T>(url, { ...options, method: 'PATCH', body });

// 从 client.ts 导入 getDefaultHeaders
import { getDefaultHeaders } from '../api/client';
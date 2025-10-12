// 通用类型定义

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分页响应数据
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * 列表响应数据
 */
export interface ListResponse<T> {
  items: T[];
  total: number;
}

/**
 * 基础实体接口
 */
export interface BaseEntity {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 用户接口
 */
export interface User extends BaseEntity {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

/**
 * 错误响应接口
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

/**
 * 成功响应接口
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * 上传文件接口
 */
export interface UploadFile {
  uri: string;
  type: string;
  name: string;
  size: number;
}

/**
 * 上传响应接口
 */
export interface UploadResponse {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}

/**
 * 搜索参数接口
 */
export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  page?: number;
  limit?: number;
}

/**
 * 搜索响应接口
 */
export interface SearchResponse<T> {
  results: T[];
  total: number;
  query: string;
  took: number;
}
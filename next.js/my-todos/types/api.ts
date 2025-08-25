/**
 * API响应基础类型
 */
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success: boolean;
  error?: string;
}

/**
 * API错误响应类型
 */
export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

/**
 * 分页请求参数类型
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分页响应类型
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
 * 查询过滤参数类型
 */
export interface FilterParams {
  search?: string;
  status?: string;
  userId?: number;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * 通用查询参数类型（包含分页和过滤）
 */
export interface QueryParams extends PaginationParams, FilterParams {}

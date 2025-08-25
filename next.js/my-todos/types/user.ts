/**
 * 用户基础信息类型
 */
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 用户创建请求类型
 */
export interface CreateUserRequest {
  name: string;
  email: string;
}

/**
 * 用户更新请求类型
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

/**
 * 用户列表响应类型
 */
export interface UsersResponse {
  users: User[];
}

/**
 * 单个用户响应类型
 */
export interface UserResponse {
  user: User;
}

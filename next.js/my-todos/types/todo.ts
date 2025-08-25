import { User } from './user';

/**
 * Todo基础信息类型
 */
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
  user?: User | null;
}

/**
 * Todo创建请求类型
 */
export interface CreateTodoRequest {
  title: string;
  userId?: number | null;
}

/**
 * Todo更新请求类型
 */
export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
  userId?: number | null;
}

/**
 * Todo列表响应类型
 */
export interface TodosResponse {
  todos: Todo[];
}

/**
 * 单个Todo响应类型
 */
export interface TodoResponse {
  todo: Todo;
}

/**
 * Todo统计信息类型
 */
export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}
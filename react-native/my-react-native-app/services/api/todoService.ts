import { get, post, put, del, requestWithRetry } from '../utils/request';
import { BaseEntity } from '../types/common';

/**
 * 待办事项接口
 */
export interface Todo extends BaseEntity {
  title: string;
  completed: boolean;
  userId?: number;
}

/**
 * 创建待办事项参数
 */
export interface CreateTodoParams {
  title: string;
  completed?: boolean;
  userId?: number;
}

/**
 * 更新待办事项参数
 */
export interface UpdateTodoParams {
  title?: string;
  completed?: boolean;
}

/**
 * 待办事项服务类
 */
export class TodoService {
  private static readonly BASE_PATH = '/todos';

  /**
   * 获取待办事项列表
   */
  static async getTodos(userId?: number): Promise<Todo[]> {
    const url = userId ? `${this.BASE_PATH}?userId=${userId}` : this.BASE_PATH;
    const response = await get<Todo[]>(url);
    return response.data;
  }

  /**
   * 获取待办事项详情
   */
  static async getTodoById(id: string | number): Promise<Todo> {
    const response = await get<Todo>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  /**
   * 创建待办事项
   */
  static async createTodo(params: CreateTodoParams): Promise<Todo> {
    const response = await post<Todo>(this.BASE_PATH, {
      ...params,
      completed: params.completed || false,
    });
    return response.data;
  }

  /**
   * 更新待办事项
   */
  static async updateTodo(id: string | number, params: UpdateTodoParams): Promise<Todo> {
    const response = await put<Todo>(`${this.BASE_PATH}/${id}`, params);
    return response.data;
  }

  /**
   * 删除待办事项
   */
  static async deleteTodo(id: string | number): Promise<void> {
    await del(`${this.BASE_PATH}/${id}`);
  }

  /**
   * 切换待办事项完成状态
   */
  static async toggleTodo(id: string | number): Promise<Todo> {
    const todo = await this.getTodoById(id);
    return this.updateTodo(id, { completed: !todo.completed });
  }

  /**
   * 批量更新待办事项
   */
  static async updateTodos(ids: (string | number)[], params: UpdateTodoParams): Promise<Todo[]> {
    const promises = ids.map(id => this.updateTodo(id, params).catch(() => null));
    const results = await Promise.all(promises);
    return results.filter(Boolean) as Todo[];
  }

  /**
   * 批量删除待办事项
   */
  static async deleteTodos(ids: (string | number)[]): Promise<void> {
    const promises = ids.map(id => this.deleteTodo(id).catch(() => null));
    await Promise.all(promises);
  }

  /**
   * 获取用户的所有待办事项
   */
  static async getUserTodos(userId: number): Promise<Todo[]> {
    return this.getTodos(userId);
  }

  /**
   * 获取完成的待办事项
   */
  static async getCompletedTodos(userId?: number): Promise<Todo[]> {
    const todos = await this.getTodos(userId);
    return todos.filter(todo => todo.completed);
  }

  /**
   * 获取未完成的待办事项
   */
  static async getPendingTodos(userId?: number): Promise<Todo[]> {
    const todos = await this.getTodos(userId);
    return todos.filter(todo => !todo.completed);
  }
}
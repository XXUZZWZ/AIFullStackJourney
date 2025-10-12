import { get, post, put, del, requestWithRetry } from '../utils/request';
import { User, PaginatedResponse, PaginationParams } from '../types/common';

/**
 * 用户服务类
 */
export class UserService {
  private static readonly BASE_PATH = '/users';

  /**
   * 获取用户列表
   */
  static async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('_page', params.page.toString());
    }

    if (params?.limit) {
      queryParams.append('_limit', params.limit.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH;

    const response = await get<User[]>(url);

    // 模拟分页响应（JSONPlaceholder 不提供分页信息）
    return {
      data: response.data,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: response.data.length,
        totalPages: Math.ceil(response.data.length / (params?.limit || 10)),
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  /**
   * 获取用户详情
   */
  static async getUserById(id: string | number): Promise<User> {
    const response = await get<User>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  /**
   * 创建用户
   */
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await post<User>(this.BASE_PATH, userData);
    return response.data;
  }

  /**
   * 更新用户
   */
  static async updateUser(id: string | number, userData: Partial<User>): Promise<User> {
    const response = await put<User>(`${this.BASE_PATH}/${id}`, userData);
    return response.data;
  }

  /**
   * 删除用户
   */
  static async deleteUser(id: string | number): Promise<void> {
    await del(`${this.BASE_PATH}/${id}`);
  }

  /**
   * 搜索用户
   */
  static async searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResponse<User>> {
    // JSONPlaceholder 不支持搜索，这里模拟实现
    const allUsers = await this.getUsers({ page: 1, limit: 1000 });

    const filteredUsers = allUsers.data.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
        hasNext: endIndex < filteredUsers.length,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * 批量获取用户
   */
  static async getUsersByIds(ids: (string | number)[]): Promise<User[]> {
    // JSONPlaceholder 不支持批量查询，这里使用 Promise.all 并行请求
    const promises = ids.map(id => this.getUserById(id).catch(() => null));
    const results = await Promise.all(promises);
    return results.filter(Boolean) as User[];
  }
}
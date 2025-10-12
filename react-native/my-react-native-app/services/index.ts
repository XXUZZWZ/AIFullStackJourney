// 服务层主入口文件

// 导出 API 配置和类型
export * from './api/client';

// 导出工具函数
export * from './utils/request';
export * from './utils/interceptors';

// 导出类型定义
export * from './types/common';

// 导出服务类
export * from './api/userService';
export * from './api/todoService';

// 导出服务实例
export { UserService } from './api/userService';
export { TodoService } from './api/todoService';
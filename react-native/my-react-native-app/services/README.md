# 服务层 - API 请求管理

这是一个遵循最佳实践的 React Native API 请求管理模块。

## 目录结构

```
services/
├── api/                    # API 服务类
│   ├── client.ts          # API 客户端配置
│   ├── userService.ts     # 用户服务
│   └── todoService.ts     # 待办事项服务
├── types/                 # 类型定义
│   └── common.ts          # 通用类型
├── utils/                 # 工具函数
│   ├── request.ts         # 请求工具
│   └── interceptors.ts    # 拦截器
├── index.ts              # 主入口文件
└── README.md             # 说明文档
```

## 核心特性

### 1. 请求拦截器
- **请求拦截器**: 自动添加认证信息、请求头
- **响应拦截器**: 统一处理响应数据、错误处理
- **错误拦截器**: 网络错误、超时、认证错误的统一处理

### 2. 重试机制
- 自动重试失败的请求
- 可配置重试次数和延迟
- 智能重试策略（仅对网络错误和超时重试）

### 3. 错误处理
- 统一的错误类型定义
- 友好的错误消息
- 详细的错误信息（状态码、错误码、错误数据）

### 4. TypeScript 支持
- 完整的类型定义
- 类型安全的 API 调用
- 自动类型推断

## 快速开始

### 基本使用

```typescript
import { UserService, TodoService } from '@/services';

// 获取用户列表
const users = await UserService.getUsers({ page: 1, limit: 10 });

// 获取用户详情
const user = await UserService.getUserById(1);

// 创建待办事项
const todo = await TodoService.createTodo({
  title: '学习 React Native',
  completed: false,
});

// 切换待办事项状态
const updatedTodo = await TodoService.toggleTodo(todo.id);
```

### 使用基础请求方法

```typescript
import { get, post, requestWithRetry } from '@/services';

// GET 请求
const response = await get('/users');

// POST 请求
const response = await post('/users', { name: 'John', email: 'john@example.com' });

// 带重试的请求
const response = await requestWithRetry('/api/data', {
  retryCount: 3,
  retryDelay: 1000,
});
```

### 添加自定义拦截器

```typescript
import { addRequestInterceptor, addResponseInterceptor } from '@/services';

// 添加请求拦截器
addRequestInterceptor(async (url, options) => {
  console.log(`发送请求: ${url}`);
  return { url, options };
});

// 添加响应拦截器
addResponseInterceptor(async (response, url, options) => {
  console.log(`收到响应: ${url}`, response.status);
  return response;
});
```

## 配置

### 环境变量

在 `.env` 文件中配置：

```env
EXPO_PUBLIC_API_URL=https://api.example.com
```

### API 配置

在 `services/api/client.ts` 中修改：

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com',
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
};
```

## 最佳实践

### 1. 错误处理

```typescript
try {
  const user = await UserService.getUserById(1);
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    // 处理网络错误
    Alert.alert('网络错误', '请检查网络连接');
  } else if (error.code === 'AUTH_ERROR') {
    // 处理认证错误
    navigateToLogin();
  } else {
    // 处理其他错误
    console.error('API Error:', error);
  }
}
```

### 2. 加载状态管理

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);

  try {
    const data = await UserService.getUsers();
    setUsers(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### 3. 取消请求

```typescript
useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const response = await fetch(url, { signal: controller.signal });
      // 处理响应
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('请求被取消');
      }
    }
  };

  fetchData();

  return () => {
    controller.abort();
  };
}, [url]);
```

## 扩展

### 添加新的 API 服务

1. 在 `services/api/` 目录下创建新的服务文件
2. 使用现有的工具函数和类型
3. 在 `services/index.ts` 中导出

### 自定义拦截器

根据项目需求添加自定义拦截器，如：
- 请求日志记录
- 性能监控
- 缓存策略
- 请求节流

## 注意事项

1. **网络状态检查**: 在发送请求前检查网络连接
2. **错误边界**: 使用错误边界组件捕获未处理的错误
3. **内存管理**: 及时取消未完成的请求
4. **安全**: 不要在客户端存储敏感信息
5. **性能**: 合理使用缓存和请求合并
# Prisma 单例模式重构说明

## 重构内容

### 1. 创建单例文件

- 位置：`lib/prisma.ts`
- 功能：提供全局唯一的 Prisma 客户端实例

### 2. 重构的 API 文件

- `app/api/todos/route.ts` - 主 todos API
- `app/api/todos/[id]/route.ts` - 单个 todo 操作 API
- `app/api/todos/user/route.ts` - 用户 API

## 单例模式的优势

### 1. 性能优化

- 避免创建多个数据库连接
- 减少内存占用
- 提高应用性能

### 2. 连接池管理

- 统一管理数据库连接池
- 防止连接池耗尽
- 更好的资源利用

### 3. 开发体验

- 开发环境下自动重新创建实例
- 生产环境下保持单例
- 避免热重载问题

## 使用方法

```typescript
// 在API文件中导入单例
import { prisma } from "@/lib/prisma";

// 直接使用，无需创建新实例
const todos = await prisma.todo.findMany();
```

## 注意事项

1. **路径别名**：使用 `@/lib/prisma` 导入
2. **环境区分**：开发和生产环境有不同的处理逻辑
3. **类型安全**：保持完整的 TypeScript 类型支持

## 文件结构

```
lib/
  └── prisma.ts          # Prisma单例
app/api/
  ├── todos/
  │   ├── route.ts       # 使用单例
  │   ├── [id]/
  │   │   └── route.ts   # 使用单例
  │   └── user/
  │       └── route.ts   # 使用单例
```

## 验证重构

运行以下命令验证重构是否成功：

```bash
# 检查TypeScript编译
pnpm build

# 启动开发服务器
pnpm dev

# 测试API端点
curl http://localhost:3000/api/todos
```

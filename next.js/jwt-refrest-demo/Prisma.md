# Prisma

## 安装与初始化

```cmd
// 核心依赖
pnpm add prisma @prisma/client
// 开发依赖
pnpm add -D prisma-erd-generator @prisma/generator-helper

// 初始化 Prisma 项目（生成 schema.prisma 和 .env）
npx prisma init
```

### baseUrl

`mysql://[username]:[password]@[host]:[port]/[database_name]`

### 数据库操作

```cmd
// 生成并运行数据库迁移
npx prisma migrate dev --name init

// 仅生成迁移文件（不运行）
npx prisma migrate dev --create-only

// 重置数据库（删除所有数据和表）
npx prisma migrate reset

// 部署迁移到生产环境
npx prisma migrate deploy

// 查看迁移状态
npx prisma migrate status
```

### 代码生成

```cmd
// 生成 Prisma Client（必须在 schema 变更后运行）
npx prisma generate

// 生成并立即推送到数据库（开发环境快速原型）
npx prisma db push
```

### 数据管理

```cmd
// 打开 Prisma Studio 可视化界面（默认端口 5555）
npx prisma studio

// 指定端口打开 Studio
npx prisma studio --port 3000

// 从数据库导入数据结构到 schema
npx prisma db pull

// 执行种子数据
npx prisma db seed
```

### 验证与调试

```cmd
// 验证 schema.prisma 文件语法
npx prisma validate

// 格式化 schema.prisma 文件
npx prisma format

// 查看 Prisma 版本
npx prisma version
```

### 数据库驱动安装

```cmd
// PostgreSQL 数据库
pnpm add pg && pnpm add -D @types/pg

// MySQL 数据库
pnpm add mysql2

// MongoDB 数据库
pnpm add mongodb
```

### 常用开发流程

```cmd
// 1. 初始化项目
npx prisma init

// 2. 编辑 schema.prisma 设计数据模型

// 3. 生成并运行迁移
npx prisma migrate dev --name init

// 4. 生成客户端代码
npx prisma generate

// 5. 查看数据库内容
npx prisma studio
```

## Prisma schema + git

- 数据库的设计图
- 文档流

### Model 表的映射模型

- 例如

```prisma
model User{
  id        Int       @id @default (autoincrement())
  email     String    @unique
  password  String
  refreshToken  String?
  createdAt     DateTime  @default(now())
  updateAt      DateTime  @updateAt
  posts         Post[]

  @@map("users")
  // 指定这个表名为users
}
```

- Model 表的映射关系
  @@map('users') 指定模型对应表名
  posts post[] 一对多的关系
  createdAt updatedAt primsa 自动维护
  @id 主键 id
  @unique 不可重复

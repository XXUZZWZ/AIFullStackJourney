# Next.js

## 数据库开发

## supbase

- ORM 工具
  - 不需要写 sql ,像操作对象一样操作数据库
  - Prisma

## Prisma 数据库的工程化

- 命令行工具，用于管理数据库 schema 迁移
- schema 是数据库的结构蓝图，定义了表，字段，数据类型，关系，约束等组织方式
- Migration 是数据库结构变更(建表改字段)等不只可以帮我们操作数据库，还可以为数据操作留下记录
- npx prisma init
- npx prisma migrate dev --name init

# 进入项目目录

cd next.js\my-todos

# 创建新的迁移

pnpm prisma migrate dev --name add_user_model

# 生成 Prisma Client

pnpm prisma generate

# 打开 Prisma Studio

pnpm prisma studio

# 查看数据库状态

pnpm prisma db pull

# 推送 schema 到数据库（不创建迁移）

pnpm prisma db push

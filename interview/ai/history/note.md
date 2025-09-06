# dotenv 库学习笔记

## 什么是 dotenv？

`dotenv` 是一个 Node.js 库，用于从 `.env` 文件中加载环境变量到 `process.env` 中。它是后端开发中管理敏感信息（如 API keys、数据库密码、配置信息）的标准解决方案。

## 核心概念

### 1. 环境变量 (Environment Variables)

- 系统级别的键值对，用于存储配置信息
- 不会被硬编码到代码中，提高安全性
- 可以在不同环境（开发、测试、生产）中使用不同的值

### 2. .env 文件

- 纯文本文件，存储环境变量
- 格式：`KEY=value`
- 通常不会被提交到版本控制系统（添加到 .gitignore）

## 为什么需要 dotenv？

### 安全性问题

```javascript
// ❌ 错误做法：硬编码敏感信息
const openai = new OpenAI({
  apiKey: "sk-1234567890abcdef...", // 直接暴露在代码中
});

// ✅ 正确做法：使用环境变量
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

### 配置管理

- **开发环境**：使用测试 API key
- **生产环境**：使用正式 API key
- **不同开发者**：各自的配置不会互相影响

## 安装和基本使用

### 1. 安装

```bash
npm install dotenv
```

### 2. 创建 .env 文件

```env
# .env 文件内容
OPENAI_API_KEY=sk-your-actual-api-key-here
DATABASE_URL=mongodb://localhost:27017/myapp
PORT=3000
NODE_ENV=development
```

### 3. 在代码中使用

```javascript
// 在应用启动时加载
import dotenv from "dotenv";
dotenv.config();

// 或者使用 require 语法
require("dotenv").config();

// 现在可以使用环境变量
console.log(process.env.OPENAI_API_KEY);
```

## 高级用法

### 1. 指定 .env 文件路径

```javascript
dotenv.config({ path: "./config/.env" });
```

### 2. 多环境配置

```javascript
// 根据环境加载不同的配置文件
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });
```

### 3. 预加载 (Preload)

```bash
# 在启动应用时自动加载
node -r dotenv/config index.js
```

## 最佳实践

### 1. .gitignore 配置

```gitignore
# 环境变量文件
.env
.env.local
.env.*.local

# 但可以提交模板文件
# .env.example
```

### 2. 提供 .env.example 模板

```env
# .env.example - 提交到版本控制
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=your_database_connection_string
PORT=3000
```

### 3. 变量命名规范

- 使用大写字母和下划线
- 有意义的名称
- 按模块分组

```env
# API Keys
OPENAI_API_KEY=xxx
GOOGLE_API_KEY=xxx

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp

# Application
APP_PORT=3000
APP_ENV=development
```

### 4. 类型转换和默认值

```javascript
// 数字类型转换
const port = parseInt(process.env.PORT) || 3000;

// 布尔值转换
const isProduction = process.env.NODE_ENV === "production";

// 提供默认值
const dbUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/default";
```

## 在你的项目中的应用

根据你的 `package.json`，你已经安装了 `dotenv` 和 `openai`，典型的使用场景：

```javascript
// index.mjs
import dotenv from "dotenv";
import OpenAI from "openai";

// 加载环境变量
dotenv.config();

// 使用环境变量初始化 OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 现在可以安全地使用 API
async function chat() {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Hello!" }],
  });
  console.log(response.choices[0].message.content);
}
```

## 安全注意事项

1. **永远不要提交 .env 文件**到版本控制
2. **定期轮换 API keys**
3. **使用最小权限原则**配置 API keys
4. **在生产环境中使用系统环境变量**而不是 .env 文件
5. **验证必需的环境变量**是否存在

```javascript
// 验证必需的环境变量
const requiredEnvVars = ["OPENAI_API_KEY", "DATABASE_URL"];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

## 总结

`dotenv` 是现代 Node.js 开发中不可或缺的工具，它帮助我们：

- 安全地管理敏感信息
- 分离配置和代码
- 支持多环境部署
- 提高代码的可维护性和安全性

在任何涉及 API keys、数据库连接等敏感信息的项目中，都应该使用 `dotenv` 来管理这些配置。

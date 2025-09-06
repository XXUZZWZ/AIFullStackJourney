# dotenv 库巩固练习题

## 一、选择题

### 1. dotenv 库的主要作用是什么？

A. 管理项目依赖  
B. 从 .env 文件加载环境变量到 process.env  
C. 编译 TypeScript 代码  
D. 处理 HTTP 请求

**答案：B**

### 2. 以下哪种做法是正确的？

A. 将 .env 文件提交到 Git 仓库  
B. 在代码中硬编码 API key  
C. 将 .env 文件添加到 .gitignore  
D. 在生产环境中使用 .env 文件

**答案：C**

### 3. 在 .env 文件中，正确的环境变量格式是？

A. `api_key = "sk-123"`  
B. `API_KEY=sk-123`  
C. `export API_KEY=sk-123`  
D. `const API_KEY = "sk-123"`

**答案：B**

### 4. 如何在 Node.js 中加载 dotenv？

A. `import dotenv from 'dotenv'; dotenv.config();`  
B. `require('dotenv').config();`  
C. `dotenv.load();`  
D. A 和 B 都正确

**答案：D**

### 5. process.env.PORT 返回的数据类型是？

A. number  
B. string  
C. boolean  
D. object

**答案：B**

## 二、判断题

### 1. .env 文件应该被提交到版本控制系统中。

**答案：错误**  
**解释：**.env 文件包含敏感信息，不应该被提交到版本控制系统，应该添加到 .gitignore 中。

### 2. 可以在 .env 文件中使用注释。

**答案：正确**  
**解释：**可以使用 # 开头的行作为注释。

### 3. dotenv 只能在 Node.js 环境中使用。

**答案：错误**  
**解释：**虽然 dotenv 主要用于 Node.js，但也有其他语言的实现版本。

### 4. 环境变量的值总是字符串类型。

**答案：正确**  
**解释：**process.env 中的所有值都是字符串，需要手动转换为其他类型。

### 5. 可以指定不同的 .env 文件路径。

**答案：正确**  
**解释：**可以使用 `dotenv.config({ path: './custom/.env' })` 指定路径。

## 三、简答题

### 1. 解释为什么不应该在代码中硬编码 API key？

**参考答案：**

- **安全风险**：代码可能被公开，API key 会暴露
- **版本控制问题**：敏感信息会被记录在 Git 历史中
- **环境管理困难**：不同环境需要不同的 key，硬编码无法灵活切换
- **团队协作问题**：每个开发者的 key 可能不同，硬编码会造成冲突
- **密钥轮换困难**：更换 key 时需要修改代码并重新部署

### 2. 描述 dotenv 的工作原理。

**参考答案：**

1. **读取文件**：dotenv 读取 .env 文件内容
2. **解析格式**：解析 `KEY=value` 格式的行
3. **设置环境变量**：将解析的键值对添加到 `process.env` 对象中
4. **不覆盖现有变量**：如果环境变量已存在，不会覆盖
5. **类型处理**：所有值都作为字符串存储

### 3. 列出使用 dotenv 的最佳实践。

**参考答案：**

- 将 .env 文件添加到 .gitignore
- 提供 .env.example 模板文件
- 使用大写字母和下划线命名变量
- 验证必需的环境变量是否存在
- 为环境变量提供默认值
- 按功能模块组织变量
- 定期轮换敏感信息
- 在生产环境使用系统环境变量

## 四、实践题

### 1. 创建一个使用 dotenv 的简单 Express 应用

**任务要求：**

- 使用 dotenv 管理端口号和数据库连接字符串
- 创建相应的 .env.example 文件
- 添加环境变量验证

**参考实现：**

**.env.example:**

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

**app.js:**

```javascript
require("dotenv").config();
const express = require("express");

// 验证必需的环境变量
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

const app = express();
const port = parseInt(process.env.PORT) || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
    environment: process.env.NODE_ENV,
    port: port,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### 2. 编写一个 OpenAI 聊天应用

**任务要求：**

- 使用 dotenv 管理 OpenAI API key
- 实现错误处理
- 支持不同的模型配置

**参考实现：**

**.env.example:**

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
MAX_TOKENS=150
```

**chat.mjs:**

```javascript
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// 验证 API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
const maxTokens = parseInt(process.env.MAX_TOKENS) || 150;

async function chat(message) {
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: message }],
      max_tokens: maxTokens,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    throw error;
  }
}

// 使用示例
chat("Hello, how are you?")
  .then((response) => console.log(response))
  .catch((error) => console.error("Error:", error.message));
```

### 3. 多环境配置管理

**任务要求：**

- 支持开发、测试、生产环境
- 每个环境有不同的配置文件
- 实现配置加载逻辑

**参考实现：**

**config/loader.js:**

```javascript
const dotenv = require("dotenv");
const path = require("path");

function loadConfig() {
  const env = process.env.NODE_ENV || "development";
  const envFile = `.env.${env}`;

  // 尝试加载特定环境的配置文件
  const envPath = path.resolve(process.cwd(), envFile);
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.warn(`Could not load ${envFile}, falling back to .env`);
    dotenv.config(); // 加载默认的 .env 文件
  }

  console.log(`Loaded configuration for ${env} environment`);
}

module.exports = { loadConfig };
```

## 五、思考题

### 1. 在微服务架构中，如何统一管理环境变量？

**参考思路：**

- 使用配置中心（如 Consul、etcd）
- 容器编排工具的配置管理（Kubernetes ConfigMap/Secret）
- 云服务提供商的配置服务（AWS Parameter Store、Azure Key Vault）
- 统一的配置模板和部署流程

### 2. 如何在前端项目中安全地使用 API key？

**参考思路：**

- 前端不应直接存储敏感的 API key
- 通过后端代理 API 请求
- 使用公开的、限制域名的 API key（如 Google Maps）
- 实现用户认证，后端验证后调用第三方 API
- 使用 JWT 等方式在前后端之间传递认证信息

---

**答题说明：**

- 选择题每题 2 分，共 10 分
- 判断题每题 2 分，共 10 分
- 简答题每题 5 分，共 15 分
- 实践题每题 10 分，共 30 分
- 思考题每题 10 分，共 20 分
- 总分：85 分

通过这些练习题，你可以全面掌握 dotenv 库的使用方法和最佳实践！

## 在本地使用大模型（Ollama + Next.js App Router）

本文档基于本目录下的示例应用，手把手带你在本地通过 Ollama 运行大模型，并用 Next.js 的 API 路由进行调用，前端页面发起聊天。

### 1. 准备工作

- 安装 Ollama：访问官网并按系统指引安装
  - 官网: `https://ollama.com/`
- Windows 用户默认本地服务监听 `http://localhost:11434`
- 本示例默认模型：`deepseek-r1:1.5b`

### 2. 下载并运行模型

在安装好 Ollama 后，先下载并运行需要的模型（示例以 DeepSeek 为例）：

```bash
# 列出可用/已拉取的模型
ollama run --list

# 运行 deepseek-r1（首次会自动拉取模型）
ollama run deepseek-r1

# 可选：指定端口（默认 11434）
ollama run deepseek-r1 --port 11434
```

确认本地 API 是否可访问：

```bash
curl http://localhost:11434/api/tags
```

若能返回已安装模型列表，则服务可用。

### 3. 配置本项目（可选）

后端 API 路由默认读取以下环境变量：

- `OLLAMA_URL`：默认为 `http://localhost:11434/api/chat`
- `MODEL_NAME`：默认为 `deepseek-r1:1.5b`

如需自定义，可在根目录创建 `.env.local`：

```bash
OLLAMA_URL=http://localhost:11434/api/chat
MODEL_NAME=deepseek-r1:1.5b
```

### 4. 启动前端（Next.js）

在本目录执行：

```bash
npm run dev
```

启动后访问 `http://localhost:3000`，即可看到一个简易聊天界面。

### 5. 前后端如何协作

- 前端页面：`app/page.tsx`
  - 维护 `messages` 与输入框状态
  - 提交消息时调用本地接口 `POST /api/chat`，将历史消息与新消息一并发送
  - 接收后端返回的 `assistant` 消息并渲染到对话列表

- 后端 API：`app/api/chat/route.ts`
  - 接收前端传入的 `messages`
  - 转发到 Ollama 的聊天接口（`OLLAMA_URL`），使用 `MODEL_NAME` 指定模型
  - 当前示例配置 `stream: false`，一次性返回完整回答

- 类型定义：`types/chat.ts`
  - 约束消息结构 `Message` 与响应结构 `ChatResponse`

### 6. 用 curl 直接调用后端 API（可选）

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "你好，给我讲个冷笑话" }
    ]
  }'
```

若返回形如 `{ message: { role: 'assistant', content: '...' }, ... }` 的 JSON，即表示链路打通。

### 7. 切换模型与进阶

- 切换模型：
  - 在 `.env.local` 中修改 `MODEL_NAME`，例如 `qwen2:7b`、`llama3:8b`
  - 确保已通过 `ollama run <model>` 拉取该模型

- 开启流式响应：
  - 目前 `route.ts` 使用 `stream: false`。要流式体验，可改为 `true` 并在前端使用 `ReadableStream`/`EventSource` 渐进渲染。

- 模型上下文与系统提示：
  - 在前端 `messages` 中加入 `role: 'system'` 的提示词，可引导模型风格与角色。

### 8. 常见问题排查

- 端口占用/无法连接：
  - 使用默认 `http://localhost:11434`，或通过 `--port` 指定新的端口
  - 确认防火墙放行本地端口（Windows）

- 模型未下载或名称错误：
  - 先执行 `ollama run <model>`，确认模型存在于 `curl /api/tags` 列表

- 返回 500 或无响应：
  - 查看终端与浏览器控制台日志
  - 在 `app/api/chat/route.ts` 中已包含错误输出，便于定位

### 9. 文件速览

- 页面：`app/page.tsx`
- API 路由：`app/api/chat/route.ts`
- 样式：`app/globals.css`
- 类型：`types/chat.ts`

### 10. 参考

- Ollama 文档：`https://github.com/ollama/ollama`
- Next.js App Router：`https://nextjs.org/docs/app`

祝你本地玩转大模型，Happy Hacking!

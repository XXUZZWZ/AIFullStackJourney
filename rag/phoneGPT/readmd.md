# phoneGPT

- chatbot
- 组件 tailwindcss message
- ai Streaming 复杂 需要处理 封装？？
- 选择大模型
- 专业领域的 chatbot
- RAG 手机知识知识库 用来做检索增强
- 知识库 爬虫
- 向量数据库 supabase

## 项目中用到哪些计算

- RAG 检索增强生成
  - embedding 模型 openai embedding
  - 相似度的 cos -->1 倒序
  - 存到 supabase 数据库

### package.json

- ai sdk
  - AI SDK Core 模块提供了统一的 API，用于与 OpenAI、Anthropic、Google 等模型提供商进行交互。
  - @ai-sdk/openai 调用 LLM 模型 @ai-sdk/react 基于 hooks api 式一行就完成 ls 输出
  - supabase BASS Bcakend as Service 基于 Postgres
  - LangChain 是一个用于构建 AI 应用的框架，它连接大模型、数据源和工具，简化了从提示工程到链式调用、记忆管理和代理决策的开发流程。
  - @langchain/community 社区提供的工具爬虫
  - @langchain/core 核心模块
  - puppter 无头浏览器 Puppeteer 是一个 Node.js 库，用于控制无头浏览器（如 Chrome），可自动化网页操作，如截图、爬取数据、测试交互等。
  - - lucide-react 是一个轻量、开源的 React 图标库
  - react-markdown 支持渲染 markdown 渲染文本

# next.js

- layout metadata 设置标题和描述 真强 seo

## tailwindcss

- 组件库
- 响应式
- max-w-3xl 响应式的技巧
- 48 rem (适配) 3XL 768 ipad 竖屏最大尺寸
- 移动设备时候 phone pad width = 188 width = 100% = 100vw
- PC 端 width = 768 px + mx-auto 居中
  - mobile First 移动端优先
  ```css
  w-full: 小屏时能占满可用宽度
  mx-auto: 在有固定/最大宽度时水平居中
  px-4: 侧边留白，防止贴边
  ```
- 在 Tailwind CSS 中，[] 表示任意值（Arbitrary Value），允许你直接写入自定义的 CSS 值（如 80vh），会被转换为对应的内联样式，实现灵活布局。

- @ai-sdk /react
  hooks 封装封装 chatLLM 功能，方便 流式输出。

## typescript

- 类型定义
  - 函数 组件 props 状态 事件 组件 props 类型约定

## 前端部分的亮点

- @ai-sdk/react 对 chatbot 响应式的封装，一行代码实现流式输出
- useChat() hooks 封装了 chatLLM
- React-markdown ai 响应 很多格式主要的格式
  - # ! [] 解析 markdown
  - tailwindcss 适配 动态设置
  - React 组件划分 和 ts 约束
  - shadcn 按需加载 ，定制性强
  - lucide-react 图标库
  - AI SDK 中用于生成流式文本响应的核心函数，支持逐字输出、工具调用和异步处理

## 后端亮点

- ai streamText 流式输出
- result.toStreamResponse() 将 streamText 生成 流式输出的，实现流式输出
- 爬虫脚本
  - npm run seed 脚本任务 seed.ts 用于编写脚本 ts 文件不能直接运行 他会结合 typescript 可以直接运行
    - 会自动先运行将 ts 编译成 js 再运行
  - 填充知识库
  - 上传到向量数据库
- ts-node

## 遇到的问题

- ai-sdk 检索的时候 LLM 给 了老版本 的代码，调试出了问题，context7
- useChat 对 hooks 的理解 封装 封装了流式输出，一般函数封装的区别，里面使用了 useState。
- ts-node 编译时 不支持 esm
  - 在 tsconfig.json ts 配置 文件
  - 支持 ts-node commonjs 模式
- langchain Agent 开发框架
- coze promptTempate 记忆 MessageMemory Community 工具
- 正则 html 替换
- vercel 的 AI 版图
- next.js
- AI SDK
- js 云端运行环境
- v0 bolt 前端的组件库
- 网页爬虫 wikipidia -> langchain/community + puppeteer(爬取网页内容)
- AI SDK/react 快捷实现流式输出---> prompt ---> embedding --> 向量数据库 supabase 查询向量数据库。
  - 做分块 chunks 段落 --> supabase 查询 --> embedding ---> supabase 存储
  - 向量存储

```sql

CREATE TABLE public.chunks (
id uuid NOT NULL DEFAULT gen_random_uuid(),
content text,
vector USER-DEFINED,
url text,
date_updated timestamp without time zone DEFAULT now(),
CONSTRAINT chunks_pkey PRIMARY KEY (id)
);

```

- rpc 调用

  - 在 supabase 数据库中调用过程

- 调用函数 向量相似度
- <=> 距离计算
- 1->
- 数据库 支持函数
- 传参
- 指定返回的内容
- 构建 sql 语句
- 设计 prompt 模板
  - 复用
  - context 分割符
  - 格式
    - 身份
    - 任务
    - 分区 context 和 question
    - 返回格式
    - 约束 不回答手机相关以外的内容
    - 接收两个参数，函数返回，我们的应用，有几个核心的 promptTemplate 构成 ，用心设计

# 🤖 Mini DeepSeek Code v1 - AI Enhanced

一个集成了 DeepSeek AI 的 Mini DeepSeek Code，展示真正的 AI 驱动编程助手功能。

## ✨ 核心特性

- 🧠 **智能自然语言处理** - 理解中英文指令，自动转换为具体操作
- 💬 **AI 对话助手** - 基于 DeepSeek API 的智能编程问答
- 🎨 **AI 代码生成** - 根据描述智能生成高质量代码
- 🔍 **智能项目分析** - 自动检测项目结构、语言和框架
- 📝 **智能文件操作** - 读取、写入、编辑和搜索文件
- ⚡ **命令执行** - 运行 shell 命令和脚本
- 💬 **交互式界面** - 友好的命令行交互体验
- 📊 **项目报告** - 生成详细的项目分析报告
- 🔧 **代码审查** - AI 驱动的代码质量分析

## 🚀 快速开始

### 1. 安装依赖

```bash
cd mini-deepseek-code-v1
npm install
```

### 2. 配置 AI 服务 (可选)

使用 DeepSeek API 以获得完整的 AI 功能：

```bash
# 启动程序
npm start

# 在交互模式中配置 API Key
mini-deepseek> config set-api-key sk-your-deepseek-api-key

# 或者设置环境变量
export DEEPSEEK_API_KEY=sk-your-deepseek-api-key
```

### 3. 启动交互模式

```bash
npm start
# 或者
node bin/cli.js interactive
```

## 📋 可用命令

### 基础命令

| 命令 | 描述 | 示例 |
|------|------|------|
| `help` | 显示帮助信息 | `help` |
| `analyze [path]` | 分析项目结构 | `analyze`, `analyze ./my-project` |
| `read <file>` | 读取文件内容 | `read package.json` |
| `write <file> <content>` | 写入文件 | `write hello.txt Hello World` |
| `edit <file> <old> <new>` | 编辑文件 | `edit index.js oldFunction newFunction` |
| `search <term> [path]` | 搜索文件内容 | `search "function", search "TODO" ./src` |
| `run <command>` | 执行 shell 命令 | `run "npm install"` |
| `create <type> <name>` | 创建新文件 | `create component Button` |
| `list [path]` | 列出目录文件 | `list`, `list ./src` |
| `status` | 显示当前状态 | `status` |
| `suggest` | 获取建议操作 | `suggest` |
| `report` | 生成项目报告 | `report` |

### 🤖 AI 命令

| 命令 | 描述 | 示例 |
|------|------|------|
| `chat <message>` | 与 AI 助手对话 | `chat 如何优化这个项目？` |
| `generate <description>` | AI 生成代码 | `generate 创建一个登录表单组件` |
| `ai status` | 显示 AI 服务状态 | `ai status` |
| `ai review <file>` | AI 代码审查 | `ai review src/app.js` |
| `config set-api-key <key>` | 设置 API Key | `config set-api-key sk-xxx` |
| `config show` | 显示当前配置 | `config show` |

### 🗣️ 自然语言指令

你可以直接用自然语言描述你想要做的事情：

**中文示例:**
- `"读取 package.json 文件"`
- `"创建一个React组件叫做Header"`
- `"搜索所有包含TODO的文件"`
- `"运行npm install"`
- `"生成一个用户登录的API接口"`

**English Examples:**
- `"Show me the package.json file"`
- `"Create a React component called Header"`
- `"Search for all files containing TODO"`
- `"Run npm install"`
- `"Generate a user login API endpoint"`

## 🧪 测试功能

```bash
# 运行基础测试
npm test

# 运行 AI 功能测试
node test/ai-test.js

# 运行完整演示 (较长)
node examples/ai-demo.js
```

## 🔧 AI 功能架构

### DeepSeek API 集成
- **API 兼容**: 使用 OpenAI SDK 访问 DeepSeek API
- **多模型支持**: `deepseek-chat` 和 `deepseek-reasoner`
- **配置管理**: 自动从环境变量或配置文件加载 API Key

### 自然语言处理
- **双重解析**: 本地规则 + AI 解析的混合方案
- **中英文支持**: 理解中文和英文指令
- **置信度评估**: 自动选择最佳解析方式
- **回退机制**: AI 不可用时使用本地解析

### 智能代码生成
- **上下文感知**: 基于项目信息生成相应代码
- **多语言支持**: JavaScript/TypeScript/Python/Java 等
- **框架适配**: 根据检测到的框架生成合适代码
- **质量保证**: 包含错误处理和最佳实践

## 📊 性能特点

- **快速响应**: 本地解析 < 100ms，AI 解析 < 3s
- **智能缓存**: 减少重复 API 调用
- **并发处理**: 支持多个操作同时执行
- **错误恢复**: 自动回退到本地模式

## 🎯 使用场景

### 1. 日常开发
```bash
mini-deepseek> 创建一个用户管理的React组件
mini-deepseek> 搜索所有的API端点
mini-deepseek> 运行测试并检查结果
```

### 2. 代码审查
```bash
mini-deepseek> ai review src/components/Login.jsx
mini-deepseek> chat 这个组件有什么可以改进的地方？
```

### 3. 项目分析
```bash
mini-deepseek> analyze
mini-deepseek> chat 分析一下这个项目的技术栈和架构
mini-deepseek> suggest
```

### 4. 智能生成
```bash
mini-deepseek> generate 创建一个完整的CRUD API
mini-claude> 生成一个响应式的导航栏组件
```

## 🔧 配置选项

### API Key 配置方式

1. **交互式配置**:
   ```bash
   mini-deepseek> config set-api-key sk-your-key
   ```

2. **环境变量**:
   ```bash
   export DEEPSEEK_API_KEY=sk-your-key
   ```

3. **配置文件**:
   ```json
   // .deepseek-config.json
   {
     "apiKey": "sk-your-key"
   }
   ```

## 🎨 项目结构

```
mini-deepseek-code-v1/
├── bin/cli.js                    # 命令行界面 (AI 增强)
├── lib/
│   ├── tool-manager.js           # 工具管理系统 (AI 集成)
│   ├── code-generator.js         # 代码生成器
│   ├── deepseek-ai.js           # DeepSeek API 集成
│   └── natural-language-processor.js # 自然语言处理器
├── tools/
│   ├── filesystem.js             # 文件系统工具
│   ├── command.js                # 命令执行工具
│   └── analyzer.js               # 代码分析器
├── test/
│   ├── test.js                   # 基础测试
│   └── ai-test.js               # AI 功能测试
├── examples/
│   ├── demo-usage.js            # 基础使用演示
│   └── ai-demo.js               # AI 功能演示
└── README.md                    # 本文档
```

## 🔍 与其他 AI Code 工具的对比

| 特性 | Mini DeepSeek Code v1 | 其他 AI Code 工具 |
|------|---------------------|------------------|
| 自然语言处理 | ✅ DeepSeek API + 本地规则 | ✅ DeepSeek AI |
| 项目分析 | ✅ 智能检测 | ✅ 深度分析 |
| 代码生成 | ✅ AI 生成 | ✅ AI 生成 |
| 文件操作 | ✅ 完整支持 | ✅ 完整支持 |
| 命令执行 | ✅ 完整支持 | ✅ 完整支持 |
| 代码审查 | ✅ AI 驱动 | ✅ AI 驱动 |
| 错误修复 | ⚠️ 基础支持 | ✅ 智能修复 |
| 测试生成 | ⚠️ 模板生成 | ✅ 智能生成 |
| Git 集成 | ⚠️ 基础支持 | ✅ 完整集成 |
| 上下文记忆 | ⚠️ 会话级别 | ✅ 跨会话 |

## 🚧 扩展建议

要使这个版本更接近真实 DeepSeek Code：

1. **增强 AI 集成**
   - 支持更多 AI 服务 (OpenAI, Anthropic, etc.)
   - 实现上下文记忆和学习能力
   - 添加流式响应支持

2. **智能错误处理**
   - AI 驱动的错误诊断和修复
   - 智能调试建议
   - 自动测试生成和修复

3. **高级功能**
   - Git 智能操作和冲突解决
   - 代码重构建议
   - 性能优化分析
   - 安全漏洞检测

4. **用户体验**
   - Web 界面集成
   - IDE 插件支持
   - 语音交互功能
   - 可视化项目视图

## 📝 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🙏 致谢

- **DeepSeek AI** - 提供强大的 AI 能力
- **XXUZZWZ** - 项目作者和主要贡献者
- **OpenAI SDK** - API 集成支持

---

🤖 **Made with Mini DeepSeek Code v1** - 展示 AI 驱动编程助手的无限可能！

## 🎉 立即体验

```bash
npm start
```

然后试试这些命令：
- `help` - 查看所有功能
- `chat 你好，请介绍一下你的能力` - 与 AI 对话
- `创建一个React组件` - 自然语言指令
- `generate 登录表单组件` - AI 代码生成
- `ai status` - 检查 AI 状态

让 AI 帮你编程吧！ 🚀
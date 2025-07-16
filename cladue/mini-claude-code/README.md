# 🤖 Mini DeepSeek Code

一个简化版的 DeepSeek Code，展示 AI 驱动的编程助手的核心功能和复杂性。

## ✨ 特性

- 🔍 **智能项目分析** - 自动检测项目结构、语言和框架
- 📝 **代码生成** - 基于模板生成各种类型的代码文件
- 🛠️ **文件操作** - 读取、写入、编辑和搜索文件
- ⚡ **命令执行** - 运行 shell 命令和脚本
- 💬 **交互式界面** - 友好的命令行交互体验
- 📊 **项目报告** - 生成详细的项目分析报告

## 🚀 快速开始

### 安装依赖

```bash
cd mini-deepseek-code
npm install
```

### 启动交互模式

```bash
npm start
# 或者
node bin/cli.js interactive
```

### 直接运行命令

```bash
# 分析当前项目
node bin/cli.js analyze

# 执行命令
node bin/cli.js run "ls -la"
```

## 📋 可用命令

### 交互模式命令

在交互模式下，你可以使用以下命令：

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
| `exit` | 退出程序 | `exit` |

### 代码生成类型

支持以下代码生成类型：

- `component` / `react-component` - React 函数组件
- `hook` / `react-hook` - React 自定义 Hook
- `route` / `express-route` - Express.js 路由
- `module` / `node-module` - Node.js 模块类
- `class` / `python-class` - Python 类
- `test` - Jest 测试文件
- `package` - package.json 文件
- `readme` - README.md 文件

## 🔧 架构设计

### 核心组件

```
mini-deepseek-code/
├── bin/
│   └── cli.js              # 命令行界面
├── lib/
│   ├── tool-manager.js     # 工具管理器
│   └── code-generator.js   # 代码生成器
├── tools/
│   ├── filesystem.js       # 文件系统工具
│   ├── command.js          # 命令执行工具
│   └── analyzer.js         # 代码分析工具
├── test/
│   └── test.js             # 测试文件
└── examples/
    └── demo-usage.js       # 使用示例
```

### 工具系统

**FileSystemTool** - 文件操作
- 读取/写入文件
- 编辑文件内容
- 搜索文件内容
- 列出目录文件

**CommandTool** - 命令执行
- 运行 shell 命令
- Git 操作
- NPM 操作
- 系统信息获取

**CodeAnalyzer** - 代码分析
- 项目结构分析
- 语言检测
- 框架识别
- 依赖分析

## 📖 使用示例

### 示例 1: 分析 React 项目

```bash
# 启动交互模式
npm start

# 在交互模式中
mini-deepseek> analyze ./my-react-app
mini-deepseek> create component UserProfile
mini-deepseek> create hook useUserData
mini-deepseek> run "npm install"
```

### 示例 2: 创建 Express 应用

```bash
mini-deepseek> create package MyAPI
mini-deepseek> create route users
mini-deepseek> create route products
mini-claude> write app.js "const express = require('express');\nconst app = express();\napp.listen(3000);"
```

### 示例 3: 项目维护

```bash
mini-deepseek> search "TODO"
mini-deepseek> list ./src
mini-deepseek> status
mini-deepseek> suggest
mini-deepseek> report
```

## 🧪 运行测试

```bash
npm test
# 或者
node test/test.js
```

测试覆盖以下功能：
- 工具管理器初始化
- 文件系统操作
- 命令执行
- 代码生成
- 项目分析

## 🎯 设计理念

这个 Mini DeepSeek Code 展示了真实 DeepSeek Code 的核心概念：

1. **模块化设计** - 每个功能都是独立的工具模块
2. **智能分析** - 自动理解项目结构和技术栈
3. **上下文感知** - 基于项目信息提供智能建议
4. **用户友好** - 直观的命令行界面和清晰的反馈
5. **可扩展性** - 易于添加新的工具和功能

## 🔍 与其他 AI Code 工具的对比

| 特性 | Mini DeepSeek Code | 其他 AI Code 工具 |
|------|------------------|------------------|
| 项目分析 | ✅ 基础检测 | ✅ 深度分析 |
| 代码生成 | ✅ 模板生成 | ✅ AI 生成 |
| 文件操作 | ✅ 完整支持 | ✅ 完整支持 |
| 命令执行 | ✅ 完整支持 | ✅ 完整支持 |
| 自然语言处理 | ❌ 未实现 | ✅ 核心功能 |
| 智能理解 | ❌ 规则基础 | ✅ AI 驱动 |
| 错误处理 | ✅ 基础处理 | ✅ 智能处理 |

## 🚧 扩展建议

要使这个 mini 版本更接近真实 DeepSeek Code，可以考虑添加：

1. **AI 集成** - 接入 OpenAI API 或其他 LLM
2. **自然语言处理** - 理解用户的自然语言指令
3. **智能代码生成** - 基于上下文生成更智能的代码
4. **错误修复** - 自动检测和修复代码错误
5. **测试生成** - 自动为代码生成测试用例
6. **文档生成** - 自动生成代码文档

## 📝 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🙏 致谢

- **XXUZZWZ** - 项目作者和主要贡献者

---

🤖 **Made with Mini DeepSeek Code** - 展示 DeepSeek Code 的复杂性和强大功能！
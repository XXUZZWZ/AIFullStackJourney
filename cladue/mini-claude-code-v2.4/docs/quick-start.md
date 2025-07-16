# 🚀 快速入门指南

欢迎使用 Mini Claude Code v3！这是一个功能强大的AI编程助手，本指南将帮助你快速上手。

## 📦 安装

### 前置要求
- Node.js 14.0.0 或更高版本
- npm 或 yarn 包管理器

### 克隆项目
```bash
git clone <repository-url>
cd mini-claude-code-v3
```

### 安装依赖
```bash
npm install
```

## ⚙️ 配置

### 1. 设置API密钥（可选但推荐）

获取DeepSeek AI的API密钥以启用完整的AI功能：

**方法一：环境变量**
```bash
export DEEPSEEK_API_KEY=sk-your-deepseek-api-key
```

**方法二：在应用中配置**
```bash
npm start
# 在交互模式中输入：
config set-api-key sk-your-deepseek-api-key
```

### 2. 验证安装
```bash
npm test
```

## 🎯 第一次使用

### 启动交互模式
```bash
npm start
```

你将看到美化的欢迎界面：

```
┌─────────────────────────────────────┐
│                                     │
│     🤖 Mini Claude Code v3          │
│   智能编程助手 - 让AI助力你的开发      │
│                                     │
└─────────────────────────────────────┘

🚀 交互模式已启动
💡 使用 Tab 键自动补全，输入 "help" 查看命令
   输入 "exit" 退出程序

mini-claude> 
```

### 查看帮助
```bash
mini-claude> help
```

## 📚 基础功能演示

### 1. 项目分析
```bash
mini-claude> analyze
```
这将分析当前项目的结构、语言、框架等信息。

### 2. 文件操作
```bash
# 读取文件
mini-claude> read package.json

# 写入文件
mini-claude> write hello.txt "Hello, World!"

# 搜索文件内容
mini-claude> search "function" ./lib
```

### 3. AI聊天（需要API密钥）
```bash
mini-claude> chat 如何优化这个项目的性能？
```

你将看到实时的AI响应：
```
🤖 AI助手:
基于你的项目分析，我建议以下几个优化方向：

1. 代码分割和懒加载...
2. 缓存策略优化...
3. 减少依赖包大小...

💬 完成，共 15 个数据块
```

### 4. 代码生成
```bash
mini-claude> generate 创建一个React计算器组件
```

AI将生成代码并自动保存：
```
🎨 AI代码生成器:
生成代码: "创建一个React计算器组件"

--- 生成的代码 ---
import React, { useState } from 'react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  // ... 更多代码
};

export default Calculator;
--- 代码结束 ---

📄 代码已保存到: generated_1234567890.js
💾 共生成 42 行代码
```

### 5. 自然语言命令
你可以直接用自然语言描述操作：

```bash
mini-claude> 创建一个名为utils的JavaScript文件
mini-claude> 运行npm install
mini-claude> 搜索所有包含TODO的文件
```

### 6. 智能补全
使用Tab键获得智能补全：

```bash
mini-claude> cre[Tab]    # 自动补全为 create
mini-claude> create comp[Tab]    # 自动补全为 component
mini-claude> create component [Tab][Tab]    # 显示所有文件名建议
```

## 🔧 高级功能

### 错误处理
```bash
# 检查项目错误
mini-claude> check

# 修复特定文件的错误
mini-claude> fix src/app.js
```

### 测试生成
```bash
# 为文件生成测试
mini-claude> test generate src/utils.js unit

# 运行测试
mini-claude> test run

# 检测测试框架
mini-claude> test framework
```

### 任务规划
```bash
# 创建任务计划
mini-claude> plan create "构建一个用户管理系统"

# 执行计划
mini-claude> plan execute

# 查看执行状态
mini-claude> plan status
```

### 系统状态
```bash
# 查看当前状态
mini-claude> status

# 获取建议操作
mini-claude> suggest

# 生成项目报告
mini-claude> report

# 查看AI状态
mini-claude> ai status

# 查看自动补全统计
mini-claude> completion
```

## 💡 实用技巧

### 1. 快捷键
- **Tab**: 自动补全命令和路径
- **Tab Tab**: 显示所有可用补全选项
- **↑/↓**: 浏览命令历史
- **Ctrl+C**: 强制退出

### 2. 配置管理
```bash
# 显示当前配置
mini-claude> config show

# 重置配置
mini-claude> config reset
```

### 3. 项目工作流程
1. **分析项目**: `analyze`
2. **获取建议**: `suggest`
3. **执行操作**: 根据建议执行相应命令
4. **AI协助**: 使用`chat`和`generate`获取AI帮助
5. **查看状态**: `status`检查进度

### 4. 高效使用AI功能
- 使用流式响应避免长时间等待
- 利用上下文记忆获得更相关的回答
- 结合项目分析结果提问更精确的问题

## 🎨 自定义配置

### 配置文件位置
```
.mini-claude-config/
├── config.json          # 主配置文件
└── .mini-claude-memory/  # 记忆数据目录
    ├── conversation_history.json
    ├── code_snippets.json
    ├── user_preferences.json
    └── project_memory.json
```

### 常用配置项
```json
{
  "ui": {
    "theme": "auto",
    "showWelcome": true,
    "verbose": false
  },
  "ai": {
    "timeout": 30000,
    "streaming": true,
    "temperature": 0.7
  },
  "completion": {
    "enabled": true,
    "showDescriptions": true
  }
}
```

### 环境变量
```bash
# AI配置
export DEEPSEEK_API_KEY=sk-your-api-key
export MINI_CLAUDE_TIMEOUT=30000

# UI配置
export MINI_CLAUDE_THEME=auto
export MINI_CLAUDE_VERBOSE=false

# 日志配置
export MINI_CLAUDE_LOG_LEVEL=info
```

## 🔍 故障排除

### 常见问题

**1. API密钥错误**
```bash
mini-claude> config set-api-key sk-your-correct-api-key
```

**2. 依赖问题**
```bash
rm -rf node_modules package-lock.json
npm install
```

**3. 权限问题**
```bash
chmod +x bin/cli-refactored.js
```

**4. 内存清理**
```bash
mini-claude> ai status
# 查看记忆统计，必要时可以清理
```

### 调试模式
```bash
# 启用详细输出
MINI_CLAUDE_VERBOSE=true npm start

# 启用调试日志
MINI_CLAUDE_LOG_LEVEL=debug npm start
```

## 📈 性能优化建议

### 1. 缓存优化
- 启用缓存可以显著提升响应速度
- 缓存会在5分钟后自动过期

### 2. 记忆管理
- 定期清理旧的对话记录
- 限制代码片段数量以节省存储空间

### 3. 网络优化
- 使用稳定的网络连接以获得最佳AI响应
- 考虑增加超时时间以避免长任务中断

## 🚀 下一步

1. **探索所有命令**: 使用`help`查看完整命令列表
2. **阅读完整文档**: 查看`docs/`目录中的详细文档
3. **运行示例**: 尝试`examples/`目录中的示例代码
4. **测试功能**: 运行`npm run demo`查看完整功能演示

## 📞 获取帮助

- **命令帮助**: 在应用中输入`help`
- **开发者文档**: `docs/developer-guide.md`
- **API参考**: `docs/api-reference.md`
- **问题反馈**: 提交GitHub Issue

---

🎉 **恭喜！你已经掌握了Mini Claude Code v3的基本使用方法。开始探索AI编程的无限可能吧！**

*Happy Coding! 🚀*
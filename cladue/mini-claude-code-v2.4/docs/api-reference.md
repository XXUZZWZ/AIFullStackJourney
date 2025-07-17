# API 参考文档

## 目录

- [DeepSeek AI 模块](#deepseek-ai-模块)
- [工具管理器](#工具管理器)
- [UI 管理器](#ui-管理器)
- [配置管理器](#配置管理器)
- [命令处理器](#命令处理器)
- [记忆系统](#记忆系统)
- [自动补全](#自动补全)
- [错误处理](#错误处理)
- [测试生成](#测试生成)

---

## DeepSeek AI 模块

### `DeepSeekAI`

主要的AI服务集成类，提供与DeepSeek API的完整交互。

#### 构造函数

```javascript
new DeepSeekAI(apiKey?: string)
```

**参数:**
- `apiKey` (string, 可选): DeepSeek API密钥

**示例:**
```javascript
const ai = new DeepSeekAI('sk-your-api-key');
// 或从环境变量加载
const ai = new DeepSeekAI();
```

#### 方法

##### `chat(messages, options?)`

发送聊天消息到AI模型。

**参数:**
- `messages` (string | Object[]): 消息内容或消息数组
- `options` (Object, 可选): 配置选项
  - `model` (string): 使用的模型，默认 'deepseek-chat'
  - `temperature` (number): 随机性，0-1，默认 0.7
  - `maxTokens` (number): 最大令牌数，默认 2000
  - `timeout` (number): 超时时间(ms)，默认 30000
  - `systemPrompt` (string): 系统提示词

**返回值:**
```javascript
Promise<{
  success: boolean,
  response?: string,
  usage?: Object,
  model?: string,
  error?: string
}>
```

**示例:**
```javascript
const result = await ai.chat('Hello, how are you?', {
  temperature: 0.5,
  maxTokens: 1000
});

if (result.success) {
  console.log(result.response);
}
```

##### `chatStream(messages, options?, onChunk?)`

流式聊天，实时返回响应块。

**参数:**
- `messages` (string | Object[]): 消息内容
- `options` (Object, 可选): 同 `chat()` 方法
- `onChunk` (Function, 可选): 数据块回调函数

**回调函数签名:**
```javascript
(data: {
  content: string,
  fullResponse: string,
  isComplete: boolean,
  chunk: Object,
  chunkIndex: number
}) => Promise<void>
```

**返回值:**
```javascript
Promise<{
  success: boolean,
  response?: string,
  chunks?: Array,
  totalChunks?: number,
  error?: string
}>
```

**示例:**
```javascript
const result = await ai.chatStream('Write a story', {}, async (data) => {
  if (data.content) {
    process.stdout.write(data.content);
  }
  if (data.isComplete) {
    console.log('\n完成!');
  }
});
```

##### `generateCode(description, context?)`

生成代码。

**参数:**
- `description` (string): 代码描述
- `context` (Object, 可选): 项目上下文信息

**返回值:**
```javascript
Promise<{
  success: boolean,
  code?: string,
  description?: string,
  context?: Object,
  error?: string
}>
```

##### `reviewCode(code, filePath?)`

审查代码并提供建议。

**参数:**
- `code` (string): 要审查的代码
- `filePath` (string, 可选): 文件路径

**返回值:**
```javascript
Promise<{
  success: boolean,
  response?: string,
  error?: string
}>
```

---

## 工具管理器

### `ToolManager`

协调各种工具和服务的中央管理器。

#### 构造函数

```javascript
new ToolManager()
```

#### 方法

##### `initialize(projectPath?)`

初始化工具管理器并分析项目。

**参数:**
- `projectPath` (string, 可选): 项目路径，默认当前目录

**返回值:**
```javascript
Promise<{
  success: boolean,
  analysis?: Object,
  error?: string
}>
```

##### `execute(toolName, method, ...args)`

执行工具方法。

**参数:**
- `toolName` (string): 工具名称 ('fs', 'cmd', 'analyzer')
- `method` (string): 方法名
- `...args` (any[]): 方法参数

**返回值:**
```javascript
Promise<{
  success: boolean,
  [key: string]: any,
  error?: string
}>
```

**示例:**
```javascript
// 读取文件
const result = await toolManager.execute('fs', 'readFile', 'package.json');

// 运行命令
const result = await toolManager.execute('cmd', 'run', 'npm install');
```

##### `processNaturalLanguage(input)`

处理自然语言输入。

**参数:**
- `input` (string): 用户的自然语言输入

**返回值:**
```javascript
Promise<{
  success: boolean,
  response?: string,
  message?: string,
  filePath?: string,
  error?: string,
  suggestion?: string
}>
```

##### `chat(message, options?)`

与AI聊天（带上下文记忆）。

**参数:**
- `message` (string): 聊天消息
- `options` (Object, 可选): 聊天选项

**返回值:** 同 `DeepSeekAI.chat()`

---

## UI 管理器

### `UIManager`

管理命令行界面的显示和美化。

#### 构造函数

```javascript
new UIManager()
```

#### 方法

##### 显示方法

```javascript
// 基础显示
showWelcome()                    // 显示欢迎信息
showReady()                      // 显示准备就绪信息
showHelp()                       // 显示帮助信息
showGoodbye()                    // 显示告别信息

// 信息显示
showSuccess(message: string)     // 显示成功信息
showError(message: string, details?: string)  // 显示错误信息
showWarning(message: string)     // 显示警告信息
showInfo(message: string)        // 显示普通信息
showSuggestion(message: string)  // 显示建议信息

// 项目相关
displayProjectInfo(analysis: Object)  // 显示项目分析结果
showStatus(context: Object)           // 显示系统状态
showSuggestions(suggestions: Array)   // 显示操作建议
showReport(report: Object)            // 显示项目报告

// 文件操作
showFileContent(content: string, filePath: string)  // 显示文件内容
showFileList(files: Array)                          // 显示文件列表
showSearchResults(results: Array)                   // 显示搜索结果

// AI相关
showAIResponseHeader()                    // 显示AI响应头部
showAIResponse(response: string)          // 显示AI响应
showCodeGenerationHeader(desc: string)    // 显示代码生成头部
showCodeBlockStart()                      // 显示代码块开始
showCodeBlockEnd()                        // 显示代码块结束
showCodeSaved(filePath: string, lines: number)  // 显示代码保存信息
```

#### 主题配置

```javascript
// UI管理器内置主题
const theme = {
  primary: chalk.blue,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  info: chalk.cyan,
  muted: chalk.gray,
  accent: chalk.magenta,
  highlight: chalk.bgBlue.white
};
```

---

## 配置管理器

### `ConfigManager`

统一管理应用配置。

#### 构造函数

```javascript
new ConfigManager(configDir?: string)
```

**参数:**
- `configDir` (string, 可选): 配置目录路径，默认 '.mini-claude-config'

#### 方法

##### `get(path, defaultValue?)`

获取配置值。

**参数:**
- `path` (string): 配置路径，如 'ai.timeout'
- `defaultValue` (any, 可选): 默认值

**返回值:** 配置值

**示例:**
```javascript
const timeout = config.get('ai.timeout', 30000);
const theme = config.get('ui.theme', 'auto');
```

##### `set(path, value)`

设置配置值。

**参数:**
- `path` (string): 配置路径
- `value` (any): 配置值

**返回值:** `boolean` - 是否设置成功

##### `loadConfig()`

加载配置文件。

**返回值:** `Promise<Object>` - 加载的配置

##### `saveConfig()`

保存配置到文件。

**返回值:** `Promise<boolean>` - 是否保存成功

##### `validate()`

验证配置有效性。

**返回值:** `Array<string>` - 验证错误列表

##### `getSummary()`

获取配置摘要。

**返回值:**
```javascript
{
  ai: {
    configured: boolean,
    model: string,
    streaming: boolean
  },
  memory: {
    maxHistory: number,
    maxSnippets: number
  },
  ui: {
    theme: string,
    verbose: boolean
  },
  performance: {
    cacheEnabled: boolean,
    metricsEnabled: boolean
  }
}
```

---

## 命令处理器

### `CommandHandler`

处理基础文件和系统命令。

#### 构造函数

```javascript
new CommandHandler(toolManager, codeGenerator, uiManager)
```

#### 方法

```javascript
// 文件操作
analyzeProject(projectPath?: string)     // 分析项目
readFile(filePath: string)               // 读取文件
writeFile(filePath: string, content: string)  // 写入文件
editFile(filePath: string, oldText: string, newText: string)  // 编辑文件
searchInFiles(searchTerm: string, searchPath?: string)  // 搜索文件
listFiles(dirPath?: string)              // 列出文件
createFile(fileType: string, fileName: string)  // 创建文件

// 系统操作
runCommand(command: string)              // 运行命令
showStatus()                            // 显示状态
showSuggestions()                       // 显示建议
showReport()                            // 显示报告
showCompletionStatus(autoCompletion: Object)  // 显示补全状态
```

### `AICommandHandler`

处理AI相关命令。

#### 构造函数

```javascript
new AICommandHandler(toolManager, uiManager)
```

#### 方法

```javascript
// AI交互
chatWithAI(message: string, useStreaming?: boolean)  // AI聊天
generateWithAI(description: string)                  // AI代码生成
reviewCodeWithAI(filePath: string)                   // AI代码审查
handleAICommand(params: Array)                       // 处理AI子命令
showAIStatus()                                       // 显示AI状态
```

---

## 记忆系统

### `ContextMemory`

管理上下文记忆和历史数据。

#### 构造函数

```javascript
new ContextMemory(storageDir?: string)
```

#### 方法

##### `addConversation(userInput, aiResponse, context?)`

添加对话到历史记录。

**参数:**
- `userInput` (string): 用户输入
- `aiResponse` (string): AI响应
- `context` (Object, 可选): 上下文信息

**返回值:** `Promise<string>` - 对话ID

##### `addCodeSnippet(code, description, language, context?)`

添加代码片段到记忆。

**参数:**
- `code` (string): 代码内容
- `description` (string): 代码描述
- `language` (string): 编程语言
- `context` (Object, 可选): 上下文信息

**返回值:** `Promise<string>` - 代码片段ID

##### `getRelevantHistory(query, maxResults?)`

获取相关的对话历史。

**参数:**
- `query` (string): 查询内容
- `maxResults` (number, 可选): 最大结果数，默认5

**返回值:** `Array<Object>` - 相关对话列表

##### `searchCodeSnippets(query, language?, maxResults?)`

搜索相关代码片段。

**参数:**
- `query` (string): 查询内容
- `language` (string, 可选): 编程语言过滤
- `maxResults` (number, 可选): 最大结果数，默认3

**返回值:** `Array<Object>` - 相关代码片段列表

##### `generateContextPrompt(currentQuery, projectInfo?)`

生成上下文提示词。

**参数:**
- `currentQuery` (string): 当前查询
- `projectInfo` (Object, 可选): 项目信息

**返回值:** `string` - 生成的上下文提示词

---

## 自动补全

### `AutoCompletion`

提供智能自动补全功能。

#### 构造函数

```javascript
new AutoCompletion(toolManager)
```

#### 方法

##### `getCommandCompletions(input)`

获取命令补全建议。

**参数:**
- `input` (string): 用户输入

**返回值:**
```javascript
Array<{
  text: string,
  display: string,
  type: string,
  description?: string
}>
```

##### `getSmartSuggestions()`

获取智能建议。

**返回值:**
```javascript
Array<{
  command: string,
  description: string
}>
```

##### `getStats()`

获取补全系统统计信息。

**返回值:**
```javascript
{
  baseCommands: number,
  cacheSize: number,
  supportedFileTypes: number,
  commonExtensions: number
}
```

---

## 错误处理

### `IntelligentErrorHandler`

智能错误分析和修复。

#### 构造函数

```javascript
new IntelligentErrorHandler(toolManager)
```

#### 方法

##### `analyzeError(errorMessage, filePath?, context?)`

分析错误信息。

**参数:**
- `errorMessage` (string): 错误消息
- `filePath` (string, 可选): 文件路径
- `context` (Object, 可选): 上下文信息

**返回值:**
```javascript
Promise<{
  success: boolean,
  analysis?: {
    originalError: string,
    filePath: string,
    detectedType: string,
    severity: string,
    autoFixable: boolean,
    suggestions: Array<string>,
    aiAnalysis?: Object
  },
  error?: string
}>
```

##### `autoFix(filePath, errorAnalysis, options?)`

自动修复错误。

**参数:**
- `filePath` (string): 文件路径
- `errorAnalysis` (Object): 错误分析结果
- `options` (Object, 可选): 修复选项

**返回值:**
```javascript
Promise<{
  success: boolean,
  message?: string,
  fixedCode?: string,
  changes?: Array<string>,
  backup?: string,
  error?: string
}>
```

##### `validateFix(filePath, originalError?)`

验证修复结果。

**参数:**
- `filePath` (string): 文件路径
- `originalError` (string, 可选): 原始错误

**返回值:**
```javascript
Promise<{
  success: boolean,
  message?: string,
  error?: string,
  stillHasErrors?: boolean
}>
```

---

## 测试生成

### `AITestGenerator`

AI驱动的测试代码生成。

#### 构造函数

```javascript
new AITestGenerator(toolManager)
```

#### 方法

##### `detectTestFramework(projectPath?)`

检测项目的测试框架。

**参数:**
- `projectPath` (string, 可选): 项目路径

**返回值:**
```javascript
Promise<{
  success: boolean,
  frameworks?: Array<{
    name: string,
    confidence: number,
    source: string
  }>,
  primary?: Object,
  error?: string
}>
```

##### `analyzeCodeForTests(filePath)`

分析代码文件用于测试生成。

**参数:**
- `filePath` (string): 文件路径

**返回值:**
```javascript
Promise<{
  success: boolean,
  analysis?: {
    filePath: string,
    fileType: string,
    functions: Array,
    classes: Array,
    exports: Array,
    complexity: string,
    testSuggestions: Array
  },
  error?: string
}>
```

##### `generateTests(filePath, testType?, options?)`

生成测试代码。

**参数:**
- `filePath` (string): 源文件路径
- `testType` (string, 可选): 测试类型，默认 'unit'
- `options` (Object, 可选): 生成选项

**返回值:**
```javascript
Promise<{
  success: boolean,
  testCode?: string,
  testFilePath?: string,
  framework?: string,
  analysis?: Object,
  suggestions?: Array<string>,
  error?: string
}>
```

##### `runTests(testFilePath?)`

运行测试。

**参数:**
- `testFilePath` (string, 可选): 测试文件路径

**返回值:**
```javascript
Promise<{
  success: boolean,
  exitCode?: number,
  stdout?: string,
  stderr?: string,
  passed?: boolean
}>
```

---

## 类型定义

### 通用类型

```typescript
// 执行结果
interface ExecutionResult {
  success: boolean;
  error?: string;
  [key: string]: any;
}

// 项目信息
interface ProjectInfo {
  path: string;
  languages: Record<string, number>;
  frameworks: Array<{
    name: string;
    confidence: number;
  }>;
  packageManager?: string;
  totalFiles: number;
  codeFiles: number;
  structure: {
    commonDirs: string[];
    hasTests: boolean;
    hasDocs: boolean;
  };
}

// 会话上下文
interface SessionContext {
  startTime: Date;
  commands: Array<{
    input?: string;
    tool?: string;
    method?: string;
    result: boolean;
    timestamp: Date;
    [key: string]: any;
  }>;
  files: string[];
  aiEnabled: boolean;
}

// 对话记录
interface ConversationRecord {
  id: string;
  sessionId: string;
  timestamp: string;
  userInput: string;
  aiResponse: string;
  context: {
    projectPath?: string;
    language?: string;
    framework?: string;
    commandType?: string;
  };
}

// 代码片段
interface CodeSnippet {
  id: string;
  sessionId: string;
  timestamp: string;
  code: string;
  description: string;
  language: string;
  context: {
    projectPath?: string;
    framework?: string;
    fileType?: string;
  };
  useCount: number;
}
```

---

## 错误代码

| 错误代码 | 描述 | 解决方案 |
|----------|------|----------|
| `AI_001` | API密钥无效 | 检查API密钥格式和有效性 |
| `AI_002` | API请求超时 | 增加超时时间或检查网络连接 |
| `AI_003` | 模型不可用 | 更换模型或联系服务提供商 |
| `FS_001` | 文件不存在 | 检查文件路径是否正确 |
| `FS_002` | 权限不足 | 检查文件/目录权限 |
| `FS_003` | 磁盘空间不足 | 清理磁盘空间 |
| `CMD_001` | 命令执行失败 | 检查命令语法和权限 |
| `CFG_001` | 配置文件损坏 | 重置配置或手动修复 |
| `MEM_001` | 内存系统错误 | 清理内存数据或重置 |

---

*最后更新: 2024年*
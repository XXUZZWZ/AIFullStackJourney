const OpenAI = require('openai');
const fs = require('fs-extra');
const path = require('path');

class DeepSeekAI {
  constructor(apiKey = null) {
    this.name = 'DeepSeekAI';
    this.apiKey = apiKey;
    this.client = null;
    this.models = {
      chat: 'deepseek-chat',      // DeepSeek-V3-0324
      reasoner: 'deepseek-reasoner' // DeepSeek-R1-0528
    };
    
    // 初始化客户端
    this.initializeClient();
  }

  /**
   * 初始化 OpenAI 客户端
   */
  initializeClient() {
    if (!this.apiKey) {
      // 尝试从环境变量或配置文件加载
      this.apiKey = this.loadApiKey();
    }

    if (this.apiKey) {
      this.client = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: this.apiKey
      });
    }
  }

  /**
   * 从多个来源加载 API Key
   */
  loadApiKey() {
    // 1. 环境变量
    if (process.env.DEEPSEEK_API_KEY) {
      return process.env.DEEPSEEK_API_KEY;
    }

    // 2. 配置文件
    try {
      const configPath = path.join(process.cwd(), '.deepseek-config.json');
      if (fs.existsSync(configPath)) {
        const config = fs.readJsonSync(configPath);
        return config.apiKey;
      }
    } catch (error) {
      // 忽略配置文件错误
    }

    // 3. 从文档中的默认值（用于演示）
    return 'sk-386b598ba19f49eba2d681f8135f5ae3';
  }

  /**
   * 保存 API Key 到配置文件
   */
  async saveApiKey(apiKey) {
    try {
      const configPath = path.join(process.cwd(), '.deepseek-config.json');
      await fs.writeJson(configPath, { apiKey }, { spaces: 2 });
      this.apiKey = apiKey;
      this.initializeClient();
      return { success: true, message: 'API Key saved successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 检查 API 是否可用
   */
  isAvailable() {
    return this.client !== null && this.apiKey !== null;
  }

  /**
   * 发送聊天消息
   */
  async chat(messages, options = {}) {
    if (!this.isAvailable()) {
      return {
        success: false,
        error: 'DeepSeek API not configured. Please set API key first.'
      };
    }

    try {
      const {
        model = this.models.chat,
        stream = false,
        temperature = 0.7,
        maxTokens = 1000,
        systemPrompt = null
      } = options;

      // 构建消息数组
      const chatMessages = [];
      
      if (systemPrompt) {
        chatMessages.push({ role: 'system', content: systemPrompt });
      }

      // 如果 messages 是字符串，转换为消息格式
      if (typeof messages === 'string') {
        chatMessages.push({ role: 'user', content: messages });
      } else if (Array.isArray(messages)) {
        chatMessages.push(...messages);
      } else {
        chatMessages.push(messages);
      }

      const completion = await this.client.chat.completions.create({
        model,
        messages: chatMessages,
        stream,
        temperature,
        max_tokens: maxTokens
      });

      if (stream) {
        return {
          success: true,
          stream: completion
        };
      } else {
        return {
          success: true,
          response: completion.choices[0].message.content,
          usage: completion.usage,
          model: completion.model
        };
      }

    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error.response?.data || null
      };
    }
  }

  /**
   * 解析自然语言指令为具体操作
   */
  async parseCommand(userInput, projectContext = null) {
    const systemPrompt = `你是一个智能编程助手，专门解析用户的自然语言指令并转换为具体的操作。

可用的操作类型：
- "read_file": 读取文件 - 参数: filePath
- "write_file": 写入文件 - 参数: filePath, content
- "edit_file": 编辑文件 - 参数: filePath, oldText, newText
- "create_file": 创建文件 - 参数: fileType, fileName
- "search_files": 搜索文件内容 - 参数: searchTerm, path (可选)
- "run_command": 执行命令 - 参数: command
- "list_files": 列出文件 - 参数: path (可选)
- "analyze_project": 分析项目结构
- "chat": 普通对话 - 参数: message

项目上下文信息：
${projectContext ? JSON.stringify(projectContext, null, 2) : '暂无项目信息'}

请将用户输入解析为 JSON 格式，包含 action 和 parameters 字段。如果无法解析为具体操作，使用 "chat" 类型。

用户输入：${userInput}

请只返回 JSON，不要包含其他文字解释。`;

    try {
      const result = await this.chat(userInput, {
        systemPrompt,
        temperature: 0.3,
        maxTokens: 500
      });

      if (result.success) {
        // 尝试解析 JSON 响应
        try {
          const parsed = JSON.parse(result.response);
          return {
            success: true,
            action: parsed.action,
            parameters: parsed.parameters || {},
            originalInput: userInput
          };
        } catch (parseError) {
          // 如果无法解析 JSON，回退到对话模式
          return {
            success: true,
            action: 'chat',
            parameters: { message: result.response },
            originalInput: userInput
          };
        }
      } else {
        return result;
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 智能代码生成
   */
  async generateCode(description, context = {}) {
    const systemPrompt = `你是一个专业的代码生成助手。根据用户描述和项目上下文，生成高质量的代码。

项目信息：
- 语言: ${context.languages ? Object.keys(context.languages).join(', ') : '未知'}
- 框架: ${context.frameworks ? context.frameworks.map(f => f.name).join(', ') : '未知'}
- 包管理器: ${context.packageManager || '未知'}

请生成符合项目风格的代码，包含必要的注释和错误处理。只返回代码，不要包含解释文字。`;

    try {
      const result = await this.chat(description, {
        systemPrompt,
        temperature: 0.5,
        maxTokens: 2000
      });

      if (result.success) {
        return {
          success: true,
          code: result.response,
          description,
          context
        };
      } else {
        return result;
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 代码审查和建议
   */
  async reviewCode(code, filePath = null) {
    const systemPrompt = `你是一个专业的代码审查专家。请分析提供的代码并给出改进建议。

关注以下方面：
1. 代码质量和最佳实践
2. 性能优化机会
3. 安全问题
4. 代码风格和一致性
5. 潜在的 bug 或错误

请提供具体、可操作的建议。`;

    const userInput = `文件路径: ${filePath || '未知'}

代码内容:
\`\`\`
${code}
\`\`\``;

    try {
      const result = await this.chat(userInput, {
        systemPrompt,
        temperature: 0.4,
        maxTokens: 1500
      });

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 解释错误信息
   */
  async explainError(errorMessage, context = {}) {
    const systemPrompt = `你是一个专业的调试专家。请分析错误信息并提供解决方案。

项目信息：
${context.projectInfo ? JSON.stringify(context.projectInfo, null, 2) : '暂无项目信息'}

请提供：
1. 错误原因的清晰解释
2. 具体的解决步骤
3. 预防类似错误的建议
4. 相关的文档链接（如果适用）`;

    try {
      const result = await this.chat(`错误信息: ${errorMessage}`, {
        systemPrompt,
        temperature: 0.3,
        maxTokens: 1000
      });

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取使用统计
   */
  getStats() {
    return {
      isConfigured: this.isAvailable(),
      apiKey: this.apiKey ? `${this.apiKey.slice(0, 8)}...` : null,
      availableModels: this.models
    };
  }
}

module.exports = DeepSeekAI;
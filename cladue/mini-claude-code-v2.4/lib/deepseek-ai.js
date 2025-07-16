/**
 * DeepSeek AI 集成模块
 * 提供与DeepSeek AI API的完整集成，支持流式和非流式响应
 * 
 * 功能特性:
 * - 🚀 流式AI响应，避免长时间等待
 * - 🔄 多种对话模式支持
 * - 🎨 智能代码生成
 * - 🔍 代码审查和错误分析
 * - ⚙️ 灵活的配置管理
 * 
 * @author Mini Claude Code Team
 * @version 3.0.0
 * @since 1.0.0
 */

const OpenAI = require('openai/index.js');
const fs = require('fs-extra');
const path = require('path');

/**
 * DeepSeek AI 客户端类
 * 封装了与DeepSeek API的所有交互逻辑
 * 
 * @class DeepSeekAI
 * @example
 * ```javascript
 * const ai = new DeepSeekAI('your-api-key');
 * const response = await ai.chat('Hello, how are you?');
 * console.log(response.response);
 * ```
 */
class DeepSeekAI {
  /**
   * 创建DeepSeek AI实例
   * 
   * @param {string|null} apiKey - DeepSeek API密钥，如果为null则从环境变量或配置文件加载
   * @throws {Error} 如果无法初始化客户端
   * 
   * @example
   * ```javascript
   * // 使用指定API密钥
   * const ai = new DeepSeekAI('sk-your-api-key');
   * 
   * // 从环境变量加载
   * const ai = new DeepSeekAI();
   * ```
   */
  constructor(apiKey = null) {
    /** @type {string} 模块名称 */
    this.name = 'DeepSeekAI';
    
    /** @type {string|null} API密钥 */
    this.apiKey = apiKey;
    
    /** @type {OpenAI|null} OpenAI客户端实例 */
    this.client = null;
    
    /** 
     * 可用的AI模型配置
     * @type {Object.<string, string>}
     */
    this.models = {
      /** 通用对话模型 */
      chat: 'deepseek-chat',
      /** 推理专用模型 */
      reasoner: 'deepseek-reasoner'
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
   * 发送聊天消息 - 支持流式和非流式响应
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
        maxTokens = 2000,
        systemPrompt = null,
        timeout = 30000
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

      // 设置超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const completion = await this.client.chat.completions.create({
          model,
          messages: chatMessages,
          stream,
          temperature,
          max_tokens: maxTokens
        }, {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (stream) {
          return {
            success: true,
            stream: completion,
            isStreaming: true
          };
        } else {
          return {
            success: true,
            response: completion.choices[0].message.content,
            usage: completion.usage,
            model: completion.model,
            isStreaming: false
          };
        }
      } catch (apiError) {
        clearTimeout(timeoutId);
        throw apiError;
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timed out. Please try again with a shorter prompt.',
          timeout: true
        };
      }
      return {
        success: false,
        error: error.message,
        details: error.response?.data || null
      };
    }
  }

  /**
   * 流式聊天 - 专门用于流式响应的方法
   */
  async chatStream(messages, options = {}, onChunk = null) {
    const streamOptions = { ...options, stream: true };
    const result = await this.chat(messages, streamOptions);
    
    if (!result.success) {
      return result;
    }

    let fullResponse = '';
    const chunks = [];

    try {
      for await (const chunk of result.stream) {
        const content = chunk.choices?.[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          chunks.push({
            content,
            timestamp: new Date(),
            index: chunks.length
          });

          // 如果提供了回调函数，实时调用
          if (onChunk && typeof onChunk === 'function') {
            await onChunk({
              content,
              fullResponse,
              isComplete: false,
              chunk: chunk,
              chunkIndex: chunks.length - 1
            });
          }
        }

        // 检查是否完成
        if (chunk.choices?.[0]?.finish_reason === 'stop') {
          if (onChunk && typeof onChunk === 'function') {
            await onChunk({
              content: '',
              fullResponse,
              isComplete: true,
              chunk: chunk,
              chunkIndex: chunks.length
            });
          }
          break;
        }
      }

      return {
        success: true,
        response: fullResponse,
        chunks,
        totalChunks: chunks.length,
        isStreaming: true
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        partialResponse: fullResponse,
        chunks
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
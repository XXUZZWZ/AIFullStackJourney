/**
 * AI命令处理器 - 专门处理AI相关的命令和功能
 * @author Mini Claude Code Team
 * @version 3.0.0
 */

const chalk = require('chalk');
const ora = require('ora');

class AICommandHandler {
  /**
   * 初始化AI命令处理器
   * @param {Object} toolManager - 工具管理器实例
   * @param {Object} uiManager - UI管理器实例
   */
  constructor(toolManager, uiManager) {
    this.toolManager = toolManager;
    this.ui = uiManager;
  }

  /**
   * 与AI聊天 - 支持流式和经典模式
   * @param {string} message - 聊天消息
   * @param {boolean} useStreaming - 是否使用流式响应
   * @returns {Promise<void>}
   */
  async chatWithAI(message, useStreaming = true) {
    if (!message.trim()) {
      this.ui.showError('请提供聊天消息');
      return;
    }

    if (useStreaming) {
      await this.chatWithAIStreaming(message);
    } else {
      await this.chatWithAIClassic(message);
    }
  }

  /**
   * 流式AI聊天
   * @param {string} message - 聊天消息
   * @returns {Promise<void>}
   */
  async chatWithAIStreaming(message) {
    this.ui.showAIResponseHeader();
    
    let responseStarted = false;
    let fullResponse = '';
    
    try {
      // 生成包含历史记忆的上下文提示
      const contextPrompt = this.toolManager.memory.generateContextPrompt(
        message, 
        this.toolManager.context.projectInfo
      );
      
      const result = await this.toolManager.ai.chatStream(message, {
        systemPrompt: this._buildSystemPrompt(contextPrompt),
        temperature: 0.7,
        timeout: 45000
      }, async (data) => {
        if (!responseStarted) {
          process.stdout.write(chalk.green(''));
          responseStarted = true;
        }
        
        if (data.content) {
          process.stdout.write(data.content);
          fullResponse = data.fullResponse;
        }
        
        if (data.isComplete) {
          process.stdout.write('\n');
        }
      });

      if (result.success) {
        this.ui.showStreamingStats(result.totalChunks || 0);
        
        // 保存对话到记忆系统
        await this._saveConversation(message, result.response, 'ai_chat_stream');
        
        // 记录聊天历史
        this._recordChatHistory(message, result, 'ai_chat_stream');
      } else {
        this._handleStreamingError(result, responseStarted);
      }
    } catch (error) {
      this.ui.showError(`流式聊天错误: ${error.message}`);
    }
  }

  /**
   * 经典AI聊天
   * @param {string} message - 聊天消息
   * @returns {Promise<void>}
   */
  async chatWithAIClassic(message) {
    const spinner = ora('🤖 AI思考中...').start();
    
    try {
      const result = await this.toolManager.chat(message);
      
      if (result.success) {
        spinner.succeed('收到AI响应');
        this.ui.showAIResponse(result.response);
        
        if (result.usage) {
          this.ui.showTokenUsage(result.usage.total_tokens);
        }
      } else {
        spinner.fail('AI聊天失败');
        this.ui.showError(result.error);
        
        if (result.suggestion) {
          this.ui.showSuggestion(result.suggestion);
        }
      }
    } catch (error) {
      spinner.fail('聊天错误');
      this.ui.showError(error.message);
    }
  }

  /**
   * AI代码生成
   * @param {string} description - 代码描述
   * @returns {Promise<void>}
   */
  async generateWithAI(description) {
    if (!description.trim()) {
      this.ui.showError('请提供代码生成描述');
      return;
    }

    this.ui.showCodeGenerationHeader(description);
    
    let responseStarted = false;
    let fullCode = '';
    
    try {
      const result = await this.toolManager.ai.chatStream(
        this._buildCodeGenerationPrompt(description),
        {
          systemPrompt: this._buildCodeGenerationSystemPrompt(),
          temperature: 0.3,
          maxTokens: 3000
        },
        async (data) => {
          if (!responseStarted) {
            this.ui.showCodeBlockStart();
            responseStarted = true;
          }
          
          if (data.content) {
            process.stdout.write(data.content);
            fullCode = data.fullResponse;
          }
          
          if (data.isComplete) {
            process.stdout.write('\n');
            this.ui.showCodeBlockEnd();
          }
        }
      );

      if (result.success && fullCode.trim()) {
        await this._saveGeneratedCode(fullCode, description);
      } else {
        this.ui.showError(result.error || '未生成代码');
      }
    } catch (error) {
      this.ui.showError(`代码生成错误: ${error.message}`);
    }
  }

  /**
   * AI代码审查
   * @param {string} filePath - 文件路径
   * @returns {Promise<void>}
   */
  async reviewCodeWithAI(filePath) {
    if (!filePath) {
      this.ui.showError('请指定要审查的文件');
      return;
    }

    const spinner = ora(`🔍 AI审查 ${filePath}...`).start();
    
    try {
      // 先读取文件
      const fileResult = await this.toolManager.execute('fs', 'readFile', filePath);
      if (!fileResult.success) {
        spinner.fail('文件读取失败');
        this.ui.showError(fileResult.error);
        return;
      }

      // AI 审查代码
      const result = await this.toolManager.ai.reviewCode(fileResult.content, filePath);
      
      if (result.success) {
        spinner.succeed('代码审查完成');
        this.ui.showCodeReview(result.response);
      } else {
        spinner.fail('代码审查失败');
        this.ui.showError(result.error);
      }
    } catch (error) {
      spinner.fail('审查错误');
      this.ui.showError(error.message);
    }
  }

  /**
   * 处理AI子命令
   * @param {Array} params - 参数数组
   * @returns {Promise<void>}
   */
  async handleAICommand(params) {
    const subCommand = params[0];
    
    switch (subCommand) {
      case 'status':
        this.showAIStatus();
        break;
      case 'review':
        await this.reviewCodeWithAI(params[1]);
        break;
      default:
        this.ui.showError('未知AI命令。可用命令: status, review');
        this.ui.showInfo('用法: ai status | ai review <file>');
    }
  }

  /**
   * 显示AI状态
   */
  showAIStatus() {
    const status = this.toolManager.getAIStatus();
    this.ui.showAIStatus(status);
  }

  /**
   * 构建系统提示词
   * @param {string} contextPrompt - 上下文提示
   * @returns {string}
   */
  _buildSystemPrompt(contextPrompt) {
    return `你是一个专业的编程助手。

${contextPrompt}

请基于以上上下文信息提供有帮助的、专业的回答。如果用户询问过类似问题，请参考历史对话。如果有相关代码片段，可以引用它们。`;
  }

  /**
   * 构建代码生成提示词
   * @param {string} description - 代码描述
   * @returns {string}
   */
  _buildCodeGenerationPrompt(description) {
    const projectContext = this.toolManager.context.projectInfo 
      ? JSON.stringify(this.toolManager.context.projectInfo, null, 2) 
      : '通用项目';

    return `请根据以下描述生成高质量的代码。只返回代码，不要包含解释文字：

${description}

项目上下文：
${projectContext}`;
  }

  /**
   * 构建代码生成系统提示词
   * @returns {string}
   */
  _buildCodeGenerationSystemPrompt() {
    return `你是一个专业的代码生成专家。根据用户需求生成干净、高效、符合最佳实践的代码。
- 包含必要的注释和错误处理
- 遵循代码规范和风格指南  
- 确保代码可以直接使用
- 只返回代码，不要包含markdown格式或解释`;
  }

  /**
   * 保存对话到记忆系统
   * @param {string} message - 用户消息
   * @param {string} response - AI响应
   * @param {string} commandType - 命令类型
   * @returns {Promise<void>}
   */
  async _saveConversation(message, response, commandType) {
    await this.toolManager.memory.addConversation(message, response, {
      projectPath: this.toolManager.context.currentDirectory,
      language: this.toolManager.context.projectInfo?.languages 
        ? Object.keys(this.toolManager.context.projectInfo.languages)[0] 
        : null,
      framework: this.toolManager.context.projectInfo?.frameworks?.length > 0 
        ? this.toolManager.context.projectInfo.frameworks[0].name 
        : null,
      commandType
    });
  }

  /**
   * 记录聊天历史
   * @param {string} message - 用户消息
   * @param {Object} result - AI响应结果
   * @param {string} type - 类型
   */
  _recordChatHistory(message, result, type) {
    this.toolManager.context.session.commands.push({
      input: message,
      type,
      result: true,
      response: result.response,
      timestamp: new Date()
    });
  }

  /**
   * 处理流式响应错误
   * @param {Object} result - 结果对象
   * @param {boolean} responseStarted - 响应是否已开始
   */
  _handleStreamingError(result, responseStarted) {
    if (!responseStarted) {
      this.ui.showError(result.error);
    } else {
      this.ui.showError(`流式响应中断: ${result.error}`);
      if (result.partialResponse) {
        this.ui.showInfo('已接收部分响应');
      }
    }
  }

  /**
   * 保存生成的代码
   * @param {string} code - 生成的代码
   * @param {string} description - 描述
   * @returns {Promise<void>}
   */
  async _saveGeneratedCode(code, description) {
    // 自动保存生成的代码
    const timestamp = Date.now();
    const filePath = `generated_${timestamp}.js`;
    
    const saveResult = await this.toolManager.execute('fs', 'writeFile', filePath, code);
    
    if (saveResult.success) {
      this.ui.showCodeSaved(filePath, code.split('\n').length);
    } else {
      this.ui.showWarning(`无法保存文件: ${saveResult.error}`);
    }
    
    // 保存生成的代码到记忆系统
    const language = this.toolManager.detectLanguageFromCode(code);
    await this.toolManager.memory.addCodeSnippet(
      code, 
      description, 
      language, 
      {
        projectPath: this.toolManager.context.currentDirectory,
        framework: this.toolManager.context.projectInfo?.frameworks?.length > 0 
          ? this.toolManager.context.projectInfo.frameworks[0].name 
          : null,
        fileType: 'generated'
      }
    );
    
    // 记录到历史
    this.toolManager.context.session.commands.push({
      input: description,
      type: 'ai_code_generation',
      result: true,
      filePath: filePath,
      timestamp: new Date()
    });
  }
}

module.exports = AICommandHandler;
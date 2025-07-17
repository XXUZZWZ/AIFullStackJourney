/**
 * 工具管理器 - Mini Claude Code v3 的核心协调模块
 * 
 * 职责:
 * - 🔧 协调所有工具和服务
 * - 🧠 管理AI服务和记忆系统
 * - 📊 维护项目上下文和会话状态
 * - 🔄 处理自然语言到具体操作的转换
 * - ⚡ 提供统一的工具执行接口
 * 
 * @author Mini Claude Code Team
 * @version 3.0.0
 * @since 1.0.0
 */

const FileSystemTool = require('../tools/filesystem');
const CommandTool = require('../tools/command');
const CodeAnalyzer = require('../tools/analyzer');
const DeepSeekAI = require('./deepseek-ai');
const NaturalLanguageProcessor = require('./natural-language-processor');
const CodeGenerator = require('./code-generator');
const ContextMemory = require('./context-memory');
const IntelligentErrorHandler = require('./error-handler');
const AITestGenerator = require('./test-generator');
const AITaskPlanner = require('./task-planner');

/**
 * 工具管理器类 - 系统的中央协调器
 * 
 * 管理和协调所有工具、AI服务、记忆系统等组件，
 * 提供统一的执行接口和上下文管理。
 * 
 * @class ToolManager
 * @example
 * ```javascript
 * const toolManager = new ToolManager();
 * await toolManager.initialize();
 * 
 * // 执行文件操作
 * const result = await toolManager.execute('fs', 'readFile', 'package.json');
 * 
 * // AI聊天
 * const chatResult = await toolManager.chat('Hello, how are you?');
 * 
 * // 自然语言处理
 * const nlpResult = await toolManager.processNaturalLanguage('创建一个React组件');
 * ```
 */
class ToolManager {
  constructor() {
    this.tools = {
      fs: new FileSystemTool(),
      cmd: new CommandTool(),
      analyzer: new CodeAnalyzer(),
      codeGenerator: new CodeGenerator()
    };
    
    // AI 组件
    this.ai = new DeepSeekAI();
    this.nlp = new NaturalLanguageProcessor(this);
    
    // 上下文记忆系统
    this.memory = new ContextMemory();
    
    // 智能错误处理系统
    this.errorHandler = new IntelligentErrorHandler(this);
    
    // AI 测试生成系统
    this.testGenerator = new AITestGenerator(this);
    
    // AI 任务规划系统
    this.taskPlanner = new AITaskPlanner(this);
    
    this.context = {
      currentDirectory: process.cwd(),
      projectInfo: null,
      session: {
        startTime: new Date(),
        commands: [],
        files: [],
        aiEnabled: this.ai.isAvailable()
      }
    };
  }

  /**
   * 初始化工具管理器，分析当前项目
   */
  async initialize(projectPath = null) {
    const workingDir = projectPath || this.context.currentDirectory;
    
    console.log(`🔍 Analyzing project at: ${workingDir}`);
    
    // 分析项目
    const analysis = await this.tools.analyzer.analyzeProject(workingDir);
    if (analysis.success) {
      this.context.projectInfo = analysis.analysis;
      console.log(`✅ Project analysis complete`);
      console.log(`   Languages: ${Object.keys(analysis.analysis.languages).join(', ')}`);
      console.log(`   Frameworks: ${analysis.analysis.frameworks.map(f => f.name).join(', ') || 'None detected'}`);
      console.log(`   Package Manager: ${analysis.analysis.packageManager || 'None'}`);
      
      // 保存项目信息到记忆系统
      await this.memory.updateProjectMemory(workingDir, {
        languages: analysis.analysis.languages,
        frameworks: analysis.analysis.frameworks,
        packageManager: analysis.analysis.packageManager,
        totalFiles: analysis.analysis.totalFiles,
        codeFiles: analysis.analysis.codeFiles,
        structure: analysis.analysis.structure
      });
    } else {
      console.log(`❌ Failed to analyze project: ${analysis.error}`);
    }

    return analysis;
  }

  /**
   * 执行工具命令
   */
  async execute(toolName, method, ...args) {
    if (!this.tools[toolName]) {
      return {
        success: false,
        error: `Tool '${toolName}' not found`
      };
    }

    if (!this.tools[toolName][method]) {
      return {
        success: false,
        error: `Method '${method}' not found in tool '${toolName}'`
      };
    }

    try {
      const startTime = Date.now();
      const result = await this.tools[toolName][method](...args);
      const duration = Date.now() - startTime;

      // 记录到会话历史
      this.context.session.commands.push({
        tool: toolName,
        method,
        args,
        result: result.success,
        duration,
        timestamp: new Date()
      });

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }

  /**
   * 获取项目上下文信息
   */
  getContext() {
    return {
      ...this.context,
      availableTools: Object.keys(this.tools),
      toolMethods: Object.fromEntries(
        Object.entries(this.tools).map(([name, tool]) => [
          name,
          Object.getOwnPropertyNames(Object.getPrototypeOf(tool))
            .filter(method => method !== 'constructor' && !method.startsWith('_'))
        ])
      )
    };
  }

  /**
   * 智能建议下一步操作
   */
  suggestNextActions() {
    const suggestions = [];
    const { projectInfo } = this.context;

    if (!projectInfo) {
      suggestions.push({
        action: 'analyze',
        description: 'Analyze the current project structure',
        command: 'analyze'
      });
      return suggestions;
    }

    // 基于项目类型提供建议
    if (projectInfo.packageManager === 'npm' || projectInfo.packageManager === 'yarn') {
      const hasNodeModules = projectInfo.structure.commonDirs.includes('node_modules');
      if (!hasNodeModules) {
        suggestions.push({
          action: 'install',
          description: 'Install project dependencies',
          command: `${projectInfo.packageManager} install`
        });
      }
    }

    // 检查是否有测试
    if (!projectInfo.structure.hasTests) {
      suggestions.push({
        action: 'create-tests',
        description: 'Create test files for the project',
        command: 'create test structure'
      });
    }

    // 检查是否有文档
    if (!projectInfo.structure.hasDocs) {
      suggestions.push({
        action: 'create-docs',
        description: 'Create documentation for the project',
        command: 'create documentation'
      });
    }

    // 基于框架提供特定建议
    projectInfo.frameworks.forEach(framework => {
      switch (framework.name) {
        case 'react':
          suggestions.push({
            action: 'create-component',
            description: 'Create a new React component',
            command: 'create react component'
          });
          break;
        case 'express':
          suggestions.push({
            action: 'create-route',
            description: 'Create a new Express route',
            command: 'create express route'
          });
          break;
        case 'vite':
          suggestions.push({
            action: 'dev-server',
            description: 'Start the Vite development server',
            command: 'npm run dev'
          });
          break;
      }
    });

    return suggestions.slice(0, 5); // 限制建议数量
  }

  /**
   * 生成项目报告
   */
  generateReport() {
    const { projectInfo, session } = this.context;
    
    const report = {
      summary: {
        projectPath: this.context.currentDirectory,
        analysisTime: session.startTime,
        totalCommands: session.commands.length,
        successRate: session.commands.length > 0 
          ? (session.commands.filter(c => c.result).length / session.commands.length * 100).toFixed(1) + '%'
          : 'N/A'
      },
      project: projectInfo,
      recentCommands: session.commands.slice(-10),
      suggestions: this.suggestNextActions()
    };

    return report;
  }

  /**
   * 处理自然语言输入
   */
  async processNaturalLanguage(input) {
    try {
      const result = await this.nlp.processInput(input, this.context);
      
      // 记录到会话历史
      this.context.session.commands.push({
        input,
        type: 'natural_language',
        result: result.success,
        timestamp: new Date()
      });

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        input
      };
    }
  }

  /**
   * AI 聊天功能 - 带上下文记忆
   */
  async chat(message, options = {}) {
    if (!this.ai.isAvailable()) {
      return {
        success: false,
        error: 'AI service is not available. Please configure DeepSeek API key.',
        suggestion: 'Use "config set-api-key <your-key>" to configure AI features.'
      };
    }

    try {
      // 生成包含历史记忆的上下文提示
      const contextPrompt = this.memory.generateContextPrompt(message, this.context.projectInfo);
      
      const result = await this.ai.chat(message, {
        systemPrompt: `你是一个专业的编程助手。

${contextPrompt}

请基于以上上下文信息提供有帮助的、专业的回答。如果用户询问过类似问题，请参考历史对话。如果有相关代码片段，可以引用它们。`,
        ...options
      });

      // 保存对话到记忆系统
      if (result.success) {
        await this.memory.addConversation(message, result.response, {
          projectPath: this.context.currentDirectory,
          language: this.context.projectInfo?.languages ? Object.keys(this.context.projectInfo.languages)[0] : null,
          framework: this.context.projectInfo?.frameworks?.length > 0 ? this.context.projectInfo.frameworks[0].name : null,
          commandType: 'ai_chat'
        });
      }

      // 记录聊天历史
      this.context.session.commands.push({
        input: message,
        type: 'ai_chat',
        result: result.success,
        timestamp: new Date()
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
   * 智能代码生成 - 带记忆保存
   */
  async generateCodeWithAI(description, options = {}) {
    if (!this.ai.isAvailable()) {
      return {
        success: false,
        error: 'AI service is not available.'
      };
    }

    try {
      const result = await this.ai.generateCode(description, {
        ...this.context.projectInfo,
        ...options
      });

      if (result.success) {
        // 保存生成的代码到记忆系统
        const language = this.detectLanguageFromCode(result.code) || 
                        (this.context.projectInfo?.languages ? Object.keys(this.context.projectInfo.languages)[0] : 'javascript');
        
        await this.memory.addCodeSnippet(
          result.code, 
          description, 
          language, 
          {
            projectPath: this.context.currentDirectory,
            framework: this.context.projectInfo?.frameworks?.length > 0 ? this.context.projectInfo.frameworks[0].name : null,
            fileType: 'generated'
          }
        );

        if (options.saveToFile) {
          const filePath = options.filePath || `generated_${Date.now()}.js`;
          const writeResult = await this.execute('fs', 'writeFile', filePath, result.code);
          
          if (writeResult.success) {
            result.filePath = filePath;
            result.saved = true;
          }
        }
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 配置管理
   */
  async configureAPI(apiKey) {
    try {
      const result = await this.ai.saveApiKey(apiKey);
      if (result.success) {
        this.context.session.aiEnabled = true;
        // 重新初始化 NLP 以使用新的 AI 配置
        this.nlp = new NaturalLanguageProcessor(this);
      }
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取 AI 状态 - 包含记忆统计
   */
  getAIStatus() {
    return {
      available: this.ai.isAvailable(),
      stats: this.ai.getStats(),
      nlpStats: this.nlp.getStats(),
      memoryStats: this.memory.getStats()
    };
  }

  /**
   * 从代码内容检测编程语言
   */
  detectLanguageFromCode(code) {
    if (!code) return null;
    
    // 简单的语言检测逻辑
    if (code.includes('import React') || code.includes('jsx') || code.includes('<div')) return 'javascript';
    if (code.includes('def ') || code.includes('import ') && code.includes('from ')) return 'python';
    if (code.includes('public class') || code.includes('import java')) return 'java';
    if (code.includes('function') || code.includes('const ') || code.includes('let ')) return 'javascript';
    if (code.includes('interface ') || code.includes(': string') || code.includes(': number')) return 'typescript';
    if (code.includes('#include') || code.includes('int main')) return 'cpp';
    
    return 'javascript'; // 默认
  }

  /**
   * 获取记忆系统统计信息
   */
  getMemoryStats() {
    return this.memory.getStats();
  }

  /**
   * 搜索相关的历史对话
   */
  searchConversationHistory(query, maxResults = 5) {
    return this.memory.getRelevantHistory(query, maxResults);
  }

  /**
   * 搜索相关的代码片段
   */
  searchCodeSnippets(query, language = null, maxResults = 3) {
    return this.memory.searchCodeSnippets(query, language, maxResults);
  }

  /**
   * 清理记忆数据
   */
  async cleanupMemory() {
    await this.memory.cleanup();
    return {
      success: true,
      message: 'Memory cleanup completed'
    };
  }

  /**
   * 重置记忆系统
   */
  async resetMemory() {
    await this.memory.resetMemory();
    return {
      success: true,
      message: 'Memory has been reset'
    };
  }

  /**
   * 分析错误并提供修复建议
   */
  async analyzeError(errorMessage, filePath = null) {
    try {
      return await this.errorHandler.analyzeError(errorMessage, filePath, {
        projectInfo: this.context.projectInfo,
        workingDirectory: this.context.currentDirectory
      });
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 自动修复错误
   */
  async autoFixError(filePath, errorAnalysis, options = {}) {
    try {
      const result = await this.errorHandler.autoFix(filePath, errorAnalysis, options);
      
      // 记录修复操作到会话历史
      this.context.session.commands.push({
        tool: 'errorHandler',
        method: 'autoFix',
        filePath,
        result: result.success,
        timestamp: new Date(),
        changes: result.changes || []
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
   * 验证修复结果
   */
  async validateFix(filePath, originalError = null) {
    try {
      return await this.errorHandler.validateFix(filePath, originalError);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 项目错误检查
   */
  async checkProjectErrors(projectPath = null) {
    try {
      const checkPath = projectPath || this.context.currentDirectory;
      return await this.errorHandler.checkProject(checkPath);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取错误处理统计
   */
  getErrorHandlerStats() {
    return this.errorHandler.getStats();
  }

  /**
   * 检测项目的测试框架
   */
  async detectTestFramework(projectPath = null) {
    try {
      const checkPath = projectPath || this.context.currentDirectory;
      return await this.testGenerator.detectTestFramework(checkPath);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 分析代码文件用于测试生成
   */
  async analyzeCodeForTests(filePath) {
    try {
      return await this.testGenerator.analyzeCodeForTests(filePath);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 使用 AI 生成测试代码
   */
  async generateTests(filePath, testType = 'unit', options = {}) {
    try {
      const result = await this.testGenerator.generateTests(filePath, testType, options);
      
      // 记录测试生成操作到会话历史
      this.context.session.commands.push({
        tool: 'testGenerator',
        method: 'generateTests',
        filePath,
        testType,
        result: result.success,
        timestamp: new Date()
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
   * 验证生成的测试
   */
  async validateTests(testFilePath) {
    try {
      return await this.testGenerator.validateTests(testFilePath);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 运行测试
   */
  async runTests(testFilePath = null) {
    try {
      if (testFilePath) {
        return await this.testGenerator.runTests(testFilePath);
      } else {
        // 运行所有测试
        const framework = await this.testGenerator.detectTestFramework();
        const primaryFramework = framework.primary?.name || 'jest';
        return await this.testGenerator.runTests(null, primaryFramework);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 生成测试覆盖率报告
   */
  async generateCoverageReport(testFilePath, sourceFilePath) {
    try {
      return await this.testGenerator.generateCoverageReport(testFilePath, sourceFilePath);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取测试生成系统统计
   */
  getTestGeneratorStats() {
    return this.testGenerator.getStats();
  }

  /**
   * 生成任务计划
   */
  async generateTaskPlan(userInput, options = {}) {
    try {
      const context = {
        projectInfo: this.context.projectInfo,
        workingDirectory: this.context.currentDirectory,
        sessionHistory: this.context.session.commands,
        ...options
      };

      const result = await this.taskPlanner.generateTaskPlan(userInput, context);
      
      // 记录任务规划到会话历史
      this.context.session.commands.push({
        tool: 'taskPlanner',
        method: 'generateTaskPlan',
        input: userInput,
        result: result.success,
        timestamp: new Date()
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
   * 执行任务计划
   */
  async executeTaskPlan(plan = null, options = {}) {
    try {
      const result = await this.taskPlanner.executePlan(plan, options);
      
      // 记录任务执行到会话历史
      this.context.session.commands.push({
        tool: 'taskPlanner',
        method: 'executePlan',
        planId: plan?.id || 'current',
        result: result.success,
        timestamp: new Date(),
        summary: result.summary
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
   * 获取任务执行状态
   */
  getTaskExecutionStatus() {
    return this.taskPlanner.getExecutionStatus();
  }

  /**
   * 控制任务执行
   */
  pauseTaskExecution() {
    return this.taskPlanner.pauseExecution();
  }

  resumeTaskExecution() {
    return this.taskPlanner.resumeExecution();
  }

  stopTaskExecution() {
    return this.taskPlanner.stopExecution();
  }

  /**
   * 获取任务规划系统统计
   */
  getTaskPlannerStats() {
    return this.taskPlanner.getStats();
  }

  /**
   * 重置会话
   */
  resetSession() {
    this.context.session = {
      startTime: new Date(),
      commands: [],
      files: [],
      aiEnabled: this.ai.isAvailable()
    };
  }
}

module.exports = ToolManager;
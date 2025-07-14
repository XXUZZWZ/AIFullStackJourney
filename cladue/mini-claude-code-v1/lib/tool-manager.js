const FileSystemTool = require('../tools/filesystem');
const CommandTool = require('../tools/command');
const CodeAnalyzer = require('../tools/analyzer');
const DeepSeekAI = require('./deepseek-ai');
const NaturalLanguageProcessor = require('./natural-language-processor');
const CodeGenerator = require('./code-generator');

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
   * AI 聊天功能
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
      const result = await this.ai.chat(message, {
        systemPrompt: `你是一个专业的编程助手。当前项目信息：
${this.context.projectInfo ? JSON.stringify(this.context.projectInfo, null, 2) : '暂无项目信息'}

请提供有帮助的、专业的回答。`,
        ...options
      });

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
   * 智能代码生成
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

      if (result.success && options.saveToFile) {
        const filePath = options.filePath || `generated_${Date.now()}.js`;
        const writeResult = await this.execute('fs', 'writeFile', filePath, result.code);
        
        if (writeResult.success) {
          result.filePath = filePath;
          result.saved = true;
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
   * 获取 AI 状态
   */
  getAIStatus() {
    return {
      available: this.ai.isAvailable(),
      stats: this.ai.getStats(),
      nlpStats: this.nlp.getStats()
    };
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
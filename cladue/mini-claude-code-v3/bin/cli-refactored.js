#!/usr/bin/env node

/**
 * Mini Claude Code v3 - 主CLI应用入口
 * 
 * 一个功能完整的AI编程助手，支持:
 * - 🚀 流式AI响应
 * - 🧠 上下文记忆系统  
 * - ⚡ 智能自动补全
 * - 🔧 智能错误处理
 * - 🧪 AI测试生成
 * - 🎯 AI任务规划
 * 
 * @author Mini Claude Code Team
 * @version 3.0.0
 * @license MIT
 */

const { program } = require('commander');
const readline = require('readline');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');

// 导入拆分后的模块
const ToolManager = require('../lib/tool-manager');
const CodeGenerator = require('../lib/code-generator');
const AutoCompletion = require('../lib/auto-completion');
const UIManager = require('../lib/cli/ui-manager');
const CommandHandler = require('../lib/cli/command-handler');
const AICommandHandler = require('../lib/cli/ai-command-handler');
const ConfigManager = require('../lib/cli/config-manager');

/**
 * 主CLI应用类 - 重构后的轻量级版本
 * 职责: 应用初始化、交互模式管理、命令路由
 */
class MiniClaudeCLI {
  /**
   * 初始化CLI应用
   */
  constructor() {
    // 核心组件
    this.toolManager = new ToolManager();
    this.codeGenerator = new CodeGenerator();
    this.configManager = new ConfigManager();
    this.ui = new UIManager();
    
    // 命令处理器
    this.commandHandler = new CommandHandler(this.toolManager, this.codeGenerator, this.ui);
    this.aiCommandHandler = new AICommandHandler(this.toolManager, this.ui);
    
    // 自动补全和交互界面
    this.autoCompletion = null;
    this.isInteractive = false;
    this.rl = null;
  }

  /**
   * 初始化应用
   * @returns {Promise<void>}
   */
  async init() {
    // 显示欢迎信息
    if (this.configManager.get('ui.showWelcome', true)) {
      this.ui.showWelcome();
    }

    // 初始化工具管理器
    const spinner = ora('初始化系统组件...').start();
    try {
      await this.toolManager.initialize();
      
      // 初始化自动补全系统
      if (this.configManager.get('completion.enabled', true)) {
        this.autoCompletion = new AutoCompletion(this.toolManager);
      }
      
      spinner.succeed('系统初始化完成');
    } catch (error) {
      spinner.fail(`初始化失败: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * 启动交互模式
   * @returns {Promise<void>}
   */
  async startInteractiveMode() {
    this.isInteractive = true;
    this.ui.showReady();

    // 创建readline接口
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: this._getPrompt(),
      completer: this.autoCompletion ? this.completer.bind(this) : undefined,
      history: this._getCommandHistory()
    });

    // 设置事件监听器
    this._setupReadlineEvents();

    // 显示提示符
    this.rl.prompt();
  }

  /**
   * 获取命令提示符
   * @returns {string} 提示符字符串
   * @private
   */
  _getPrompt() {
    const projectName = this.toolManager.context.projectInfo?.packageManager 
      ? path.basename(this.toolManager.context.currentDirectory)
      : 'mini-claude';
    return chalk.cyan(`${projectName}> `);
  }

  /**
   * 设置readline事件监听器
   * @private
   */
  _setupReadlineEvents() {
    this.rl.on('line', async (input) => {
      const command = input.trim();
      
      if (!command) {
        this.rl.prompt();
        return;
      }

      try {
        await this._handleCommand(command);
      } catch (error) {
        this.ui.showError(`执行错误: ${error.message}`);
      }

      if (this.isInteractive) {
        console.log(); // 添加空行
        this.rl.prompt();
      }
    });

    this.rl.on('close', () => {
      this._exit();
    });

    this.rl.on('SIGINT', () => {
      console.log(chalk.yellow('\n👋 使用 "exit" 退出或再次按 Ctrl+C 强制退出'));
      this.rl.prompt();
    });
  }

  /**
   * Tab补全功能
   * @param {string} line - 当前输入行
   * @returns {Array} 补全结果
   */
  completer(line) {
    if (!this.autoCompletion) {
      return [[], line];
    }

    try {
      const completions = this.autoCompletion.getCommandCompletions(line);
      
      // 提取补全文本
      const hits = completions.map(comp => comp.text);
      
      // 如果只有一个匹配，直接返回
      if (hits.length === 1) {
        return [hits, line];
      }
      
      // 多个匹配时，显示所有选项
      if (hits.length > 1) {
        this._showCompletions(completions);
      }
      
      return [hits, line];
    } catch (error) {
      console.warn('补全错误:', error.message);
      return [[], line];
    }
  }

  /**
   * 显示补全选项
   * @param {Array} completions - 补全列表
   * @private
   */
  _showCompletions(completions) {
    console.log(); // 换行
    console.log(chalk.blue('📋 可用补全:'));
    
    completions.slice(0, 10).forEach((comp, index) => {
      const icon = this._getCompletionIcon(comp.type);
      const description = comp.description ? chalk.gray(` - ${comp.description}`) : '';
      console.log(`  ${icon} ${chalk.green(comp.display)}${description}`);
    });
    
    if (completions.length > 10) {
      console.log(chalk.gray(`  ... 还有 ${completions.length - 10} 个选项`));
    }
    
    console.log(); // 添加空行
    this.rl.prompt();
  }

  /**
   * 获取补全项图标
   * @param {string} type - 补全类型
   * @returns {string} 图标
   * @private
   */
  _getCompletionIcon(type) {
    const icons = {
      'command': '⚡',
      'file': '📄',
      'directory': '📁',
      'file-type': '🏗️',
      'filename': '📝'
    };
    return icons[type] || '•';
  }

  /**
   * 获取命令历史
   * @returns {Array} 命令历史数组
   * @private
   */
  _getCommandHistory() {
    const maxHistory = this.configManager.get('completion.maxHistory', 50);
    return this.toolManager.context.session.commands
      .filter(cmd => cmd.input && typeof cmd.input === 'string')
      .map(cmd => cmd.input)
      .slice(-maxHistory);
  }

  /**
   * 处理用户命令
   * @param {string} input - 用户输入
   * @returns {Promise<void>}
   * @private
   */
  async _handleCommand(input) {
    const args = input.split(' ');
    const command = args[0].toLowerCase();
    const params = args.slice(1);

    // 基础命令路由
    switch (command) {
      case 'help':
        this.ui.showHelp();
        break;
      case 'exit':
      case 'quit':
        this._exit();
        break;
        
      // 文件操作命令
      case 'analyze':
        await this.commandHandler.analyzeProject(params[0]);
        break;
      case 'read':
        await this.commandHandler.readFile(params[0]);
        break;
      case 'write':
        await this.commandHandler.writeFile(params[0], params.slice(1).join(' '));
        break;
      case 'edit':
        await this.commandHandler.editFile(params[0], params[1], params.slice(2).join(' '));
        break;
      case 'search':
        await this.commandHandler.searchInFiles(params[0], params[1]);
        break;
      case 'run':
        await this.commandHandler.runCommand(params.join(' '));
        break;
      case 'create':
        await this.commandHandler.createFile(params[0], params[1]);
        break;
      case 'list':
        await this.commandHandler.listFiles(params[0]);
        break;
        
      // 系统状态命令
      case 'status':
        this.commandHandler.showStatus();
        break;
      case 'suggest':
        this.commandHandler.showSuggestions();
        break;
      case 'report':
        this.commandHandler.showReport();
        break;
      case 'completion':
        this.commandHandler.showCompletionStatus(this.autoCompletion);
        break;
        
      // 错误处理命令
      case 'fix':
        await this._handleErrorFix(params);
        break;
      case 'check':
        await this._checkErrors(params[0]);
        break;
        
      // 测试命令
      case 'test':
        await this._handleTestCommand(params);
        break;
        
      // 任务规划命令
      case 'plan':
        await this._handlePlanCommand(params);
        break;
        
      // AI命令
      case 'chat':
        await this.aiCommandHandler.chatWithAI(params.join(' '));
        break;
      case 'ai':
        await this.aiCommandHandler.handleAICommand(params);
        break;
      case 'generate':
        await this.aiCommandHandler.generateWithAI(params.join(' '));
        break;
        
      // 配置命令
      case 'config':
        await this._handleConfig(params);
        break;
        
      // 默认: 自然语言处理
      default:
        if (input.length > 0) {
          await this._processNaturalLanguage(input);
        }
        break;
    }
  }

  /**
   * 处理错误修复命令
   * @param {Array} params - 参数数组
   * @returns {Promise<void>}
   * @private
   */
  async _handleErrorFix(params) {
    // 复用原有的错误处理逻辑，但使用UI管理器显示
    const filePath = params[0];
    const errorMessage = params.slice(1).join(' ');

    if (!filePath) {
      this.ui.showError('请指定要分析/修复的文件');
      this.ui.showInfo('用法: fix <file> [error_message]');
      return;
    }

    const spinner = ora(`🔍 分析 ${filePath} 中的错误...`).start();

    try {
      let analysis;
      
      if (errorMessage) {
        analysis = await this.toolManager.analyzeError(errorMessage, filePath);
      } else {
        const validation = await this.toolManager.validateFix(filePath);
        if (validation.success) {
          spinner.succeed('文件中未发现错误');
          this.ui.showSuccess(`${filePath} 看起来没有错误`);
          return;
        } else if (validation.stillHasErrors) {
          analysis = await this.toolManager.analyzeError(validation.error, filePath);
        } else {
          spinner.fail('无法验证文件');
          this.ui.showError(validation.error);
          return;
        }
      }

      if (!analysis.success) {
        spinner.fail('错误分析失败');
        this.ui.showError(analysis.error);
        return;
      }

      spinner.succeed('错误分析完成');
      this._displayErrorAnalysis(analysis.analysis);

      // 询问是否自动修复
      if (analysis.analysis.autoFixable) {
        console.log(chalk.yellow('\n🤔 此错误似乎可以自动修复'));
        
        const fixSpinner = ora('🔧 尝试自动修复...').start();
        const fixResult = await this.toolManager.autoFixError(filePath, analysis.analysis);
        
        if (fixResult.success) {
          fixSpinner.succeed('自动修复完成');
          this.ui.showSuccess(fixResult.message);
          
          if (fixResult.changes) {
            console.log(chalk.blue('\n📝 已做出的更改:'));
            fixResult.changes.forEach(change => {
              console.log(`   • ${change}`);
            });
          }
        } else {
          fixSpinner.fail('自动修复失败');
          this.ui.showError(fixResult.error);
        }
      }

    } catch (error) {
      spinner.fail('错误处理失败');
      this.ui.showError(error.message);
    }
  }

  /**
   * 显示错误分析结果
   * @param {Object} errorAnalysis - 错误分析结果
   * @private
   */
  _displayErrorAnalysis(errorAnalysis) {
    console.log(chalk.blue('\n📋 错误分析:'));
    console.log(`🔍 错误类型: ${errorAnalysis.detectedType || '未知'}`);
    console.log(`⚠️  严重程度: ${errorAnalysis.severity}`);
    console.log(`🔧 可自动修复: ${errorAnalysis.autoFixable ? '是' : '否'}`);

    if (errorAnalysis.suggestions.length > 0) {
      console.log(chalk.blue('\n💡 修复建议:'));
      errorAnalysis.suggestions.forEach((suggestion, index) => {
        console.log(`   ${index + 1}. ${suggestion}`);
      });
    }

    if (errorAnalysis.aiAnalysis) {
      console.log(chalk.blue('\n🤖 AI分析:'));
      console.log(`   根本原因: ${errorAnalysis.aiAnalysis.rootCause}`);
      if (errorAnalysis.aiAnalysis.codeExample) {
        console.log(chalk.blue('\n📝 代码示例:'));
        console.log(chalk.gray(errorAnalysis.aiAnalysis.codeExample));
      }
    }
  }

  /**
   * 检查项目错误
   * @param {string} projectPath - 项目路径
   * @returns {Promise<void>}
   * @private
   */
  async _checkErrors(projectPath) {
    const checkPath = projectPath || '.';
    const spinner = ora(`🔍 检查 ${checkPath} 中的错误...`).start();

    try {
      const result = await this.toolManager.checkProjectErrors(checkPath);

      if (!result.success) {
        spinner.fail('错误检查失败');
        this.ui.showError(result.error);
        return;
      }

      spinner.succeed('错误检查完成');

      console.log(chalk.blue('\n📊 错误检查结果:'));
      console.log(`📁 扫描文件: ${result.totalFiles}`);
      console.log(`❌ 有错误的文件: ${result.errorFiles}`);

      if (result.errorFiles === 0) {
        this.ui.showSuccess('🎉 项目中未发现错误！');
        return;
      }

      console.log(chalk.blue('\n📋 发现的错误:'));
      result.results.forEach((fileResult, index) => {
        console.log(`\n${index + 1}. ${chalk.yellow(fileResult.file)}`);
        console.log(`   错误: ${fileResult.error.substring(0, 100)}...`);
        
        if (fileResult.analysis) {
          console.log(`   类型: ${fileResult.analysis.detectedType || '未知'}`);
          console.log(`   严重程度: ${fileResult.analysis.severity}`);
          console.log(`   可自动修复: ${fileResult.analysis.autoFixable ? '是' : '否'}`);
        }
      });

      // 统计可自动修复的错误
      const autoFixableCount = result.results.filter(r => 
        r.analysis && r.analysis.autoFixable
      ).length;

      if (autoFixableCount > 0) {
        this.ui.showSuccess(`\n🔧 ${autoFixableCount} 个错误可以自动修复`);
        this.ui.showInfo('使用 "fix <file>" 修复单个文件');
      }

    } catch (error) {
      spinner.fail('错误检查失败');
      this.ui.showError(error.message);
    }
  }

  /**
   * 处理测试命令
   * @param {Array} params - 参数数组
   * @returns {Promise<void>}
   * @private
   */
  async _handleTestCommand(params) {
    // 简化的测试命令处理，委托给工具管理器
    const subCommand = params[0];
    
    // 这里可以添加更详细的测试命令处理逻辑
    // 现在先显示基本信息
    this.ui.showInfo(`测试命令: ${subCommand || '未指定'}`);
    this.ui.showInfo('测试功能正在开发中...');
  }

  /**
   * 处理任务规划命令
   * @param {Array} params - 参数数组
   * @returns {Promise<void>}
   * @private
   */
  async _handlePlanCommand(params) {
    // 简化的任务规划命令处理
    const subCommand = params[0];
    
    this.ui.showInfo(`任务规划命令: ${subCommand || '未指定'}`);
    this.ui.showInfo('任务规划功能正在开发中...');
  }

  /**
   * 处理配置命令
   * @param {Array} params - 参数数组
   * @returns {Promise<void>}
   * @private
   */
  async _handleConfig(params) {
    const subCommand = params[0];
    
    switch (subCommand) {
      case 'set-api-key':
        await this._setApiKey(params[1]);
        break;
      case 'show':
        this._showConfig();
        break;
      case 'reset':
        this._resetConfig();
        break;
      default:
        this.ui.showError('未知配置命令。可用命令: set-api-key, show, reset');
        this.ui.showInfo('用法: config set-api-key <key> | config show | config reset');
    }
  }

  /**
   * 设置API密钥
   * @param {string} apiKey - API密钥
   * @returns {Promise<void>}
   * @private
   */
  async _setApiKey(apiKey) {
    if (!apiKey) {
      this.ui.showError('请提供API密钥');
      return;
    }

    const spinner = ora('💾 保存API密钥...').start();
    
    try {
      const result = await this.toolManager.configureAPI(apiKey);
      
      if (result.success) {
        spinner.succeed('API密钥配置成功');
        this.ui.showSuccess('✅ DeepSeek AI现在可用！');
        
        // 同时保存到配置管理器
        this.configManager.set('ai.apiKey', apiKey);
        await this.configManager.saveConfig();
      } else {
        spinner.fail('保存API密钥失败');
        this.ui.showError(result.error);
      }
    } catch (error) {
      spinner.fail('配置错误');
      this.ui.showError(error.message);
    }
  }

  /**
   * 显示配置信息
   * @private
   */
  _showConfig() {
    const summary = this.configManager.getSummary();
    
    console.log(chalk.blue('\n⚙️  当前配置:\n'));
    console.log(`AI服务: ${summary.ai.configured ? chalk.green('已配置') : chalk.red('未配置')}`);
    console.log(`模型: ${summary.ai.model}`);
    console.log(`流式响应: ${summary.ai.streaming ? chalk.green('启用') : chalk.red('禁用')}`);
    console.log(`主题: ${summary.ui.theme}`);
    console.log(`详细输出: ${summary.ui.verbose ? chalk.green('启用') : chalk.red('禁用')}`);
    console.log(`缓存: ${summary.performance.cacheEnabled ? chalk.green('启用') : chalk.red('禁用')}`);
    console.log('');
  }

  /**
   * 重置配置
   * @private
   */
  _resetConfig() {
    this.configManager.reset();
    this.ui.showSuccess('配置已重置为默认值');
  }

  /**
   * 处理自然语言输入
   * @param {string} input - 用户输入
   * @returns {Promise<void>}
   * @private
   */
  async _processNaturalLanguage(input) {
    console.log(chalk.cyan(`🤔 处理: "${input}"`));
    
    try {
      const result = await this.toolManager.processNaturalLanguage(input);
      
      if (result.success) {
        if (result.response) {
          if (!result.isStreaming) {
            this.ui.showAIResponse(result.response);
          }
        } else if (result.message) {
          this.ui.showSuccess(result.message);
        } else {
          this.ui.showSuccess('命令执行成功');
        }
        
        if (result.filePath) {
          this.ui.showInfo(`📄 文件: ${result.filePath}`);
        }
      } else {
        this.ui.showError(result.error);
        
        if (result.suggestion) {
          this.ui.showSuggestion(result.suggestion);
        }
      }
    } catch (error) {
      this.ui.showError(`错误: ${error.message}`);
    }
  }

  /**
   * 退出应用
   * @private
   */
  _exit() {
    this.ui.showGoodbye();
    this.isInteractive = false;
    
    if (this.rl) {
      this.rl.close();
    }
    
    process.exit(0);
  }
}

// CLI程序设置
program
  .name('mini-claude')
  .description('Mini Claude Code v3 - 智能编程助手')
  .version('3.0.0');

program
  .command('interactive')
  .alias('i')
  .description('启动交互模式')
  .action(async () => {
    const cli = new MiniClaudeCLI();
    await cli.init();
    await cli.startInteractiveMode();
  });

program
  .command('analyze [path]')
  .description('分析项目结构')
  .action(async (projectPath) => {
    const cli = new MiniClaudeCLI();
    await cli.init();
    await cli.commandHandler.analyzeProject(projectPath);
  });

program
  .command('run <command>')
  .description('执行shell命令')
  .action(async (command) => {
    const cli = new MiniClaudeCLI();
    await cli.init();
    await cli.commandHandler.runCommand(command);
  });

// 默认启动交互模式
if (process.argv.length === 2) {
  process.argv.push('interactive');
}

program.parse();

module.exports = MiniClaudeCLI;
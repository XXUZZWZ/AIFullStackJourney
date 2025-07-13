#!/usr/bin/env node

const { program } = require('commander');
const readline = require('readline');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');

const ToolManager = require('../lib/tool-manager');
const CodeGenerator = require('../lib/code-generator');
const AutoCompletion = require('../lib/auto-completion');

class MiniClaudeCLI {
  constructor() {
    this.toolManager = new ToolManager();
    this.codeGenerator = new CodeGenerator();
    this.autoCompletion = null;
    this.isInteractive = false;
    this.rl = null;
  }

  async init() {
    console.log(chalk.blue.bold('🤖 Mini Claude Code'));
    console.log(chalk.gray('A simplified AI coding assistant\n'));

    // 初始化工具管理器
    const spinner = ora('Initializing...').start();
    try {
      await this.toolManager.initialize();
      
      // 初始化自动补全系统
      this.autoCompletion = new AutoCompletion(this.toolManager);
      
      spinner.succeed('Ready to assist!');
    } catch (error) {
      spinner.fail(`Initialization failed: ${error.message}`);
      process.exit(1);
    }
  }

  async startInteractiveMode() {
    this.isInteractive = true;
    console.log(chalk.green('🚀 Interactive mode started. Type "help" for commands or "exit" to quit.'));
    console.log(chalk.gray('💡 Use Tab key for auto-completion\n'));

    // 创建 readline 接口
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.cyan('mini-claude> '),
      completer: this.completer.bind(this),
      history: this.getCommandHistory()
    });

    // 设置 readline 事件监听器
    this.setupReadlineEvents();

    // 显示提示符
    this.rl.prompt();
  }

  /**
   * 设置 readline 事件监听器
   */
  setupReadlineEvents() {
    this.rl.on('line', async (input) => {
      const command = input.trim();
      
      if (!command) {
        this.rl.prompt();
        return;
      }

      try {
        await this.handleCommand(command);
      } catch (error) {
        console.error(chalk.red(`Error: ${error.message}`));
      }

      if (this.isInteractive) {
        console.log(); // 添加空行
        this.rl.prompt();
      }
    });

    this.rl.on('close', () => {
      this.exit();
    });

    this.rl.on('SIGINT', () => {
      console.log(chalk.yellow('\n👋 Use "exit" to quit or Ctrl+C again to force quit'));
      this.rl.prompt();
    });

    // 处理 Tab 键补全的特殊情况
    this.rl.on('completer', (line) => {
      this.showIntelligentSuggestions(line);
    });
  }

  /**
   * Tab 补全函数
   */
  completer(line) {
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
        console.log(); // 换行
        console.log(chalk.blue('📋 Available completions:'));
        
        completions.forEach((comp, index) => {
          const icon = this.getCompletionIcon(comp.type);
          const description = comp.description ? chalk.gray(` - ${comp.description}`) : '';
          console.log(`  ${icon} ${chalk.green(comp.display)}${description}`);
        });
        
        console.log(); // 添加空行
        this.rl.prompt();
      }
      
      return [hits, line];
    } catch (error) {
      console.warn('Completion error:', error.message);
      return [[], line];
    }
  }

  /**
   * 获取补全项图标
   */
  getCompletionIcon(type) {
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
   * 显示智能建议
   */
  showIntelligentSuggestions(line) {
    if (!line.trim()) {
      const suggestions = this.autoCompletion.getSmartSuggestions();
      if (suggestions.length > 0) {
        console.log();
        console.log(chalk.blue('💡 Smart suggestions:'));
        suggestions.forEach((suggestion, index) => {
          console.log(`  ${index + 1}. ${chalk.green(suggestion.command)} - ${chalk.gray(suggestion.description)}`);
        });
        console.log();
      }
    }
  }

  /**
   * 获取命令历史
   */
  getCommandHistory() {
    return this.toolManager.context.session.commands
      .filter(cmd => cmd.input && typeof cmd.input === 'string')
      .map(cmd => cmd.input)
      .slice(-50); // 最近50个命令
  }

  async handleCommand(input) {
    const args = input.split(' ');
    const command = args[0].toLowerCase();
    const params = args.slice(1);

    switch (command) {
      case 'help':
        this.showHelp();
        break;
      case 'exit':
      case 'quit':
        this.exit();
        break;
      case 'analyze':
        await this.analyzeProject(params[0]);
        break;
      case 'read':
        await this.readFile(params[0]);
        break;
      case 'write':
        await this.writeFile(params[0], params.slice(1).join(' '));
        break;
      case 'edit':
        await this.editFile(params[0], params[1], params.slice(2).join(' '));
        break;
      case 'search':
        await this.searchInFiles(params[0], params[1]);
        break;
      case 'run':
        await this.runCommand(params.join(' '));
        break;
      case 'create':
        await this.createFile(params[0], params[1]);
        break;
      case 'list':
        await this.listFiles(params[0] || '.');
        break;
      case 'status':
        this.showStatus();
        break;
      case 'suggest':
        this.showSuggestions();
        break;
      case 'report':
        this.showReport();
        break;
      case 'completion':
        this.showCompletionStatus();
        break;
      case 'fix':
        await this.handleErrorFix(params);
        break;
      case 'check':
        await this.checkErrors(params[0]);
        break;
      case 'test':
        await this.handleTestCommand(params);
        break;
      case 'plan':
        await this.handlePlanCommand(params);
        break;
      case 'chat':
        await this.chatWithAI(params.join(' '));
        break;
      case 'ai':
        await this.handleAICommand(params);
        break;
      case 'config':
        await this.handleConfig(params);
        break;
      case 'generate':
        await this.generateWithAI(params.join(' '));
        break;
      default:
        if (input.length > 0) {
          await this.processNaturalLanguage(input);
        }
        break;
    }
  }

  showHelp() {
    console.log(chalk.yellow('\n📖 Available Commands:\n'));
    
    const commands = [
      ['help', 'Show this help message'],
      ['analyze [path]', 'Analyze project structure'],
      ['read <file>', 'Read file contents'],
      ['write <file> <content>', 'Write content to file'],
      ['edit <file> <old> <new>', 'Edit file by replacing text'],
      ['search <term> [path]', 'Search for text in files'],
      ['run <command>', 'Execute shell command'],
      ['create <type> <name>', 'Create new file/component'],
      ['list [path]', 'List files in directory'],
      ['status', 'Show current project status'],
      ['completion', 'Show auto-completion statistics'],
      ['suggest', 'Get suggestions for next actions'],
      ['report', 'Generate project report'],
      ['', ''],
      [chalk.red('🔧 Error Handling:'), ''],
      ['fix <file> [error]', 'Analyze and fix errors in file'],
      ['check [path]', 'Check project for errors'],
      ['', ''],
      [chalk.blue('🧪 Test Generation:'), ''],
      ['test generate <file> [type]', 'Generate tests for a file'],
      ['test run [file]', 'Run tests'],
      ['test analyze <file>', 'Analyze code for testing'],
      ['test framework', 'Detect test framework'],
      ['test coverage <test> <source>', 'Generate coverage report'],
      ['', ''],
      [chalk.blue('🎯 Task Planning:'), ''],
      ['plan create "<description>"', 'Generate task plan from description'],
      ['plan execute [plan]', 'Execute current or specified plan'],
      ['plan status', 'Show execution status'],
      ['plan pause', 'Pause current execution'],
      ['plan resume', 'Resume paused execution'],
      ['plan stop', 'Stop current execution'],
      ['', ''],
      [chalk.blue('🤖 AI Commands:'), ''],
      ['chat <message>', 'Chat with AI assistant'],
      ['generate <description>', 'Generate code with AI'],
      ['ai status', 'Show AI service status'],
      ['ai review <file>', 'AI code review'],
      ['config set-api-key <key>', 'Set DeepSeek API key'],
      ['config show', 'Show current configuration'],
      ['', ''],
      [chalk.blue('🔧 Auto-Completion Features:'), ''],
      ['Tab', 'Auto-complete commands and file paths'],
      ['Tab Tab', 'Show all available completions'],
      ['Up/Down arrows', 'Browse command history'],
      ['', ''],
      ['exit', 'Exit the program']
    ];

    commands.forEach(([cmd, desc]) => {
      if (cmd === '') {
        console.log('');
      } else if (cmd.includes('🤖')) {
        console.log(`${cmd}`);
      } else {
        console.log(`  ${chalk.cyan(cmd.padEnd(25))} ${chalk.gray(desc)}`);
      }
    });

    console.log(chalk.yellow('\n💡 You can also describe what you want in natural language!\n'));
    console.log(chalk.green('Examples:'));
    console.log(chalk.gray('  "创建一个React组件叫做Header"'));
    console.log(chalk.gray('  "搜索所有包含TODO的文件"'));
    console.log(chalk.gray('  "运行npm install"'));
    console.log(chalk.gray('  "Show me the package.json file"'));
    console.log(chalk.gray('  "Generate a login form component"\n'));
  }

  async analyzeProject(projectPath) {
    const spinner = ora('Analyzing project...').start();
    
    try {
      const result = await this.toolManager.initialize(projectPath);
      if (result.success) {
        spinner.succeed('Project analysis complete');
        this.displayProjectInfo(result.analysis);
      } else {
        spinner.fail(`Analysis failed: ${result.error}`);
      }
    } catch (error) {
      spinner.fail(`Analysis error: ${error.message}`);
    }
  }

  async readFile(filePath) {
    if (!filePath) {
      console.log(chalk.red('❌ Please specify a file path'));
      return;
    }

    const spinner = ora(`Reading ${filePath}...`).start();
    
    try {
      const result = await this.toolManager.execute('fs', 'readFile', filePath);
      if (result.success) {
        spinner.succeed(`File read successfully (${result.lines} lines, ${result.size} bytes)`);
        console.log(chalk.gray('\\n--- File Content ---'));
        console.log(result.content);
        console.log(chalk.gray('--- End of File ---\\n'));
      } else {
        spinner.fail(`Failed to read file: ${result.error}`);
      }
    } catch (error) {
      spinner.fail(`Read error: ${error.message}`);
    }
  }

  async writeFile(filePath, content) {
    if (!filePath || !content) {
      console.log(chalk.red('❌ Please specify both file path and content'));
      return;
    }

    const spinner = ora(`Writing to ${filePath}...`).start();
    
    try {
      const result = await this.toolManager.execute('fs', 'writeFile', filePath, content);
      if (result.success) {
        spinner.succeed(`File written successfully: ${filePath}`);
      } else {
        spinner.fail(`Failed to write file: ${result.error}`);
      }
    } catch (error) {
      spinner.fail(`Write error: ${error.message}`);
    }
  }

  async editFile(filePath, oldText, newText) {
    if (!filePath || !oldText || !newText) {
      console.log(chalk.red('❌ Please specify file path, old text, and new text'));
      return;
    }

    const spinner = ora(`Editing ${filePath}...`).start();
    
    try {
      const result = await this.toolManager.execute('fs', 'editFile', filePath, oldText, newText);
      if (result.success) {
        spinner.succeed(`File edited successfully: ${filePath}`);
      } else {
        spinner.fail(`Failed to edit file: ${result.error}`);
      }
    } catch (error) {
      spinner.fail(`Edit error: ${error.message}`);
    }
  }

  async searchInFiles(searchTerm, searchPath = '.') {
    if (!searchTerm) {
      console.log(chalk.red('❌ Please specify a search term'));
      return;
    }

    const spinner = ora(`Searching for "${searchTerm}"...`).start();
    
    try {
      const result = await this.toolManager.execute('fs', 'searchInFiles', searchPath, searchTerm);
      if (result.success) {
        const totalMatches = result.results.reduce((sum, file) => sum + file.matches.length, 0);
        spinner.succeed(`Found ${totalMatches} matches in ${result.results.length} files`);
        
        result.results.forEach(file => {
          console.log(chalk.blue(`\\n📄 ${file.file}:`));
          file.matches.slice(0, 3).forEach(match => { // Show max 3 matches per file
            console.log(`  ${chalk.yellow(`Line ${match.line}:`)} ${match.content}`);
          });
          if (file.matches.length > 3) {
            console.log(chalk.gray(`  ... and ${file.matches.length - 3} more matches`));
          }
        });
      } else {
        spinner.fail(`Search failed: ${result.error}`);
      }
    } catch (error) {
      spinner.fail(`Search error: ${error.message}`);
    }
  }

  async runCommand(command) {
    if (!command) {
      console.log(chalk.red('❌ Please specify a command to run'));
      return;
    }

    const spinner = ora(`Running: ${command}`).start();
    
    try {
      const result = await this.toolManager.execute('cmd', 'run', command);
      if (result.success) {
        spinner.succeed(`Command completed`);
        if (result.stdout) {
          console.log(chalk.green('📤 Output:'));
          console.log(result.stdout);
        }
        if (result.stderr) {
          console.log(chalk.yellow('⚠️  Warnings:'));
          console.log(result.stderr);
        }
      } else {
        spinner.fail(`Command failed: ${result.error}`);
        if (result.stderr) {
          console.log(chalk.red('📥 Error output:'));
          console.log(result.stderr);
        }
      }
    } catch (error) {
      spinner.fail(`Command error: ${error.message}`);
    }
  }

  async createFile(fileType, fileName) {
    if (!fileType || !fileName) {
      console.log(chalk.red('❌ Please specify file type and name'));
      console.log(chalk.gray('Example: create component MyComponent'));
      return;
    }

    const spinner = ora(`Creating ${fileType}: ${fileName}...`).start();
    
    try {
      const result = await this.codeGenerator.generateFile(fileType, fileName, this.toolManager.context.projectInfo);
      if (result.success) {
        // Write the generated file
        const writeResult = await this.toolManager.execute('fs', 'writeFile', result.filePath, result.content);
        if (writeResult.success) {
          spinner.succeed(`Created ${fileType}: ${result.filePath}`);
        } else {
          spinner.fail(`Failed to write file: ${writeResult.error}`);
        }
      } else {
        spinner.fail(`Failed to generate ${fileType}: ${result.error}`);
      }
    } catch (error) {
      spinner.fail(`Creation error: ${error.message}`);
    }
  }

  async listFiles(dirPath) {
    const spinner = ora(`Listing files in ${dirPath}...`).start();
    
    try {
      const result = await this.toolManager.execute('fs', 'listFiles', dirPath);
      if (result.success) {
        spinner.succeed(`Found ${result.files.length} items`);
        
        result.files.forEach(file => {
          const icon = file.isDirectory ? '📁' : '📄';
          const size = file.isDirectory ? '' : ` (${file.size} bytes)`;
          console.log(`  ${icon} ${file.name}${size}`);
        });
      } else {
        spinner.fail(`Failed to list files: ${result.error}`);
      }
    } catch (error) {
      spinner.fail(`List error: ${error.message}`);
    }
  }

  showStatus() {
    const context = this.toolManager.getContext();
    console.log(chalk.blue('\\n📊 Current Status:\\n'));
    
    console.log(`🗂️  Working Directory: ${context.currentDirectory}`);
    console.log(`⏰ Session Started: ${context.session.startTime.toLocaleString()}`);
    console.log(`🔧 Commands Executed: ${context.session.commands.length}`);
    
    if (context.projectInfo) {
      console.log(`\\n📦 Project Info:`);
      console.log(`   Languages: ${Object.keys(context.projectInfo.languages).join(', ') || 'None'}`);
      console.log(`   Frameworks: ${context.projectInfo.frameworks.map(f => f.name).join(', ') || 'None'}`);
      console.log(`   Package Manager: ${context.projectInfo.packageManager || 'None'}`);
      console.log(`   Total Files: ${context.projectInfo.totalFiles}`);
      console.log(`   Code Files: ${context.projectInfo.codeFiles}`);
    }
    
    console.log('');
  }

  showSuggestions() {
    const suggestions = this.toolManager.suggestNextActions();
    
    if (suggestions.length === 0) {
      console.log(chalk.yellow('💡 No specific suggestions at the moment. Try analyzing the project first!'));
      return;
    }

    console.log(chalk.blue('\\n💡 Suggested Actions:\\n'));
    
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${chalk.green(suggestion.action)}: ${suggestion.description}`);
      console.log(`   ${chalk.gray('Command:')} ${chalk.cyan(suggestion.command)}`);
      console.log('');
    });
  }

  showReport() {
    const report = this.toolManager.generateReport();
    
    console.log(chalk.blue('\\n📋 Project Report\\n'));
    console.log(chalk.yellow('Summary:'));
    Object.entries(report.summary).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    if (report.project) {
      console.log(chalk.yellow('\\nProject Details:'));
      console.log(`  Languages: ${Object.entries(report.project.languages).map(([lang, count]) => `${lang} (${count})`).join(', ')}`);
      console.log(`  Frameworks: ${report.project.frameworks.map(f => `${f.name} (${(f.confidence * 100).toFixed(0)}%)`).join(', ')}`);
    }
    
    if (report.recentCommands.length > 0) {
      console.log(chalk.yellow('\\nRecent Commands:'));
      report.recentCommands.slice(-5).forEach(cmd => {
        const status = cmd.result ? '✅' : '❌';
        console.log(`  ${status} ${cmd.tool}.${cmd.method} (${cmd.duration}ms)`);
      });
    }
    
    console.log('');
  }

  async processNaturalLanguage(input) {
    console.log(chalk.cyan(`🤔 Processing: "${input}"`));
    
    try {
      const result = await this.toolManager.processNaturalLanguage(input);
      
      if (result.success) {
        if (result.response) {
          // 如果是 AI 响应，使用流式显示已经在处理过程中完成了
          if (!result.isStreaming) {
            console.log(chalk.blue('\n🤖 AI Response:'));
            console.log(result.response);
          }
        } else if (result.message) {
          console.log(chalk.green(`✅ ${result.message}`));
        } else {
          console.log(chalk.green('✅ Command executed successfully'));
        }
        
        if (result.filePath) {
          console.log(chalk.gray(`📄 File: ${result.filePath}`));
        }
      } else {
        console.log(chalk.red(`❌ ${result.error}`));
        
        if (result.suggestion) {
          console.log(chalk.yellow(`💡 Suggestion: ${result.suggestion}`));
        }
      }
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  }

  async chatWithAI(message) {
    if (!message.trim()) {
      console.log(chalk.red('❌ Please provide a message to chat'));
      return;
    }

    // 检查是否使用流式响应（默认启用）
    const useStreaming = true;
    
    if (useStreaming) {
      await this.chatWithAIStreaming(message);
    } else {
      await this.chatWithAIClassic(message);
    }
  }

  async chatWithAIStreaming(message) {
    console.log(chalk.blue('\n🤖 AI Assistant:'));
    
    let responseStarted = false;
    let fullResponse = '';
    
    try {
      // 生成包含历史记忆的上下文提示
      const contextPrompt = this.toolManager.memory.generateContextPrompt(message, this.toolManager.context.projectInfo);
      
      const result = await this.toolManager.ai.chatStream(message, {
        systemPrompt: `你是一个专业的编程助手。

${contextPrompt}

请基于以上上下文信息提供有帮助的、专业的回答。如果用户询问过类似问题，请参考历史对话。如果有相关代码片段，可以引用它们。`,
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
        console.log(chalk.gray(`\n💬 Completed in ${result.totalChunks || 0} chunks`));
        
        // 保存对话到记忆系统
        await this.toolManager.memory.addConversation(message, result.response, {
          projectPath: this.toolManager.context.currentDirectory,
          language: this.toolManager.context.projectInfo?.languages ? Object.keys(this.toolManager.context.projectInfo.languages)[0] : null,
          framework: this.toolManager.context.projectInfo?.frameworks?.length > 0 ? this.toolManager.context.projectInfo.frameworks[0].name : null,
          commandType: 'ai_chat_stream'
        });
        
        // 记录聊天历史
        this.toolManager.context.session.commands.push({
          input: message,
          type: 'ai_chat_stream',
          result: true,
          response: result.response,
          timestamp: new Date()
        });
      } else {
        if (!responseStarted) {
          console.log(chalk.red(`❌ ${result.error}`));
        } else {
          console.log(chalk.red(`\n❌ Stream interrupted: ${result.error}`));
          if (result.partialResponse) {
            console.log(chalk.yellow('📝 Partial response received.'));
          }
        }
      }
    } catch (error) {
      console.log(chalk.red(`\n❌ Streaming error: ${error.message}`));
    }
  }

  async chatWithAIClassic(message) {
    const spinner = ora('🤖 AI is thinking...').start();
    
    try {
      const result = await this.toolManager.chat(message);
      
      if (result.success) {
        spinner.succeed('AI response received');
        console.log(chalk.blue('\n🤖 AI Assistant:'));
        console.log(result.response);
        
        if (result.usage) {
          console.log(chalk.gray(`\n📊 Tokens used: ${result.usage.total_tokens}`));
        }
      } else {
        spinner.fail('AI chat failed');
        console.log(chalk.red(`❌ ${result.error}`));
        
        if (result.suggestion) {
          console.log(chalk.yellow(`💡 ${result.suggestion}`));
        }
      }
    } catch (error) {
      spinner.fail('Chat error');
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  }

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
        console.log(chalk.red('❌ Unknown AI command. Available: status, review'));
        console.log(chalk.gray('Usage: ai status | ai review <file>'));
    }
  }

  async handleConfig(params) {
    const subCommand = params[0];
    
    switch (subCommand) {
      case 'set-api-key':
        await this.setApiKey(params[1]);
        break;
      case 'show':
        this.showConfig();
        break;
      default:
        console.log(chalk.red('❌ Unknown config command. Available: set-api-key, show'));
        console.log(chalk.gray('Usage: config set-api-key <key> | config show'));
    }
  }

  async generateWithAI(description) {
    if (!description.trim()) {
      console.log(chalk.red('❌ Please provide a description for code generation'));
      return;
    }

    console.log(chalk.blue('\n🎨 AI Code Generator:'));
    console.log(chalk.gray(`Generating code for: "${description}"`));
    
    let responseStarted = false;
    let fullCode = '';
    
    try {
      const result = await this.toolManager.ai.chatStream(
        `请根据以下描述生成高质量的代码。只返回代码，不要包含解释文字：

${description}

项目上下文：
${this.toolManager.context.projectInfo ? JSON.stringify(this.toolManager.context.projectInfo, null, 2) : '通用项目'}`,
        {
          systemPrompt: `你是一个专业的代码生成专家。根据用户需求生成干净、高效、符合最佳实践的代码。
- 包含必要的注释和错误处理
- 遵循代码规范和风格指南  
- 确保代码可以直接使用
- 只返回代码，不要包含markdown格式或解释`,
          temperature: 0.3,
          maxTokens: 3000
        },
        async (data) => {
          if (!responseStarted) {
            console.log(chalk.green('\n--- Generated Code ---'));
            responseStarted = true;
          }
          
          if (data.content) {
            process.stdout.write(data.content);
            fullCode = data.fullResponse;
          }
          
          if (data.isComplete) {
            process.stdout.write('\n');
            console.log(chalk.gray('--- End of Code ---'));
          }
        }
      );

      if (result.success && fullCode.trim()) {
        // 自动保存生成的代码
        const timestamp = Date.now();
        const filePath = `generated_${timestamp}.js`;
        
        const saveResult = await this.toolManager.execute('fs', 'writeFile', filePath, fullCode);
        
        if (saveResult.success) {
          console.log(chalk.blue(`\n📄 Code saved to: ${filePath}`));
          console.log(chalk.gray(`💾 ${fullCode.split('\n').length} lines generated`));
        } else {
          console.log(chalk.yellow(`⚠️  Could not save file: ${saveResult.error}`));
        }
        
        // 保存生成的代码到记忆系统
        const language = this.toolManager.detectLanguageFromCode(fullCode);
        await this.toolManager.memory.addCodeSnippet(
          fullCode, 
          description, 
          language, 
          {
            projectPath: this.toolManager.context.currentDirectory,
            framework: this.toolManager.context.projectInfo?.frameworks?.length > 0 ? this.toolManager.context.projectInfo.frameworks[0].name : null,
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
      } else {
        console.log(chalk.red(`❌ ${result.error || 'No code generated'}`));
      }
    } catch (error) {
      console.log(chalk.red(`\n❌ Generation error: ${error.message}`));
    }
  }

  async reviewCodeWithAI(filePath) {
    if (!filePath) {
      console.log(chalk.red('❌ Please specify a file to review'));
      return;
    }

    const spinner = ora(`🔍 AI is reviewing ${filePath}...`).start();
    
    try {
      // 先读取文件
      const fileResult = await this.toolManager.execute('fs', 'readFile', filePath);
      if (!fileResult.success) {
        spinner.fail('Failed to read file');
        console.log(chalk.red(`❌ ${fileResult.error}`));
        return;
      }

      // AI 审查代码
      const result = await this.toolManager.ai.reviewCode(fileResult.content, filePath);
      
      if (result.success) {
        spinner.succeed('Code review completed');
        console.log(chalk.blue('\n📋 AI Code Review:'));
        console.log(result.response);
      } else {
        spinner.fail('Code review failed');
        console.log(chalk.red(`❌ ${result.error}`));
      }
    } catch (error) {
      spinner.fail('Review error');
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  }

  async setApiKey(apiKey) {
    if (!apiKey) {
      console.log(chalk.red('❌ Please provide an API key'));
      return;
    }

    const spinner = ora('💾 Saving API key...').start();
    
    try {
      const result = await this.toolManager.configureAPI(apiKey);
      
      if (result.success) {
        spinner.succeed('API key configured successfully');
        console.log(chalk.green('✅ DeepSeek AI is now available!'));
      } else {
        spinner.fail('Failed to save API key');
        console.log(chalk.red(`❌ ${result.error}`));
      }
    } catch (error) {
      spinner.fail('Configuration error');
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  }

  showAIStatus() {
    const status = this.toolManager.getAIStatus();
    
    console.log(chalk.blue('\n🤖 AI Service Status:\n'));
    console.log(`🔌 Available: ${status.available ? chalk.green('Yes') : chalk.red('No')}`);
    
    if (status.stats.isConfigured) {
      console.log(`🔑 API Key: ${chalk.gray(status.stats.apiKey)}`);
      console.log(`📊 Models: ${Object.values(status.stats.availableModels).join(', ')}`);
    } else {
      console.log(chalk.yellow('⚠️  API key not configured'));
      console.log(chalk.gray('   Use: config set-api-key <your-deepseek-api-key>'));
    }
    
    console.log(`\n🧠 NLP Status:`);
    console.log(`   Supported Actions: ${status.nlpStats.supportedActions.length}`);
    console.log(`   File Types: ${status.nlpStats.supportedFileTypes.length}`);
    
    // 显示记忆统计
    console.log(`\n💾 Memory System:`);
    console.log(`   Conversations: ${status.memoryStats.conversationCount}`);
    console.log(`   Code Snippets: ${status.memoryStats.codeSnippetCount}`);
    console.log(`   User Preferences: ${status.memoryStats.userPreferences}`);
    console.log(`   Projects Remembered: ${status.memoryStats.projectsRemembered}`);
    console.log(`   Current Session: ${status.memoryStats.currentSessionId}`);
    console.log('');
  }

  showConfig() {
    const status = this.toolManager.getAIStatus();
    
    console.log(chalk.blue('\n⚙️  Configuration:\n'));
    console.log(`AI Service: ${status.available ? chalk.green('Enabled') : chalk.red('Disabled')}`);
    console.log(`API Key: ${status.stats.apiKey || chalk.gray('Not set')}`);
    console.log(`Base URL: https://api.deepseek.com`);
    console.log(`Models: ${Object.values(status.stats.availableModels).join(', ')}`);
    console.log('');
  }

  showCompletionStatus() {
    if (!this.autoCompletion) {
      console.log(chalk.red('❌ Auto-completion system not initialized'));
      return;
    }

    const stats = this.autoCompletion.getStats();
    
    console.log(chalk.blue('\n🔧 Auto-Completion System Status:\n'));
    console.log(`⚡ Base Commands: ${stats.baseCommands}`);
    console.log(`🗃️ Cache Size: ${stats.cacheSize} entries`);
    console.log(`🏗️ File Types: ${stats.supportedFileTypes}`);
    console.log(`📄 Extensions: ${stats.commonExtensions}`);
    
    console.log(chalk.blue('\n📋 Available Completion Types:'));
    console.log('   • Commands and sub-commands');
    console.log('   • File paths and directories');
    console.log('   • File types and extensions');
    console.log('   • Project-specific suggestions');
    console.log('   • Command history');
    
    console.log(chalk.blue('\n💡 Usage Tips:'));
    console.log('   • Press Tab to auto-complete');
    console.log('   • Press Tab twice to see all options');
    console.log('   • Use Up/Down arrows for history');
    console.log('   • Type partial commands for smart suggestions');
    console.log('');
  }

  async handleErrorFix(params) {
    const filePath = params[0];
    const errorMessage = params.slice(1).join(' ');

    if (!filePath) {
      console.log(chalk.red('❌ Please specify a file to analyze/fix'));
      console.log(chalk.gray('Usage: fix <file> [error_message]'));
      return;
    }

    const spinner = ora(`🔍 Analyzing errors in ${filePath}...`).start();

    try {
      let analysis;
      
      if (errorMessage) {
        // 分析特定错误
        analysis = await this.toolManager.analyzeError(errorMessage, filePath);
      } else {
        // 验证文件并检查错误
        const validation = await this.toolManager.validateFix(filePath);
        if (validation.success) {
          spinner.succeed('No errors found in file');
          console.log(chalk.green(`✅ ${filePath} appears to be error-free`));
          return;
        } else if (validation.stillHasErrors) {
          analysis = await this.toolManager.analyzeError(validation.error, filePath);
        } else {
          spinner.fail('Could not validate file');
          console.log(chalk.red(`❌ ${validation.error}`));
          return;
        }
      }

      if (!analysis.success) {
        spinner.fail('Error analysis failed');
        console.log(chalk.red(`❌ ${analysis.error}`));
        return;
      }

      spinner.succeed('Error analysis complete');

      const errorAnalysis = analysis.analysis;
      console.log(chalk.blue('\n📋 Error Analysis:'));
      console.log(`🔍 Error Type: ${errorAnalysis.detectedType || 'Unknown'}`);
      console.log(`⚠️  Severity: ${errorAnalysis.severity}`);
      console.log(`🔧 Auto-fixable: ${errorAnalysis.autoFixable ? 'Yes' : 'No'}`);

      if (errorAnalysis.suggestions.length > 0) {
        console.log(chalk.blue('\n💡 Suggestions:'));
        errorAnalysis.suggestions.forEach((suggestion, index) => {
          console.log(`   ${index + 1}. ${suggestion}`);
        });
      }

      if (errorAnalysis.aiAnalysis) {
        console.log(chalk.blue('\n🤖 AI Analysis:'));
        console.log(`   Root Cause: ${errorAnalysis.aiAnalysis.rootCause}`);
        if (errorAnalysis.aiAnalysis.codeExample) {
          console.log(chalk.blue('\n📝 Code Example:'));
          console.log(chalk.gray(errorAnalysis.aiAnalysis.codeExample));
        }
      }

      // 询问是否自动修复
      if (errorAnalysis.autoFixable) {
        console.log(chalk.yellow('\n🤔 This error appears to be auto-fixable.'));
        
        // 在实际应用中，这里可以使用 inquirer 询问用户
        // 为了演示，我们直接尝试修复
        const fixSpinner = ora('🔧 Attempting auto-fix...').start();
        
        const fixResult = await this.toolManager.autoFixError(filePath, errorAnalysis);
        
        if (fixResult.success) {
          fixSpinner.succeed('Auto-fix completed');
          console.log(chalk.green(`✅ ${fixResult.message}`));
          
          if (fixResult.changes) {
            console.log(chalk.blue('\n📝 Changes made:'));
            fixResult.changes.forEach(change => {
              console.log(`   • ${change}`);
            });
          }
          
          if (fixResult.backup) {
            console.log(chalk.gray(`💾 Backup created: ${fixResult.backup}`));
          }

          // 验证修复结果
          const validation = await this.toolManager.validateFix(filePath);
          if (validation.success) {
            console.log(chalk.green('✅ Fix verified successfully'));
          } else {
            console.log(chalk.yellow('⚠️  Fix applied, but validation failed:'));
            console.log(chalk.gray(validation.error));
          }
        } else {
          fixSpinner.fail('Auto-fix failed');
          console.log(chalk.red(`❌ ${fixResult.error}`));
          
          if (fixResult.manual) {
            console.log(chalk.yellow('💡 Manual fix required'));
            if (fixResult.suggestion) {
              console.log(`   ${fixResult.suggestion}`);
            }
          }
        }
      } else {
        console.log(chalk.yellow('\n⚠️  This error requires manual fixing'));
      }

    } catch (error) {
      spinner.fail('Error handling failed');
      console.log(chalk.red(`❌ ${error.message}`));
    }
  }

  async checkErrors(projectPath) {
    const checkPath = projectPath || '.';
    const spinner = ora(`🔍 Checking for errors in ${checkPath}...`).start();

    try {
      const result = await this.toolManager.checkProjectErrors(checkPath);

      if (!result.success) {
        spinner.fail('Error check failed');
        console.log(chalk.red(`❌ ${result.error}`));
        return;
      }

      spinner.succeed('Error check complete');

      console.log(chalk.blue('\n📊 Error Check Results:'));
      console.log(`📁 Files scanned: ${result.totalFiles}`);
      console.log(`❌ Files with errors: ${result.errorFiles}`);

      if (result.errorFiles === 0) {
        console.log(chalk.green('\n🎉 No errors found in the project!'));
        return;
      }

      console.log(chalk.blue('\n📋 Errors found:'));
      result.results.forEach((fileResult, index) => {
        console.log(`\n${index + 1}. ${chalk.yellow(fileResult.file)}`);
        console.log(`   Error: ${fileResult.error.substring(0, 100)}...`);
        
        if (fileResult.analysis) {
          console.log(`   Type: ${fileResult.analysis.detectedType || 'Unknown'}`);
          console.log(`   Severity: ${fileResult.analysis.severity}`);
          console.log(`   Auto-fixable: ${fileResult.analysis.autoFixable ? 'Yes' : 'No'}`);
        }
      });

      // 统计可自动修复的错误
      const autoFixableCount = result.results.filter(r => 
        r.analysis && r.analysis.autoFixable
      ).length;

      if (autoFixableCount > 0) {
        console.log(chalk.green(`\n🔧 ${autoFixableCount} errors can be auto-fixed`));
        console.log(chalk.gray('Use "fix <file>" to fix individual files'));
      }

      // 显示错误处理统计
      const errorStats = this.toolManager.getErrorHandlerStats();
      console.log(chalk.blue('\n📊 Error Handler Capabilities:'));
      console.log(`   Supported Error Types: ${errorStats.supportedErrorTypes}`);
      console.log(`   Auto-fixable Types: ${errorStats.autoFixableTypes}`);
      console.log(`   Fix Strategies: ${errorStats.fixStrategies}`);

    } catch (error) {
      spinner.fail('Error check failed');
      console.log(chalk.red(`❌ ${error.message}`));
    }
  }

  async handleTestCommand(params) {
    const subCommand = params[0];
    
    switch (subCommand) {
      case 'generate':
        await this.generateTest(params[1], params[2]);
        break;
      case 'run':
        await this.runTest(params[1]);
        break;
      case 'analyze':
        await this.analyzeForTests(params[1]);
        break;
      case 'framework':
        await this.detectTestFramework();
        break;
      case 'coverage':
        await this.generateCoverage(params[1], params[2]);
        break;
      default:
        console.log(chalk.red('❌ Unknown test command. Available: generate, run, analyze, framework, coverage'));
        console.log(chalk.gray('Usage: test generate <file> [type] | test run [file] | test analyze <file> | test framework | test coverage <test> <source>'));
    }
  }

  async generateTest(filePath, testType = 'unit') {
    if (!filePath) {
      console.log(chalk.red('❌ Please specify a file to generate tests for'));
      console.log(chalk.gray('Usage: test generate <file> [type]'));
      return;
    }

    const spinner = ora(`🧪 Generating ${testType} tests for ${filePath}...`).start();

    try {
      const result = await this.toolManager.generateTests(filePath, testType);

      if (!result.success) {
        spinner.fail('Test generation failed');
        console.log(chalk.red(`❌ ${result.error}`));
        return;
      }

      spinner.succeed('Test generation completed');

      console.log(chalk.blue('\n🧪 Test Generation Results:'));
      console.log(`📄 Test file: ${result.testFilePath}`);
      console.log(`🔧 Framework: ${result.framework}`);
      console.log(`📊 Test type: ${testType}`);

      if (result.analysis) {
        console.log(chalk.blue('\n📋 Code Analysis:'));
        console.log(`   Functions: ${result.analysis.functions.length}`);
        console.log(`   Classes: ${result.analysis.classes.length}`);
        console.log(`   File type: ${result.analysis.fileType}`);
        console.log(`   Complexity: ${result.analysis.complexity}`);
      }

      if (result.suggestions && result.suggestions.length > 0) {
        console.log(chalk.blue('\n💡 Optimization Suggestions:'));
        result.suggestions.forEach((suggestion, index) => {
          console.log(`   ${index + 1}. ${suggestion}`);
        });
      }

      // 询问是否保存测试文件
      console.log(chalk.yellow('\n💾 Saving test file...'));
      const writeResult = await this.toolManager.execute('fs', 'writeFile', result.testFilePath, result.testCode);
      
      if (writeResult.success) {
        console.log(chalk.green(`✅ Test file saved: ${result.testFilePath}`));
        console.log(chalk.gray(`📝 ${result.testCode.split('\n').length} lines generated`));
      } else {
        console.log(chalk.red(`❌ Failed to save test file: ${writeResult.error}`));
      }

    } catch (error) {
      spinner.fail('Test generation error');
      console.log(chalk.red(`❌ ${error.message}`));
    }
  }

  async runTest(testFilePath) {
    const spinner = ora(`🏃 Running tests${testFilePath ? ` for ${testFilePath}` : ''}...`).start();

    try {
      const result = await this.toolManager.runTests(testFilePath);

      if (result.success) {
        spinner.succeed('Tests completed');
        console.log(chalk.green('\n✅ Test Results:'));
        if (result.stdout) {
          console.log(result.stdout);
        }
      } else {
        spinner.fail('Tests failed');
        console.log(chalk.red('\n❌ Test Failures:'));
        if (result.stderr) {
          console.log(result.stderr);
        }
        console.log(chalk.yellow(`Exit code: ${result.exitCode}`));
      }

    } catch (error) {
      spinner.fail('Test execution error');
      console.log(chalk.red(`❌ ${error.message}`));
    }
  }

  async analyzeForTests(filePath) {
    if (!filePath) {
      console.log(chalk.red('❌ Please specify a file to analyze'));
      return;
    }

    const spinner = ora(`🔍 Analyzing ${filePath} for test generation...`).start();

    try {
      const result = await this.toolManager.analyzeCodeForTests(filePath);

      if (!result.success) {
        spinner.fail('Code analysis failed');
        console.log(chalk.red(`❌ ${result.error}`));
        return;
      }

      spinner.succeed('Code analysis completed');

      const analysis = result.analysis;
      console.log(chalk.blue('\n📋 Code Analysis Results:'));
      console.log(`📄 File: ${analysis.filePath}`);
      console.log(`🏗️ Type: ${analysis.fileType}`);
      console.log(`📊 Complexity: ${analysis.complexity}`);

      if (analysis.functions.length > 0) {
        console.log(chalk.blue('\n⚡ Functions:'));
        analysis.functions.forEach((func, index) => {
          console.log(`   ${index + 1}. ${func.name}${func.async ? ' (async)' : ''} - ${func.params.length} params`);
        });
      }

      if (analysis.classes.length > 0) {
        console.log(chalk.blue('\n🏗️ Classes:'));
        analysis.classes.forEach((cls, index) => {
          console.log(`   ${index + 1}. ${cls.name}`);
        });
      }

      if (analysis.exports.length > 0) {
        console.log(chalk.blue('\n📤 Exports:'));
        analysis.exports.forEach((exp, index) => {
          console.log(`   ${index + 1}. ${exp.name} (${exp.type})`);
        });
      }

      if (analysis.testSuggestions.length > 0) {
        console.log(chalk.blue('\n💡 Test Suggestions:'));
        analysis.testSuggestions.forEach((suggestion, index) => {
          console.log(`   ${index + 1}. ${suggestion.description} (${suggestion.type})`);
          if (suggestion.testCases && suggestion.testCases.length > 0) {
            console.log(`      Test cases: ${suggestion.testCases.slice(0, 2).join(', ')}${suggestion.testCases.length > 2 ? '...' : ''}`);
          }
        });
      }

    } catch (error) {
      spinner.fail('Analysis error');
      console.log(chalk.red(`❌ ${error.message}`));
    }
  }

  async detectTestFramework() {
    const spinner = ora('🔍 Detecting test framework...').start();

    try {
      const result = await this.toolManager.detectTestFramework();

      if (!result.success) {
        spinner.fail('Framework detection failed');
        console.log(chalk.red(`❌ ${result.error}`));
        return;
      }

      spinner.succeed('Framework detection completed');

      console.log(chalk.blue('\n🧪 Test Framework Detection:'));
      
      if (result.frameworks.length === 0) {
        console.log(chalk.yellow('No test frameworks detected in this project'));
        console.log(chalk.gray('Consider installing a test framework like Jest, Mocha, or Vitest'));
        return;
      }

      console.log(`📊 Detected ${result.frameworks.length} framework(s):`);
      
      result.frameworks.forEach((framework, index) => {
        const confidence = (framework.confidence * 100).toFixed(0);
        const isPrimary = result.primary && result.primary.name === framework.name;
        const marker = isPrimary ? '🎯' : '  ';
        console.log(`${marker} ${index + 1}. ${framework.name} (${confidence}% confidence) - ${framework.source}`);
      });

      if (result.primary) {
        console.log(chalk.green(`\n🎯 Primary framework: ${result.primary.name}`));
      }

      // 显示测试生成系统统计
      const testStats = this.toolManager.getTestGeneratorStats();
      console.log(chalk.blue('\n📊 Test Generator Capabilities:'));
      console.log(`   Supported Frameworks: ${testStats.supportedFrameworks}`);
      console.log(`   Test Types: ${testStats.testTypes}`);
      console.log(`   Test Patterns: ${testStats.testPatterns}`);

    } catch (error) {
      spinner.fail('Framework detection error');
      console.log(chalk.red(`❌ ${error.message}`));
    }
  }

  async generateCoverage(testFilePath, sourceFilePath) {
    if (!testFilePath || !sourceFilePath) {
      console.log(chalk.red('❌ Please specify both test file and source file'));
      console.log(chalk.gray('Usage: test coverage <test_file> <source_file>'));
      return;
    }

    const spinner = ora(`📊 Generating coverage report...`).start();

    try {
      const result = await this.toolManager.generateCoverageReport(testFilePath, sourceFilePath);

      if (!result.success) {
        spinner.fail('Coverage generation failed');
        console.log(chalk.red(`❌ ${result.error}`));
        return;
      }

      spinner.succeed('Coverage report generated');

      console.log(chalk.blue('\n📊 Coverage Report:'));
      
      if (result.coverage) {
        console.log(`📏 Statements: ${result.coverage.statements}%`);
        console.log(`🌿 Branches: ${result.coverage.branches}%`);
        console.log(`⚡ Functions: ${result.coverage.functions}%`);
        console.log(`📝 Lines: ${result.coverage.lines}%`);
        
        const avgCoverage = (
          result.coverage.statements + 
          result.coverage.branches + 
          result.coverage.functions + 
          result.coverage.lines
        ) / 4;
        
        const coverageColor = avgCoverage >= 80 ? chalk.green : avgCoverage >= 60 ? chalk.yellow : chalk.red;
        console.log(coverageColor(`\n📈 Average Coverage: ${avgCoverage.toFixed(1)}%`));
      }

    } catch (error) {
      spinner.fail('Coverage generation error');
      console.log(chalk.red(`❌ ${error.message}`));
    }
  }

  async handlePlanCommand(params) {
    const subCommand = params[0];
    
    switch (subCommand) {
      case 'create':
        await this.createTaskPlan(params.slice(1).join(' '));
        break;
      case 'execute':
        await this.executeTaskPlan(params[1]);
        break;
      case 'status':
        await this.showPlanStatus();
        break;
      case 'pause':
        await this.pausePlan();
        break;
      case 'resume':
        await this.resumePlan();
        break;
      case 'stop':
        await this.stopPlan();
        break;
      default:
        console.log(chalk.red('❌ Unknown plan command. Available: create, execute, status, pause, resume, stop'));
        console.log(chalk.gray('Usage: plan create "<description>" | plan execute | plan status | plan pause | plan resume | plan stop'));
    }
  }

  async createTaskPlan(description) {
    if (!description.trim()) {
      console.log(chalk.red('❌ Please provide a description for the task plan'));
      console.log(chalk.gray('Usage: plan create "Create a full-stack e-commerce app with React and Node.js"'));
      return;
    }

    const spinner = ora('🤖 AI is analyzing requirements and generating task plan...').start();

    try {
      const result = await this.toolManager.generateTaskPlan(description);

      if (!result.success) {
        spinner.fail('Task plan generation failed');
        console.log(chalk.red(`❌ ${result.error}`));
        return;
      }

      spinner.succeed('Task plan generated successfully');

      const { plan, summary } = result;
      
      console.log(chalk.blue(`\n🎯 Task Plan: ${plan.title}`));
      console.log(chalk.gray(`📝 ${plan.description}`));
      
      if (plan.techStack && plan.techStack.length > 0) {
        console.log(chalk.blue(`\n🔧 Technology Stack:`));
        plan.techStack.forEach(tech => console.log(`   • ${tech}`));
      }

      console.log(chalk.blue(`\n📊 Plan Summary:`));
      console.log(`   📋 Total Tasks: ${summary.totalTasks}`);
      console.log(`   🔥 High Priority: ${summary.highPriorityTasks}`);
      console.log(`   ⏱️  Estimated Time: ${summary.estimatedTime} minutes`);
      console.log(`   📊 Complexity: ${plan.complexity}`);

      console.log(chalk.blue('\n📋 Task Breakdown:'));
      plan.tasks.forEach((task, index) => {
        const priorityIcon = task.priority === 'high' ? '🔥' : task.priority === 'medium' ? '🟡' : '🟢';
        console.log(`   ${index + 1}. ${priorityIcon} ${task.title} (${task.estimatedTime}min)`);
        console.log(`      ${chalk.gray(task.description)}`);
      });

      if (plan.metadata.recommendations && plan.metadata.recommendations.length > 0) {
        console.log(chalk.blue('\n💡 Recommendations:'));
        plan.metadata.recommendations.forEach((rec, index) => {
          console.log(`   ${index + 1}. ${rec}`);
        });
      }

      console.log(chalk.yellow('\n🚀 Ready to execute! Use "plan execute" to start implementation.'));

    } catch (error) {
      spinner.fail('Task plan generation error');
      console.log(chalk.red(`❌ ${error.message}`));
    }
  }

  async executeTaskPlan(planId) {
    const status = this.toolManager.getTaskExecutionStatus();
    
    if (status.isExecuting) {
      console.log(chalk.yellow('⚠️  A task plan is already executing. Use "plan status" to check progress.'));
      return;
    }

    if (!status.currentPlan) {
      console.log(chalk.red('❌ No task plan available for execution. Create one first with "plan create".'));
      return;
    }

    console.log(chalk.blue(`🚀 Starting execution of plan: ${status.currentPlan.title}`));
    console.log(chalk.gray('💡 You can use "plan pause", "plan resume", or "plan stop" to control execution.'));

    try {
      const result = await this.toolManager.executeTaskPlan(null, {
        stopOnError: false // Continue execution even if some tasks fail
      });

      if (result.success) {
        console.log(chalk.green('\n🎉 Plan execution completed!'));
        
        if (result.executionState) {
          const { completedTasks, failedTasks, totalTasks } = result.executionState;
          console.log(`📊 Results: ${completedTasks.length}/${totalTasks} tasks completed`);
          
          if (failedTasks.length > 0) {
            console.log(chalk.red(`⚠️  ${failedTasks.length} tasks failed:`));
            failedTasks.forEach((task, index) => {
              console.log(`   ${index + 1}. ${task.title}: ${task.error}`);
            });
          }
        }
      } else {
        console.log(chalk.red(`❌ Plan execution failed: ${result.error}`));
      }

    } catch (error) {
      console.log(chalk.red(`❌ Execution error: ${error.message}`));
    }
  }

  async showPlanStatus() {
    const status = this.toolManager.getTaskExecutionStatus();
    const plannerStats = this.toolManager.getTaskPlannerStats();

    console.log(chalk.blue('\n🎯 Task Planning System Status:'));
    
    if (status.currentPlan) {
      console.log(chalk.blue('\n📋 Current Plan:'));
      console.log(`   Title: ${status.currentPlan.title}`);
      console.log(`   Status: ${status.currentPlan.status}`);
      console.log(`   Tasks: ${status.totalTasks}`);
      console.log(`   Created: ${status.currentPlan.createdAt?.toLocaleString()}`);
      
      if (status.isExecuting) {
        console.log(chalk.blue('\n⚡ Execution Status:'));
        console.log(`   Current Task: ${status.currentTaskIndex + 1}/${status.totalTasks}`);
        console.log(`   Completed: ${status.completedTasks.length}`);
        console.log(`   Failed: ${status.failedTasks.length}`);
        console.log(`   Pending: ${status.pendingTasks.length}`);
        
        if (status.startTime) {
          const duration = Math.round((new Date() - status.startTime) / 1000 / 60);
          console.log(`   Running Time: ${duration} minutes`);
        }
        
        // Show current task details
        if (status.currentTaskIndex < status.totalTasks) {
          const currentTask = status.currentPlan.tasks[status.currentTaskIndex];
          console.log(chalk.blue('\n🔄 Current Task:'));
          console.log(`   ${currentTask.title}`);
          console.log(`   ${chalk.gray(currentTask.description)}`);
        }
      }
      
      // Show task list with status
      console.log(chalk.blue('\n📋 Task List:'));
      status.currentPlan.tasks.forEach((task, index) => {
        const statusIcon = task.status === 'completed' ? '✅' : 
                          task.status === 'failed' ? '❌' : 
                          task.status === 'executing' ? '🔄' : '⏸️';
        console.log(`   ${statusIcon} ${index + 1}. ${task.title}`);
      });
    } else {
      console.log(chalk.yellow('\n📄 No current plan available.'));
      console.log(chalk.gray('Use "plan create <description>" to generate a new task plan.'));
    }

    console.log(chalk.blue('\n📊 System Capabilities:'));
    console.log(`   Task Types: ${plannerStats.supportedTaskTypes}`);
    console.log(`   Templates: ${plannerStats.availableTemplates}`);
    console.log(`   Execution Features: ${plannerStats.executionCapabilities.join(', ')}`);
  }

  async pausePlan() {
    const status = this.toolManager.getTaskExecutionStatus();
    
    if (!status.isExecuting) {
      console.log(chalk.yellow('⚠️  No plan is currently executing.'));
      return;
    }

    this.toolManager.pauseTaskExecution();
    console.log(chalk.yellow('⏸️  Plan execution paused. Use "plan resume" to continue.'));
  }

  async resumePlan() {
    const status = this.toolManager.getTaskExecutionStatus();
    
    if (!status.isPaused) {
      console.log(chalk.yellow('⚠️  No paused plan to resume.'));
      return;
    }

    this.toolManager.resumeTaskExecution();
    console.log(chalk.green('▶️  Plan execution resumed.'));
  }

  async stopPlan() {
    const status = this.toolManager.getTaskExecutionStatus();
    
    if (!status.isExecuting && !status.isPaused) {
      console.log(chalk.yellow('⚠️  No plan is currently executing.'));
      return;
    }

    this.toolManager.stopTaskExecution();
    console.log(chalk.red('⏹️  Plan execution stopped.'));
    
    // Show final status
    const finalStatus = this.toolManager.getTaskExecutionStatus();
    if (finalStatus.completedTasks.length > 0) {
      console.log(chalk.blue(`\n📊 Final Results: ${finalStatus.completedTasks.length}/${finalStatus.totalTasks} tasks completed`));
    }
  }

  displayProjectInfo(analysis) {
    console.log(chalk.blue('\n📊 Project Analysis Results:\n'));
    
    console.log(`📁 Path: ${analysis.path}`);
    console.log(`📄 Total Files: ${analysis.totalFiles}`);
    console.log(`💻 Code Files: ${analysis.codeFiles}`);
    
    if (Object.keys(analysis.languages).length > 0) {
      console.log('\n🔤 Languages:');
      Object.entries(analysis.languages).forEach(([lang, count]) => {
        console.log(`  ${lang}: ${count} files`);
      });
    }
    
    if (analysis.frameworks.length > 0) {
      console.log('\n🚀 Frameworks:');
      analysis.frameworks.forEach(framework => {
        const confidence = (framework.confidence * 100).toFixed(0);
        console.log(`  ${framework.name} (${confidence}% confidence)`);
      });
    }
    
    if (analysis.packageManager) {
      console.log(`\n📦 Package Manager: ${analysis.packageManager}`);
    }
    
    console.log('');
  }

  exit() {
    console.log(chalk.green('\n👋 Thanks for using Mini Claude Code with AI and Auto-Completion!'));
    this.isInteractive = false;
    
    if (this.rl) {
      this.rl.close();
    }
    
    process.exit(0);
  }
}

// CLI setup
program
  .name('mini-claude')
  .description('A simplified AI coding assistant')
  .version('1.0.0');

program
  .command('interactive')
  .alias('i')
  .description('Start interactive mode')
  .action(async () => {
    const cli = new MiniClaudeCLI();
    await cli.init();
    await cli.startInteractiveMode();
  });

program
  .command('analyze [path]')
  .description('Analyze project structure')
  .action(async (projectPath) => {
    const cli = new MiniClaudeCLI();
    await cli.init();
    await cli.analyzeProject(projectPath);
  });

program
  .command('run <command>')
  .description('Execute a shell command')
  .action(async (command) => {
    const cli = new MiniClaudeCLI();
    await cli.init();
    await cli.runCommand(command);
  });

// Default to interactive mode if no command specified
if (process.argv.length === 2) {
  process.argv.push('interactive');
}

program.parse();

module.exports = MiniClaudeCLI;
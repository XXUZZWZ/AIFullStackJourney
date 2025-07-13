#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');

const ToolManager = require('../lib/tool-manager');
const CodeGenerator = require('../lib/code-generator');

class MiniClaudeCLI {
  constructor() {
    this.toolManager = new ToolManager();
    this.codeGenerator = new CodeGenerator();
    this.isInteractive = false;
  }

  async init() {
    console.log(chalk.blue.bold('🤖 Mini Claude Code'));
    console.log(chalk.gray('A simplified AI coding assistant\n'));

    // 初始化工具管理器
    const spinner = ora('Initializing...').start();
    try {
      await this.toolManager.initialize();
      spinner.succeed('Ready to assist!');
    } catch (error) {
      spinner.fail(`Initialization failed: ${error.message}`);
      process.exit(1);
    }
  }

  async startInteractiveMode() {
    this.isInteractive = true;
    console.log(chalk.green('\n🚀 Interactive mode started. Type "help" for commands or "exit" to quit.\n'));

    while (this.isInteractive) {
      try {
        const { action } = await inquirer.prompt([
          {
            type: 'input',
            name: 'action',
            message: chalk.cyan('mini-claude>'),
            prefix: ''
          }
        ]);

        if (!action.trim()) continue;

        await this.handleCommand(action.trim());
      } catch (error) {
        if (error.name === 'ExitPromptError') {
          break;
        }
        console.error(chalk.red(`Error: ${error.message}`));
      }
    }
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
      ['suggest', 'Get suggestions for next actions'],
      ['report', 'Generate project report'],
      ['', ''],
      [chalk.blue('🤖 AI Commands:'), ''],
      ['chat <message>', 'Chat with AI assistant'],
      ['generate <description>', 'Generate code with AI'],
      ['ai status', 'Show AI service status'],
      ['ai review <file>', 'AI code review'],
      ['config set-api-key <key>', 'Set DeepSeek API key'],
      ['config show', 'Show current configuration'],
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
    const spinner = ora('🤔 Processing natural language...').start();
    
    try {
      const result = await this.toolManager.processNaturalLanguage(input);
      
      if (result.success) {
        spinner.succeed('Natural language processed');
        
        if (result.response) {
          console.log(chalk.blue('\n🤖 AI Response:'));
          console.log(result.response);
        } else if (result.message) {
          console.log(chalk.green(`✅ ${result.message}`));
        } else {
          console.log(chalk.green('✅ Command executed successfully'));
        }
        
        if (result.filePath) {
          console.log(chalk.gray(`📄 File: ${result.filePath}`));
        }
      } else {
        spinner.fail('Natural language processing failed');
        console.log(chalk.red(`❌ ${result.error}`));
        
        if (result.suggestion) {
          console.log(chalk.yellow(`💡 Suggestion: ${result.suggestion}`));
        }
      }
    } catch (error) {
      spinner.fail('Processing error');
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  }

  async chatWithAI(message) {
    if (!message.trim()) {
      console.log(chalk.red('❌ Please provide a message to chat'));
      return;
    }

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

    const spinner = ora('🎨 AI is generating code...').start();
    
    try {
      const result = await this.toolManager.generateCodeWithAI(description, {
        saveToFile: true,
        filePath: `generated_${Date.now()}.js`
      });
      
      if (result.success) {
        spinner.succeed('Code generated successfully');
        console.log(chalk.green('\n✨ Generated Code:'));
        console.log(chalk.gray('--- Start ---'));
        console.log(result.code);
        console.log(chalk.gray('--- End ---'));
        
        if (result.saved) {
          console.log(chalk.blue(`\n📄 Saved to: ${result.filePath}`));
        }
      } else {
        spinner.fail('Code generation failed');
        console.log(chalk.red(`❌ ${result.error}`));
      }
    } catch (error) {
      spinner.fail('Generation error');
      console.log(chalk.red(`❌ Error: ${error.message}`));
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
    console.log(chalk.green('\n👋 Thanks for using Mini Claude Code with AI!'));
    this.isInteractive = false;
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
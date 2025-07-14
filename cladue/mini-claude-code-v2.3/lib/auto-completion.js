const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

class AutoCompletion {
  constructor(toolManager) {
    this.toolManager = toolManager;
    this.name = 'AutoCompletion';
    
    // 基础命令列表
    this.baseCommands = [
      'help', 'analyze', 'read', 'write', 'edit', 'search', 'run', 'create',
      'list', 'status', 'suggest', 'report', 'chat', 'ai', 'config', 'generate',
      'exit', 'quit'
    ];

    // AI 子命令
    this.aiSubCommands = ['status', 'review'];
    
    // 配置子命令
    this.configSubCommands = ['set-api-key', 'show'];
    
    // 文件类型
    this.fileTypes = [
      'component', 'page', 'service', 'util', 'test', 'config', 'style', 'doc'
    ];
    
    // 常用文件扩展名
    this.commonExtensions = [
      '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.html', 
      '.css', '.scss', '.json', '.md', '.txt', '.yml', '.yaml'
    ];
    
    // 常用目录
    this.commonDirectories = [
      'src', 'lib', 'components', 'pages', 'utils', 'services', 'tests', 
      'test', '__tests__', 'docs', 'config', 'public', 'assets', 'styles'
    ];
    
    // 命令历史（从工具管理器获取）
    this.commandHistory = [];
    
    // 智能建议缓存
    this.suggestionCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5分钟缓存
  }

  /**
   * 获取命令补全建议
   */
  getCommandCompletions(input, cursorPosition = input.length) {
    const beforeCursor = input.substring(0, cursorPosition);
    const words = beforeCursor.trim().split(/\s+/);
    const currentWord = words[words.length - 1] || '';
    const previousWords = words.slice(0, -1);

    // 基于输入位置提供不同的补全
    if (previousWords.length === 0) {
      // 主命令补全
      return this.getMainCommandCompletions(currentWord);
    } else {
      // 子命令或参数补全
      return this.getSubCommandCompletions(previousWords, currentWord);
    }
  }

  /**
   * 主命令补全
   */
  getMainCommandCompletions(partialCommand) {
    const matches = this.baseCommands.filter(cmd => 
      cmd.toLowerCase().startsWith(partialCommand.toLowerCase())
    );

    // 添加历史命令中的匹配项
    const historyMatches = this.getHistoryMatches(partialCommand);
    
    // 合并并去重
    const allMatches = [...new Set([...matches, ...historyMatches])];
    
    return this.formatCompletions(allMatches, partialCommand);
  }

  /**
   * 子命令或参数补全
   */
  getSubCommandCompletions(previousWords, currentWord) {
    const mainCommand = previousWords[0];
    
    switch (mainCommand) {
      case 'ai':
        return this.getAISubCommands(currentWord);
      
      case 'config':
        return this.getConfigSubCommands(currentWord);
      
      case 'read':
      case 'edit':
      case 'analyze':
        return this.getFilePathCompletions(currentWord);
      
      case 'write':
        if (previousWords.length === 1) {
          return this.getFilePathCompletions(currentWord);
        }
        break;
      
      case 'search':
        if (previousWords.length === 2) {
          return this.getDirectoryCompletions(currentWord);
        }
        break;
      
      case 'create':
        if (previousWords.length === 1) {
          return this.getFileTypeCompletions(currentWord);
        } else if (previousWords.length === 2) {
          return this.getFileNameSuggestions(previousWords[1], currentWord);
        }
        break;
      
      case 'list':
        return this.getDirectoryCompletions(currentWord);
      
      case 'run':
        return this.getCommandSuggestions(currentWord);
      
      default:
        return [];
    }
    
    return [];
  }

  /**
   * AI 子命令补全
   */
  getAISubCommands(currentWord) {
    const matches = this.aiSubCommands.filter(cmd => 
      cmd.toLowerCase().startsWith(currentWord.toLowerCase())
    );
    return this.formatCompletions(matches, currentWord);
  }

  /**
   * 配置子命令补全
   */
  getConfigSubCommands(currentWord) {
    const matches = this.configSubCommands.filter(cmd => 
      cmd.toLowerCase().startsWith(currentWord.toLowerCase())
    );
    return this.formatCompletions(matches, currentWord);
  }

  /**
   * 文件路径补全
   */
  getFilePathCompletions(currentWord, maxResults = 20) {
    try {
      const cacheKey = `filepath_${currentWord}`;
      const cached = this.suggestionCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.results;
      }

      let searchPattern;
      let basePath = '';
      
      if (currentWord.includes('/')) {
        // 路径中包含目录分隔符
        const lastSlash = currentWord.lastIndexOf('/');
        basePath = currentWord.substring(0, lastSlash + 1);
        const filename = currentWord.substring(lastSlash + 1);
        searchPattern = path.join(basePath, `${filename}*`);
      } else {
        // 只是文件名
        searchPattern = `${currentWord}*`;
      }

      const matches = glob.sync(searchPattern, { 
        maxResults,
        ignore: ['node_modules/**', '.git/**', '*.tmp', '*.log']
      });

      const completions = matches.map(match => {
        const isDirectory = fs.statSync(match).isDirectory();
        return {
          text: match,
          display: `${match}${isDirectory ? '/' : ''}`,
          type: isDirectory ? 'directory' : 'file',
          description: isDirectory ? 'Directory' : this.getFileDescription(match)
        };
      });

      // 缓存结果
      this.suggestionCache.set(cacheKey, {
        results: completions,
        timestamp: Date.now()
      });

      return completions;
    } catch (error) {
      console.warn('File path completion error:', error.message);
      return [];
    }
  }

  /**
   * 目录补全
   */
  getDirectoryCompletions(currentWord) {
    const fileCompletions = this.getFilePathCompletions(currentWord);
    return fileCompletions.filter(comp => comp.type === 'directory');
  }

  /**
   * 文件类型补全
   */
  getFileTypeCompletions(currentWord) {
    const matches = this.fileTypes.filter(type => 
      type.toLowerCase().startsWith(currentWord.toLowerCase())
    );
    return this.formatCompletions(matches, currentWord, 'file-type');
  }

  /**
   * 文件名建议
   */
  getFileNameSuggestions(fileType, currentWord) {
    const suggestions = [];
    
    // 基于文件类型提供建议
    switch (fileType) {
      case 'component':
        suggestions.push('Button', 'Header', 'Footer', 'Card', 'Modal', 'Form');
        break;
      case 'page':
        suggestions.push('Home', 'About', 'Contact', 'Login', 'Dashboard', 'Profile');
        break;
      case 'service':
        suggestions.push('api', 'auth', 'data', 'utils', 'config', 'storage');
        break;
      case 'test':
        suggestions.push('unit', 'integration', 'e2e', 'helpers', 'mocks');
        break;
      default:
        suggestions.push('index', 'main', 'app', 'core', 'base');
    }

    const matches = suggestions.filter(name => 
      name.toLowerCase().startsWith(currentWord.toLowerCase())
    );
    
    return this.formatCompletions(matches, currentWord, 'filename');
  }

  /**
   * 命令建议（shell 命令）
   */
  getCommandSuggestions(currentWord) {
    const commonCommands = [
      'npm install', 'npm start', 'npm test', 'npm run build', 'npm run dev',
      'yarn install', 'yarn start', 'yarn test', 'yarn build', 'yarn dev',
      'git status', 'git add', 'git commit', 'git push', 'git pull',
      'ls', 'cd', 'pwd', 'mkdir', 'touch', 'cat', 'grep', 'find',
      'node', 'python', 'java', 'javac', 'gcc', 'make'
    ];

    // 添加项目特定的命令
    const projectCommands = this.getProjectSpecificCommands();
    const allCommands = [...commonCommands, ...projectCommands];

    const matches = allCommands.filter(cmd => 
      cmd.toLowerCase().includes(currentWord.toLowerCase())
    );

    return matches.map(cmd => ({
      text: cmd,
      display: cmd,
      type: 'command',
      description: this.getCommandDescription(cmd)
    }));
  }

  /**
   * 获取项目特定的命令
   */
  getProjectSpecificCommands() {
    const commands = [];
    const projectInfo = this.toolManager.context.projectInfo;
    
    if (!projectInfo) return commands;

    // 基于 package.json 脚本
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packagePath)) {
        const packageJson = fs.readJsonSync(packagePath);
        if (packageJson.scripts) {
          Object.keys(packageJson.scripts).forEach(script => {
            commands.push(`npm run ${script}`);
            if (projectInfo.packageManager === 'yarn') {
              commands.push(`yarn ${script}`);
            }
          });
        }
      }
    } catch (error) {
      // 忽略错误
    }

    // 基于框架
    projectInfo.frameworks?.forEach(framework => {
      switch (framework.name) {
        case 'react':
          commands.push('npx create-react-app', 'npm run eject');
          break;
        case 'vue':
          commands.push('vue create', 'vue serve');
          break;
        case 'next':
          commands.push('npx create-next-app', 'next build', 'next export');
          break;
        case 'express':
          commands.push('nodemon', 'pm2 start');
          break;
      }
    });

    return commands;
  }

  /**
   * 历史命令匹配
   */
  getHistoryMatches(partialCommand) {
    // 从工具管理器获取命令历史
    const history = this.toolManager.context.session.commands
      .filter(cmd => cmd.input && typeof cmd.input === 'string')
      .map(cmd => cmd.input.split(' ')[0])
      .filter(cmd => cmd.toLowerCase().startsWith(partialCommand.toLowerCase()));

    // 去重并按使用频率排序
    const frequency = {};
    history.forEach(cmd => {
      frequency[cmd] = (frequency[cmd] || 0) + 1;
    });

    return Object.keys(frequency)
      .sort((a, b) => frequency[b] - frequency[a])
      .slice(0, 5);
  }

  /**
   * 格式化补全结果
   */
  formatCompletions(matches, currentWord, type = 'command') {
    return matches.map(match => ({
      text: match,
      display: match,
      type: type,
      description: this.getCompletionDescription(match, type)
    }));
  }

  /**
   * 获取补全项描述
   */
  getCompletionDescription(item, type) {
    switch (type) {
      case 'command':
        return this.getCommandDescription(item);
      case 'file-type':
        return this.getFileTypeDescription(item);
      case 'filename':
        return 'Suggested filename';
      default:
        return '';
    }
  }

  /**
   * 获取命令描述
   */
  getCommandDescription(command) {
    const descriptions = {
      'help': 'Show help information',
      'analyze': 'Analyze project structure',
      'read': 'Read file contents',
      'write': 'Write content to file',
      'edit': 'Edit file by replacing text',
      'search': 'Search for text in files',
      'run': 'Execute shell command',
      'create': 'Create new file/component',
      'list': 'List files in directory',
      'status': 'Show current status',
      'chat': 'Chat with AI assistant',
      'generate': 'Generate code with AI',
      'npm install': 'Install npm dependencies',
      'npm start': 'Start the application',
      'npm test': 'Run tests',
      'git status': 'Show git status',
      'git add': 'Add files to git staging'
    };
    
    return descriptions[command] || '';
  }

  /**
   * 获取文件类型描述
   */
  getFileTypeDescription(fileType) {
    const descriptions = {
      'component': 'React/Vue component file',
      'page': 'Application page/view',
      'service': 'Service or API layer',
      'util': 'Utility functions',
      'test': 'Test file',
      'config': 'Configuration file',
      'style': 'CSS/SCSS styling',
      'doc': 'Documentation file'
    };
    
    return descriptions[fileType] || 'File';
  }

  /**
   * 获取文件描述
   */
  getFileDescription(filePath) {
    const ext = path.extname(filePath);
    const fileDescriptions = {
      '.js': 'JavaScript file',
      '.ts': 'TypeScript file',
      '.jsx': 'React component',
      '.tsx': 'TypeScript React component',
      '.py': 'Python file',
      '.java': 'Java file',
      '.cpp': 'C++ file',
      '.c': 'C file',
      '.html': 'HTML file',
      '.css': 'CSS stylesheet',
      '.scss': 'SASS stylesheet',
      '.json': 'JSON data',
      '.md': 'Markdown document',
      '.txt': 'Text file',
      '.yml': 'YAML configuration',
      '.yaml': 'YAML configuration'
    };
    
    return fileDescriptions[ext] || 'File';
  }

  /**
   * 智能建议下一个可能的命令
   */
  getSmartSuggestions(context = {}) {
    const suggestions = [];
    const projectInfo = this.toolManager.context.projectInfo;
    
    // 基于项目状态的建议
    if (!projectInfo) {
      suggestions.push({
        command: 'analyze',
        description: 'Analyze the current project to get started',
        priority: 10
      });
    }

    // 基于最近命令的建议
    const recentCommands = this.toolManager.context.session.commands.slice(-5);
    const lastCommand = recentCommands[recentCommands.length - 1];
    
    if (lastCommand) {
      switch (lastCommand.tool) {
        case 'fs':
          if (lastCommand.method === 'readFile') {
            suggestions.push({
              command: 'edit',
              description: 'Edit the file you just read',
              priority: 8
            });
          }
          break;
        case 'analyzer':
          suggestions.push({
            command: 'create',
            description: 'Create a new component or file',
            priority: 7
          });
          break;
      }
    }

    // 基于项目类型的建议
    if (projectInfo?.frameworks) {
      projectInfo.frameworks.forEach(framework => {
        switch (framework.name) {
          case 'react':
            suggestions.push({
              command: 'create component',
              description: 'Create a new React component',
              priority: 6
            });
            break;
          case 'express':
            suggestions.push({
              command: 'create service',
              description: 'Create a new Express service',
              priority: 6
            });
            break;
        }
      });
    }

    // 排序并返回前5个建议
    return suggestions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5);
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.suggestionCache.clear();
  }

  /**
   * 获取补全统计信息
   */
  getStats() {
    return {
      baseCommands: this.baseCommands.length,
      cacheSize: this.suggestionCache.size,
      supportedFileTypes: this.fileTypes.length,
      commonExtensions: this.commonExtensions.length
    };
  }
}

module.exports = AutoCompletion;
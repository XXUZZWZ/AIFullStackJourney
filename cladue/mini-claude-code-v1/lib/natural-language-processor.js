const DeepSeekAI = require('./deepseek-ai');

class NaturalLanguageProcessor {
  constructor(toolManager) {
    this.toolManager = toolManager;
    this.ai = new DeepSeekAI();
    this.name = 'NaturalLanguageProcessor';
    
    // 指令模式映射
    this.commandPatterns = {
      // 文件操作
      read: ['read', 'show', 'display', '读取', '显示', '查看'],
      write: ['write', 'create', 'make', '写入', '创建', '生成'],
      edit: ['edit', 'modify', 'change', 'update', '编辑', '修改', '更改'],
      delete: ['delete', 'remove', '删除', '移除'],
      
      // 搜索操作
      search: ['search', 'find', 'grep', '搜索', '查找', '找'],
      
      // 命令执行
      run: ['run', 'execute', 'exec', '执行', '运行'],
      
      // 项目操作
      analyze: ['analyze', 'scan', 'check', '分析', '扫描', '检查'],
      list: ['list', 'ls', 'dir', '列出', '显示文件'],
      
      // AI 操作
      explain: ['explain', 'describe', 'tell me about', '解释', '说明', '介绍'],
      generate: ['generate', 'code', 'build', '生成', '代码'],
      review: ['review', 'check code', '审查', '检查代码'],
      fix: ['fix', 'solve', 'debug', '修复', '解决', '调试']
    };

    // 文件类型检测
    this.fileTypes = {
      component: ['component', 'comp', '组件'],
      page: ['page', 'view', '页面', '视图'],
      service: ['service', 'api', '服务', '接口'],
      util: ['util', 'helper', 'tool', '工具', '辅助'],
      test: ['test', 'spec', '测试'],
      config: ['config', 'setting', '配置'],
      style: ['style', 'css', 'scss', '样式'],
      doc: ['doc', 'readme', 'md', '文档']
    };
  }

  /**
   * 处理自然语言输入
   */
  async processInput(input, context = null) {
    try {
      console.log(`🤔 Processing: "${input}"`);

      // 首先尝试本地模式匹配（快速响应）
      const localResult = this.parseLocally(input);
      if (localResult.confidence > 0.8) {
        console.log(`⚡ Using local parsing (confidence: ${(localResult.confidence * 100).toFixed(0)}%)`);
        return await this.executeAction(localResult.action, localResult.parameters, context);
      }

      // 如果本地解析置信度不高，使用 AI 解析
      if (this.ai.isAvailable()) {
        console.log(`🧠 Using AI parsing...`);
        const aiResult = await this.ai.parseCommand(input, context?.projectInfo);
        
        if (aiResult.success) {
          return await this.executeAction(aiResult.action, aiResult.parameters, context);
        } else {
          console.log(`❌ AI parsing failed: ${aiResult.error}`);
          // 回退到本地解析
          return await this.executeAction(localResult.action, localResult.parameters, context);
        }
      } else {
        console.log(`⚠️  AI not available, using local parsing`);
        return await this.executeAction(localResult.action, localResult.parameters, context);
      }

    } catch (error) {
      return {
        success: false,
        error: error.message,
        suggestion: 'Try being more specific about what you want to do.'
      };
    }
  }

  /**
   * 本地解析自然语言（基于规则）
   */
  parseLocally(input) {
    const lowerInput = input.toLowerCase();
    let action = 'chat';
    let parameters = { message: input };
    let confidence = 0.1;

    // 文件路径检测
    const filePathMatch = input.match(/[\w\-\.\/]+\.(js|ts|jsx|tsx|py|java|cpp|c|html|css|json|md|txt|yml|yaml)[\w\-\.\/]*/gi);
    const filePath = filePathMatch ? filePathMatch[0] : null;

    // 文件名检测
    const fileNameMatch = input.match(/[\w\-\.]+\.(js|ts|jsx|tsx|py|java|cpp|c|html|css|json|md|txt|yml|yaml)/gi);
    const fileName = fileNameMatch ? fileNameMatch[0] : null;

    // 检测操作类型
    for (const [actionType, patterns] of Object.entries(this.commandPatterns)) {
      for (const pattern of patterns) {
        if (lowerInput.includes(pattern)) {
          action = actionType;
          confidence = Math.max(confidence, 0.6);
          break;
        }
      }
      if (confidence >= 0.6) break;
    }

    // 根据操作类型设置参数
    switch (action) {
      case 'read':
        if (filePath) {
          parameters = { filePath };
          confidence = 0.9;
        } else {
          parameters = { filePath: this.extractFileName(input) || '.' };
          confidence = 0.5;
        }
        action = 'read_file';
        break;

      case 'write':
        if (this.containsCodeBlock(input)) {
          const { fileName: extractedName, content } = this.extractCodeAndFileName(input);
          parameters = { 
            filePath: extractedName || fileName || 'output.txt', 
            content: content || input 
          };
          confidence = 0.8;
        } else {
          // 检测是否是创建文件
          const fileType = this.detectFileType(input);
          if (fileType) {
            parameters = { 
              fileType, 
              fileName: this.extractFileName(input) || 'NewFile' 
            };
            action = 'create_file';
            confidence = 0.7;
          } else {
            parameters = { 
              filePath: fileName || 'output.txt', 
              content: this.extractContent(input) 
            };
            action = 'write_file';
            confidence = 0.6;
          }
        }
        break;

      case 'edit':
        if (filePath) {
          const { oldText, newText } = this.extractEditParams(input);
          parameters = { filePath, oldText, newText };
          confidence = oldText && newText ? 0.8 : 0.5;
        }
        action = 'edit_file';
        break;

      case 'search':
        const searchTerm = this.extractSearchTerm(input);
        parameters = { 
          searchTerm, 
          path: this.extractPath(input) || '.' 
        };
        confidence = searchTerm ? 0.8 : 0.4;
        action = 'search_files';
        break;

      case 'run':
        const command = this.extractCommand(input);
        parameters = { command };
        confidence = command ? 0.8 : 0.4;
        action = 'run_command';
        break;

      case 'analyze':
        parameters = { path: this.extractPath(input) || '.' };
        confidence = 0.7;
        action = 'analyze_project';
        break;

      case 'list':
        parameters = { path: this.extractPath(input) || '.' };
        confidence = 0.7;
        action = 'list_files';
        break;

      default:
        // 默认为对话
        action = 'chat';
        parameters = { message: input };
        confidence = 0.1;
    }

    return { action, parameters, confidence };
  }

  /**
   * 执行解析后的操作
   */
  async executeAction(action, parameters, context) {
    try {
      switch (action) {
        case 'read_file':
          return await this.toolManager.execute('fs', 'readFile', parameters.filePath);

        case 'write_file':
          return await this.toolManager.execute('fs', 'writeFile', parameters.filePath, parameters.content);

        case 'edit_file':
          return await this.toolManager.execute('fs', 'editFile', parameters.filePath, parameters.oldText, parameters.newText);

        case 'create_file':
          const codeGen = this.toolManager.tools.codeGenerator || require('./code-generator');
          const result = await codeGen.generateFile(parameters.fileType, parameters.fileName, context?.projectInfo);
          if (result.success) {
            return await this.toolManager.execute('fs', 'writeFile', result.filePath, result.content);
          }
          return result;

        case 'search_files':
          return await this.toolManager.execute('fs', 'searchInFiles', parameters.path, parameters.searchTerm);

        case 'run_command':
          return await this.toolManager.execute('cmd', 'run', parameters.command);

        case 'list_files':
          return await this.toolManager.execute('fs', 'listFiles', parameters.path);

        case 'analyze_project':
          return await this.toolManager.tools.analyzer.analyzeProject(parameters.path);

        case 'chat':
          // 如果是对话，尝试使用 AI
          if (this.ai.isAvailable()) {
            return await this.ai.chat(parameters.message, {
              systemPrompt: `你是一个友好的编程助手。当前项目信息：${context?.projectInfo ? JSON.stringify(context.projectInfo, null, 2) : '暂无'}`,
              temperature: 0.7
            });
          } else {
            return {
              success: true,
              response: `我收到了你的消息："${parameters.message}"。但是 AI 功能暂时不可用，请使用具体的命令，或者输入 "help" 查看可用命令。`,
              isLocal: true
            };
          }

        default:
          return {
            success: false,
            error: `Unknown action: ${action}`,
            suggestion: 'Try using a more specific command or type "help" for available commands.'
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        action,
        parameters
      };
    }
  }

  // 辅助方法

  containsCodeBlock(input) {
    return input.includes('```') || input.includes('function') || input.includes('class') || input.includes('import');
  }

  extractCodeAndFileName(input) {
    const codeBlockMatch = input.match(/```[\w]*\n?([\s\S]*?)```/);
    const fileNameMatch = input.match(/(?:文件名|filename|name|保存为)\s*[:：]?\s*([^\s]+)/i);
    
    return {
      content: codeBlockMatch ? codeBlockMatch[1].trim() : null,
      fileName: fileNameMatch ? fileNameMatch[1] : null
    };
  }

  detectFileType(input) {
    const lowerInput = input.toLowerCase();
    for (const [type, patterns] of Object.entries(this.fileTypes)) {
      for (const pattern of patterns) {
        if (lowerInput.includes(pattern)) {
          return type;
        }
      }
    }
    return null;
  }

  extractFileName(input) {
    const fileMatch = input.match(/[\w\-\.]+\.[a-z]+/gi);
    return fileMatch ? fileMatch[0] : null;
  }

  extractContent(input) {
    // 提取引号内的内容或代码块
    const quotedMatch = input.match(/["']([^"']+)["']/);
    if (quotedMatch) return quotedMatch[1];

    const codeMatch = input.match(/```[\w]*\n?([\s\S]*?)```/);
    if (codeMatch) return codeMatch[1].trim();

    // 移除操作词后的内容
    const cleanInput = input.replace(/(write|create|make|写入|创建|生成)\s+/i, '').trim();
    return cleanInput;
  }

  extractEditParams(input) {
    // 尝试提取 "替换 A 为 B" 模式
    const replaceMatch = input.match(/(替换|replace|change)\s+["']?([^"']+)["']?\s+(为|to|with)\s+["']?([^"']+)["']?/i);
    if (replaceMatch) {
      return { oldText: replaceMatch[2], newText: replaceMatch[4] };
    }

    // 尝试提取 "A -> B" 模式
    const arrowMatch = input.match(/["']?([^"']+)["']?\s*->\s*["']?([^"']+)["']?/);
    if (arrowMatch) {
      return { oldText: arrowMatch[1], newText: arrowMatch[2] };
    }

    return { oldText: null, newText: null };
  }

  extractSearchTerm(input) {
    // 提取引号内的搜索词
    const quotedMatch = input.match(/["']([^"']+)["']/);
    if (quotedMatch) return quotedMatch[1];

    // 移除搜索关键词后的内容
    const cleanInput = input.replace(/(search|find|grep|搜索|查找|找)\s+/i, '').trim();
    return cleanInput.split(/\s+/)[0];
  }

  extractCommand(input) {
    // 提取引号内的命令
    const quotedMatch = input.match(/["']([^"']+)["']/);
    if (quotedMatch) return quotedMatch[1];

    // 移除运行关键词后的内容
    const cleanInput = input.replace(/(run|execute|exec|执行|运行)\s+/i, '').trim();
    return cleanInput;
  }

  extractPath(input) {
    // 提取路径
    const pathMatch = input.match(/[\w\-\.\/]+\/[\w\-\.\/]*|\.{1,2}\/[\w\-\.\/]*/);
    return pathMatch ? pathMatch[0] : null;
  }

  /**
   * 获取处理统计
   */
  getStats() {
    return {
      aiAvailable: this.ai.isAvailable(),
      supportedActions: Object.keys(this.commandPatterns),
      supportedFileTypes: Object.keys(this.fileTypes)
    };
  }
}

module.exports = NaturalLanguageProcessor;
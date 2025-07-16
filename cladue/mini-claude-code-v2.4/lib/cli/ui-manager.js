/**
 * UI管理器 - 负责命令行界面的显示和美化
 * @author Mini Claude Code Team
 * @version 3.0.0
 */

const chalk = require('chalk');
const boxen = require('boxen');

class UIManager {
  constructor() {
    this.theme = {
      primary: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red,
      info: chalk.cyan,
      muted: chalk.gray,
      accent: chalk.magenta,
      highlight: chalk.bgBlue.white
    };
  }

  /**
   * 显示欢迎信息
   */
  showWelcome() {
    console.log(boxen(
      `${chalk.blue.bold('🤖 Mini Claude Code v3')}\n${chalk.gray('智能编程助手 - 让AI助力你的开发')}`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'blue',
        textAlignment: 'center'
      }
    ));
  }

  /**
   * 显示启动完成信息
   */
  showReady() {
    console.log(this.theme.success('🚀 交互模式已启动'));
    console.log(this.theme.info('💡 使用 Tab 键自动补全，输入 "help" 查看命令'));
    console.log(this.theme.muted('   输入 "exit" 退出程序\n'));
  }

  /**
   * 显示帮助信息
   */
  showHelp() {
    console.log(boxen(
      this.theme.accent.bold('📖 可用命令'),
      {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        borderStyle: 'round',
        borderColor: 'magenta'
      }
    ));
    
    const commandGroups = [
      {
        title: '📁 文件操作',
        commands: [
          ['analyze [path]', '分析项目结构'],
          ['read <file>', '读取文件内容'],
          ['write <file> <content>', '写入文件内容'],
          ['edit <file> <old> <new>', '编辑文件内容'],
          ['search <term> [path]', '搜索文件内容'],
          ['list [path]', '列出目录文件']
        ]
      },
      {
        title: '🤖 AI功能',
        commands: [
          ['chat <message>', '与AI助手对话 (流式)'],
          ['generate <description>', 'AI生成代码 (流式)'],
          ['ai status', '显示AI服务状态'],
          ['ai review <file>', 'AI代码审查'],
          ['config set-api-key <key>', '设置DeepSeek API密钥'],
          ['config show', '显示当前配置']
        ]
      },
      {
        title: '🔧 错误处理',
        commands: [
          ['fix <file> [error]', '分析和修复文件错误'],
          ['check [path]', '检查项目错误']
        ]
      },
      {
        title: '🧪 测试生成',
        commands: [
          ['test generate <file> [type]', '为文件生成测试'],
          ['test run [file]', '运行测试'],
          ['test framework', '检测测试框架'],
          ['test coverage <test> <source>', '生成覆盖率报告']
        ]
      },
      {
        title: '🎯 任务规划',
        commands: [
          ['plan create "<description>"', '生成任务计划'],
          ['plan execute', '执行当前计划'],
          ['plan status', '显示执行状态'],
          ['plan pause/resume/stop', '控制执行']
        ]
      },
      {
        title: '⚡ 系统工具',
        commands: [
          ['run <command>', '执行shell命令'],
          ['create <type> <name>', '创建新文件'],
          ['status', '显示当前状态'],
          ['suggest', '获取建议操作'],
          ['report', '生成项目报告'],
          ['completion', '显示自动补全统计']
        ]
      }
    ];

    commandGroups.forEach(group => {
      console.log(`\n${this.theme.primary.bold(group.title)}`);
      group.commands.forEach(([cmd, desc]) => {
        console.log(`  ${this.theme.info(cmd.padEnd(30))} ${this.theme.muted(desc)}`);
      });
    });

    console.log(boxen(
      `${this.theme.success('💬 自然语言支持')}\n${this.theme.muted('直接描述你想做的事情，AI会智能理解和执行')}\n\n${this.theme.info('示例:')}\n${this.theme.muted('  "创建一个React组件叫做Header"')}\n${this.theme.muted('  "搜索所有包含TODO的文件"')}\n${this.theme.muted('  "运行npm install"')}`,
      {
        padding: 1,
        margin: { top: 1, bottom: 0, left: 0, right: 0 },
        borderStyle: 'single',
        borderColor: 'green'
      }
    ));

    console.log(boxen(
      `${this.theme.accent('🔧 快捷键')}\n${this.theme.muted('Tab        自动补全命令和路径')}\n${this.theme.muted('Tab Tab    显示所有可用补全')}\n${this.theme.muted('↑/↓       浏览命令历史')}\n${this.theme.muted('Ctrl+C     强制退出')}`,
      {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 0, right: 0 },
        borderStyle: 'single',
        borderColor: 'cyan'
      }
    ));
  }

  /**
   * 显示项目信息
   * @param {Object} analysis - 项目分析结果
   */
  displayProjectInfo(analysis) {
    console.log(boxen(
      this.theme.primary.bold('📊 项目分析结果'),
      {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        borderStyle: 'round',
        borderColor: 'blue'
      }
    ));
    
    console.log(`\n📁 ${this.theme.info('路径:')} ${analysis.path}`);
    console.log(`📄 ${this.theme.info('总文件:')} ${this.theme.success(analysis.totalFiles)}`);
    console.log(`💻 ${this.theme.info('代码文件:')} ${this.theme.success(analysis.codeFiles)}`);
    
    if (Object.keys(analysis.languages).length > 0) {
      console.log(`\n🔤 ${this.theme.primary('编程语言:')}`);
      Object.entries(analysis.languages).forEach(([lang, count]) => {
        console.log(`  ${this.theme.accent('●')} ${lang}: ${this.theme.success(count)} 个文件`);
      });
    }
    
    if (analysis.frameworks.length > 0) {
      console.log(`\n🚀 ${this.theme.primary('检测到的框架:')}`);
      analysis.frameworks.forEach(framework => {
        const confidence = (framework.confidence * 100).toFixed(0);
        console.log(`  ${this.theme.accent('●')} ${framework.name} ${this.theme.muted(`(${confidence}% 置信度)`)}`);
      });
    }
    
    if (analysis.packageManager) {
      console.log(`\n📦 ${this.theme.info('包管理器:')} ${this.theme.success(analysis.packageManager)}`);
    }
    
    console.log('');
  }

  /**
   * 显示文件内容
   * @param {string} content - 文件内容
   * @param {string} filePath - 文件路径
   */
  showFileContent(content, filePath) {
    console.log(this.theme.muted(`\n--- ${filePath} ---`));
    console.log(content);
    console.log(this.theme.muted('--- 文件结束 ---\n'));
  }

  /**
   * 显示搜索结果
   * @param {Array} results - 搜索结果
   */
  showSearchResults(results) {
    results.forEach(file => {
      console.log(`\n📄 ${this.theme.primary(file.file)}:`);
      file.matches.slice(0, 3).forEach(match => {
        console.log(`  ${this.theme.warning(`第${match.line}行:`)} ${match.content}`);
      });
      if (file.matches.length > 3) {
        console.log(this.theme.muted(`  ... 还有 ${file.matches.length - 3} 个匹配项`));
      }
    });
  }

  /**
   * 显示命令执行结果
   * @param {Object} result - 执行结果
   */
  showCommandResult(result) {
    if (result.stdout) {
      console.log(this.theme.success('\n📤 输出:'));
      console.log(result.stdout);
    }
    if (result.stderr) {
      console.log(this.theme.warning('\n⚠️  警告:'));
      console.log(result.stderr);
    }
  }

  /**
   * 显示文件列表
   * @param {Array} files - 文件列表
   */
  showFileList(files) {
    files.forEach(file => {
      const icon = file.isDirectory ? '📁' : '📄';
      const size = file.isDirectory ? '' : this.theme.muted(` (${file.size} bytes)`);
      console.log(`  ${icon} ${file.name}${size}`);
    });
  }

  /**
   * 显示状态信息
   * @param {Object} context - 上下文信息
   */
  showStatus(context) {
    console.log(boxen(
      this.theme.primary.bold('📊 当前状态'),
      {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        borderStyle: 'round',
        borderColor: 'blue'
      }
    ));
    
    console.log(`\n🗂️  ${this.theme.info('工作目录:')} ${context.currentDirectory}`);
    console.log(`⏰ ${this.theme.info('会话开始:')} ${context.session.startTime.toLocaleString()}`);
    console.log(`🔧 ${this.theme.info('已执行命令:')} ${this.theme.success(context.session.commands.length)}`);
    
    if (context.projectInfo) {
      console.log(`\n📦 ${this.theme.primary('项目信息:')}`);
      console.log(`   ${this.theme.info('语言:')} ${Object.keys(context.projectInfo.languages).join(', ') || '无'}`);
      console.log(`   ${this.theme.info('框架:')} ${context.projectInfo.frameworks.map(f => f.name).join(', ') || '无'}`);
      console.log(`   ${this.theme.info('包管理器:')} ${context.projectInfo.packageManager || '无'}`);
      console.log(`   ${this.theme.info('总文件:')} ${context.projectInfo.totalFiles}`);
      console.log(`   ${this.theme.info('代码文件:')} ${context.projectInfo.codeFiles}`);
    }
    
    console.log('');
  }

  /**
   * 显示建议操作
   * @param {Array} suggestions - 建议列表
   */
  showSuggestions(suggestions) {
    if (suggestions.length === 0) {
      console.log(this.theme.warning('💡 暂时没有特定建议。尝试先分析项目！'));
      return;
    }

    console.log(boxen(
      this.theme.primary.bold('💡 建议操作'),
      {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        borderStyle: 'round',
        borderColor: 'yellow'
      }
    ));
    
    suggestions.forEach((suggestion, index) => {
      console.log(`\n${this.theme.accent(`${index + 1}.`)} ${this.theme.success(suggestion.action)}: ${suggestion.description}`);
      console.log(`   ${this.theme.muted('命令:')} ${this.theme.info(suggestion.command)}`);
    });
    
    console.log('');
  }

  /**
   * 显示项目报告
   * @param {Object} report - 项目报告
   */
  showReport(report) {
    console.log(boxen(
      this.theme.primary.bold('📋 项目报告'),
      {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        borderStyle: 'round',
        borderColor: 'blue'
      }
    ));
    
    console.log(this.theme.warning('\n摘要:'));
    Object.entries(report.summary).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    if (report.project) {
      console.log(this.theme.warning('\n项目详情:'));
      console.log(`  语言: ${Object.entries(report.project.languages).map(([lang, count]) => `${lang} (${count})`).join(', ')}`);
      console.log(`  框架: ${report.project.frameworks.map(f => `${f.name} (${(f.confidence * 100).toFixed(0)}%)`).join(', ')}`);
    }
    
    if (report.recentCommands.length > 0) {
      console.log(this.theme.warning('\n最近命令:'));
      report.recentCommands.slice(-5).forEach(cmd => {
        const status = cmd.result ? '✅' : '❌';
        console.log(`  ${status} ${cmd.tool}.${cmd.method} (${cmd.duration}ms)`);
      });
    }
    
    console.log('');
  }

  /**
   * 显示自动补全状态
   * @param {Object} stats - 统计信息
   */
  showCompletionStatus(stats) {
    console.log(boxen(
      this.theme.primary.bold('🔧 自动补全系统状态'),
      {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        borderStyle: 'round',
        borderColor: 'cyan'
      }
    ));
    
    console.log(`\n⚡ ${this.theme.info('基础命令:')} ${this.theme.success(stats.baseCommands)}`);
    console.log(`🗃️ ${this.theme.info('缓存大小:')} ${this.theme.success(stats.cacheSize)} 项`);
    console.log(`🏗️ ${this.theme.info('文件类型:')} ${this.theme.success(stats.supportedFileTypes)}`);
    console.log(`📄 ${this.theme.info('扩展名:')} ${this.theme.success(stats.commonExtensions)}`);
    
    console.log(this.theme.primary('\n📋 可用补全类型:'));
    const completionTypes = [
      '• 命令和子命令',
      '• 文件路径和目录',
      '• 文件类型和扩展名',
      '• 项目特定建议',
      '• 命令历史'
    ];
    
    completionTypes.forEach(type => {
      console.log(`   ${this.theme.muted(type)}`);
    });
    
    console.log(this.theme.primary('\n💡 使用技巧:'));
    const tips = [
      '• 按 Tab 键自动补全',
      '• 按两次 Tab 显示所有选项',
      '• 用 ↑/↓ 箭头浏览历史',
      '• 输入部分命令获得智能建议'
    ];
    
    tips.forEach(tip => {
      console.log(`   ${this.theme.muted(tip)}`);
    });
    
    console.log('');
  }

  /**
   * 显示AI响应头部
   */
  showAIResponseHeader() {
    console.log(this.theme.primary('\n🤖 AI助手:'));
  }

  /**
   * 显示AI响应
   * @param {string} response - AI响应内容
   */
  showAIResponse(response) {
    console.log(this.theme.primary('\n🤖 AI助手:'));
    console.log(response);
  }

  /**
   * 显示流式统计
   * @param {number} chunks - 数据块数量
   */
  showStreamingStats(chunks) {
    console.log(this.theme.muted(`\n💬 完成，共 ${chunks} 个数据块`));
  }

  /**
   * 显示令牌使用量
   * @param {number} tokens - 使用的令牌数
   */
  showTokenUsage(tokens) {
    console.log(this.theme.muted(`\n📊 使用令牌: ${tokens}`));
  }

  /**
   * 显示代码生成头部
   * @param {string} description - 描述
   */
  showCodeGenerationHeader(description) {
    console.log(this.theme.primary('\n🎨 AI代码生成器:'));
    console.log(this.theme.muted(`生成代码: "${description}"`));
  }

  /**
   * 显示代码块开始
   */
  showCodeBlockStart() {
    console.log(this.theme.success('\n--- 生成的代码 ---'));
  }

  /**
   * 显示代码块结束
   */
  showCodeBlockEnd() {
    console.log(this.theme.muted('--- 代码结束 ---'));
  }

  /**
   * 显示代码保存信息
   * @param {string} filePath - 文件路径
   * @param {number} lines - 行数
   */
  showCodeSaved(filePath, lines) {
    console.log(this.theme.primary(`\n📄 代码已保存到: ${filePath}`));
    console.log(this.theme.muted(`💾 共生成 ${lines} 行代码`));
  }

  /**
   * 显示代码审查结果
   * @param {string} review - 审查结果
   */
  showCodeReview(review) {
    console.log(this.theme.primary('\n📋 AI代码审查:'));
    console.log(review);
  }

  /**
   * 显示AI状态
   * @param {Object} status - AI状态信息
   */
  showAIStatus(status) {
    console.log(boxen(
      this.theme.primary.bold('🤖 AI服务状态'),
      {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        borderStyle: 'round',
        borderColor: 'blue'
      }
    ));
    
    console.log(`\n🔌 ${this.theme.info('可用性:')} ${status.available ? this.theme.success('是') : this.theme.error('否')}`);
    
    if (status.stats.isConfigured) {
      console.log(`🔑 ${this.theme.info('API密钥:')} ${this.theme.muted(status.stats.apiKey)}`);
      console.log(`📊 ${this.theme.info('模型:')} ${Object.values(status.stats.availableModels).join(', ')}`);
    } else {
      console.log(this.theme.warning('⚠️  API密钥未配置'));
      console.log(this.theme.muted('   使用: config set-api-key <你的-deepseek-api-密钥>'));
    }
    
    console.log(`\n🧠 ${this.theme.primary('NLP状态:')}`);
    console.log(`   支持的操作: ${status.nlpStats.supportedActions.length}`);
    console.log(`   文件类型: ${status.nlpStats.supportedFileTypes.length}`);
    
    console.log(`\n💾 ${this.theme.primary('记忆系统:')}`);
    console.log(`   对话记录: ${status.memoryStats.conversationCount}`);
    console.log(`   代码片段: ${status.memoryStats.codeSnippetCount}`);
    console.log(`   用户偏好: ${status.memoryStats.userPreferences}`);
    console.log(`   记忆项目: ${status.memoryStats.projectsRemembered}`);
    console.log(`   当前会话: ${status.memoryStats.currentSessionId}`);
    console.log('');
  }

  /**
   * 显示错误信息
   * @param {string} message - 错误消息
   * @param {string} details - 详细信息
   */
  showError(message, details = null) {
    console.log(`${this.theme.error('❌')} ${this.theme.error(message)}`);
    if (details) {
      console.log(this.theme.muted(details));
    }
  }

  /**
   * 显示警告信息
   * @param {string} message - 警告消息
   */
  showWarning(message) {
    console.log(`${this.theme.warning('⚠️')} ${this.theme.warning(message)}`);
  }

  /**
   * 显示成功信息
   * @param {string} message - 成功消息
   */
  showSuccess(message) {
    console.log(`${this.theme.success('✅')} ${this.theme.success(message)}`);
  }

  /**
   * 显示信息
   * @param {string} message - 信息消息
   */
  showInfo(message) {
    console.log(`${this.theme.info('💡')} ${this.theme.info(message)}`);
  }

  /**
   * 显示建议
   * @param {string} message - 建议消息
   */
  showSuggestion(message) {
    console.log(`${this.theme.warning('💡')} ${this.theme.warning(message)}`);
  }

  /**
   * 显示退出信息
   */
  showGoodbye() {
    console.log(boxen(
      `${this.theme.success('👋 感谢使用 Mini Claude Code!')}\n${this.theme.muted('期待下次为您服务')}`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green',
        textAlignment: 'center'
      }
    ));
  }
}

module.exports = UIManager;
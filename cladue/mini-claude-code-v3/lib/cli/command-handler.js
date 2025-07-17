/**
 * 命令处理器 - 处理各种CLI命令的执行逻辑
 * @author Mini Claude Code Team
 * @version 3.0.0
 */

const chalk = require('chalk');
const ora = require('ora');

class CommandHandler {
  /**
   * 初始化命令处理器
   * @param {Object} toolManager - 工具管理器实例
   * @param {Object} codeGenerator - 代码生成器实例
   * @param {Object} uiManager - UI管理器实例
   */
  constructor(toolManager, codeGenerator, uiManager) {
    this.toolManager = toolManager;
    this.codeGenerator = codeGenerator;
    this.ui = uiManager;
  }

  /**
   * 分析项目结构
   * @param {string} projectPath - 项目路径
   * @returns {Promise<void>}
   */
  async analyzeProject(projectPath) {
    const spinner = ora('分析项目中...').start();
    
    try {
      const result = await this.toolManager.initialize(projectPath);
      if (result.success) {
        spinner.succeed('项目分析完成');
        this.ui.displayProjectInfo(result.analysis);
      } else {
        spinner.fail(`分析失败: ${result.error}`);
      }
    } catch (error) {
      spinner.fail(`分析错误: ${error.message}`);
    }
  }

  /**
   * 读取文件内容
   * @param {string} filePath - 文件路径
   * @returns {Promise<void>}
   */
  async readFile(filePath) {
    if (!filePath) {
      this.ui.showError('请指定文件路径');
      return;
    }

    const spinner = ora(`读取 ${filePath}...`).start();
    
    try {
      const result = await this.toolManager.execute('fs', 'readFile', filePath);
      if (result.success) {
        spinner.succeed(`文件读取成功 (${result.lines} 行, ${result.size} 字节)`);
        this.ui.showFileContent(result.content, filePath);
      } else {
        spinner.fail(`读取失败: ${result.error}`);
      }
    } catch (error) {
      spinner.fail(`读取错误: ${error.message}`);
    }
  }

  /**
   * 写入文件
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @returns {Promise<void>}
   */
  async writeFile(filePath, content) {
    if (!filePath || !content) {
      this.ui.showError('请指定文件路径和内容');
      return;
    }

    const spinner = ora(`写入 ${filePath}...`).start();
    
    try {
      const result = await this.toolManager.execute('fs', 'writeFile', filePath, content);
      if (result.success) {
        spinner.succeed(`文件写入成功: ${filePath}`);
      } else {
        spinner.fail(`写入失败: ${result.error}`);
      }
    } catch (error) {
      spinner.fail(`写入错误: ${error.message}`);
    }
  }

  /**
   * 编辑文件
   * @param {string} filePath - 文件路径
   * @param {string} oldText - 要替换的文本
   * @param {string} newText - 新文本
   * @returns {Promise<void>}
   */
  async editFile(filePath, oldText, newText) {
    if (!filePath || !oldText || !newText) {
      this.ui.showError('请指定文件路径、原文本和新文本');
      return;
    }

    const spinner = ora(`编辑 ${filePath}...`).start();
    
    try {
      const result = await this.toolManager.execute('fs', 'editFile', filePath, oldText, newText);
      if (result.success) {
        spinner.succeed(`文件编辑成功: ${filePath}`);
      } else {
        spinner.fail(`编辑失败: ${result.error}`);
      }
    } catch (error) {
      spinner.fail(`编辑错误: ${error.message}`);
    }
  }

  /**
   * 搜索文件内容
   * @param {string} searchTerm - 搜索词
   * @param {string} searchPath - 搜索路径
   * @returns {Promise<void>}
   */
  async searchInFiles(searchTerm, searchPath = '.') {
    if (!searchTerm) {
      this.ui.showError('请指定搜索词');
      return;
    }

    const spinner = ora(`搜索 "${searchTerm}"...`).start();
    
    try {
      const result = await this.toolManager.execute('fs', 'searchInFiles', searchPath, searchTerm);
      if (result.success) {
        const totalMatches = result.results.reduce((sum, file) => sum + file.matches.length, 0);
        spinner.succeed(`找到 ${totalMatches} 个匹配项，共 ${result.results.length} 个文件`);
        
        this.ui.showSearchResults(result.results);
      } else {
        spinner.fail(`搜索失败: ${result.error}`);
      }
    } catch (error) {
      spinner.fail(`搜索错误: ${error.message}`);
    }
  }

  /**
   * 运行shell命令
   * @param {string} command - 要执行的命令
   * @returns {Promise<void>}
   */
  async runCommand(command) {
    if (!command) {
      this.ui.showError('请指定要执行的命令');
      return;
    }

    const spinner = ora(`执行: ${command}`).start();
    
    try {
      const result = await this.toolManager.execute('cmd', 'run', command);
      if (result.success) {
        spinner.succeed('命令执行完成');
        this.ui.showCommandResult(result);
      } else {
        spinner.fail(`命令执行失败: ${result.error}`);
        if (result.stderr) {
          this.ui.showError('错误输出:', result.stderr);
        }
      }
    } catch (error) {
      spinner.fail(`命令错误: ${error.message}`);
    }
  }

  /**
   * 创建文件
   * @param {string} fileType - 文件类型
   * @param {string} fileName - 文件名
   * @returns {Promise<void>}
   */
  async createFile(fileType, fileName) {
    if (!fileType || !fileName) {
      this.ui.showError('请指定文件类型和名称');
      this.ui.showInfo('示例: create component Button');
      return;
    }

    const spinner = ora(`创建 ${fileType}: ${fileName}...`).start();
    
    try {
      const result = await this.codeGenerator.generateFile(fileType, fileName, this.toolManager.context.projectInfo);
      if (result.success) {
        // 写入生成的文件
        const writeResult = await this.toolManager.execute('fs', 'writeFile', result.filePath, result.content);
        if (writeResult.success) {
          spinner.succeed(`创建 ${fileType}: ${result.filePath}`);
        } else {
          spinner.fail(`文件写入失败: ${writeResult.error}`);
        }
      } else {
        spinner.fail(`生成 ${fileType} 失败: ${result.error}`);
      }
    } catch (error) {
      spinner.fail(`创建错误: ${error.message}`);
    }
  }

  /**
   * 列出目录文件
   * @param {string} dirPath - 目录路径
   * @returns {Promise<void>}
   */
  async listFiles(dirPath = '.') {
    const spinner = ora(`列出 ${dirPath} 中的文件...`).start();
    
    try {
      const result = await this.toolManager.execute('fs', 'listFiles', dirPath);
      if (result.success) {
        spinner.succeed(`找到 ${result.files.length} 个项目`);
        this.ui.showFileList(result.files);
      } else {
        spinner.fail(`列表失败: ${result.error}`);
      }
    } catch (error) {
      spinner.fail(`列表错误: ${error.message}`);
    }
  }

  /**
   * 显示当前状态
   */
  showStatus() {
    const context = this.toolManager.getContext();
    this.ui.showStatus(context);
  }

  /**
   * 显示建议操作
   */
  showSuggestions() {
    const suggestions = this.toolManager.suggestNextActions();
    this.ui.showSuggestions(suggestions);
  }

  /**
   * 生成项目报告
   */
  showReport() {
    const report = this.toolManager.generateReport();
    this.ui.showReport(report);
  }

  /**
   * 显示自动补全状态
   * @param {Object} autoCompletion - 自动补全实例
   */
  showCompletionStatus(autoCompletion) {
    if (!autoCompletion) {
      this.ui.showError('自动补全系统未初始化');
      return;
    }

    const stats = autoCompletion.getStats();
    this.ui.showCompletionStatus(stats);
  }
}

module.exports = CommandHandler;
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

class FileSystemTool {
  constructor() {
    this.name = 'FileSystem';
  }

  /**
   * 读取文件内容
   */
  async readFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return {
        success: true,
        content,
        lines: content.split('\n').length,
        size: Buffer.byteLength(content, 'utf8')
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 写入文件
   */
  async writeFile(filePath, content) {
    try {
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content, 'utf8');
      return {
        success: true,
        message: `File written to ${filePath}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 编辑文件 - 简单的字符串替换
   */
  async editFile(filePath, oldString, newString) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const newContent = content.replace(oldString, newString);
      
      if (content === newContent) {
        return {
          success: false,
          error: 'String not found in file'
        };
      }

      await fs.writeFile(filePath, newContent, 'utf8');
      return {
        success: true,
        message: `File ${filePath} edited successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 列出目录文件
   */
  async listFiles(dirPath, pattern = '*') {
    try {
      const globPattern = path.join(dirPath, pattern);
      const files = glob.sync(globPattern, { 
        windowsPathsNoEscape: true 
      });
      const result = [];
      
      for (const file of files) {
        const stats = await fs.stat(file);
        result.push({
          path: file,
          name: path.basename(file),
          isDirectory: stats.isDirectory(),
          size: stats.size,
          modified: stats.mtime
        });
      }

      return {
        success: true,
        files: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 搜索文件内容
   */
  async searchInFiles(dirPath, searchTerm, filePattern = '**/*.{js,ts,json,md}') {
    try {
      const globPattern = path.join(dirPath, filePattern);
      const files = glob.sync(globPattern, { 
        windowsPathsNoEscape: true 
      });
      const results = [];

      for (const file of files) {
        try {
          const content = await fs.readFile(file, 'utf8');
          const lines = content.split('\n');
          const matches = [];

          lines.forEach((line, index) => {
            if (line.includes(searchTerm)) {
              matches.push({
                line: index + 1,
                content: line.trim(),
                context: lines.slice(Math.max(0, index - 1), index + 2)
              });
            }
          });

          if (matches.length > 0) {
            results.push({
              file,
              matches
            });
          }
        } catch (fileError) {
          // Skip files that can't be read
          continue;
        }
      }

      return {
        success: true,
        results
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 创建目录
   */
  async createDirectory(dirPath) {
    try {
      await fs.ensureDir(dirPath);
      return {
        success: true,
        message: `Directory created: ${dirPath}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 检查文件是否存在
   */
  async exists(filePath) {
    try {
      await fs.access(filePath);
      return {
        success: true,
        exists: true
      };
    } catch (error) {
      return {
        success: true,
        exists: false
      };
    }
  }
}

module.exports = FileSystemTool;
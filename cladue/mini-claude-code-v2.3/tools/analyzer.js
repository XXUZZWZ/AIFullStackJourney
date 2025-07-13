const path = require('path');
const FileSystemTool = require('./filesystem');

class CodeAnalyzer {
  constructor() {
    this.name = 'CodeAnalyzer';
    this.fs = new FileSystemTool();
    
    // 文件类型映射
    this.languageMap = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c',
      '.cs': 'csharp',
      '.php': 'php',
      '.rb': 'ruby',
      '.go': 'go',
      '.rs': 'rust',
      '.swift': 'swift',
      '.kt': 'kotlin',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.sass': 'sass',
      '.less': 'less',
      '.json': 'json',
      '.xml': 'xml',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.md': 'markdown'
    };

    // 框架检测规则
    this.frameworkDetection = {
      'react': {
        files: ['package.json'],
        patterns: ['"react":', 'import React', 'from "react"'],
        dependencies: ['react', 'react-dom']
      },
      'vue': {
        files: ['package.json', '*.vue'],
        patterns: ['"vue":', 'Vue.component', '<template>'],
        dependencies: ['vue']
      },
      'angular': {
        files: ['angular.json', 'package.json'],
        patterns: ['"@angular/', 'import { Component }'],
        dependencies: ['@angular/core']
      },
      'express': {
        files: ['package.json'],
        patterns: ['"express":', 'require("express")', 'app.listen'],
        dependencies: ['express']
      },
      'next': {
        files: ['next.config.js', 'package.json'],
        patterns: ['"next":', 'import next'],
        dependencies: ['next']
      },
      'vite': {
        files: ['vite.config.js', 'vite.config.ts'],
        patterns: ['"vite":', 'defineConfig'],
        dependencies: ['vite']
      }
    };
  }

  /**
   * 分析项目结构
   */
  async analyzeProject(projectPath) {
    try {
      const analysis = {
        path: projectPath,
        languages: {},
        frameworks: [],
        packageManager: null,
        totalFiles: 0,
        codeFiles: 0,
        structure: {}
      };

      // 获取文件列表
      const filesResult = await this.fs.listFiles(projectPath, '**/*');
      if (!filesResult.success) {
        return { success: false, error: filesResult.error };
      }

      const files = Array.isArray(filesResult.files) ? filesResult.files.filter(f => !f.isDirectory) : [];
      analysis.totalFiles = files.length;

      // 分析语言分布
      files.forEach(file => {
        const ext = path.extname(file.name).toLowerCase();
        const language = this.languageMap[ext];
        
        if (language) {
          analysis.codeFiles++;
          analysis.languages[language] = (analysis.languages[language] || 0) + 1;
        }
      });

      // 检测包管理器
      analysis.packageManager = await this.detectPackageManager(projectPath);

      // 检测框架
      analysis.frameworks = await this.detectFrameworks(projectPath);

      // 分析目录结构
      analysis.structure = await this.analyzeDirectoryStructure(projectPath);

      return {
        success: true,
        analysis
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 检测包管理器
   */
  async detectPackageManager(projectPath) {
    const managers = [
      { name: 'pnpm', file: 'pnpm-lock.yaml' },
      { name: 'yarn', file: 'yarn.lock' },
      { name: 'npm', file: 'package-lock.json' },
      { name: 'npm', file: 'package.json' }
    ];

    for (const manager of managers) {
      const exists = await this.fs.exists(path.join(projectPath, manager.file));
      if (exists.exists) {
        return manager.name;
      }
    }

    return null;
  }

  /**
   * 检测使用的框架
   */
  async detectFrameworks(projectPath) {
    const detectedFrameworks = [];

    for (const [framework, config] of Object.entries(this.frameworkDetection)) {
      let score = 0;

      // 检查关键文件
      for (const file of config.files) {
        const exists = await this.fs.exists(path.join(projectPath, file));
        if (exists.exists) {
          score += 2;

          // 如果是 package.json，检查依赖
          if (file === 'package.json') {
            const packageResult = await this.fs.readFile(path.join(projectPath, file));
            if (packageResult.success) {
              try {
                const packageData = JSON.parse(packageResult.content);
                const allDeps = {
                  ...packageData.dependencies,
                  ...packageData.devDependencies
                };

                for (const dep of config.dependencies) {
                  if (allDeps[dep]) {
                    score += 3;
                  }
                }
              } catch (e) {
                // Invalid JSON, skip
              }
            }
          }
        }
      }

      // 检查代码模式
      const searchResult = await this.fs.searchInFiles(projectPath, config.patterns[0]);
      if (searchResult.success && searchResult.results.length > 0) {
        score += searchResult.results.length;
      }

      if (score >= 3) {
        detectedFrameworks.push({
          name: framework,
          confidence: Math.min(score / 10, 1),
          score
        });
      }
    }

    return detectedFrameworks.sort((a, b) => b.score - a.score);
  }

  /**
   * 分析目录结构
   */
  async analyzeDirectoryStructure(projectPath) {
    const structure = {
      hasTests: false,
      hasDocs: false,
      hasConfig: false,
      hasSource: false,
      commonDirs: []
    };

    const dirsResult = await this.fs.listFiles(projectPath, '*/');
    if (dirsResult.success && Array.isArray(dirsResult.files)) {
      const dirs = dirsResult.files
        .filter(f => f.isDirectory)
        .map(f => f.name.toLowerCase());

      structure.hasTests = dirs.some(d => ['test', 'tests', '__tests__', 'spec'].includes(d));
      structure.hasDocs = dirs.some(d => ['docs', 'doc', 'documentation'].includes(d));
      structure.hasConfig = dirs.some(d => ['config', 'configs', '.config'].includes(d));
      structure.hasSource = dirs.some(d => ['src', 'source', 'lib', 'app'].includes(d));
      structure.commonDirs = dirs;
    }

    return structure;
  }

  /**
   * 分析文件内容获取函数和类定义
   */
  async analyzeCodeStructure(filePath) {
    const result = await this.fs.readFile(filePath);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    const content = result.content;
    const ext = path.extname(filePath).toLowerCase();
    const language = this.languageMap[ext];

    const analysis = {
      language,
      functions: [],
      classes: [],
      imports: [],
      exports: [],
      lineCount: result.lines
    };

    if (language === 'javascript' || language === 'typescript') {
      // JavaScript/TypeScript 分析
      analysis.functions = this.extractJSFunctions(content);
      analysis.classes = this.extractJSClasses(content);
      analysis.imports = this.extractJSImports(content);
      analysis.exports = this.extractJSExports(content);
    } else if (language === 'python') {
      // Python 分析
      analysis.functions = this.extractPythonFunctions(content);
      analysis.classes = this.extractPythonClasses(content);
      analysis.imports = this.extractPythonImports(content);
    }

    return {
      success: true,
      analysis
    };
  }

  /**
   * 提取 JavaScript 函数
   */
  extractJSFunctions(content) {
    const patterns = [
      /function\s+(\w+)\s*\(/g,
      /const\s+(\w+)\s*=\s*\(/g,
      /(\w+)\s*:\s*function\s*\(/g,
      /(\w+)\s*=>\s*/g
    ];

    const functions = [];
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        functions.push(match[1]);
      }
    });

    return [...new Set(functions)];
  }

  /**
   * 提取 JavaScript 类
   */
  extractJSClasses(content) {
    const pattern = /class\s+(\w+)/g;
    const classes = [];
    let match;
    
    while ((match = pattern.exec(content)) !== null) {
      classes.push(match[1]);
    }

    return classes;
  }

  /**
   * 提取 JavaScript 导入
   */
  extractJSImports(content) {
    const patterns = [
      /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
      /require\(['"]([^'"]+)['"]\)/g
    ];

    const imports = [];
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        imports.push(match[1]);
      }
    });

    return [...new Set(imports)];
  }

  /**
   * 提取 JavaScript 导出
   */
  extractJSExports(content) {
    const patterns = [
      /export\s+(?:default\s+)?(?:class|function|const|let|var)\s+(\w+)/g,
      /exports\.(\w+)/g,
      /module\.exports\s*=\s*(\w+)/g
    ];

    const exports = [];
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        exports.push(match[1]);
      }
    });

    return [...new Set(exports)];
  }

  /**
   * 提取 Python 函数
   */
  extractPythonFunctions(content) {
    const pattern = /def\s+(\w+)\s*\(/g;
    const functions = [];
    let match;
    
    while ((match = pattern.exec(content)) !== null) {
      functions.push(match[1]);
    }

    return functions;
  }

  /**
   * 提取 Python 类
   */
  extractPythonClasses(content) {
    const pattern = /class\s+(\w+)/g;
    const classes = [];
    let match;
    
    while ((match = pattern.exec(content)) !== null) {
      classes.push(match[1]);
    }

    return classes;
  }

  /**
   * 提取 Python 导入
   */
  extractPythonImports(content) {
    const patterns = [
      /from\s+(\w+(?:\.\w+)*)\s+import/g,
      /import\s+(\w+(?:\.\w+)*)/g
    ];

    const imports = [];
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        imports.push(match[1]);
      }
    });

    return [...new Set(imports)];
  }
}

module.exports = CodeAnalyzer;
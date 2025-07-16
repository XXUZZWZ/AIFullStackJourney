const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

class IntelligentErrorHandler {
  constructor(toolManager) {
    this.toolManager = toolManager;
    this.name = 'IntelligentErrorHandler';
    
    // 常见错误模式和修复策略
    this.errorPatterns = {
      // JavaScript/TypeScript 错误
      syntax: {
        patterns: [
          /SyntaxError: (.+)/,
          /Unexpected token (.+)/,
          /Missing \) after argument list/,
          /Unexpected end of input/
        ],
        severity: 'high',
        autoFixable: true
      },
      
      import: {
        patterns: [
          /Cannot find module ['"](.+)['"]/,
          /Module not found: Error: Can't resolve ['"](.+)['"]/,
          /Cannot resolve module ['"](.+)['"]/
        ],
        severity: 'medium',
        autoFixable: true
      },
      
      type: {
        patterns: [
          /(.+) is not defined/,
          /(.+) is not a function/,
          /Cannot read property ['"](.+)['"] of (.+)/,
          /Property ['"](.+)['"] does not exist on type ['"](.+)['"]/
        ],
        severity: 'medium',
        autoFixable: false
      },
      
      react: {
        patterns: [
          /Each child in a list should have a unique "key" prop/,
          /Warning: (.+) is using uppercase HTML/,
          /Warning: React does not recognize the `(.+)` prop/
        ],
        severity: 'low',
        autoFixable: true
      },
      
      eslint: {
        patterns: [
          /(.+) is assigned a value but never used/,
          /Missing semicolon/,
          /Unexpected console statement/,
          /'(.+)' is not defined no-undef/
        ],
        severity: 'low',
        autoFixable: true
      }
    };

    // 修复策略映射
    this.fixStrategies = {
      missingImport: this.fixMissingImport.bind(this),
      syntaxError: this.fixSyntaxError.bind(this),
      undefinedVariable: this.fixUndefinedVariable.bind(this),
      reactKey: this.fixReactKey.bind(this),
      unusedVariable: this.fixUnusedVariable.bind(this),
      missingSemicolon: this.fixMissingSemicolon.bind(this)
    };
  }

  /**
   * 分析错误信息并提供修复建议
   */
  async analyzeError(errorMessage, filePath = null, context = {}) {
    try {
      console.log(`🔍 Analyzing error: ${errorMessage.substring(0, 100)}...`);
      
      const errorAnalysis = {
        originalError: errorMessage,
        filePath,
        detectedType: null,
        severity: 'unknown',
        autoFixable: false,
        suggestions: [],
        aiAnalysis: null
      };

      // 本地模式识别
      const localAnalysis = this.classifyErrorLocally(errorMessage);
      if (localAnalysis) {
        errorAnalysis.detectedType = localAnalysis.type;
        errorAnalysis.severity = localAnalysis.severity;
        errorAnalysis.autoFixable = localAnalysis.autoFixable;
        errorAnalysis.suggestions = localAnalysis.suggestions;
      }

      // AI 深度分析
      if (this.toolManager.ai.isAvailable()) {
        const aiAnalysis = await this.getAIErrorAnalysis(errorMessage, filePath, context);
        if (aiAnalysis.success) {
          errorAnalysis.aiAnalysis = aiAnalysis.analysis;
          errorAnalysis.suggestions = [
            ...errorAnalysis.suggestions,
            ...aiAnalysis.analysis.suggestions
          ];
        }
      }

      return {
        success: true,
        analysis: errorAnalysis
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 本地错误分类
   */
  classifyErrorLocally(errorMessage) {
    for (const [type, config] of Object.entries(this.errorPatterns)) {
      for (const pattern of config.patterns) {
        const match = errorMessage.match(pattern);
        if (match) {
          return {
            type,
            severity: config.severity,
            autoFixable: config.autoFixable,
            match: match[1] || match[0],
            suggestions: this.getLocalSuggestions(type, match)
          };
        }
      }
    }
    return null;
  }

  /**
   * 获取本地修复建议
   */
  getLocalSuggestions(errorType, match) {
    const suggestions = {
      syntax: [
        '检查语法错误，特别是括号、分号和引号',
        '使用代码格式化工具检查代码结构',
        '检查函数定义和调用的语法'
      ],
      import: [
        `检查模块 "${match[1]}" 是否已安装`,
        '验证导入路径是否正确',
        '检查文件扩展名是否正确',
        '考虑使用相对路径或绝对路径'
      ],
      type: [
        `检查变量 "${match[1]}" 是否已定义`,
        '验证对象属性是否存在',
        '添加类型检查或默认值',
        '检查函数调用的参数类型'
      ],
      react: [
        '为列表项添加唯一的 key 属性',
        '检查 React 组件的 prop 命名',
        '验证 JSX 语法和组件使用'
      ],
      eslint: [
        '移除未使用的变量或添加 eslint-disable',
        '添加缺失的分号',
        '移除 console.log 语句或添加注释'
      ]
    };

    return suggestions[errorType] || ['使用 AI 分析获取更详细的修复建议'];
  }

  /**
   * AI 错误分析
   */
  async getAIErrorAnalysis(errorMessage, filePath, context) {
    try {
      const fileContent = filePath && await fs.pathExists(filePath) 
        ? await fs.readFile(filePath, 'utf8') 
        : null;

      const contextPrompt = this.toolManager.memory?.generateContextPrompt(
        `错误分析: ${errorMessage}`, 
        this.toolManager.context.projectInfo
      ) || '';

      const prompt = `请分析以下错误并提供详细的修复建议：

错误信息: ${errorMessage}
${filePath ? `文件路径: ${filePath}` : ''}
${fileContent ? `\n代码内容:\n\`\`\`\n${fileContent.substring(0, 2000)}\n\`\`\`` : ''}

项目上下文:
${contextPrompt}

请提供JSON格式的分析结果，包含：
1. errorType: 错误类型
2. rootCause: 根本原因
3. severity: 严重程度 (high/medium/low)
4. suggestions: 修复建议数组
5. codeExample: 修复代码示例（如果适用）
6. preventionTips: 预防建议

只返回JSON，不要包含其他文字。`;

      const result = await this.toolManager.ai.chat(prompt, {
        temperature: 0.3,
        maxTokens: 1500,
        timeout: 20000
      });

      if (result.success) {
        try {
          const analysis = JSON.parse(result.response);
          return {
            success: true,
            analysis
          };
        } catch (parseError) {
          return {
            success: true,
            analysis: {
              errorType: 'unknown',
              rootCause: result.response.substring(0, 200),
              severity: 'medium',
              suggestions: [result.response.substring(0, 500)],
              codeExample: null,
              preventionTips: []
            }
          };
        }
      }

      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 自动修复错误
   */
  async autoFix(filePath, errorAnalysis, options = {}) {
    try {
      if (!errorAnalysis.autoFixable) {
        return {
          success: false,
          error: 'This error type is not auto-fixable',
          manual: true
        };
      }

      const { detectedType, match } = errorAnalysis;
      const fixStrategy = this.getFixStrategy(detectedType);

      if (!fixStrategy) {
        return {
          success: false,
          error: 'No fix strategy available for this error type'
        };
      }

      console.log(`🔧 Attempting to auto-fix ${detectedType} error in ${filePath}`);

      const fixResult = await fixStrategy(filePath, match, errorAnalysis, options);

      if (fixResult.success) {
        // 保存修复记录到记忆系统
        if (this.toolManager.memory) {
          await this.toolManager.memory.addCodeSnippet(
            fixResult.fixedCode || 'Auto-fix applied',
            `Auto-fix: ${detectedType} error`,
            'auto-fix',
            {
              projectPath: this.toolManager.context.currentDirectory,
              errorType: detectedType,
              filePath
            }
          );
        }
      }

      return fixResult;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取修复策略
   */
  getFixStrategy(errorType) {
    const strategyMap = {
      import: this.fixStrategies.missingImport,
      syntax: this.fixStrategies.syntaxError,
      type: this.fixStrategies.undefinedVariable,
      react: this.fixStrategies.reactKey,
      eslint: this.fixStrategies.unusedVariable
    };

    return strategyMap[errorType];
  }

  /**
   * 修复缺失导入
   */
  async fixMissingImport(filePath, missingModule, errorAnalysis) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      
      // 检测导入风格 (ES6 vs CommonJS)
      const hasESImports = content.includes('import ') || content.includes('export ');
      
      let importStatement;
      if (hasESImports) {
        importStatement = this.generateES6Import(missingModule);
      } else {
        importStatement = `const ${missingModule} = require('${missingModule}');`;
      }

      // 找到插入位置（其他导入语句之后）
      let insertIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('import ') || lines[i].includes('require(')) {
          insertIndex = i + 1;
        } else if (lines[i].trim() && !lines[i].startsWith('//') && !lines[i].startsWith('/*')) {
          break;
        }
      }

      lines.splice(insertIndex, 0, importStatement);
      const fixedContent = lines.join('\n');

      await fs.writeFile(filePath, fixedContent);

      return {
        success: true,
        message: `Added import for ${missingModule}`,
        fixedCode: importStatement,
        changes: [`Added: ${importStatement}`]
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 生成 ES6 导入语句
   */
  generateES6Import(moduleName) {
    // 常见的默认导入模块
    const defaultImports = ['react', 'vue', 'axios', 'lodash', 'moment'];
    
    if (defaultImports.includes(moduleName.toLowerCase())) {
      const capitalizedName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
      return `import ${capitalizedName} from '${moduleName}';`;
    }
    
    // 命名导入
    return `import { ${moduleName} } from '${moduleName}';`;
  }

  /**
   * 修复语法错误
   */
  async fixSyntaxError(filePath, syntaxError, errorAnalysis) {
    try {
      // 对于语法错误，使用 AI 进行修复
      if (!this.toolManager.ai.isAvailable()) {
        return {
          success: false,
          error: 'AI required for syntax error fixing'
        };
      }

      const content = await fs.readFile(filePath, 'utf8');
      
      const prompt = `请修复以下代码中的语法错误：

错误信息: ${syntaxError}
代码内容:
\`\`\`javascript
${content}
\`\`\`

请返回修复后的完整代码，不要包含解释文字。`;

      const result = await this.toolManager.ai.chat(prompt, {
        temperature: 0.2,
        maxTokens: 3000,
        timeout: 25000
      });

      if (result.success) {
        // 提取代码块
        const codeMatch = result.response.match(/```(?:javascript|js|typescript|ts)?\n?([\s\S]*?)\n?```/);
        const fixedCode = codeMatch ? codeMatch[1] : result.response;

        // 创建备份
        await fs.writeFile(`${filePath}.backup`, content);
        
        // 写入修复后的代码
        await fs.writeFile(filePath, fixedCode);

        return {
          success: true,
          message: 'Syntax error fixed using AI',
          fixedCode: fixedCode,
          changes: ['AI-generated syntax fix'],
          backup: `${filePath}.backup`
        };
      }

      return {
        success: false,
        error: 'AI could not fix the syntax error'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 修复未定义变量
   */
  async fixUndefinedVariable(filePath, variable, errorAnalysis) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      
      // 检查是否是常见的全局变量或 API
      const globalFixes = this.getGlobalVariableFix(variable);
      if (globalFixes) {
        const lines = content.split('\n');
        lines.unshift(globalFixes);
        await fs.writeFile(filePath, lines.join('\n'));
        
        return {
          success: true,
          message: `Added declaration for global variable ${variable}`,
          fixedCode: globalFixes,
          changes: [`Added: ${globalFixes}`]
        };
      }

      return {
        success: false,
        error: 'Cannot auto-fix undefined variable',
        manual: true,
        suggestion: `Please define the variable '${variable}' or check if it should be imported`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取全局变量修复
   */
  getGlobalVariableFix(variable) {
    const globalFixes = {
      'window': '/* global window */',
      'document': '/* global document */',
      'console': '/* global console */',
      'process': '/* global process */',
      'Buffer': '/* global Buffer */',
      'global': '/* global global */',
      'require': '/* global require */',
      'module': '/* global module */',
      'exports': '/* global exports */'
    };

    return globalFixes[variable];
  }

  /**
   * 修复 React key 警告
   */
  async fixReactKey(filePath, keyError, errorAnalysis) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      
      // 使用正则表达式查找需要添加 key 的地方
      const mapPattern = /\.map\s*\(\s*\(([^)]+)\)\s*=>\s*(<[^>]+>)/g;
      let fixedContent = content;
      let matches = [];

      let match;
      while ((match = mapPattern.exec(content)) !== null) {
        const [fullMatch, paramName, elementStart] = match;
        
        // 检查是否已经有 key 属性
        if (!elementStart.includes('key=')) {
          const param = paramName.split(',')[0].trim();
          const fixedElement = elementStart.replace('>', ` key={${param}.id || index}>`);
          fixedContent = fixedContent.replace(fullMatch, fullMatch.replace(elementStart, fixedElement));
          matches.push(fixedElement);
        }
      }

      if (matches.length > 0) {
        await fs.writeFile(filePath, fixedContent);
        
        return {
          success: true,
          message: `Added ${matches.length} key prop(s) to React elements`,
          fixedCode: matches.join('\n'),
          changes: matches.map(m => `Added key prop: ${m}`)
        };
      }

      return {
        success: false,
        error: 'No map functions found that need key props'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 修复未使用变量
   */
  async fixUnusedVariable(filePath, variable, errorAnalysis) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      let fixedLines = [];
      let removed = [];

      for (let line of lines) {
        // 检查是否是未使用变量的声明行
        if (line.includes(`const ${variable}`) || 
            line.includes(`let ${variable}`) || 
            line.includes(`var ${variable}`)) {
          // 添加 eslint 注释或删除该行
          if (line.trim().endsWith(';')) {
            removed.push(line.trim());
            continue; // 删除该行
          }
        }
        fixedLines.push(line);
      }

      if (removed.length > 0) {
        await fs.writeFile(filePath, fixedLines.join('\n'));
        
        return {
          success: true,
          message: `Removed ${removed.length} unused variable declaration(s)`,
          fixedCode: removed.join('\n'),
          changes: removed.map(r => `Removed: ${r}`)
        };
      }

      return {
        success: false,
        error: 'No unused variable declarations found to remove'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 修复缺失分号
   */
  async fixMissingSemicolon(filePath, missingLine, errorAnalysis) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      
      // 自动添加分号的模式
      const needsSemicolon = /^[\s]*[^\/\*\s].*[^;{}\s][\s]*$/;
      
      let fixedLines = lines.map(line => {
        if (needsSemicolon.test(line) && 
            !line.includes('//') && 
            !line.includes('if ') && 
            !line.includes('for ') && 
            !line.includes('while ') &&
            !line.includes('function ')) {
          return line.trimEnd() + ';';
        }
        return line;
      });

      await fs.writeFile(filePath, fixedLines.join('\n'));

      return {
        success: true,
        message: 'Added missing semicolons',
        fixedCode: 'Added semicolons to appropriate lines',
        changes: ['Added missing semicolons']
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 验证修复结果
   */
  async validateFix(filePath, originalError) {
    try {
      // 尝试运行基本语法检查
      if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        return await this.validateJavaScript(filePath);
      } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        return await this.validateTypeScript(filePath);
      }

      return {
        success: true,
        message: 'File appears to be valid'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 验证 JavaScript 文件
   */
  async validateJavaScript(filePath) {
    return new Promise((resolve) => {
      const child = spawn('node', ['--check', filePath]);
      
      let stderr = '';
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            message: 'JavaScript syntax is valid'
          });
        } else {
          resolve({
            success: false,
            error: stderr,
            stillHasErrors: true
          });
        }
      });
    });
  }

  /**
   * 验证 TypeScript 文件
   */
  async validateTypeScript(filePath) {
    return new Promise((resolve) => {
      const child = spawn('npx', ['tsc', '--noEmit', filePath]);
      
      let stderr = '';
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            message: 'TypeScript compilation successful'
          });
        } else {
          resolve({
            success: false,
            error: stderr,
            stillHasErrors: true
          });
        }
      });
    });
  }

  /**
   * 获取错误处理统计
   */
  getStats() {
    return {
      supportedErrorTypes: Object.keys(this.errorPatterns).length,
      autoFixableTypes: Object.values(this.errorPatterns)
        .filter(pattern => pattern.autoFixable).length,
      fixStrategies: Object.keys(this.fixStrategies).length
    };
  }

  /**
   * 批量错误检查
   */
  async checkProject(projectPath = '.') {
    try {
      const results = [];
      const files = await this.findCodeFiles(projectPath);
      
      for (const file of files) {
        const validation = await this.validateFix(file);
        if (!validation.success && validation.stillHasErrors) {
          const analysis = await this.analyzeError(validation.error, file);
          results.push({
            file,
            error: validation.error,
            analysis: analysis.success ? analysis.analysis : null
          });
        }
      }

      return {
        success: true,
        results,
        totalFiles: files.length,
        errorFiles: results.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 查找代码文件
   */
  async findCodeFiles(projectPath) {
    const glob = require('glob');
    const pattern = path.join(projectPath, '**/*.{js,jsx,ts,tsx}');
    
    return new Promise((resolve, reject) => {
      glob(pattern, { 
        ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'] 
      }, (err, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });
  }
}

module.exports = IntelligentErrorHandler;
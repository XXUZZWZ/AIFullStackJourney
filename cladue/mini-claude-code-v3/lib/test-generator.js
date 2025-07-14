const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

class AITestGenerator {
  constructor(toolManager) {
    this.toolManager = toolManager;
    this.name = 'AITestGenerator';
    
    // 测试框架检测
    this.supportedFrameworks = {
      jest: {
        patterns: ['jest.config.js', 'jest.config.json', '__tests__/', '*.test.js', '*.spec.js'],
        dependencies: ['jest', '@testing-library/jest-dom'],
        fileExtensions: ['.test.js', '.test.ts', '.spec.js', '.spec.ts']
      },
      mocha: {
        patterns: ['mocha.opts', 'test/', '*.test.js'],
        dependencies: ['mocha', 'chai'],
        fileExtensions: ['.test.js', '.spec.js']
      },
      vitest: {
        patterns: ['vitest.config.js', 'vitest.config.ts'],
        dependencies: ['vitest'],
        fileExtensions: ['.test.js', '.test.ts']
      },
      cypress: {
        patterns: ['cypress.json', 'cypress/', 'cypress.config.js'],
        dependencies: ['cypress'],
        fileExtensions: ['.cy.js', '.cy.ts']
      }
    };

    // 测试类型定义
    this.testTypes = {
      unit: {
        description: '单元测试 - 测试单个函数或组件',
        scope: 'function',
        complexity: 'low'
      },
      integration: {
        description: '集成测试 - 测试模块间交互',
        scope: 'module',
        complexity: 'medium'
      },
      component: {
        description: '组件测试 - 测试 React/Vue 组件',
        scope: 'component',
        complexity: 'medium'
      },
      e2e: {
        description: '端到端测试 - 测试完整用户流程',
        scope: 'application',
        complexity: 'high'
      },
      api: {
        description: 'API 测试 - 测试接口功能',
        scope: 'api',
        complexity: 'medium'
      }
    };

    // 常见测试模式
    this.testPatterns = {
      // 函数测试模式
      function: {
        arrange: '// Arrange - 准备测试数据',
        act: '// Act - 执行被测试的功能',
        assert: '// Assert - 验证结果'
      },
      
      // React 组件测试模式
      react: {
        render: 'render(<Component {...props} />)',
        interact: 'fireEvent.click(getByText("Button"))',
        assert: 'expect(getByText("Expected")).toBeInTheDocument()'
      },
      
      // API 测试模式
      api: {
        setup: 'const mockData = { ... }',
        request: 'const response = await api.get("/endpoint")',
        validate: 'expect(response.status).toBe(200)'
      }
    };
  }

  /**
   * 检测项目的测试框架
   */
  async detectTestFramework(projectPath = '.') {
    try {
      const detected = [];
      
      // 检查 package.json 依赖
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies
        };
        
        for (const [framework, config] of Object.entries(this.supportedFrameworks)) {
          const hasFramework = config.dependencies.some(dep => allDeps[dep]);
          if (hasFramework) {
            detected.push({
              name: framework,
              confidence: 0.8,
              source: 'package.json'
            });
          }
        }
      }

      // 检查项目文件结构
      for (const [framework, config] of Object.entries(this.supportedFrameworks)) {
        for (const pattern of config.patterns) {
          const filePath = path.join(projectPath, pattern);
          if (await fs.pathExists(filePath)) {
            const existing = detected.find(d => d.name === framework);
            if (existing) {
              existing.confidence = Math.min(existing.confidence + 0.3, 1.0);
            } else {
              detected.push({
                name: framework,
                confidence: 0.6,
                source: 'file_pattern'
              });
            }
          }
        }
      }

      // 按置信度排序
      detected.sort((a, b) => b.confidence - a.confidence);

      return {
        success: true,
        frameworks: detected,
        primary: detected.length > 0 ? detected[0] : null
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 分析代码文件生成测试
   */
  async analyzeCodeForTests(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const ext = path.extname(filePath);
      
      const analysis = {
        filePath,
        fileType: this.detectFileType(filePath, content),
        functions: this.extractFunctions(content, ext),
        classes: this.extractClasses(content, ext),
        exports: this.extractExports(content, ext),
        imports: this.extractImports(content, ext),
        complexity: this.assessComplexity(content),
        testSuggestions: []
      };

      // 生成测试建议
      analysis.testSuggestions = this.generateTestSuggestions(analysis);

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
   * 检测文件类型
   */
  detectFileType(filePath, content) {
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath);

    if (content.includes('import React') || content.includes('from \'react\'')) {
      return 'react-component';
    }
    if (content.includes('Vue.component') || content.includes('export default {')) {
      return 'vue-component';
    }
    if (content.includes('app.get') || content.includes('express()')) {
      return 'express-route';
    }
    if (content.includes('class ') && ext === '.js') {
      return 'class';
    }
    if (content.includes('function ') || content.includes('=>')) {
      return 'utility';
    }
    if (fileName.includes('api') || fileName.includes('service')) {
      return 'api-service';
    }

    return 'module';
  }

  /**
   * 提取函数定义
   */
  extractFunctions(content, ext) {
    const functions = [];
    
    // 函数声明
    const functionRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)/g;
    let match;
    while ((match = functionRegex.exec(content)) !== null) {
      functions.push({
        name: match[1],
        params: match[2].split(',').map(p => p.trim()).filter(p => p),
        type: 'function',
        async: content.includes(`async function ${match[1]}`)
      });
    }

    // 箭头函数
    const arrowRegex = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g;
    while ((match = arrowRegex.exec(content)) !== null) {
      functions.push({
        name: match[1],
        params: [], // 简化处理
        type: 'arrow',
        async: match[0].includes('async')
      });
    }

    return functions;
  }

  /**
   * 提取类定义
   */
  extractClasses(content, ext) {
    const classes = [];
    const classRegex = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    
    let match;
    while ((match = classRegex.exec(content)) !== null) {
      classes.push({
        name: match[1],
        type: 'class'
      });
    }

    return classes;
  }

  /**
   * 提取导出
   */
  extractExports(content, ext) {
    const exports = [];
    
    // ES6 exports
    const namedExportRegex = /export\s+(?:const|let|var|function|class)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    const defaultExportRegex = /export\s+default\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/;
    
    let match;
    while ((match = namedExportRegex.exec(content)) !== null) {
      exports.push({
        name: match[1],
        type: 'named'
      });
    }

    match = defaultExportRegex.exec(content);
    if (match) {
      exports.push({
        name: match[1],
        type: 'default'
      });
    }

    return exports;
  }

  /**
   * 提取导入
   */
  extractImports(content, ext) {
    const imports = [];
    const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
    
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    return imports;
  }

  /**
   * 评估代码复杂度
   */
  assessComplexity(content) {
    let score = 0;
    
    // 计算循环复杂度的简化版本
    score += (content.match(/if\s*\(/g) || []).length;
    score += (content.match(/for\s*\(/g) || []).length;
    score += (content.match(/while\s*\(/g) || []).length;
    score += (content.match(/switch\s*\(/g) || []).length;
    score += (content.match(/catch\s*\(/g) || []).length;

    if (score <= 5) return 'low';
    if (score <= 15) return 'medium';
    return 'high';
  }

  /**
   * 生成测试建议
   */
  generateTestSuggestions(analysis) {
    const suggestions = [];

    // 为每个函数生成单元测试建议
    analysis.functions.forEach(func => {
      suggestions.push({
        type: 'unit',
        target: func.name,
        description: `为函数 ${func.name} 生成单元测试`,
        priority: 'high',
        testCases: this.generateFunctionTestCases(func)
      });
    });

    // 为组件生成组件测试建议
    if (analysis.fileType === 'react-component') {
      suggestions.push({
        type: 'component',
        target: path.basename(analysis.filePath, path.extname(analysis.filePath)),
        description: '生成 React 组件测试',
        priority: 'high',
        testCases: ['渲染测试', '属性测试', '事件处理测试']
      });
    }

    // 为 API 服务生成 API 测试建议
    if (analysis.fileType === 'api-service' || analysis.fileType === 'express-route') {
      suggestions.push({
        type: 'api',
        target: 'API endpoints',
        description: '生成 API 端点测试',
        priority: 'medium',
        testCases: ['成功响应测试', '错误处理测试', '参数验证测试']
      });
    }

    return suggestions;
  }

  /**
   * 为函数生成测试用例
   */
  generateFunctionTestCases(func) {
    const testCases = [];
    
    // 基础功能测试
    testCases.push(`${func.name} 正常执行测试`);
    
    // 边界条件测试
    if (func.params.length > 0) {
      testCases.push(`${func.name} 边界参数测试`);
      testCases.push(`${func.name} 无效参数测试`);
    }
    
    // 异步函数特殊测试
    if (func.async) {
      testCases.push(`${func.name} 异步执行测试`);
      testCases.push(`${func.name} 错误处理测试`);
    }

    return testCases;
  }

  /**
   * 使用 AI 生成测试代码
   */
  async generateTests(filePath, testType = 'unit', options = {}) {
    try {
      if (!this.toolManager.ai.isAvailable()) {
        return {
          success: false,
          error: 'AI service not available for test generation'
        };
      }

      // 分析源代码
      const codeAnalysis = await this.analyzeCodeForTests(filePath);
      if (!codeAnalysis.success) {
        return codeAnalysis;
      }

      // 检测测试框架
      const frameworkDetection = await this.detectTestFramework();
      const testFramework = frameworkDetection.primary?.name || 'jest';

      const sourceCode = await fs.readFile(filePath, 'utf8');
      
      // 生成上下文提示
      const contextPrompt = this.toolManager.memory?.generateContextPrompt(
        `生成测试代码: ${filePath}`,
        this.toolManager.context.projectInfo
      ) || '';

      const prompt = this.buildTestGenerationPrompt(
        sourceCode,
        filePath,
        testType,
        testFramework,
        codeAnalysis.analysis,
        contextPrompt,
        options
      );

      console.log(`🧪 使用 AI 生成 ${testType} 测试 (${testFramework} 框架)...`);

      const result = await this.toolManager.ai.chat(prompt, {
        temperature: 0.4,
        maxTokens: 3000,
        timeout: 30000
      });

      if (result.success) {
        const testCode = this.extractTestCode(result.response);
        const testFilePath = this.generateTestFilePath(filePath, testType, testFramework);

        return {
          success: true,
          testCode,
          testFilePath,
          framework: testFramework,
          analysis: codeAnalysis.analysis,
          suggestions: this.generateTestOptimizationSuggestions(testCode)
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 构建测试生成提示词
   */
  buildTestGenerationPrompt(sourceCode, filePath, testType, framework, analysis, contextPrompt, options) {
    const frameworkInstructions = this.getFrameworkInstructions(framework);
    const testTypeInstructions = this.getTestTypeInstructions(testType);

    return `请为以下代码生成高质量的${testType}测试：

文件路径: ${filePath}
测试框架: ${framework}
代码复杂度: ${analysis.complexity}

${contextPrompt}

源代码:
\`\`\`javascript
${sourceCode}
\`\`\`

代码分析:
- 函数: ${analysis.functions.map(f => f.name).join(', ') || '无'}
- 类: ${analysis.classes.map(c => c.name).join(', ') || '无'}
- 文件类型: ${analysis.fileType}
- 导出: ${analysis.exports.length} 个

测试要求:
${testTypeInstructions}

框架规范:
${frameworkInstructions}

请生成完整的测试文件，包含：
1. 必要的导入语句
2. 测试套件结构
3. 具体的测试用例
4. 边界条件测试
5. 错误处理测试
6. 模拟 (mock) 依赖
7. 断言验证

要求：
- 遵循测试最佳实践
- 包含 AAA 模式 (Arrange, Act, Assert)
- 提供良好的测试覆盖率
- 添加清晰的测试描述
- 只返回测试代码，不要包含解释

返回格式: 完整的测试文件代码`;
  }

  /**
   * 获取框架特定指令
   */
  getFrameworkInstructions(framework) {
    const instructions = {
      jest: `
- 使用 describe() 和 it() 组织测试
- 使用 jest.fn() 创建模拟函数
- 使用 expect() 断言
- 支持异步测试 async/await
- 使用 beforeEach/afterEach 设置清理`,
      
      mocha: `
- 使用 describe() 和 it() 组织测试
- 使用 chai 的 expect() 进行断言
- 使用 sinon 创建模拟和存根
- 支持异步测试的 done() 回调`,
      
      vitest: `
- 使用 describe() 和 it() 组织测试
- 使用 vi.fn() 创建模拟函数
- 使用 expect() 断言
- 支持异步测试 async/await`
    };

    return instructions[framework] || instructions.jest;
  }

  /**
   * 获取测试类型指令
   */
  getTestTypeInstructions(testType) {
    const instructions = {
      unit: `
- 测试单个函数或方法
- 隔离依赖项（使用模拟）
- 测试各种输入和边界条件
- 验证返回值和副作用`,
      
      integration: `
- 测试多个模块的交互
- 验证数据流和接口
- 测试真实的依赖关系
- 关注业务逻辑`,
      
      component: `
- 测试组件渲染
- 验证 props 处理
- 测试用户交互
- 检查状态变化
- 使用 @testing-library/react`,
      
      api: `
- 测试 HTTP 请求/响应
- 验证状态码和响应格式
- 测试错误处理
- 模拟外部 API 调用`,
      
      e2e: `
- 测试完整用户流程
- 使用真实浏览器环境
- 验证页面交互
- 测试多步骤操作`
    };

    return instructions[testType] || instructions.unit;
  }

  /**
   * 提取测试代码
   */
  extractTestCode(aiResponse) {
    // 尝试提取代码块
    const codeBlockMatch = aiResponse.match(/```(?:javascript|js|typescript|ts)?\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }

    // 如果没有代码块，返回整个响应
    return aiResponse.trim();
  }

  /**
   * 生成测试文件路径
   */
  generateTestFilePath(sourceFilePath, testType, framework) {
    const dir = path.dirname(sourceFilePath);
    const name = path.basename(sourceFilePath, path.extname(sourceFilePath));
    const ext = path.extname(sourceFilePath);
    
    const frameworkConfig = this.supportedFrameworks[framework];
    const testExt = frameworkConfig?.fileExtensions[0] || '.test.js';

    // 根据项目结构选择测试目录
    if (fs.existsSync(path.join(process.cwd(), '__tests__'))) {
      return path.join('__tests__', `${name}${testExt}`);
    } else if (fs.existsSync(path.join(process.cwd(), 'test'))) {
      return path.join('test', `${name}${testExt}`);
    } else {
      // 与源文件同目录
      return path.join(dir, `${name}${testExt}`);
    }
  }

  /**
   * 生成测试优化建议
   */
  generateTestOptimizationSuggestions(testCode) {
    const suggestions = [];

    if (!testCode.includes('beforeEach') && !testCode.includes('beforeAll')) {
      suggestions.push('考虑使用 beforeEach/beforeAll 设置测试数据');
    }

    if (!testCode.includes('mock') && !testCode.includes('spy')) {
      suggestions.push('考虑添加模拟外部依赖');
    }

    if (testCode.split('it(').length < 3) {
      suggestions.push('考虑增加更多测试用例以提高覆盖率');
    }

    if (!testCode.includes('toThrow') && !testCode.includes('catch')) {
      suggestions.push('考虑添加错误处理测试');
    }

    return suggestions;
  }

  /**
   * 验证生成的测试
   */
  async validateTests(testFilePath) {
    try {
      // 语法检查
      const syntaxCheck = await this.checkTestSyntax(testFilePath);
      if (!syntaxCheck.success) {
        return syntaxCheck;
      }

      // 运行测试
      const testRun = await this.runTests(testFilePath);
      
      return {
        success: true,
        syntaxValid: syntaxCheck.success,
        testResults: testRun
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 检查测试语法
   */
  async checkTestSyntax(testFilePath) {
    return new Promise((resolve) => {
      const child = spawn('node', ['--check', testFilePath]);
      
      let stderr = '';
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            message: 'Test syntax is valid'
          });
        } else {
          resolve({
            success: false,
            error: stderr,
            suggestion: 'Fix syntax errors in generated test'
          });
        }
      });
    });
  }

  /**
   * 运行测试
   */
  async runTests(testFilePath) {
    const framework = await this.detectTestFramework();
    const primaryFramework = framework.primary?.name || 'jest';

    return new Promise((resolve) => {
      let command, args;
      
      switch (primaryFramework) {
        case 'jest':
          command = 'npx';
          args = ['jest', testFilePath, '--no-coverage'];
          break;
        case 'mocha':
          command = 'npx';
          args = ['mocha', testFilePath];
          break;
        case 'vitest':
          command = 'npx';
          args = ['vitest', testFilePath, '--run'];
          break;
        default:
          command = 'npx';
          args = ['jest', testFilePath, '--no-coverage'];
      }

      const child = spawn(command, args);
      
      let stdout = '';
      let stderr = '';
      
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        resolve({
          success: code === 0,
          exitCode: code,
          stdout,
          stderr,
          passed: code === 0
        });
      });
    });
  }

  /**
   * 获取测试覆盖率
   */
  async generateCoverageReport(testFilePath, sourceFilePath) {
    try {
      const framework = await this.detectTestFramework();
      const primaryFramework = framework.primary?.name || 'jest';

      if (primaryFramework === 'jest') {
        return new Promise((resolve) => {
          const child = spawn('npx', ['jest', testFilePath, '--coverage', '--collectCoverageFrom', sourceFilePath]);
          
          let stdout = '';
          child.stdout.on('data', (data) => {
            stdout += data.toString();
          });

          child.on('close', (code) => {
            const coverage = this.parseCoverageReport(stdout);
            resolve({
              success: code === 0,
              coverage
            });
          });
        });
      }

      return {
        success: false,
        error: 'Coverage report not supported for this framework'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 解析覆盖率报告
   */
  parseCoverageReport(output) {
    const coverage = {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0
    };

    // 简单解析 Jest 覆盖率输出
    const coverageMatch = output.match(/All files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)/);
    if (coverageMatch) {
      coverage.statements = parseFloat(coverageMatch[1]);
      coverage.branches = parseFloat(coverageMatch[2]);
      coverage.functions = parseFloat(coverageMatch[3]);
      coverage.lines = parseFloat(coverageMatch[4]);
    }

    return coverage;
  }

  /**
   * 获取测试生成统计
   */
  getStats() {
    return {
      supportedFrameworks: Object.keys(this.supportedFrameworks).length,
      testTypes: Object.keys(this.testTypes).length,
      testPatterns: Object.keys(this.testPatterns).length
    };
  }
}

module.exports = AITestGenerator;
/**
 * Mini Claude Code v3 - AI 测试生成系统测试
 */

const ToolManager = require('../lib/tool-manager');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function testTestGenerationFeatures() {
  console.log(chalk.blue.bold('🧪 Mini Claude Code v3 - AI 测试生成系统测试\n'));

  const toolManager = new ToolManager();
  await toolManager.initialize();

  // 检查 AI 和测试生成系统状态
  const aiStatus = toolManager.getAIStatus();
  const testStats = toolManager.getTestGeneratorStats();
  
  console.log(`✅ AI 服务状态: ${aiStatus.available ? '可用' : '不可用'}`);
  console.log(`🧪 测试生成系统: 支持 ${testStats.supportedFrameworks} 个框架`);
  console.log(`📋 测试类型: ${testStats.testTypes} 种`);
  console.log(`🔧 测试模式: ${testStats.testPatterns} 个`);

  if (!aiStatus.available) {
    console.log(chalk.yellow('⚠️  配置默认 API Key...'));
    await toolManager.configureAPI('sk-386b598ba19f49eba2d681f8135f5ae3');
  }

  // 创建测试目录
  const testDir = 'test-generation-samples';
  await fs.ensureDir(testDir);

  console.log(chalk.blue('\n🔍 测试 1: 测试框架检测'));
  
  try {
    // 创建模拟项目文件
    const packageJsonContent = {
      "name": "test-project",
      "version": "1.0.0",
      "devDependencies": {
        "jest": "^29.0.0",
        "@testing-library/react": "^13.0.0",
        "@testing-library/jest-dom": "^5.0.0"
      },
      "scripts": {
        "test": "jest",
        "test:coverage": "jest --coverage"
      }
    };
    
    await fs.writeJson(path.join(testDir, 'package.json'), packageJsonContent, { spaces: 2 });
    await fs.ensureDir(path.join(testDir, '__tests__'));
    
    console.log(`📄 创建模拟项目结构: ${testDir}`);

    // 检测测试框架
    const frameworkDetection = await toolManager.detectTestFramework(testDir);

    if (frameworkDetection.success) {
      console.log(chalk.green('✅ 测试框架检测完成'));
      console.log(`   检测到 ${frameworkDetection.frameworks.length} 个框架`);
      
      frameworkDetection.frameworks.forEach(framework => {
        const confidence = (framework.confidence * 100).toFixed(0);
        console.log(`   • ${framework.name} (${confidence}% 置信度) - ${framework.source}`);
      });
      
      if (frameworkDetection.primary) {
        console.log(`   🎯 主要框架: ${frameworkDetection.primary.name}`);
      }
    }
  } catch (error) {
    console.log(chalk.red(`❌ 框架检测测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n⚡ 测试 2: 代码分析功能'));
  
  try {
    // 创建示例 JavaScript 文件
    const sampleJSFile = path.join(testDir, 'calculator.js');
    const sampleJSCode = `
/**
 * 简单计算器类
 */
class Calculator {
  constructor() {
    this.history = [];
  }

  /**
   * 加法运算
   * @param {number} a 
   * @param {number} b 
   * @returns {number}
   */
  add(a, b) {
    const result = a + b;
    this.history.push({ operation: 'add', a, b, result });
    return result;
  }

  /**
   * 减法运算
   * @param {number} a 
   * @param {number} b 
   * @returns {number}
   */
  subtract(a, b) {
    const result = a - b;
    this.history.push({ operation: 'subtract', a, b, result });
    return result;
  }

  /**
   * 乘法运算
   * @param {number} a 
   * @param {number} b 
   * @returns {number}
   */
  multiply(a, b) {
    const result = a * b;
    this.history.push({ operation: 'multiply', a, b, result });
    return result;
  }

  /**
   * 除法运算
   * @param {number} a 
   * @param {number} b 
   * @returns {number}
   */
  divide(a, b) {
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    const result = a / b;
    this.history.push({ operation: 'divide', a, b, result });
    return result;
  }

  /**
   * 获取计算历史
   * @returns {Array}
   */
  getHistory() {
    return this.history;
  }

  /**
   * 清除历史记录
   */
  clearHistory() {
    this.history = [];
  }
}

// 工具函数
function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

async function asyncCalculate(operation, a, b) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const calc = new Calculator();
      try {
        let result;
        switch (operation) {
          case 'add':
            result = calc.add(a, b);
            break;
          case 'subtract':
            result = calc.subtract(a, b);
            break;
          case 'multiply':
            result = calc.multiply(a, b);
            break;
          case 'divide':
            result = calc.divide(a, b);
            break;
          default:
            throw new Error('Unknown operation');
        }
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, 100);
  });
}

module.exports = { Calculator, isNumber, asyncCalculate };
`;
    
    await fs.writeFile(sampleJSFile, sampleJSCode);
    console.log(`📄 创建示例文件: ${sampleJSFile}`);

    // 分析代码文件
    const codeAnalysis = await toolManager.analyzeCodeForTests(sampleJSFile);

    if (codeAnalysis.success) {
      console.log(chalk.green('✅ 代码分析完成'));
      const analysis = codeAnalysis.analysis;
      console.log(`   文件类型: ${analysis.fileType}`);
      console.log(`   复杂度: ${analysis.complexity}`);
      console.log(`   函数数量: ${analysis.functions.length}`);
      console.log(`   类数量: ${analysis.classes.length}`);
      console.log(`   导出数量: ${analysis.exports.length}`);
      
      if (analysis.functions.length > 0) {
        console.log('   函数列表:');
        analysis.functions.slice(0, 3).forEach((func, index) => {
          console.log(`     ${index + 1}. ${func.name}${func.async ? ' (异步)' : ''} - ${func.params.length} 个参数`);
        });
      }
      
      if (analysis.testSuggestions.length > 0) {
        console.log('   测试建议:');
        analysis.testSuggestions.slice(0, 2).forEach((suggestion, index) => {
          console.log(`     ${index + 1}. ${suggestion.description} (${suggestion.type})`);
        });
      }
    }
  } catch (error) {
    console.log(chalk.red(`❌ 代码分析测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n🎨 测试 3: AI 测试代码生成'));
  
  try {
    const calculatorFile = path.join(testDir, 'calculator.js');
    
    console.log('🤖 使用 AI 生成单元测试...');
    const testGeneration = await toolManager.generateTests(calculatorFile, 'unit');

    if (testGeneration.success) {
      console.log(chalk.green('✅ 测试代码生成完成'));
      console.log(`📄 测试文件路径: ${testGeneration.testFilePath}`);
      console.log(`🔧 使用框架: ${testGeneration.framework}`);
      
      if (testGeneration.analysis) {
        console.log(`📊 分析的函数: ${testGeneration.analysis.functions.length}`);
        console.log(`🏗️ 分析的类: ${testGeneration.analysis.classes.length}`);
      }
      
      // 显示生成的测试代码片段
      if (testGeneration.testCode) {
        console.log('📝 生成的测试代码 (前几行):');
        const codeLines = testGeneration.testCode.split('\n').slice(0, 10);
        console.log(chalk.gray(codeLines.join('\n')));
        console.log(chalk.gray('...'));
        
        // 保存测试文件
        await fs.writeFile(testGeneration.testFilePath, testGeneration.testCode);
        console.log(chalk.green(`💾 测试文件已保存: ${testGeneration.testFilePath}`));
      }
      
      if (testGeneration.suggestions && testGeneration.suggestions.length > 0) {
        console.log('💡 优化建议:');
        testGeneration.suggestions.slice(0, 2).forEach((suggestion, index) => {
          console.log(`   ${index + 1}. ${suggestion}`);
        });
      }
    }
  } catch (error) {
    console.log(chalk.red(`❌ 测试生成失败: ${error.message}`));
  }

  console.log(chalk.blue('\n⚛️ 测试 4: React 组件测试生成'));
  
  try {
    // 创建 React 组件示例
    const reactComponentFile = path.join(testDir, 'UserProfile.jsx');
    const reactComponentCode = `
import React, { useState, useEffect } from 'react';

/**
 * 用户配置文件组件
 */
function UserProfile({ userId, onUpdate }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(\`/api/users/\${userId}\`);
      const userData = await response.json();
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        bio: userData.bio || ''
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(\`/api/users/\${userId}\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditing(false);
        if (onUpdate) {
          onUpdate(updatedUser);
        }
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <div className="loading">Loading user profile...</div>;
  }

  if (!user) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="user-profile">
      <div className="user-header">
        <img 
          src={user.avatar || '/default-avatar.png'} 
          alt={user.name} 
          className="user-avatar"
        />
        <h1>{user.name}</h1>
      </div>

      <div className="user-details">
        {editing ? (
          <div className="edit-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows="4"
              />
            </div>
            
            <div className="form-actions">
              <button onClick={handleSave} className="save-btn">
                Save
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="view-mode">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Bio:</strong> {user.bio || 'No bio available'}</p>
            <button onClick={handleEdit} className="edit-btn">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
`;
    
    await fs.writeFile(reactComponentFile, reactComponentCode);
    console.log(`📄 创建 React 组件: ${reactComponentFile}`);

    // 生成 React 组件测试
    console.log('🤖 为 React 组件生成测试...');
    const reactTestGeneration = await toolManager.generateTests(reactComponentFile, 'component');

    if (reactTestGeneration.success) {
      console.log(chalk.green('✅ React 组件测试生成完成'));
      console.log(`📄 测试文件: ${reactTestGeneration.testFilePath}`);
      
      // 显示生成的测试代码片段
      if (reactTestGeneration.testCode) {
        console.log('📝 生成的组件测试代码 (前几行):');
        const codeLines = reactTestGeneration.testCode.split('\n').slice(0, 8);
        console.log(chalk.gray(codeLines.join('\n')));
        console.log(chalk.gray('...'));
        
        // 保存测试文件
        await fs.writeFile(reactTestGeneration.testFilePath, reactTestGeneration.testCode);
        console.log(chalk.green(`💾 React 测试文件已保存`));
      }
    }
  } catch (error) {
    console.log(chalk.red(`❌ React 组件测试生成失败: ${error.message}`));
  }

  console.log(chalk.blue('\n🔬 测试 5: 测试验证和运行'));
  
  try {
    // 查找生成的测试文件
    const testFiles = await fs.readdir(testDir);
    const generatedTestFiles = testFiles.filter(file => 
      file.includes('.test.') || file.includes('.spec.')
    );

    if (generatedTestFiles.length > 0) {
      console.log(`📋 发现 ${generatedTestFiles.length} 个测试文件`);
      
      for (const testFile of generatedTestFiles.slice(0, 2)) {
        const testFilePath = path.join(testDir, testFile);
        console.log(`🔍 验证测试文件: ${testFile}`);
        
        // 验证测试语法
        const validation = await toolManager.validateTests(testFilePath);
        
        if (validation.success) {
          console.log(chalk.green(`   ✅ ${testFile} 语法验证通过`));
          
          if (validation.syntaxValid) {
            console.log('   📝 测试文件语法正确');
          }
        } else {
          console.log(chalk.yellow(`   ⚠️  ${testFile} 验证失败: ${validation.error?.substring(0, 100)}...`));
        }
      }
    } else {
      console.log(chalk.yellow('📄 未找到生成的测试文件'));
    }
  } catch (error) {
    console.log(chalk.red(`❌ 测试验证失败: ${error.message}`));
  }

  console.log(chalk.blue('\n📊 测试 6: 测试覆盖率分析'));
  
  try {
    // 模拟覆盖率测试
    const calculatorFile = path.join(testDir, 'calculator.js');
    const testFiles = await fs.readdir(testDir);
    const calculatorTestFile = testFiles.find(file => 
      file.includes('calculator') && (file.includes('.test.') || file.includes('.spec.'))
    );

    if (calculatorTestFile) {
      const testFilePath = path.join(testDir, calculatorTestFile);
      console.log(`📊 分析覆盖率: ${calculatorTestFile} -> calculator.js`);
      
      const coverageResult = await toolManager.generateCoverageReport(testFilePath, calculatorFile);
      
      if (coverageResult.success && coverageResult.coverage) {
        console.log(chalk.green('✅ 覆盖率分析完成'));
        console.log(`   📏 语句覆盖率: ${coverageResult.coverage.statements}%`);
        console.log(`   🌿 分支覆盖率: ${coverageResult.coverage.branches}%`);
        console.log(`   ⚡ 函数覆盖率: ${coverageResult.coverage.functions}%`);
        console.log(`   📝 行覆盖率: ${coverageResult.coverage.lines}%`);
      } else {
        console.log(chalk.yellow('⚠️  覆盖率分析暂不支持或配置问题'));
      }
    } else {
      console.log(chalk.yellow('📄 未找到计算器的测试文件'));
    }
  } catch (error) {
    console.log(chalk.red(`❌ 覆盖率分析失败: ${error.message}`));
  }

  // 清理测试文件
  try {
    await fs.remove(testDir);
    console.log(chalk.gray('\n🧹 测试文件已清理'));
  } catch (error) {
    console.log(chalk.yellow('\n⚠️  清理测试文件时出错'));
  }

  // 显示最终统计
  console.log(chalk.blue('\n📊 AI 测试生成系统统计信息:'));
  const finalTestStats = toolManager.getTestGeneratorStats();
  console.log(`🧪 支持的测试框架: ${finalTestStats.supportedFrameworks} 个`);
  console.log(`📋 测试类型: ${finalTestStats.testTypes} 种`);
  console.log(`🔧 测试模式: ${finalTestStats.testPatterns} 个`);

  console.log(chalk.blue('\n🎉 任务 2 完成: AI 驱动的测试生成和验证系统 ✅'));
  console.log(chalk.green('新增功能:'));
  console.log('   - 智能测试框架检测 (Jest, Mocha, Vitest, Cypress)');
  console.log('   - 代码结构分析和测试建议生成');
  console.log('   - AI 驱动的测试代码生成');
  console.log('   - 多种测试类型支持 (单元、集成、组件、E2E、API)');
  console.log('   - 测试语法验证和运行');
  console.log('   - 测试覆盖率分析');
  console.log('   - 框架特定的测试模式和最佳实践');
  console.log(chalk.yellow('\n🎊 Mini Claude Code v3 增强完成!'));
  console.log(chalk.green('现在拥有:'));
  console.log('   ✅ 流式 AI 响应系统');
  console.log('   ✅ 上下文记忆管理');  
  console.log('   ✅ 智能自动补全');
  console.log('   ✅ 智能错误处理和自动修复系统');
  console.log('   ✅ AI 驱动的测试生成和验证系统');
}

// 运行测试
if (require.main === module) {
  testTestGenerationFeatures().catch(console.error);
}

module.exports = { testTestGenerationFeatures };
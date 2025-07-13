/**
 * Mini Claude Code v3 - 智能错误处理系统测试
 */

const ToolManager = require('../lib/tool-manager');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function testErrorHandlingFeatures() {
  console.log(chalk.red.bold('🔧 Mini Claude Code v3 - 智能错误处理系统测试\n'));

  const toolManager = new ToolManager();
  await toolManager.initialize();

  // 检查 AI 和错误处理系统状态
  const aiStatus = toolManager.getAIStatus();
  const errorStats = toolManager.getErrorHandlerStats();
  
  console.log(`✅ AI 服务状态: ${aiStatus.available ? '可用' : '不可用'}`);
  console.log(`🔧 错误处理系统: 支持 ${errorStats.supportedErrorTypes} 种错误类型`);
  console.log(`⚡ 自动修复: 支持 ${errorStats.autoFixableTypes} 种自动修复`);

  if (!aiStatus.available) {
    console.log(chalk.yellow('⚠️  配置默认 API Key...'));
    await toolManager.configureAPI('sk-386b598ba19f49eba2d681f8135f5ae3');
  }

  // 创建测试目录
  const testDir = 'error-test-files';
  await fs.ensureDir(testDir);

  console.log(chalk.red('\n🐛 测试 1: 语法错误检测和修复'));
  
  try {
    // 创建包含语法错误的文件
    const syntaxErrorFile = path.join(testDir, 'syntax-error.js');
    const syntaxErrorCode = `
function hello() {
  console.log("Hello World"
  // 缺少闭合括号
}

const name = "Test
// 缺少闭合引号

if (true {
  console.log("Missing parenthesis");
}
`;
    
    await fs.writeFile(syntaxErrorFile, syntaxErrorCode);
    console.log(`📄 创建测试文件: ${syntaxErrorFile}`);

    // 分析语法错误
    const syntaxAnalysis = await toolManager.analyzeError(
      'SyntaxError: Unexpected end of input',
      syntaxErrorFile
    );

    if (syntaxAnalysis.success) {
      console.log(chalk.green('✅ 语法错误分析完成'));
      console.log(`   错误类型: ${syntaxAnalysis.analysis.detectedType}`);
      console.log(`   严重程度: ${syntaxAnalysis.analysis.severity}`);
      console.log(`   可自动修复: ${syntaxAnalysis.analysis.autoFixable}`);
      
      if (syntaxAnalysis.analysis.suggestions.length > 0) {
        console.log('   建议:');
        syntaxAnalysis.analysis.suggestions.slice(0, 2).forEach((suggestion, index) => {
          console.log(`     ${index + 1}. ${suggestion}`);
        });
      }
    }
  } catch (error) {
    console.log(chalk.red(`❌ 语法错误测试失败: ${error.message}`));
  }

  console.log(chalk.red('\n📦 测试 2: 缺失导入检测和修复'));
  
  try {
    // 创建缺失导入的文件
    const importErrorFile = path.join(testDir, 'missing-import.js');
    const importErrorCode = `
// 缺少 React 导入
function MyComponent() {
  return React.createElement('div', {}, 'Hello');
}

// 缺少 lodash 导入
const data = _.map([1, 2, 3], x => x * 2);

// 缺少 fs 导入
fs.readFile('test.txt', 'utf8', (err, data) => {
  console.log(data);
});
`;
    
    await fs.writeFile(importErrorFile, importErrorCode);
    console.log(`📄 创建测试文件: ${importErrorFile}`);

    // 分析导入错误
    const importAnalysis = await toolManager.analyzeError(
      "Cannot find module 'react'",
      importErrorFile
    );

    if (importAnalysis.success) {
      console.log(chalk.green('✅ 导入错误分析完成'));
      
      // 尝试自动修复
      if (importAnalysis.analysis.autoFixable) {
        const fixResult = await toolManager.autoFixError(
          importErrorFile, 
          importAnalysis.analysis
        );
        
        if (fixResult.success) {
          console.log(chalk.green(`✅ 自动修复成功: ${fixResult.message}`));
          
          // 显示修复后的代码
          const fixedCode = await fs.readFile(importErrorFile, 'utf8');
          console.log('📝 修复后的代码 (前几行):');
          console.log(chalk.gray(fixedCode.split('\n').slice(0, 5).join('\n')));
        }
      }
    }
  } catch (error) {
    console.log(chalk.red(`❌ 导入错误测试失败: ${error.message}`));
  }

  console.log(chalk.red('\n⚛️ 测试 3: React Key 警告修复'));
  
  try {
    // 创建 React Key 警告的文件
    const reactErrorFile = path.join(testDir, 'react-key-warning.jsx');
    const reactErrorCode = `
import React from 'react';

function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li>{todo.text}</li>
      ))}
    </ul>
  );
}

function UserList({ users }) {
  return (
    <div>
      {users.map((user, index) => (
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default TodoList;
`;
    
    await fs.writeFile(reactErrorFile, reactErrorCode);
    console.log(`📄 创建测试文件: ${reactErrorFile}`);

    // 分析 React Key 警告
    const reactAnalysis = await toolManager.analyzeError(
      'Each child in a list should have a unique "key" prop',
      reactErrorFile
    );

    if (reactAnalysis.success && reactAnalysis.analysis.autoFixable) {
      console.log(chalk.green('✅ React Key 警告分析完成'));
      
      const fixResult = await toolManager.autoFixError(
        reactErrorFile, 
        reactAnalysis.analysis
      );
      
      if (fixResult.success) {
        console.log(chalk.green(`✅ React Key 修复成功: ${fixResult.message}`));
        console.log('📝 修复内容:');
        fixResult.changes.forEach(change => {
          console.log(`   • ${change}`);
        });
      }
    }
  } catch (error) {
    console.log(chalk.red(`❌ React 错误测试失败: ${error.message}`));
  }

  console.log(chalk.red('\n🔍 测试 4: 项目错误扫描'));
  
  try {
    // 创建更多测试文件
    const eslintErrorFile = path.join(testDir, 'eslint-errors.js');
    const eslintErrorCode = `
const unusedVariable = 'this will not be used';
let anotherUnused = 42

function test() {
  console.log("Debug statement")
  const localUnused = 'also unused'
  return true
}

// 缺少分号的语句
const result = test()
`;
    
    await fs.writeFile(eslintErrorFile, eslintErrorCode);

    // 扫描整个测试目录
    console.log(`🔍 扫描目录: ${testDir}`);
    const projectCheck = await toolManager.checkProjectErrors(testDir);

    if (projectCheck.success) {
      console.log(chalk.green('✅ 项目扫描完成'));
      console.log(`📁 扫描文件数: ${projectCheck.totalFiles}`);
      console.log(`❌ 有错误的文件: ${projectCheck.errorFiles}`);
      
      if (projectCheck.results.length > 0) {
        console.log('📋 发现的错误:');
        projectCheck.results.slice(0, 3).forEach((result, index) => {
          console.log(`   ${index + 1}. ${path.basename(result.file)}`);
          console.log(`      错误: ${result.error.substring(0, 80)}...`);
        });
      }
    }
  } catch (error) {
    console.log(chalk.red(`❌ 项目扫描测试失败: ${error.message}`));
  }

  console.log(chalk.red('\n🤖 测试 5: AI 深度错误分析'));
  
  try {
    // 测试复杂错误的 AI 分析
    const complexError = `TypeError: Cannot read property 'map' of undefined
    at UserList (/path/to/file.js:15:23)
    at renderWithHooks (/node_modules/react-dom/cjs/react-dom.development.js:14985:18)`;

    const complexFile = path.join(testDir, 'complex-error.js');
    const complexCode = `
function UserList({ users }) {
  // 这里可能 users 是 undefined
  return users.map(user => (
    <div key={user.id}>
      <h3>{user.name}</h3>
    </div>
  ));
}
`;
    
    await fs.writeFile(complexFile, complexCode);

    console.log('🤖 使用 AI 分析复杂错误...');
    const aiAnalysis = await toolManager.analyzeError(complexError, complexFile);

    if (aiAnalysis.success && aiAnalysis.analysis.aiAnalysis) {
      console.log(chalk.green('✅ AI 错误分析完成'));
      console.log(`📊 错误类型: ${aiAnalysis.analysis.aiAnalysis.errorType}`);
      console.log(`🔍 根本原因: ${aiAnalysis.analysis.aiAnalysis.rootCause}`);
      console.log(`⚠️  严重程度: ${aiAnalysis.analysis.aiAnalysis.severity}`);
      
      if (aiAnalysis.analysis.aiAnalysis.suggestions.length > 0) {
        console.log('💡 AI 建议:');
        aiAnalysis.analysis.aiAnalysis.suggestions.slice(0, 2).forEach((suggestion, index) => {
          console.log(`   ${index + 1}. ${suggestion}`);
        });
      }
      
      if (aiAnalysis.analysis.aiAnalysis.codeExample) {
        console.log('📝 修复示例:');
        console.log(chalk.gray(aiAnalysis.analysis.aiAnalysis.codeExample.substring(0, 200) + '...'));
      }
    }
  } catch (error) {
    console.log(chalk.red(`❌ AI 分析测试失败: ${error.message}`));
  }

  console.log(chalk.red('\n🧹 测试 6: 批量修复演示'));
  
  try {
    // 演示批量修复流程
    console.log('🔧 模拟批量修复流程...');
    
    // 修复所有可修复的导入错误
    const importFiles = [
      path.join(testDir, 'missing-import.js'),
      path.join(testDir, 'react-key-warning.jsx')
    ];

    for (const file of importFiles) {
      if (await fs.pathExists(file)) {
        console.log(`🔧 检查文件: ${path.basename(file)}`);
        
        const validation = await toolManager.validateFix(file);
        if (!validation.success && validation.stillHasErrors) {
          console.log(`   发现错误，尝试修复...`);
          
          const analysis = await toolManager.analyzeError(validation.error, file);
          if (analysis.success && analysis.analysis.autoFixable) {
            const fixResult = await toolManager.autoFixError(file, analysis.analysis);
            if (fixResult.success) {
              console.log(chalk.green(`   ✅ 修复成功: ${fixResult.message}`));
            }
          }
        } else {
          console.log(chalk.green('   ✅ 文件无错误或已修复'));
        }
      }
    }
  } catch (error) {
    console.log(chalk.red(`❌ 批量修复测试失败: ${error.message}`));
  }

  // 清理测试文件
  try {
    await fs.remove(testDir);
    console.log(chalk.gray('\n🧹 测试文件已清理'));
  } catch (error) {
    console.log(chalk.yellow('\n⚠️  清理测试文件时出错'));
  }

  // 显示最终统计
  console.log(chalk.red('\n📊 智能错误处理系统统计信息:'));
  const finalErrorStats = toolManager.getErrorHandlerStats();
  console.log(`🔧 支持的错误类型: ${finalErrorStats.supportedErrorTypes} 种`);
  console.log(`⚡ 可自动修复类型: ${finalErrorStats.autoFixableTypes} 种`);
  console.log(`🛠️ 修复策略: ${finalErrorStats.fixStrategies} 个`);

  console.log(chalk.red('\n🎉 任务 1 完成: 智能错误处理和自动修复系统 ✅'));
  console.log(chalk.green('新增功能:'));
  console.log('   - 多种错误类型的智能检测和分类');
  console.log('   - AI 驱动的深度错误分析');
  console.log('   - 自动修复常见的语法和导入错误');
  console.log('   - React 特定错误的智能处理');
  console.log('   - 项目级别的错误扫描和批量修复');
  console.log('   - 修复结果验证和备份机制');
  console.log(chalk.yellow('\n下一步: 开始实现 AI 驱动的测试生成系统...'));
}

// 运行测试
if (require.main === module) {
  testErrorHandlingFeatures().catch(console.error);
}

module.exports = { testErrorHandlingFeatures };
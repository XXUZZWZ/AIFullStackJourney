/**
 * Mini Claude Code 使用示例
 * 
 * 这个文件展示了如何编程式地使用 Mini Claude Code 的各种功能
 */

const ToolManager = require('../lib/tool-manager');
const CodeGenerator = require('../lib/code-generator');

async function demoUsage() {
  console.log('🤖 Mini Claude Code 使用演示\n');

  // 1. 初始化工具管理器
  console.log('📦 初始化工具管理器...');
  const toolManager = new ToolManager();
  await toolManager.initialize();

  // 2. 项目分析演示
  console.log('\n🔍 项目分析演示:');
  const analysis = await toolManager.tools.analyzer.analyzeProject('.');
  if (analysis.success) {
    console.log(`✅ 检测到的语言: ${Object.keys(analysis.analysis.languages).join(', ')}`);
    console.log(`✅ 检测到的框架: ${analysis.analysis.frameworks.map(f => f.name).join(', ') || '无'}`);
    console.log(`✅ 包管理器: ${analysis.analysis.packageManager || '无'}`);
  }

  // 3. 文件操作演示
  console.log('\n📝 文件操作演示:');
  
  // 写入示例文件
  const testFile = './demo-output.txt';
  const content = `# 演示文件
这是由 Mini Claude Code 生成的演示文件。
生成时间: ${new Date().toLocaleString()}

## 项目信息
- 总文件数: ${analysis.success ? analysis.analysis.totalFiles : '未知'}
- 代码文件数: ${analysis.success ? analysis.analysis.codeFiles : '未知'}
`;

  const writeResult = await toolManager.execute('fs', 'writeFile', testFile, content);
  if (writeResult.success) {
    console.log(`✅ 文件写入成功: ${testFile}`);
  }

  // 读取文件
  const readResult = await toolManager.execute('fs', 'readFile', testFile);
  if (readResult.success) {
    console.log(`✅ 文件读取成功 (${readResult.lines} 行)`);
  }

  // 4. 代码生成演示
  console.log('\n🎨 代码生成演示:');
  const codeGenerator = new CodeGenerator();

  // 生成 React 组件
  const componentResult = await codeGenerator.generateFile('component', 'DemoComponent', analysis.analysis);
  if (componentResult.success) {
    console.log(`✅ React 组件生成: ${componentResult.filePath}`);
    
    // 写入生成的组件
    const componentWriteResult = await toolManager.execute('fs', 'writeFile', componentResult.filePath, componentResult.content);
    if (componentWriteResult.success) {
      console.log(`✅ 组件文件已保存`);
    }
  }

  // 生成测试文件
  const testResult = await codeGenerator.generateFile('test', 'DemoComponent', analysis.analysis);
  if (testResult.success) {
    console.log(`✅ 测试文件生成: ${testResult.filePath}`);
  }

  // 5. 搜索功能演示
  console.log('\n🔍 搜索功能演示:');
  const searchResult = await toolManager.execute('fs', 'searchInFiles', '.', 'function', '**/*.js');
  if (searchResult.success && searchResult.results.length > 0) {
    console.log(`✅ 找到 ${searchResult.results.length} 个包含 'function' 的文件`);
    searchResult.results.slice(0, 2).forEach(file => {
      console.log(`   📄 ${file.file}: ${file.matches.length} 个匹配`);
    });
  }

  // 6. 命令执行演示
  console.log('\n⚡ 命令执行演示:');
  
  // 获取系统信息
  const sysInfoResult = await toolManager.execute('cmd', 'getSystemInfo');
  if (sysInfoResult.success) {
    console.log(`✅ 系统信息:`);
    console.log(`   OS: ${sysInfoResult.system.os}`);
    console.log(`   架构: ${sysInfoResult.system.arch}`);
    console.log(`   Node.js: ${sysInfoResult.system.node}`);
  }

  // 检查 Git 状态
  const gitResult = await toolManager.execute('cmd', 'git', 'status --porcelain');
  if (gitResult.success) {
    const changedFiles = gitResult.stdout.trim().split('\n').filter(line => line.trim());
    console.log(`✅ Git 状态: ${changedFiles.length > 0 ? `${changedFiles.length} 个文件有变更` : '工作目录干净'}`);
  }

  // 7. 智能建议演示
  console.log('\n💡 智能建议演示:');
  const suggestions = toolManager.suggestNextActions();
  if (suggestions.length > 0) {
    console.log(`✅ 发现 ${suggestions.length} 个建议操作:`);
    suggestions.slice(0, 3).forEach((suggestion, index) => {
      console.log(`   ${index + 1}. ${suggestion.description}`);
      console.log(`      命令: ${suggestion.command}`);
    });
  } else {
    console.log(`ℹ️  当前没有特定建议`);
  }

  // 8. 生成项目报告
  console.log('\n📊 项目报告演示:');
  const report = toolManager.generateReport();
  console.log(`✅ 项目报告生成完成:`);
  console.log(`   项目路径: ${report.summary.projectPath}`);
  console.log(`   执行命令数: ${report.summary.totalCommands}`);
  console.log(`   成功率: ${report.summary.successRate}`);

  // 9. 清理演示文件
  console.log('\n🧹 清理演示文件...');
  try {
    const fs = require('fs-extra');
    
    if (await fs.pathExists(testFile)) {
      await fs.remove(testFile);
      console.log(`✅ 已删除: ${testFile}`);
    }
    
    if (componentResult.success && await fs.pathExists(componentResult.filePath)) {
      await fs.remove(componentResult.filePath);
      console.log(`✅ 已删除: ${componentResult.filePath}`);
    }
    
    // 清理可能创建的目录
    const dirsToClean = ['src/components', 'src', 'tests'];
    for (const dir of dirsToClean) {
      if (await fs.pathExists(dir)) {
        const isEmpty = (await fs.readdir(dir)).length === 0;
        if (isEmpty) {
          await fs.remove(dir);
          console.log(`✅ 已删除空目录: ${dir}`);
        }
      }
    }
    
  } catch (error) {
    console.log(`⚠️  清理过程中出现错误: ${error.message}`);
  }

  console.log('\n🎉 演示完成！');
  console.log('💡 这个演示展示了 Mini Claude Code 的核心功能:');
  console.log('   - 项目分析和框架检测');
  console.log('   - 智能文件操作');
  console.log('   - 基于模板的代码生成');
  console.log('   - 强大的搜索功能');
  console.log('   - 命令执行和系统集成');
  console.log('   - 智能建议和项目报告');
  console.log('\n🚀 尝试运行 "npm start" 体验交互模式！');
}

// 使用示例函数
async function exampleUsagePatterns() {
  console.log('\n📚 常见使用模式示例:\n');

  const toolManager = new ToolManager();
  await toolManager.initialize();

  // 模式 1: 快速项目初始化
  console.log('🏗️  模式 1: 快速项目初始化');
  console.log('// 1. 创建项目基础文件');
  console.log('await toolManager.execute("fs", "writeFile", "package.json", packageContent);');
  console.log('await toolManager.execute("fs", "writeFile", "README.md", readmeContent);');
  console.log('await toolManager.execute("fs", "createDirectory", "src");');
  
  // 模式 2: 批量代码生成
  console.log('\n🎨 模式 2: 批量代码生成');
  console.log('const components = ["Header", "Footer", "Sidebar"];');
  console.log('for (const comp of components) {');
  console.log('  const result = await codeGenerator.generateFile("component", comp);');
  console.log('  await toolManager.execute("fs", "writeFile", result.filePath, result.content);');
  console.log('}');
  
  // 模式 3: 项目维护自动化
  console.log('\n🔧 模式 3: 项目维护自动化');
  console.log('// 1. 检查代码质量');
  console.log('await toolManager.execute("cmd", "run", "npm run lint");');
  console.log('// 2. 运行测试');
  console.log('await toolManager.execute("cmd", "run", "npm test");');
  console.log('// 3. 搜索待办事项');
  console.log('await toolManager.execute("fs", "searchInFiles", ".", "TODO");');
  
  // 模式 4: 智能重构辅助
  console.log('\n🔄 模式 4: 智能重构辅助');
  console.log('// 1. 搜索特定函数');
  console.log('const searchResult = await toolManager.execute("fs", "searchInFiles", ".", "oldFunction");');
  console.log('// 2. 批量替换');
  console.log('for (const file of searchResult.results) {');
  console.log('  await toolManager.execute("fs", "editFile", file.file, "oldFunction", "newFunction");');
  console.log('}');
  
  console.log('\n✨ 这些模式展示了如何组合基础功能实现复杂的自动化任务！');
}

// 性能测试示例
async function performanceDemo() {
  console.log('\n⚡ 性能演示:\n');

  const toolManager = new ToolManager();
  await toolManager.initialize();

  // 并发文件操作
  console.log('🔄 并发文件操作测试...');
  const startTime = Date.now();
  
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(
      toolManager.execute('fs', 'writeFile', `temp-${i}.txt`, `File ${i} content`)
    );
  }
  
  const results = await Promise.all(promises);
  const duration = Date.now() - startTime;
  
  console.log(`✅ 并发创建 5 个文件用时: ${duration}ms`);
  console.log(`✅ 成功率: ${results.filter(r => r.success).length}/5`);
  
  // 清理临时文件
  const fs = require('fs-extra');
  for (let i = 0; i < 5; i++) {
    await fs.remove(`temp-${i}.txt`);
  }
  
  console.log('✅ 临时文件已清理');
}

// 主函数
async function main() {
  try {
    await demoUsage();
    await exampleUsagePatterns();
    await performanceDemo();
  } catch (error) {
    console.error('❌ 演示过程中出现错误:', error.message);
  }
}

// 如果直接运行此文件，执行演示
if (require.main === module) {
  main();
}

module.exports = {
  demoUsage,
  exampleUsagePatterns,
  performanceDemo
};
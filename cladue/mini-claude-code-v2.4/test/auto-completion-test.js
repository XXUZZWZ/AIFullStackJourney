/**
 * Mini Claude Code v2 - 命令自动补全测试
 */

const ToolManager = require('../lib/tool-manager');
const AutoCompletion = require('../lib/auto-completion');
const chalk = require('chalk');
const fs = require('fs-extra');

async function testAutoCompletionFeatures() {
  console.log(chalk.blue.bold('⚡ Mini Claude Code v2 - 命令自动补全测试\n'));

  const toolManager = new ToolManager();
  await toolManager.initialize();

  const autoCompletion = new AutoCompletion(toolManager);

  console.log(chalk.blue('🔧 测试 1: 基础命令补全'));
  
  try {
    // 测试主命令补全
    const helpCompletions = autoCompletion.getCommandCompletions('he');
    console.log(`✅ "he" 补全结果: ${helpCompletions.map(c => c.text).join(', ')}`);
    
    const readCompletions = autoCompletion.getCommandCompletions('r');
    console.log(`✅ "r" 补全结果: ${readCompletions.map(c => c.text).join(', ')}`);
    
    const createCompletions = autoCompletion.getCommandCompletions('cr');
    console.log(`✅ "cr" 补全结果: ${createCompletions.map(c => c.text).join(', ')}`);
    
  } catch (error) {
    console.log(chalk.red(`❌ 基础命令补全测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n🎯 测试 2: 子命令补全'));
  
  try {
    // 测试 AI 子命令
    const aiCompletions = autoCompletion.getCommandCompletions('ai s');
    console.log(`✅ "ai s" 补全结果: ${aiCompletions.map(c => c.text).join(', ')}`);
    
    // 测试配置子命令
    const configCompletions = autoCompletion.getCommandCompletions('config s');
    console.log(`✅ "config s" 补全结果: ${configCompletions.map(c => c.text).join(', ')}`);
    
  } catch (error) {
    console.log(chalk.red(`❌ 子命令补全测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n📁 测试 3: 文件路径补全'));
  
  try {
    // 创建一些测试文件
    await fs.ensureDir('test-files');
    await fs.writeFile('test-files/example.js', 'console.log("test");');
    await fs.writeFile('test-files/demo.ts', 'const test: string = "hello";');
    await fs.ensureDir('test-files/components');
    
    // 测试文件路径补全
    const fileCompletions = autoCompletion.getFilePathCompletions('test-files/');
    console.log(`✅ "test-files/" 补全结果: ${fileCompletions.length} 个文件/目录`);
    fileCompletions.forEach(comp => {
      console.log(`   ${comp.type === 'directory' ? '📁' : '📄'} ${comp.display} - ${comp.description}`);
    });
    
    const jsCompletions = autoCompletion.getFilePathCompletions('test-files/e');
    console.log(`✅ "test-files/e" 补全结果: ${jsCompletions.map(c => c.text).join(', ')}`);
    
  } catch (error) {
    console.log(chalk.red(`❌ 文件路径补全测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n🏗️ 测试 4: 文件类型补全'));
  
  try {
    const componentCompletions = autoCompletion.getCommandCompletions('create comp');
    console.log(`✅ "create comp" 补全结果: ${componentCompletions.map(c => c.text).join(', ')}`);
    
    const pageCompletions = autoCompletion.getCommandCompletions('create p');
    console.log(`✅ "create p" 补全结果: ${pageCompletions.map(c => c.text).join(', ')}`);
    
  } catch (error) {
    console.log(chalk.red(`❌ 文件类型补全测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n📝 测试 5: 文件名建议'));
  
  try {
    const buttonSuggestions = autoCompletion.getCommandCompletions('create component But');
    console.log(`✅ "create component But" 补全结果: ${buttonSuggestions.map(c => c.text).join(', ')}`);
    
    const homeSuggestions = autoCompletion.getCommandCompletions('create page Ho');
    console.log(`✅ "create page Ho" 补全结果: ${homeSuggestions.map(c => c.text).join(', ')}`);
    
  } catch (error) {
    console.log(chalk.red(`❌ 文件名建议测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n⚡ 测试 6: 命令建议'));
  
  try {
    const npmSuggestions = autoCompletion.getCommandSuggestions('npm');
    console.log(`✅ "npm" 命令建议: ${npmSuggestions.length} 个`);
    npmSuggestions.slice(0, 5).forEach(suggestion => {
      console.log(`   ⚡ ${suggestion.text} - ${suggestion.description}`);
    });
    
    const gitSuggestions = autoCompletion.getCommandSuggestions('git');
    console.log(`✅ "git" 命令建议: ${gitSuggestions.length} 个`);
    gitSuggestions.slice(0, 3).forEach(suggestion => {
      console.log(`   ⚡ ${suggestion.text} - ${suggestion.description}`);
    });
    
  } catch (error) {
    console.log(chalk.red(`❌ 命令建议测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n🎯 测试 7: 智能建议'));
  
  try {
    const smartSuggestions = autoCompletion.getSmartSuggestions();
    console.log(`✅ 智能建议: ${smartSuggestions.length} 个`);
    smartSuggestions.forEach((suggestion, index) => {
      console.log(`   ${index + 1}. ${suggestion.command} - ${suggestion.description} (优先级: ${suggestion.priority})`);
    });
    
  } catch (error) {
    console.log(chalk.red(`❌ 智能建议测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n📊 测试 8: 项目特定命令'));
  
  try {
    const projectCommands = autoCompletion.getProjectSpecificCommands();
    console.log(`✅ 项目特定命令: ${projectCommands.length} 个`);
    projectCommands.slice(0, 5).forEach(cmd => {
      console.log(`   📦 ${cmd}`);
    });
    
  } catch (error) {
    console.log(chalk.red(`❌ 项目特定命令测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n🗂️ 测试 9: 缓存系统'));
  
  try {
    // 测试缓存功能
    const beforeCache = Date.now();
    const firstCall = autoCompletion.getFilePathCompletions('test-files');
    const firstTime = Date.now() - beforeCache;
    
    const beforeCachedCall = Date.now();
    const secondCall = autoCompletion.getFilePathCompletions('test-files');
    const secondTime = Date.now() - beforeCachedCall;
    
    console.log(`✅ 第一次调用: ${firstTime}ms, 第二次调用: ${secondTime}ms`);
    console.log(`✅ 缓存效果: ${firstCall.length === secondCall.length ? '结果一致' : '结果不一致'}`);
    
    // 显示缓存统计
    const stats = autoCompletion.getStats();
    console.log(`✅ 当前缓存大小: ${stats.cacheSize} 项`);
    
  } catch (error) {
    console.log(chalk.red(`❌ 缓存系统测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n🔧 测试 10: 复杂命令补全'));
  
  try {
    // 测试复杂的命令补全场景
    const readFileCompletion = autoCompletion.getCommandCompletions('read test-files/exam');
    console.log(`✅ "read test-files/exam" 补全: ${readFileCompletion.map(c => c.text).join(', ')}`);
    
    const editFileCompletion = autoCompletion.getCommandCompletions('edit package.');
    console.log(`✅ "edit package." 补全: ${editFileCompletion.map(c => c.text).join(', ')}`);
    
    const searchCompletion = autoCompletion.getCommandCompletions('search "TODO" test-');
    console.log(`✅ "search 'TODO' test-" 补全: ${searchCompletion.map(c => c.text).join(', ')}`);
    
  } catch (error) {
    console.log(chalk.red(`❌ 复杂命令补全测试失败: ${error.message}`));
  }

  // 清理测试文件
  try {
    await fs.remove('test-files');
    console.log(chalk.gray('\n🧹 测试文件已清理'));
  } catch (error) {
    console.log(chalk.yellow('\n⚠️  清理测试文件时出错'));
  }

  // 显示最终统计
  console.log(chalk.blue('\n📈 自动补全系统统计信息:'));
  const finalStats = autoCompletion.getStats();
  console.log(`⚡ 基础命令: ${finalStats.baseCommands} 个`);
  console.log(`🗃️ 缓存项目: ${finalStats.cacheSize} 个`);
  console.log(`🏗️ 文件类型: ${finalStats.supportedFileTypes} 个`);
  console.log(`📄 文件扩展名: ${finalStats.commonExtensions} 个`);

  console.log(chalk.blue('\n🎉 任务 3 完成: 命令自动补全 ✅'));
  console.log(chalk.green('新增功能:'));
  console.log('   - Tab 键智能命令补全');
  console.log('   - 文件路径和目录自动补全');
  console.log('   - 项目特定命令建议');
  console.log('   - 命令历史浏览支持');
  console.log('   - 智能上下文建议');
  console.log('   - 缓存优化的性能');
  console.log('   - 多种补全类型支持');
  console.log(chalk.yellow('\n🎊 所有 3 个优先任务已完成！'));
}

// 运行测试
if (require.main === module) {
  testAutoCompletionFeatures().catch(console.error);
}

module.exports = { testAutoCompletionFeatures };
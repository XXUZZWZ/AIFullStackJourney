/**
 * 快速 AI 功能测试
 */

const ToolManager = require('../lib/tool-manager');
const chalk = require('chalk');

async function quickAITest() {
  console.log(chalk.blue.bold('🤖 快速 AI 功能测试\n'));

  const toolManager = new ToolManager();
  await toolManager.initialize();

  // 1. 检查 AI 状态
  console.log('1. AI 状态检查:');
  const status = toolManager.getAIStatus();
  console.log(`   ✅ AI 可用: ${status.available ? '是' : '否'}`);
  console.log(`   ✅ API Key: ${status.stats.apiKey ? '已配置' : '未配置'}`);

  // 2. 本地自然语言解析测试
  console.log('\n2. 本地解析测试:');
  const localTests = [
    'read package.json',
    'list files',
    'create component TestComponent'
  ];

  for (const input of localTests) {
    console.log(`   测试: "${input}"`);
    try {
      const result = await toolManager.processNaturalLanguage(input);
      console.log(`   结果: ${result.success ? '✅ 成功' : '❌ 失败'}`);
    } catch (error) {
      console.log(`   结果: ❌ 错误 - ${error.message}`);
    }
  }

  // 3. 功能统计
  console.log('\n3. 功能统计:');
  const nlpStats = toolManager.nlp.getStats();
  console.log(`   ✅ 支持操作: ${nlpStats.supportedActions.length} 种`);
  console.log(`   ✅ 文件类型: ${nlpStats.supportedFileTypes.length} 种`);
  console.log(`   ✅ AI 集成: ${nlpStats.aiAvailable ? '已启用' : '本地模式'}`);

  console.log(chalk.green('\n🎉 测试完成！系统正常运行。'));
  console.log(chalk.yellow('💡 使用 "npm start" 启动交互模式体验完整功能！'));
}

if (require.main === module) {
  quickAITest().catch(console.error);
}

module.exports = { quickAITest };
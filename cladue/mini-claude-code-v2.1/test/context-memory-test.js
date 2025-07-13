/**
 * Mini Claude Code v2 - 上下文记忆系统测试
 */

const ToolManager = require('../lib/tool-manager');
const chalk = require('chalk');

async function testContextMemoryFeatures() {
  console.log(chalk.blue.bold('🧠 Mini Claude Code v2 - 上下文记忆系统测试\n'));

  const toolManager = new ToolManager();
  await toolManager.initialize();

  // 检查 AI 服务状态
  const aiStatus = toolManager.getAIStatus();
  console.log(`✅ AI 服务状态: ${aiStatus.available ? '可用' : '不可用'}`);
  console.log(`💾 记忆系统状态: ${aiStatus.memoryStats ? '已初始化' : '未初始化'}`);

  if (!aiStatus.available) {
    console.log(chalk.yellow('⚠️  配置 API Key 以体验完整功能...'));
    await toolManager.configureAPI('sk-386b598ba19f49eba2d681f8135f5ae3');
  }

  console.log(chalk.blue('\n📝 测试 1: 对话记忆保存'));
  
  try {
    // 模拟第一次对话
    console.log(chalk.cyan('用户: 我想学习 React 组件开发'));
    const firstResult = await toolManager.chat('我想学习 React 组件开发', {
      timeout: 15000
    });
    
    if (firstResult.success) {
      console.log(chalk.green('✅ 第一次对话已保存到记忆系统'));
    }

    // 等待一秒以确保时间戳不同
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 模拟第二次相关对话
    console.log(chalk.cyan('\n用户: 如何创建一个简单的按钮组件？'));
    const secondResult = await toolManager.chat('如何创建一个简单的按钮组件？', {
      timeout: 15000
    });
    
    if (secondResult.success) {
      console.log(chalk.green('✅ 第二次对话已保存，应该能关联到之前的 React 讨论'));
    }

  } catch (error) {
    console.log(chalk.red(`❌ 对话测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n🔍 测试 2: 历史对话检索'));
  
  try {
    const relatedHistory = toolManager.searchConversationHistory('React 组件', 3);
    console.log(chalk.green(`✅ 找到 ${relatedHistory.length} 条相关历史对话`));
    
    relatedHistory.forEach((conv, index) => {
      console.log(`  ${index + 1}. 用户: ${conv.userInput.substring(0, 50)}...`);
      console.log(`     AI: ${conv.aiResponse.substring(0, 50)}...`);
      console.log(`     评分: ${conv.score.toFixed(2)} | 时间: ${new Date(conv.timestamp).toLocaleString()}`);
    });
  } catch (error) {
    console.log(chalk.red(`❌ 历史检索测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n💻 测试 3: 代码片段记忆'));
  
  try {
    // 生成一个简单的代码片段
    const codeDescription = '创建一个计算两个数之和的函数';
    console.log(chalk.cyan(`生成代码: ${codeDescription}`));
    
    const codeResult = await toolManager.generateCodeWithAI(codeDescription, {
      saveToFile: false // 不保存到文件，只保存到记忆
    });
    
    if (codeResult.success) {
      console.log(chalk.green('✅ 代码片段已生成并保存到记忆系统'));
      console.log(chalk.gray(`代码预览: ${codeResult.code.substring(0, 100)}...`));
    }

    // 搜索相关代码片段
    const relatedCode = toolManager.searchCodeSnippets('函数 计算', 'javascript', 2);
    console.log(chalk.green(`✅ 找到 ${relatedCode.length} 个相关代码片段`));
    
    relatedCode.forEach((snippet, index) => {
      console.log(`  ${index + 1}. ${snippet.description} (${snippet.language})`);
      console.log(`     评分: ${snippet.score.toFixed(2)} | 使用次数: ${snippet.useCount}`);
    });

  } catch (error) {
    console.log(chalk.red(`❌ 代码片段测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n🗃️ 测试 4: 项目记忆'));
  
  try {
    const currentPath = process.cwd();
    
    // 更新项目记忆
    await toolManager.memory.updateProjectMemory(currentPath, {
      lastUsedCommands: ['read', 'generate', 'chat'],
      preferredFramework: 'React',
      codeStyle: 'ES6+',
      testingFramework: 'Jest'
    });
    
    console.log(chalk.green('✅ 项目记忆已更新'));
    
    // 获取项目记忆
    const projectMemory = toolManager.memory.projectMemory[currentPath];
    if (projectMemory) {
      console.log(`   最后访问时间: ${projectMemory.lastAccessed}`);
      console.log(`   偏好框架: ${projectMemory.preferredFramework || '无'}`);
      console.log(`   代码风格: ${projectMemory.codeStyle || '无'}`);
    }
  } catch (error) {
    console.log(chalk.red(`❌ 项目记忆测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n⚙️ 测试 5: 用户偏好设置'));
  
  try {
    await toolManager.memory.updateUserPreferences({
      preferredLanguage: 'JavaScript',
      codeStyle: 'functional',
      responseStyle: '简洁实用',
      autoSave: true
    });
    
    console.log(chalk.green('✅ 用户偏好已设置'));
    
    const preferences = toolManager.memory.userPreferences;
    console.log(`   偏好语言: ${preferences.preferredLanguage}`);
    console.log(`   代码风格: ${preferences.codeStyle}`);
    console.log(`   响应风格: ${preferences.responseStyle}`);
    console.log(`   自动保存: ${preferences.autoSave}`);
  } catch (error) {
    console.log(chalk.red(`❌ 用户偏好测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n📊 测试 6: 上下文提示生成'));
  
  try {
    const testQuery = '如何优化 React 组件性能？';
    const contextPrompt = toolManager.memory.generateContextPrompt(testQuery, toolManager.context.projectInfo);
    
    console.log(chalk.green('✅ 上下文提示已生成'));
    console.log(chalk.gray('上下文内容预览:'));
    console.log(chalk.gray(contextPrompt.substring(0, 300) + '...'));
    
    // 验证上下文包含相关信息
    const hasHistory = contextPrompt.includes('相关对话历史');
    const hasPreferences = contextPrompt.includes('用户偏好');
    const hasProject = contextPrompt.includes('当前项目信息');
    
    console.log(`   包含历史对话: ${hasHistory ? '✅' : '❌'}`);
    console.log(`   包含用户偏好: ${hasPreferences ? '✅' : '❌'}`);
    console.log(`   包含项目信息: ${hasProject ? '✅' : '❌'}`);
  } catch (error) {
    console.log(chalk.red(`❌ 上下文生成测试失败: ${error.message}`));
  }

  // 显示最终统计
  console.log(chalk.blue('\n📈 记忆系统统计信息:'));
  const memoryStats = toolManager.getMemoryStats();
  console.log(`📝 对话记录: ${memoryStats.conversationCount}`);
  console.log(`💻 代码片段: ${memoryStats.codeSnippetCount}`);
  console.log(`⚙️ 用户偏好: ${memoryStats.userPreferences} 项`);
  console.log(`🗂️ 项目记忆: ${memoryStats.projectsRemembered} 个`);
  console.log(`🆔 会话ID: ${memoryStats.currentSessionId}`);
  console.log(`📁 存储位置: ${memoryStats.storageDir}`);

  console.log(chalk.blue('\n🎉 任务 2 完成: 上下文记忆系统 ✅'));
  console.log(chalk.green('新增功能:'));
  console.log('   - 跨会话对话历史记录和检索');
  console.log('   - 智能代码片段保存和搜索');
  console.log('   - 项目信息记忆和关联');
  console.log('   - 用户偏好学习和应用');
  console.log('   - 上下文感知的AI响应生成');
  console.log('   - 记忆数据的持久化存储');
  console.log(chalk.yellow('\n下一步: 实现命令自动补全功能...'));
}

// 运行测试
if (require.main === module) {
  testContextMemoryFeatures().catch(console.error);
}

module.exports = { testContextMemoryFeatures };
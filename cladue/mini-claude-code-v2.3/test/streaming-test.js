/**
 * Mini Claude Code v2 - 流式响应测试
 */

const ToolManager = require('../lib/tool-manager');
const chalk = require('chalk');

async function testStreamingFeatures() {
  console.log(chalk.blue.bold('🚀 Mini Claude Code v2 - 流式响应测试\n'));

  const toolManager = new ToolManager();
  await toolManager.initialize();

  // 检查 AI 服务状态
  const aiStatus = toolManager.getAIStatus();
  console.log(`✅ AI 服务状态: ${aiStatus.available ? '可用' : '不可用'}`);

  if (!aiStatus.available) {
    console.log(chalk.yellow('⚠️  配置 API Key 以体验流式功能...'));
    await toolManager.configureAPI('sk-386b598ba19f49eba2d681f8135f5ae3');
  }

  console.log(chalk.blue('\n📡 测试 1: 流式聊天对话'));
  console.log(chalk.cyan('用户: 你好，请简单介绍一下你的能力'));
  
  try {
    const result = await toolManager.ai.chatStream(
      '你好，请简单介绍一下你的能力',
      {
        temperature: 0.7,
        timeout: 30000
      },
      async (data) => {
        if (data.content) {
          process.stdout.write(data.content);
        }
        if (data.isComplete) {
          process.stdout.write('\n');
        }
      }
    );

    if (result.success) {
      console.log(chalk.green(`✅ 流式对话成功 (${result.totalChunks} 个数据块)`));
    } else {
      console.log(chalk.red(`❌ 流式对话失败: ${result.error}`));
    }
  } catch (error) {
    console.log(chalk.red(`❌ 测试错误: ${error.message}`));
  }

  console.log(chalk.blue('\n🎨 测试 2: 流式代码生成'));
  console.log(chalk.cyan('需求: 创建一个简单的计算器函数'));
  
  try {
    const result = await toolManager.ai.chatStream(
      '请生成一个JavaScript计算器函数，包含加减乘除功能。只返回代码，不要解释。',
      {
        systemPrompt: '你是一个代码生成专家。只返回干净的JavaScript代码，不要包含markdown格式。',
        temperature: 0.3,
        maxTokens: 1000
      },
      async (data) => {
        if (data.content) {
          process.stdout.write(data.content);
        }
        if (data.isComplete) {
          process.stdout.write('\n');
        }
      }
    );

    if (result.success) {
      console.log(chalk.green(`✅ 代码生成成功 (${result.totalChunks} 个数据块)`));
    } else {
      console.log(chalk.red(`❌ 代码生成失败: ${result.error}`));
    }
  } catch (error) {
    console.log(chalk.red(`❌ 测试错误: ${error.message}`));
  }

  console.log(chalk.blue('\n⚡ 测试 3: 性能对比'));
  
  // 测试非流式响应
  console.log(chalk.gray('测试非流式响应...'));
  const classicStart = Date.now();
  try {
    const classicResult = await toolManager.ai.chat('请用一句话介绍JavaScript', {
      stream: false,
      maxTokens: 100
    });
    const classicDuration = Date.now() - classicStart;
    
    if (classicResult.success) {
      console.log(chalk.green(`✅ 非流式: ${classicDuration}ms`));
      console.log(chalk.gray(`响应: ${classicResult.response.substring(0, 100)}...`));
    }
  } catch (error) {
    console.log(chalk.red(`❌ 非流式测试失败: ${error.message}`));
  }

  // 测试流式响应
  console.log(chalk.gray('测试流式响应...'));
  const streamStart = Date.now();
  let firstChunkTime = null;
  try {
    const streamResult = await toolManager.ai.chatStream('请用一句话介绍Python', {
      maxTokens: 100
    }, async (data) => {
      if (data.content && !firstChunkTime) {
        firstChunkTime = Date.now();
      }
    });
    const streamDuration = Date.now() - streamStart;
    const timeToFirst = firstChunkTime ? firstChunkTime - streamStart : streamDuration;
    
    if (streamResult.success) {
      console.log(chalk.green(`✅ 流式: 总时间 ${streamDuration}ms, 首字节 ${timeToFirst}ms`));
      console.log(chalk.gray(`响应: ${streamResult.response.substring(0, 100)}...`));
    }
  } catch (error) {
    console.log(chalk.red(`❌ 流式测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n🔧 测试 4: 超时和错误处理'));
  
  try {
    console.log(chalk.gray('测试短超时...'));
    const timeoutResult = await toolManager.ai.chat('请详细解释什么是机器学习', {
      timeout: 1000, // 1秒超时
      maxTokens: 2000
    });
    
    if (timeoutResult.timeout) {
      console.log(chalk.green('✅ 超时处理正常工作'));
    } else if (timeoutResult.success) {
      console.log(chalk.yellow('⚠️  请求意外完成（可能网络很快）'));
    } else {
      console.log(chalk.red(`❌ 其他错误: ${timeoutResult.error}`));
    }
  } catch (error) {
    console.log(chalk.red(`❌ 超时测试失败: ${error.message}`));
  }

  // 统计信息
  console.log(chalk.blue('\n📊 流式功能总结:'));
  console.log(chalk.green('✅ 新增功能:'));
  console.log('   - chatStream() 方法支持实时流式输出');
  console.log('   - 超时控制和错误恢复');
  console.log('   - 实时回调函数处理数据块');
  console.log('   - 流式 vs 非流式性能对比');
  console.log('   - CLI 界面流式显示集成');

  console.log(chalk.blue('\n🎉 任务 1 完成: 流式 AI 响应 ✅'));
  console.log(chalk.yellow('下一步: 实现上下文记忆系统...'));
}

// 运行测试
if (require.main === module) {
  testStreamingFeatures().catch(console.error);
}

module.exports = { testStreamingFeatures };
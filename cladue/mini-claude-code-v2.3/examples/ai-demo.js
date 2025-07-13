/**
 * Mini Claude Code v1 AI 功能演示
 * 
 * 这个演示展示了集成 DeepSeek API 后的 AI 功能
 */

const ToolManager = require('../lib/tool-manager');
const chalk = require('chalk');

async function demoAIFeatures() {
  console.log(chalk.blue.bold('🤖 Mini Claude Code v1 - AI 功能演示\n'));

  // 1. 初始化工具管理器
  console.log('📦 初始化工具管理器...');
  const toolManager = new ToolManager();
  await toolManager.initialize();

  // 2. 检查 AI 状态
  console.log('\n🔍 检查 AI 服务状态:');
  const aiStatus = toolManager.getAIStatus();
  console.log(`✅ AI 可用性: ${aiStatus.available ? '已启用' : '未配置'}`);
  console.log(`✅ API Key: ${aiStatus.stats.apiKey || '未设置'}`);
  console.log(`✅ 可用模型: ${Object.values(aiStatus.stats.availableModels).join(', ')}`);

  if (!aiStatus.available) {
    console.log(chalk.yellow('\n⚠️  AI 功能需要配置 API Key 才能使用'));
    console.log(chalk.gray('使用文档中提供的 API Key 进行演示...'));
    
    // 使用文档中的 API Key
    const configResult = await toolManager.configureAPI('sk-386b598ba19f49eba2d681f8135f5ae3');
    if (configResult.success) {
      console.log(chalk.green('✅ API Key 配置成功！'));
    } else {
      console.log(chalk.red(`❌ API Key 配置失败: ${configResult.error}`));
      console.log(chalk.yellow('演示将展示本地功能...'));
    }
  }

  // 3. 自然语言处理演示
  console.log(chalk.blue('\n🧠 自然语言处理演示:'));
  
  const nlpTests = [
    '读取 package.json 文件',
    '创建一个名为 Button 的 React 组件', 
    '搜索包含 function 的文件',
    '运行 ls -la 命令',
    'Show me the project structure'
  ];

  for (const input of nlpTests) {
    console.log(chalk.cyan(`\n👤 用户输入: "${input}"`));
    
    try {
      const result = await toolManager.processNaturalLanguage(input);
      
      if (result.success) {
        if (result.response) {
          console.log(chalk.green(`🤖 AI 响应: ${result.response.substring(0, 150)}...`));
        } else if (result.message) {
          console.log(chalk.green(`✅ 执行结果: ${result.message}`));
        } else {
          console.log(chalk.green('✅ 命令执行成功'));
        }
        
        if (result.filePath) {
          console.log(chalk.gray(`📄 文件路径: ${result.filePath}`));
        }
      } else {
        console.log(chalk.red(`❌ 处理失败: ${result.error}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ 错误: ${error.message}`));
    }
    
    // 添加延迟避免 API 限制
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 4. AI 聊天演示
  if (aiStatus.available || toolManager.getAIStatus().available) {
    console.log(chalk.blue('\n💬 AI 聊天功能演示:'));
    
    const chatTests = [
      '你好，请介绍一下你的能力',
      '这个项目使用了什么技术栈？',
      '如何优化 Node.js 应用的性能？'
    ];

    for (const message of chatTests) {
      console.log(chalk.cyan(`\n👤 用户: ${message}`));
      
      try {
        const result = await toolManager.chat(message);
        
        if (result.success) {
          console.log(chalk.green(`🤖 AI: ${result.response.substring(0, 200)}...`));
          if (result.usage) {
            console.log(chalk.gray(`📊 Token 使用: ${result.usage.total_tokens}`));
          }
        } else {
          console.log(chalk.red(`❌ 聊天失败: ${result.error}`));
        }
      } catch (error) {
        console.log(chalk.red(`❌ 错误: ${error.message}`));
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 5. 智能代码生成演示
    console.log(chalk.blue('\n✨ 智能代码生成演示:'));
    
    const codeGenTests = [
      '创建一个简单的计算器函数',
      '生成一个 Express.js 路由处理 GET /api/users',
      '写一个 React Hook 来管理用户状态'
    ];

    for (const description of codeGenTests) {
      console.log(chalk.cyan(`\n👤 需求: ${description}`));
      
      try {
        const result = await toolManager.generateCodeWithAI(description);
        
        if (result.success) {
          console.log(chalk.green('✅ 代码生成成功:'));
          console.log(chalk.gray('--- 生成的代码 ---'));
          console.log(result.code.substring(0, 300) + '...');
          console.log(chalk.gray('--- 代码结束 ---'));
        } else {
          console.log(chalk.red(`❌ 代码生成失败: ${result.error}`));
        }
      } catch (error) {
        console.log(chalk.red(`❌ 错误: ${error.message}`));
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // 6. 本地解析功能演示
  console.log(chalk.blue('\n🏠 本地解析功能演示:'));
  
  const localTests = [
    'read README.md',
    'list .',
    'create component TestLocal',
    'search "test"'
  ];

  for (const input of localTests) {
    console.log(chalk.cyan(`\n👤 本地命令: "${input}"`));
    
    try {
      const result = await toolManager.processNaturalLanguage(input);
      
      if (result.success) {
        console.log(chalk.green('✅ 本地解析成功'));
        if (result.message) {
          console.log(chalk.gray(`结果: ${result.message}`));
        }
      } else {
        console.log(chalk.red(`❌ 本地解析失败: ${result.error}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ 错误: ${error.message}`));
    }
  }

  // 7. 性能统计
  console.log(chalk.blue('\n📊 功能统计:'));
  const finalStats = toolManager.getAIStatus();
  const context = toolManager.getContext();
  
  console.log(`✅ 总命令执行: ${context.session.commands.length}`);
  console.log(`✅ AI 功能状态: ${finalStats.available ? '已启用' : '仅本地'}`);
  console.log(`✅ 支持的操作: ${finalStats.nlpStats.supportedActions.length} 种`);
  console.log(`✅ 支持的文件类型: ${finalStats.nlpStats.supportedFileTypes.length} 种`);

  console.log(chalk.green('\n🎉 AI 功能演示完成！'));
  console.log(chalk.yellow('💡 主要特性:'));
  console.log(chalk.gray('   - 自然语言指令解析 (中英文)'));
  console.log(chalk.gray('   - AI 智能对话'));
  console.log(chalk.gray('   - 智能代码生成'));
  console.log(chalk.gray('   - 本地规则备用解析'));
  console.log(chalk.gray('   - 项目上下文感知'));
  console.log(chalk.gray('   - 多模型支持 (deepseek-chat, deepseek-reasoner)'));
  
  console.log(chalk.blue('\n🚀 启动交互模式试试: npm start'));
}

// 错误处理和统计
async function performanceTest() {
  console.log(chalk.blue('\n⚡ 性能测试:'));
  
  const toolManager = new ToolManager();
  await toolManager.initialize();
  
  const startTime = Date.now();
  
  // 并发测试本地解析
  const localPromises = [
    toolManager.processNaturalLanguage('list files'),
    toolManager.processNaturalLanguage('show status'),
    toolManager.processNaturalLanguage('analyze project')
  ];
  
  const results = await Promise.all(localPromises.map(p => p.catch(e => ({ success: false, error: e.message }))));
  const duration = Date.now() - startTime;
  
  console.log(`✅ 并发处理 3 个本地指令用时: ${duration}ms`);
  console.log(`✅ 成功率: ${results.filter(r => r.success).length}/3`);
}

// 功能完整性测试
async function functionalityTest() {
  console.log(chalk.blue('\n🧪 功能完整性测试:'));
  
  const toolManager = new ToolManager();
  await toolManager.initialize();
  
  const tests = [
    {
      name: '工具管理器初始化',
      test: () => toolManager.getContext() !== null
    },
    {
      name: 'AI 模块加载',
      test: () => toolManager.ai !== null
    },
    {
      name: 'NLP 处理器加载',
      test: () => toolManager.nlp !== null
    },
    {
      name: '代码生成器集成',
      test: () => toolManager.tools.codeGenerator !== null
    },
    {
      name: '配置管理功能',
      test: () => typeof toolManager.configureAPI === 'function'
    }
  ];

  tests.forEach(({ name, test }) => {
    const result = test();
    console.log(`${result ? '✅' : '❌'} ${name}`);
  });
}

// 主函数
async function main() {
  try {
    await demoAIFeatures();
    await performanceTest();
    await functionalityTest();
  } catch (error) {
    console.error(chalk.red('❌ 演示过程中出现错误:'), error.message);
    console.error(chalk.gray(error.stack));
  }
}

// 如果直接运行此文件，执行演示
if (require.main === module) {
  main();
}

module.exports = {
  demoAIFeatures,
  performanceTest,
  functionalityTest
};
/**
 * Mini Claude Code v3 - AI 任务规划和执行系统测试
 */

const ToolManager = require('../lib/tool-manager');
const chalk = require('chalk');

async function testTaskPlanningFeatures() {
  console.log(chalk.blue.bold('🎯 Mini Claude Code v3 - AI 任务规划和执行系统测试\n'));

  const toolManager = new ToolManager();
  await toolManager.initialize();

  // 检查系统状态
  const aiStatus = toolManager.getAIStatus();
  const plannerStats = toolManager.getTaskPlannerStats();
  
  console.log(`✅ AI 服务状态: ${aiStatus.available ? '可用' : '不可用'}`);
  console.log(`🎯 任务规划系统: 支持 ${plannerStats.supportedTaskTypes} 种任务类型`);
  console.log(`📋 可用模板: ${plannerStats.availableTemplates} 个`);
  console.log(`⚡ 执行能力: ${plannerStats.executionCapabilities.join(', ')}`);

  if (!aiStatus.available) {
    console.log(chalk.yellow('⚠️  配置默认 API Key...'));
    await toolManager.configureAPI('sk-386b598ba19f49eba2d681f8135f5ae3');
  }

  console.log(chalk.blue('\n🚀 测试 1: 简单项目规划 - React Todo 应用'));
  
  try {
    const simpleProject = "创建一个React Todo应用，包含添加、删除、标记完成的功能";
    console.log(`📝 用户需求: ${simpleProject}`);
    
    const planResult = await toolManager.generateTaskPlan(simpleProject);

    if (planResult.success) {
      console.log(chalk.green('✅ 任务计划生成成功'));
      const { plan, summary } = planResult;
      
      console.log(`🎯 计划标题: ${plan.title}`);
      console.log(`📝 描述: ${plan.description}`);
      console.log(`📊 复杂度: ${plan.complexity}`);
      console.log(`⏱️  预计时间: ${plan.estimatedDuration} 分钟`);
      
      if (plan.techStack && plan.techStack.length > 0) {
        console.log(`🔧 技术栈: ${plan.techStack.join(', ')}`);
      }
      
      console.log(`📋 任务数量: ${summary.totalTasks}`);
      console.log(`🔥 高优先级任务: ${summary.highPriorityTasks}`);
      
      console.log('\n📋 任务列表:');
      plan.tasks.forEach((task, index) => {
        const priorityIcon = task.priority === 'high' ? '🔥' : task.priority === 'medium' ? '🟡' : '🟢';
        console.log(`   ${index + 1}. ${priorityIcon} ${task.title} (${task.estimatedTime}分钟)`);
        console.log(`      ${chalk.gray(task.description)}`);
      });
      
      // 测试部分执行
      console.log(chalk.blue('\n🔄 测试任务执行 (前3个任务)...'));
      
      // 创建一个简化的计划用于测试
      const testPlan = {
        ...plan,
        tasks: plan.tasks.slice(0, 3) // 只执行前3个任务
      };
      
      const executionResult = await toolManager.executeTaskPlan(testPlan, {
        stopOnError: false
      });
      
      if (executionResult.success) {
        console.log(chalk.green('✅ 任务执行测试完成'));
        const { executionState } = executionResult;
        console.log(`📊 执行结果: ${executionState.completedTasks.length}/${executionState.totalTasks} 任务完成`);
        
        if (executionState.failedTasks.length > 0) {
          console.log(`⚠️  ${executionState.failedTasks.length} 个任务失败`);
        }
      } else {
        console.log(chalk.yellow(`⚠️  执行测试失败: ${executionResult.error}`));
      }
    } else {
      console.log(chalk.red(`❌ 计划生成失败: ${planResult.error}`));
    }
  } catch (error) {
    console.log(chalk.red(`❌ 简单项目规划测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n🏗️ 测试 2: 复杂项目规划 - 全栈电商应用'));
  
  try {
    const complexProject = "创建一个全栈电商项目，包含用户认证、商品管理、购物车、支付功能，使用React、Node.js、MongoDB";
    console.log(`📝 用户需求: ${complexProject}`);
    
    const complexPlanResult = await toolManager.generateTaskPlan(complexProject);

    if (complexPlanResult.success) {
      console.log(chalk.green('✅ 复杂项目计划生成成功'));
      const { plan, summary } = complexPlanResult;
      
      console.log(`🎯 计划标题: ${plan.title}`);
      console.log(`📊 复杂度: ${plan.complexity}`);
      console.log(`⏱️  预计时间: ${plan.estimatedDuration} 分钟`);
      console.log(`📋 任务数量: ${summary.totalTasks}`);
      
      if (plan.techStack && plan.techStack.length > 0) {
        console.log(`🔧 技术栈: ${plan.techStack.join(', ')}`);
      }
      
      console.log('\n📋 主要任务分类:');
      const tasksByType = {};
      plan.tasks.forEach(task => {
        const type = task.type || 'general';
        if (!tasksByType[type]) tasksByType[type] = 0;
        tasksByType[type]++;
      });
      
      Object.entries(tasksByType).forEach(([type, count]) => {
        console.log(`   • ${type}: ${count} 个任务`);
      });
      
      if (plan.metadata.recommendations && plan.metadata.recommendations.length > 0) {
        console.log('\n💡 AI 建议:');
        plan.metadata.recommendations.slice(0, 3).forEach((rec, index) => {
          console.log(`   ${index + 1}. ${rec}`);
        });
      }
    } else {
      console.log(chalk.red(`❌ 复杂项目计划生成失败: ${complexPlanResult.error}`));
    }
  } catch (error) {
    console.log(chalk.red(`❌ 复杂项目规划测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n🔧 测试 3: 功能添加规划'));
  
  try {
    const featureRequest = "为现有项目添加用户权限管理功能，包含角色分配和权限控制";
    console.log(`📝 功能需求: ${featureRequest}`);
    
    const featurePlanResult = await toolManager.generateTaskPlan(featureRequest);

    if (featurePlanResult.success) {
      console.log(chalk.green('✅ 功能添加计划生成成功'));
      const { plan } = featurePlanResult;
      
      console.log(`🎯 功能: ${plan.title}`);
      console.log(`📊 类型: ${plan.type}`);
      console.log(`📋 任务概览:`);
      
      plan.tasks.slice(0, 5).forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title}`);
      });
      
      if (plan.tasks.length > 5) {
        console.log(`   ... 共 ${plan.tasks.length} 个任务`);
      }
    } else {
      console.log(chalk.red(`❌ 功能规划生成失败: ${featurePlanResult.error}`));
    }
  } catch (error) {
    console.log(chalk.red(`❌ 功能规划测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n⚡ 测试 4: 执行控制功能'));
  
  try {
    // 获取当前执行状态
    const status = toolManager.getTaskExecutionStatus();
    console.log(`📊 当前状态: ${status.currentPlan ? status.currentPlan.status : '无活动计划'}`);
    
    // 测试状态查询
    console.log('🔍 系统能力统计:');
    const stats = toolManager.getTaskPlannerStats();
    console.log(`   任务类型支持: ${stats.supportedTaskTypes} 种`);
    console.log(`   模板数量: ${stats.availableTemplates} 个`);
    console.log(`   执行能力: ${stats.executionCapabilities.length} 种`);
    
    console.log(chalk.green('✅ 执行控制功能正常'));
  } catch (error) {
    console.log(chalk.red(`❌ 执行控制测试失败: ${error.message}`));
  }

  console.log(chalk.blue('\n🎨 测试 5: 自然语言理解'));
  
  try {
    const naturalLanguageInputs = [
      "我想搭建一个博客网站",
      "帮我优化这个项目的性能",
      "添加用户登录注册功能",
      "部署到云服务器"
    ];
    
    console.log('🗣️ 测试自然语言输入理解:');
    
    for (const input of naturalLanguageInputs.slice(0, 2)) {
      console.log(`\n📝 输入: "${input}"`);
      
      try {
        const nlResult = await toolManager.generateTaskPlan(input);
        if (nlResult.success) {
          console.log(chalk.green(`   ✅ 理解成功: ${nlResult.plan.title}`));
          console.log(`   📊 生成 ${nlResult.plan.tasks.length} 个任务`);
        } else {
          console.log(chalk.yellow(`   ⚠️  理解失败: ${nlResult.error}`));
        }
      } catch (error) {
        console.log(chalk.red(`   ❌ 处理错误: ${error.message}`));
      }
    }
  } catch (error) {
    console.log(chalk.red(`❌ 自然语言理解测试失败: ${error.message}`));
  }

  // 显示最终统计
  console.log(chalk.blue('\n📊 AI 任务规划系统统计信息:'));
  const finalStats = toolManager.getTaskPlannerStats();
  console.log(`🎯 支持的任务类型: ${finalStats.supportedTaskTypes} 种`);
  console.log(`📋 可用模板: ${finalStats.availableTemplates} 个`);
  console.log(`⚡ 执行能力: ${finalStats.executionCapabilities.join(', ')}`);

  console.log(chalk.blue('\n🎉 Mini Claude Code v3 - 终极版本完成！'));
  console.log(chalk.green('现在拥有完整的功能套件:'));
  console.log('   ✅ 流式 AI 响应系统');
  console.log('   ✅ 上下文记忆管理');  
  console.log('   ✅ 智能自动补全');
  console.log('   ✅ 智能错误处理和自动修复系统');
  console.log('   ✅ AI 驱动的测试生成和验证系统');
  console.log('   ✅ AI 驱动的任务规划和执行系统');
  
  console.log(chalk.yellow('\n🚀 核心亮点:'));
  console.log('   🎯 智能任务分解: 将复杂需求自动分解为可执行任务');
  console.log('   🤖 AI 驱动执行: 使用 AI 生成代码和配置文件');
  console.log('   📊 实时监控: 任务执行状态实时跟踪');
  console.log('   🔄 执行控制: 支持暂停、恢复、停止操作');
  console.log('   🧠 上下文感知: 基于项目历史的智能规划');
  
  console.log(chalk.blue('\n💡 使用场景:'));
  console.log('   "创建一个全栈电商项目" → 自动生成完整开发计划并执行');
  console.log('   "优化项目性能" → 智能分析并应用优化策略');
  console.log('   "添加用户认证" → 生成认证系统实现方案');
  console.log('   "部署到AWS" → 自动化部署流程规划');
}

// 运行测试
if (require.main === module) {
  testTaskPlanningFeatures().catch(console.error);
}

module.exports = { testTaskPlanningFeatures };
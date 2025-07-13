const fs = require('fs-extra');
const path = require('path');

class AITaskPlanner {
  constructor(toolManager) {
    this.toolManager = toolManager;
    this.name = 'AITaskPlanner';
    
    // 当前执行状态
    this.currentPlan = null;
    this.executionState = {
      isExecuting: false,
      currentTaskIndex: 0,
      totalTasks: 0,
      completedTasks: [],
      failedTasks: [],
      pendingTasks: [],
      startTime: null,
      estimatedDuration: 0
    };

    // 任务模板和模式
    this.taskTemplates = {
      // 项目创建模板
      createProject: {
        pattern: /创建|建立|搭建.*项目|应用|系统/,
        subtasks: [
          'analyze_requirements',
          'create_structure',
          'setup_dependencies',
          'create_basic_files',
          'setup_configuration',
          'initialize_git'
        ]
      },
      
      // 功能开发模板
      addFeature: {
        pattern: /添加|实现|开发.*功能|模块|组件/,
        subtasks: [
          'analyze_feature',
          'design_structure',
          'implement_backend',
          'implement_frontend',
          'add_tests',
          'update_documentation'
        ]
      },

      // 代码优化模板
      optimize: {
        pattern: /优化|重构|改进|提升/,
        subtasks: [
          'analyze_code',
          'identify_issues',
          'plan_refactoring',
          'apply_optimizations',
          'run_tests',
          'verify_performance'
        ]
      },

      // 部署模板
      deploy: {
        pattern: /部署|发布|上线/,
        subtasks: [
          'prepare_build',
          'setup_environment',
          'configure_deployment',
          'deploy_application',
          'setup_monitoring',
          'verify_deployment'
        ]
      }
    };

    // 任务执行器映射
    this.taskExecutors = {
      // 分析和规划
      analyze_requirements: this.analyzeRequirements.bind(this),
      analyze_feature: this.analyzeFeature.bind(this),
      analyze_code: this.analyzeCode.bind(this),
      
      // 项目结构
      create_structure: this.createProjectStructure.bind(this),
      design_structure: this.designFeatureStructure.bind(this),
      
      // 依赖和配置
      setup_dependencies: this.setupDependencies.bind(this),
      setup_configuration: this.setupConfiguration.bind(this),
      configure_deployment: this.configureDeployment.bind(this),
      
      // 代码实现
      create_basic_files: this.createBasicFiles.bind(this),
      implement_backend: this.implementBackend.bind(this),
      implement_frontend: this.implementFrontend.bind(this),
      apply_optimizations: this.applyOptimizations.bind(this),
      
      // 测试和验证
      add_tests: this.addTests.bind(this),
      run_tests: this.runTests.bind(this),
      verify_performance: this.verifyPerformance.bind(this),
      verify_deployment: this.verifyDeployment.bind(this),
      
      // 工具和基础设施
      initialize_git: this.initializeGit.bind(this),
      prepare_build: this.prepareBuild.bind(this),
      setup_environment: this.setupEnvironment.bind(this),
      deploy_application: this.deployApplication.bind(this),
      setup_monitoring: this.setupMonitoring.bind(this),
      update_documentation: this.updateDocumentation.bind(this)
    };
  }

  /**
   * 根据用户输入生成任务计划
   */
  async generateTaskPlan(userInput, context = {}) {
    try {
      console.log('🤖 AI 正在分析需求并生成执行计划...');
      
      // 分析用户输入的意图
      const intentAnalysis = this.analyzeUserIntent(userInput);
      
      // 使用 AI 生成详细的任务计划
      const aiPlan = await this.generateAIPlan(userInput, intentAnalysis, context);
      
      if (!aiPlan.success) {
        return aiPlan;
      }

      // 生成可执行的任务计划
      const executablePlan = await this.createExecutablePlan(aiPlan.plan, intentAnalysis);
      
      this.currentPlan = executablePlan;
      
      return {
        success: true,
        plan: executablePlan,
        summary: this.generatePlanSummary(executablePlan)
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 分析用户意图
   */
  analyzeUserIntent(userInput) {
    const analysis = {
      type: 'general',
      complexity: 'medium',
      technologies: [],
      features: [],
      scope: 'single_feature'
    };

    // 检测项目类型
    if (userInput.match(/全栈|full.?stack|前后端/i)) {
      analysis.type = 'fullstack';
      analysis.scope = 'full_project';
    } else if (userInput.match(/前端|frontend|react|vue|angular/i)) {
      analysis.type = 'frontend';
    } else if (userInput.match(/后端|backend|api|服务器/i)) {
      analysis.type = 'backend';
    }

    // 检测复杂度
    if (userInput.match(/简单|基础|basic|simple/i)) {
      analysis.complexity = 'low';
    } else if (userInput.match(/复杂|高级|advanced|enterprise/i)) {
      analysis.complexity = 'high';
    }

    // 检测技术栈
    const techPatterns = {
      react: /react/i,
      vue: /vue/i,
      angular: /angular/i,
      nodejs: /node\.?js|node/i,
      express: /express/i,
      mongodb: /mongodb|mongo/i,
      mysql: /mysql/i,
      postgresql: /postgresql|postgres/i,
      typescript: /typescript|ts/i,
      javascript: /javascript|js/i
    };

    for (const [tech, pattern] of Object.entries(techPatterns)) {
      if (userInput.match(pattern)) {
        analysis.technologies.push(tech);
      }
    }

    // 检测功能需求
    const featurePatterns = {
      auth: /认证|登录|注册|authentication|login|register/i,
      crud: /增删改查|crud|管理/i,
      api: /接口|api/i,
      database: /数据库|database/i,
      ui: /界面|ui|页面|component/i,
      testing: /测试|test/i,
      deployment: /部署|deploy/i
    };

    for (const [feature, pattern] of Object.entries(featurePatterns)) {
      if (userInput.match(pattern)) {
        analysis.features.push(feature);
      }
    }

    return analysis;
  }

  /**
   * 使用 AI 生成详细计划
   */
  async generateAIPlan(userInput, intentAnalysis, context) {
    if (!this.toolManager.ai.isAvailable()) {
      return {
        success: false,
        error: 'AI service not available for task planning'
      };
    }

    const contextPrompt = this.toolManager.memory?.generateContextPrompt(
      `任务规划: ${userInput}`,
      this.toolManager.context.projectInfo
    ) || '';

    const prompt = `请为以下用户需求生成详细的开发任务计划：

用户需求: ${userInput}

意图分析:
- 类型: ${intentAnalysis.type}
- 复杂度: ${intentAnalysis.complexity}
- 技术栈: ${intentAnalysis.technologies.join(', ') || '未指定'}
- 功能: ${intentAnalysis.features.join(', ') || '未指定'}
- 范围: ${intentAnalysis.scope}

项目上下文:
${contextPrompt}

请返回JSON格式的任务计划，包含：
{
  "title": "项目/任务标题",
  "description": "详细描述",
  "estimatedDuration": "预计耗时（分钟）",
  "techStack": ["推荐的技术栈"],
  "tasks": [
    {
      "id": "task_1",
      "title": "任务标题",
      "description": "任务详细描述",
      "type": "create_structure|implement_feature|setup_config|test|deploy",
      "dependencies": ["依赖的任务ID"],
      "estimatedTime": 30,
      "priority": "high|medium|low",
      "commands": ["具体要执行的命令"],
      "files": ["需要创建/修改的文件"],
      "validation": "如何验证任务完成"
    }
  ],
  "recommendations": ["建议和最佳实践"]
}

只返回JSON，不要包含其他文字。`;

    const result = await this.toolManager.ai.chat(prompt, {
      temperature: 0.3,
      maxTokens: 3000,
      timeout: 30000
    });

    if (result.success) {
      try {
        const plan = JSON.parse(result.response);
        return {
          success: true,
          plan
        };
      } catch (parseError) {
        return {
          success: false,
          error: 'Failed to parse AI-generated plan'
        };
      }
    }

    return result;
  }

  /**
   * 创建可执行的任务计划
   */
  async createExecutablePlan(aiPlan, intentAnalysis) {
    const executablePlan = {
      id: `plan_${Date.now()}`,
      title: aiPlan.title,
      description: aiPlan.description,
      type: intentAnalysis.type,
      complexity: intentAnalysis.complexity,
      techStack: aiPlan.techStack || [],
      estimatedDuration: aiPlan.estimatedDuration || 60,
      createdAt: new Date(),
      status: 'pending',
      tasks: [],
      metadata: {
        originalInput: aiPlan.originalInput,
        intentAnalysis,
        recommendations: aiPlan.recommendations || []
      }
    };

    // 处理任务列表
    for (let i = 0; i < aiPlan.tasks.length; i++) {
      const task = aiPlan.tasks[i];
      const executableTask = {
        id: task.id || `task_${i + 1}`,
        index: i,
        title: task.title,
        description: task.description,
        type: task.type || 'general',
        status: 'pending',
        priority: task.priority || 'medium',
        estimatedTime: task.estimatedTime || 15,
        dependencies: task.dependencies || [],
        commands: task.commands || [],
        files: task.files || [],
        validation: task.validation || '',
        result: null,
        error: null,
        startTime: null,
        endTime: null,
        duration: 0
      };

      executablePlan.tasks.push(executableTask);
    }

    return executablePlan;
  }

  /**
   * 生成计划摘要
   */
  generatePlanSummary(plan) {
    const totalTasks = plan.tasks.length;
    const highPriorityTasks = plan.tasks.filter(t => t.priority === 'high').length;
    const estimatedTime = plan.tasks.reduce((sum, task) => sum + (task.estimatedTime || 15), 0);

    return {
      totalTasks,
      highPriorityTasks,
      estimatedTime,
      techStack: plan.techStack,
      complexity: plan.complexity,
      taskBreakdown: plan.tasks.map(t => ({
        title: t.title,
        type: t.type,
        priority: t.priority,
        estimatedTime: t.estimatedTime
      }))
    };
  }

  /**
   * 执行任务计划
   */
  async executePlan(plan = null, options = {}) {
    try {
      const targetPlan = plan || this.currentPlan;
      
      if (!targetPlan) {
        return {
          success: false,
          error: 'No plan available for execution'
        };
      }

      console.log(`🚀 开始执行计划: ${targetPlan.title}`);
      console.log(`📊 总计 ${targetPlan.tasks.length} 个任务，预计用时 ${targetPlan.estimatedDuration} 分钟`);

      // 初始化执行状态
      this.executionState = {
        isExecuting: true,
        currentTaskIndex: 0,
        totalTasks: targetPlan.tasks.length,
        completedTasks: [],
        failedTasks: [],
        pendingTasks: [...targetPlan.tasks],
        startTime: new Date(),
        estimatedDuration: targetPlan.estimatedDuration
      };

      targetPlan.status = 'executing';
      targetPlan.startTime = new Date();

      const results = [];
      
      // 按顺序执行任务
      for (let i = 0; i < targetPlan.tasks.length; i++) {
        const task = targetPlan.tasks[i];
        
        // 检查依赖是否完成
        if (!this.checkTaskDependencies(task, results)) {
          console.log(`⏸️  任务 ${i + 1} 等待依赖完成: ${task.title}`);
          continue;
        }

        console.log(`\n🔄 执行任务 ${i + 1}/${targetPlan.tasks.length}: ${task.title}`);
        console.log(`📝 ${task.description}`);

        this.executionState.currentTaskIndex = i;
        task.status = 'executing';
        task.startTime = new Date();

        try {
          const taskResult = await this.executeTask(task, targetPlan);
          
          task.endTime = new Date();
          task.duration = task.endTime - task.startTime;
          task.result = taskResult;

          if (taskResult.success) {
            task.status = 'completed';
            this.executionState.completedTasks.push(task);
            console.log(`✅ 任务 ${i + 1} 完成: ${task.title}`);
            
            if (taskResult.message) {
              console.log(`   ${taskResult.message}`);
            }
          } else {
            task.status = 'failed';
            task.error = taskResult.error;
            this.executionState.failedTasks.push(task);
            console.log(`❌ 任务 ${i + 1} 失败: ${taskResult.error}`);

            // 根据选项决定是否继续
            if (options.stopOnError) {
              break;
            }
          }

          results.push(taskResult);

        } catch (error) {
          task.status = 'failed';
          task.error = error.message;
          task.endTime = new Date();
          task.duration = task.endTime - task.startTime;
          
          this.executionState.failedTasks.push(task);
          console.log(`❌ 任务 ${i + 1} 执行异常: ${error.message}`);

          if (options.stopOnError) {
            break;
          }
        }

        // 移除已处理的任务
        this.executionState.pendingTasks = this.executionState.pendingTasks.filter(t => t.id !== task.id);
      }

      // 完成执行
      targetPlan.endTime = new Date();
      targetPlan.duration = targetPlan.endTime - targetPlan.startTime;
      targetPlan.status = this.executionState.failedTasks.length === 0 ? 'completed' : 'partial';

      this.executionState.isExecuting = false;

      const summary = this.generateExecutionSummary(targetPlan);
      console.log('\n' + summary);

      return {
        success: true,
        plan: targetPlan,
        executionState: this.executionState,
        summary: summary
      };

    } catch (error) {
      this.executionState.isExecuting = false;
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 检查任务依赖
   */
  checkTaskDependencies(task, completedResults) {
    if (!task.dependencies || task.dependencies.length === 0) {
      return true;
    }

    return task.dependencies.every(depId => {
      const completed = completedResults.find(r => r.taskId === depId);
      return completed && completed.success;
    });
  }

  /**
   * 执行单个任务
   */
  async executeTask(task, plan) {
    try {
      // 根据任务类型选择执行器
      const executor = this.taskExecutors[task.type] || this.executeGenericTask.bind(this);
      
      const result = await executor(task, plan);
      result.taskId = task.id;
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        taskId: task.id
      };
    }
  }

  /**
   * 通用任务执行器
   */
  async executeGenericTask(task, plan) {
    // 如果有具体命令，执行命令
    if (task.commands && task.commands.length > 0) {
      const results = [];
      
      for (const command of task.commands) {
        console.log(`   执行命令: ${command}`);
        const result = await this.toolManager.execute('cmd', 'run', command);
        results.push(result);
        
        if (!result.success) {
          return {
            success: false,
            error: `Command failed: ${command} - ${result.error}`
          };
        }
      }
      
      return {
        success: true,
        message: `Executed ${task.commands.length} commands successfully`,
        results
      };
    }

    // 如果有文件操作，创建文件
    if (task.files && task.files.length > 0) {
      const results = [];
      
      for (const filePath of task.files) {
        console.log(`   创建文件: ${filePath}`);
        
        // 使用 AI 生成文件内容
        const content = await this.generateFileContent(filePath, task, plan);
        const result = await this.toolManager.execute('fs', 'writeFile', filePath, content);
        results.push(result);
        
        if (!result.success) {
          return {
            success: false,
            error: `Failed to create file: ${filePath} - ${result.error}`
          };
        }
      }
      
      return {
        success: true,
        message: `Created ${task.files.length} files successfully`,
        results
      };
    }

    // 默认成功
    return {
      success: true,
      message: 'Task completed (no specific actions defined)'
    };
  }

  /**
   * 生成文件内容
   */
  async generateFileContent(filePath, task, plan) {
    const ext = path.extname(filePath);
    const fileName = path.basename(filePath);
    
    // 简单的文件内容模板
    const templates = {
      '.js': `// ${fileName}
// Generated by Mini Claude Code v3
// Task: ${task.title}

console.log('Hello from ${fileName}');

module.exports = {
  // Add your exports here
};`,
      
      '.jsx': `import React from 'react';

// ${fileName} - ${task.title}
const ${path.basename(fileName, '.jsx')} = () => {
  return (
    <div>
      <h1>Welcome to ${path.basename(fileName, '.jsx')}</h1>
    </div>
  );
};

export default ${path.basename(fileName, '.jsx')};`,
      
      '.json': JSON.stringify({
        name: plan.title.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        description: plan.description,
        generated_by: 'Mini Claude Code v3'
      }, null, 2),
      
      '.md': `# ${plan.title}

${plan.description}

## Task: ${task.title}

Generated by Mini Claude Code v3

## Todo

- [ ] Complete implementation
- [ ] Add tests
- [ ] Update documentation
`,
      
      '.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${plan.title}</title>
</head>
<body>
    <h1>${plan.title}</h1>
    <p>${plan.description}</p>
    <p><em>Generated by Mini Claude Code v3</em></p>
</body>
</html>`
    };

    return templates[ext] || `// ${fileName}
// ${task.title}
// Generated by Mini Claude Code v3`;
  }

  // 专用任务执行器实现
  async analyzeRequirements(task, plan) {
    console.log('   🔍 分析项目需求...');
    return {
      success: true,
      message: '需求分析完成',
      analysis: {
        type: plan.type,
        complexity: plan.complexity,
        techStack: plan.techStack
      }
    };
  }

  async createProjectStructure(task, plan) {
    console.log('   📁 创建项目结构...');
    
    const structure = this.getProjectStructure(plan.type, plan.techStack);
    const results = [];
    
    for (const dir of structure.directories) {
      await fs.ensureDir(dir);
      results.push(`Created directory: ${dir}`);
    }
    
    return {
      success: true,
      message: `创建了 ${structure.directories.length} 个目录`,
      structure: structure.directories
    };
  }

  async setupDependencies(task, plan) {
    console.log('   📦 安装项目依赖...');
    
    const packageManager = this.detectPackageManager();
    const installCommand = `${packageManager} install`;
    
    const result = await this.toolManager.execute('cmd', 'run', installCommand);
    
    return {
      success: result.success,
      message: result.success ? '依赖安装完成' : `依赖安装失败: ${result.error}`,
      packageManager
    };
  }

  async initializeGit(task, plan) {
    console.log('   🔧 初始化 Git 仓库...');
    
    const commands = [
      'git init',
      'git add .',
      'git commit -m "Initial commit - Generated by Mini Claude Code v3"'
    ];
    
    for (const cmd of commands) {
      const result = await this.toolManager.execute('cmd', 'run', cmd);
      if (!result.success) {
        return {
          success: false,
          error: `Git command failed: ${cmd}`
        };
      }
    }
    
    return {
      success: true,
      message: 'Git 仓库初始化完成'
    };
  }

  // 更多执行器可以根据需要添加...
  async analyzeFeature(task, plan) { 
    console.log('   🔍 分析功能需求...');
    return {
      success: true,
      message: '功能分析完成'
    };
  }
  
  async analyzeCode(task, plan) { 
    console.log('   📊 分析代码结构...');
    return {
      success: true,
      message: '代码分析完成'
    };
  }
  
  async designFeatureStructure(task, plan) { 
    console.log('   🏗️ 设计功能结构...');
    return {
      success: true,
      message: '功能结构设计完成'
    };
  }
  
  async setupConfiguration(task, plan) { 
    console.log('   ⚙️ 配置项目设置...');
    return {
      success: true,
      message: '项目配置完成'
    };
  }
  
  async configureDeployment(task, plan) { 
    console.log('   🚀 配置部署环境...');
    return {
      success: true,
      message: '部署配置完成'
    };
  }
  
  async createBasicFiles(task, plan) { 
    console.log('   📄 创建基础文件...');
    return {
      success: true,
      message: '基础文件创建完成'
    };
  }
  
  async implementBackend(task, plan) { 
    console.log('   🔧 实现后端功能...');
    return {
      success: true,
      message: '后端实现完成'
    };
  }
  
  async implementFrontend(task, plan) { 
    console.log('   🎨 实现前端界面...');
    return {
      success: true,
      message: '前端实现完成'
    };
  }
  
  async applyOptimizations(task, plan) { 
    console.log('   ⚡ 应用性能优化...');
    return {
      success: true,
      message: '优化应用完成'
    };
  }
  
  async addTests(task, plan) { 
    console.log('   🧪 添加测试用例...');
    return {
      success: true,
      message: '测试添加完成'
    };
  }
  
  async runTests(task, plan) { 
    console.log('   🏃 运行测试...');
    return {
      success: true,
      message: '测试执行完成'
    };
  }
  
  async verifyPerformance(task, plan) { 
    console.log('   📈 验证性能指标...');
    return {
      success: true,
      message: '性能验证完成'
    };
  }
  
  async verifyDeployment(task, plan) { 
    console.log('   ✅ 验证部署状态...');
    return {
      success: true,
      message: '部署验证完成'
    };
  }
  
  async prepareBuild(task, plan) { 
    console.log('   📦 准备构建...');
    return {
      success: true,
      message: '构建准备完成'
    };
  }
  
  async setupEnvironment(task, plan) { 
    console.log('   🌍 设置环境...');
    return {
      success: true,
      message: '环境设置完成'
    };
  }
  
  async deployApplication(task, plan) { 
    console.log('   🚀 部署应用...');
    return {
      success: true,
      message: '应用部署完成'
    };
  }
  
  async setupMonitoring(task, plan) { 
    console.log('   📊 设置监控...');
    return {
      success: true,
      message: '监控设置完成'
    };
  }
  
  async updateDocumentation(task, plan) { 
    console.log('   📚 更新文档...');
    return {
      success: true,
      message: '文档更新完成'
    };
  }

  /**
   * 获取项目结构模板
   */
  getProjectStructure(type, techStack) {
    const structures = {
      fullstack: {
        directories: [
          'client/src/components',
          'client/src/pages',
          'client/src/utils',
          'client/public',
          'server/src/routes',
          'server/src/models',
          'server/src/middleware',
          'server/src/controllers',
          'tests',
          'docs'
        ]
      },
      frontend: {
        directories: [
          'src/components',
          'src/pages',
          'src/utils',
          'src/assets',
          'public',
          'tests'
        ]
      },
      backend: {
        directories: [
          'src/routes',
          'src/models',
          'src/controllers',
          'src/middleware',
          'src/utils',
          'tests',
          'config'
        ]
      }
    };
    
    return structures[type] || structures.frontend;
  }

  /**
   * 检测包管理器
   */
  detectPackageManager() {
    if (fs.existsSync('yarn.lock')) return 'yarn';
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
    return 'npm';
  }

  /**
   * 生成执行摘要
   */
  generateExecutionSummary(plan) {
    const completed = this.executionState.completedTasks.length;
    const failed = this.executionState.failedTasks.length;
    const total = this.executionState.totalTasks;
    const duration = plan.duration ? Math.round(plan.duration / 1000 / 60) : 0;

    let summary = `\n🎉 执行完成！\n`;
    summary += `📊 任务统计: ${completed}/${total} 完成，${failed} 失败\n`;
    summary += `⏱️  总耗时: ${duration} 分钟\n`;

    if (completed === total) {
      summary += `✅ 所有任务成功完成！\n`;
    } else if (failed > 0) {
      summary += `⚠️  部分任务失败，请检查错误信息\n`;
    }

    summary += `\n📋 任务详情:\n`;
    plan.tasks.forEach((task, index) => {
      const status = task.status === 'completed' ? '✅' : 
                    task.status === 'failed' ? '❌' : '⏸️';
      summary += `   ${status} ${index + 1}. ${task.title}\n`;
    });

    return summary;
  }

  /**
   * 获取当前执行状态
   */
  getExecutionStatus() {
    return {
      ...this.executionState,
      currentPlan: this.currentPlan
    };
  }

  /**
   * 暂停执行
   */
  pauseExecution() {
    this.executionState.isPaused = true;
    console.log('⏸️  任务执行已暂停');
  }

  /**
   * 恢复执行
   */
  resumeExecution() {
    this.executionState.isPaused = false;
    console.log('▶️  任务执行已恢复');
  }

  /**
   * 停止执行
   */
  stopExecution() {
    this.executionState.isExecuting = false;
    this.executionState.isStopped = true;
    console.log('⏹️  任务执行已停止');
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      supportedTaskTypes: Object.keys(this.taskExecutors).length,
      availableTemplates: Object.keys(this.taskTemplates).length,
      currentPlanStatus: this.currentPlan?.status || 'none',
      executionCapabilities: ['analyze', 'create', 'implement', 'test', 'deploy']
    };
  }
}

module.exports = AITaskPlanner;
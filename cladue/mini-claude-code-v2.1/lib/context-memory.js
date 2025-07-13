const fs = require('fs-extra');
const path = require('path');

class ContextMemory {
  constructor(storageDir = '.mini-claude-memory') {
    this.storageDir = storageDir;
    this.conversationHistory = [];
    this.userPreferences = {};
    this.projectMemory = {};
    this.codeSnippets = [];
    this.sessionId = this.generateSessionId();
    this.maxHistorySize = 100; // 最大对话记录数
    this.maxCodeSnippets = 50; // 最大代码片段数
    
    // 确保存储目录存在
    this.ensureStorageDir();
    
    // 加载已有的记忆
    this.loadMemory();
  }

  /**
   * 生成会话 ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 确保存储目录存在
   */
  async ensureStorageDir() {
    try {
      await fs.ensureDir(this.storageDir);
    } catch (error) {
      console.warn('Warning: Could not create memory storage directory:', error.message);
    }
  }

  /**
   * 加载已有的记忆数据
   */
  async loadMemory() {
    try {
      // 加载对话历史
      const historyPath = path.join(this.storageDir, 'conversation_history.json');
      if (await fs.pathExists(historyPath)) {
        const historyData = await fs.readJson(historyPath);
        this.conversationHistory = historyData.slice(-this.maxHistorySize);
      }

      // 加载用户偏好
      const preferencesPath = path.join(this.storageDir, 'user_preferences.json');
      if (await fs.pathExists(preferencesPath)) {
        this.userPreferences = await fs.readJson(preferencesPath);
      }

      // 加载项目记忆
      const projectPath = path.join(this.storageDir, 'project_memory.json');
      if (await fs.pathExists(projectPath)) {
        this.projectMemory = await fs.readJson(projectPath);
      }

      // 加载代码片段
      const snippetsPath = path.join(this.storageDir, 'code_snippets.json');
      if (await fs.pathExists(snippetsPath)) {
        const snippetsData = await fs.readJson(snippetsPath);
        this.codeSnippets = snippetsData.slice(-this.maxCodeSnippets);
      }

    } catch (error) {
      console.warn('Warning: Could not load memory data:', error.message);
    }
  }

  /**
   * 保存记忆数据到磁盘
   */
  async saveMemory() {
    try {
      // 保存对话历史
      const historyPath = path.join(this.storageDir, 'conversation_history.json');
      await fs.writeJson(historyPath, this.conversationHistory, { spaces: 2 });

      // 保存用户偏好
      const preferencesPath = path.join(this.storageDir, 'user_preferences.json');
      await fs.writeJson(preferencesPath, this.userPreferences, { spaces: 2 });

      // 保存项目记忆
      const projectPath = path.join(this.storageDir, 'project_memory.json');
      await fs.writeJson(projectPath, this.projectMemory, { spaces: 2 });

      // 保存代码片段
      const snippetsPath = path.join(this.storageDir, 'code_snippets.json');
      await fs.writeJson(snippetsPath, this.codeSnippets, { spaces: 2 });

    } catch (error) {
      console.warn('Warning: Could not save memory data:', error.message);
    }
  }

  /**
   * 添加对话到历史记录
   */
  async addConversation(userInput, aiResponse, context = {}) {
    const conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      userInput,
      aiResponse,
      context: {
        projectPath: context.projectPath || null,
        language: context.language || null,
        framework: context.framework || null,
        commandType: context.commandType || null
      }
    };

    this.conversationHistory.push(conversation);

    // 保持历史记录在限制范围内
    if (this.conversationHistory.length > this.maxHistorySize) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistorySize);
    }

    // 异步保存
    this.saveMemory();

    return conversation.id;
  }

  /**
   * 添加代码片段记忆
   */
  async addCodeSnippet(code, description, language, context = {}) {
    const snippet = {
      id: `code_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      code,
      description,
      language,
      context: {
        projectPath: context.projectPath || null,
        framework: context.framework || null,
        fileType: context.fileType || null
      },
      useCount: 0
    };

    this.codeSnippets.push(snippet);

    // 保持代码片段在限制范围内
    if (this.codeSnippets.length > this.maxCodeSnippets) {
      this.codeSnippets = this.codeSnippets.slice(-this.maxCodeSnippets);
    }

    this.saveMemory();
    return snippet.id;
  }

  /**
   * 更新用户偏好
   */
  async updateUserPreferences(preferences) {
    this.userPreferences = {
      ...this.userPreferences,
      ...preferences,
      lastUpdated: new Date().toISOString()
    };

    this.saveMemory();
  }

  /**
   * 更新项目记忆
   */
  async updateProjectMemory(projectPath, projectInfo) {
    this.projectMemory[projectPath] = {
      ...this.projectMemory[projectPath],
      ...projectInfo,
      lastAccessed: new Date().toISOString()
    };

    this.saveMemory();
  }

  /**
   * 获取相关的对话历史
   */
  getRelevantHistory(query, maxResults = 5) {
    const queryLower = query.toLowerCase();
    
    const scoredHistory = this.conversationHistory.map(conv => {
      let score = 0;
      
      // 基于内容相似性评分
      if (conv.userInput.toLowerCase().includes(queryLower)) score += 3;
      if (conv.aiResponse.toLowerCase().includes(queryLower)) score += 2;
      
      // 基于时间新近性评分
      const daysSince = (Date.now() - new Date(conv.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      score += Math.max(0, 2 - daysSince / 7); // 一周内的对话有额外分数
      
      // 基于会话相关性评分
      if (conv.sessionId === this.sessionId) score += 1;
      
      return { ...conv, score };
    });

    return scoredHistory
      .filter(conv => conv.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }

  /**
   * 搜索相关代码片段
   */
  searchCodeSnippets(query, language = null, maxResults = 3) {
    const queryLower = query.toLowerCase();
    
    let filteredSnippets = this.codeSnippets;
    
    // 按语言过滤
    if (language) {
      filteredSnippets = filteredSnippets.filter(snippet => 
        snippet.language === language
      );
    }

    const scoredSnippets = filteredSnippets.map(snippet => {
      let score = 0;
      
      // 基于描述相似性评分
      if (snippet.description.toLowerCase().includes(queryLower)) score += 3;
      if (snippet.code.toLowerCase().includes(queryLower)) score += 2;
      
      // 基于使用频率评分
      score += Math.min(snippet.useCount, 5) * 0.5;
      
      // 基于时间新近性评分
      const daysSince = (Date.now() - new Date(snippet.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      score += Math.max(0, 1 - daysSince / 30); // 一个月内的代码有额外分数
      
      return { ...snippet, score };
    });

    const results = scoredSnippets
      .filter(snippet => snippet.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    // 增加使用计数
    results.forEach(snippet => {
      const original = this.codeSnippets.find(s => s.id === snippet.id);
      if (original) {
        original.useCount++;
      }
    });

    return results;
  }

  /**
   * 生成上下文提示词
   */
  generateContextPrompt(currentQuery, projectInfo = null) {
    let contextPrompt = '';

    // 添加相关历史对话
    const relevantHistory = this.getRelevantHistory(currentQuery, 3);
    if (relevantHistory.length > 0) {
      contextPrompt += '相关对话历史:\n';
      relevantHistory.forEach((conv, index) => {
        contextPrompt += `${index + 1}. 用户: ${conv.userInput}\n   AI: ${conv.aiResponse.substring(0, 200)}...\n\n`;
      });
    }

    // 添加用户偏好
    if (Object.keys(this.userPreferences).length > 0) {
      contextPrompt += '用户偏好:\n';
      if (this.userPreferences.preferredLanguage) {
        contextPrompt += `- 偏好编程语言: ${this.userPreferences.preferredLanguage}\n`;
      }
      if (this.userPreferences.codeStyle) {
        contextPrompt += `- 代码风格: ${this.userPreferences.codeStyle}\n`;
      }
      if (this.userPreferences.responseStyle) {
        contextPrompt += `- 回答风格: ${this.userPreferences.responseStyle}\n`;
      }
      contextPrompt += '\n';
    }

    // 添加项目上下文
    if (projectInfo) {
      contextPrompt += '当前项目信息:\n';
      contextPrompt += `- 路径: ${projectInfo.path || '未知'}\n`;
      contextPrompt += `- 主要语言: ${Object.keys(projectInfo.languages || {}).join(', ') || '未知'}\n`;
      contextPrompt += `- 框架: ${(projectInfo.frameworks || []).map(f => f.name).join(', ') || '未知'}\n`;
      contextPrompt += '\n';
    }

    // 添加相关代码片段
    const relevantCode = this.searchCodeSnippets(currentQuery, projectInfo?.mainLanguage, 2);
    if (relevantCode.length > 0) {
      contextPrompt += '相关代码片段:\n';
      relevantCode.forEach((snippet, index) => {
        contextPrompt += `${index + 1}. ${snippet.description} (${snippet.language}):\n`;
        contextPrompt += `\`\`\`${snippet.language}\n${snippet.code.substring(0, 300)}\n\`\`\`\n\n`;
      });
    }

    return contextPrompt;
  }

  /**
   * 清理旧数据
   */
  async cleanup() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // 清理旧对话
    this.conversationHistory = this.conversationHistory.filter(conv => 
      new Date(conv.timestamp) > thirtyDaysAgo
    );

    // 清理不常用的代码片段
    this.codeSnippets = this.codeSnippets
      .filter(snippet => 
        new Date(snippet.timestamp) > thirtyDaysAgo || snippet.useCount > 0
      )
      .slice(-this.maxCodeSnippets);

    this.saveMemory();
  }

  /**
   * 获取记忆统计信息
   */
  getStats() {
    return {
      conversationCount: this.conversationHistory.length,
      codeSnippetCount: this.codeSnippets.length,
      userPreferences: Object.keys(this.userPreferences).length,
      projectsRemembered: Object.keys(this.projectMemory).length,
      currentSessionId: this.sessionId,
      storageDir: this.storageDir
    };
  }

  /**
   * 重置所有记忆
   */
  async resetMemory() {
    this.conversationHistory = [];
    this.userPreferences = {};
    this.projectMemory = {};
    this.codeSnippets = [];
    
    await this.saveMemory();
  }
}

module.exports = ContextMemory;
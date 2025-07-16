/**
 * 配置管理器 - 统一管理应用配置
 * @author Mini Claude Code Team
 * @version 3.0.0
 */

const fs = require('fs-extra');
const path = require('path');

class ConfigManager {
  /**
   * 初始化配置管理器
   * @param {string} configDir - 配置目录路径
   */
  constructor(configDir = '.mini-claude-config') {
    this.configDir = configDir;
    this.configFile = path.join(configDir, 'config.json');
    this.defaultConfig = this._getDefaultConfig();
    this.config = null;
    
    this._ensureConfigDir();
    this.loadConfig();
  }

  /**
   * 获取默认配置
   * @returns {Object} 默认配置对象
   * @private
   */
  _getDefaultConfig() {
    return {
      // AI相关配置
      ai: {
        timeout: 30000,
        maxTokens: 2000,
        temperature: 0.7,
        model: 'deepseek-chat',
        streaming: true
      },
      
      // 记忆系统配置
      memory: {
        maxHistory: 100,
        maxSnippets: 50,
        cleanupDays: 30,
        storageDir: '.mini-claude-memory'
      },
      
      // UI界面配置
      ui: {
        theme: 'auto', // auto, light, dark
        showWelcome: true,
        verbose: false,
        showProgress: true,
        pageSize: 10
      },
      
      // 自动补全配置
      completion: {
        enabled: true,
        cacheSize: 1000,
        showDescriptions: true,
        caseSensitive: false
      },
      
      // 错误处理配置
      errorHandling: {
        autoFix: true,
        createBackup: true,
        maxRetries: 3,
        timeout: 20000
      },
      
      // 测试生成配置
      testing: {
        defaultFramework: 'jest',
        testDir: '__tests__',
        coverage: false,
        verbose: true
      },
      
      // 任务规划配置
      taskPlanning: {
        autoExecute: false,
        showProgress: true,
        pauseOnError: true,
        maxConcurrent: 3
      },
      
      // 安全相关配置
      security: {
        encryptApiKeys: true,
        validateInputs: true,
        sandboxCommands: false
      },
      
      // 性能配置
      performance: {
        enableCache: true,
        cacheTimeout: 300000, // 5分钟
        maxCacheSize: 100,
        enableMetrics: false
      },
      
      // 日志配置
      logging: {
        level: 'info', // debug, info, warn, error
        file: 'mini-claude.log',
        maxSize: '10MB',
        maxFiles: 5
      }
    };
  }

  /**
   * 确保配置目录存在
   * @private
   */
  async _ensureConfigDir() {
    try {
      await fs.ensureDir(this.configDir);
    } catch (error) {
      console.warn('Warning: Could not create config directory:', error.message);
    }
  }

  /**
   * 加载配置文件
   * @returns {Object} 加载的配置
   */
  async loadConfig() {
    try {
      if (await fs.pathExists(this.configFile)) {
        const userConfig = await fs.readJson(this.configFile);
        this.config = this._mergeConfig(this.defaultConfig, userConfig);
      } else {
        this.config = { ...this.defaultConfig };
      }
      
      // 应用环境变量覆盖
      this._applyEnvironmentOverrides();
      
      return this.config;
    } catch (error) {
      console.warn('Warning: Could not load config file, using defaults:', error.message);
      this.config = { ...this.defaultConfig };
      return this.config;
    }
  }

  /**
   * 保存配置文件
   * @returns {Promise<boolean>} 是否保存成功
   */
  async saveConfig() {
    try {
      await fs.writeJson(this.configFile, this.config, { spaces: 2 });
      return true;
    } catch (error) {
      console.error('Failed to save config:', error.message);
      return false;
    }
  }

  /**
   * 深度合并配置对象
   * @param {Object} defaultConfig - 默认配置
   * @param {Object} userConfig - 用户配置
   * @returns {Object} 合并后的配置
   * @private
   */
  _mergeConfig(defaultConfig, userConfig) {
    const merged = { ...defaultConfig };
    
    for (const [key, value] of Object.entries(userConfig)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        merged[key] = this._mergeConfig(merged[key] || {}, value);
      } else {
        merged[key] = value;
      }
    }
    
    return merged;
  }

  /**
   * 应用环境变量覆盖
   * @private
   */
  _applyEnvironmentOverrides() {
    // AI配置
    if (process.env.DEEPSEEK_API_KEY) {
      this.config.ai.apiKey = process.env.DEEPSEEK_API_KEY;
    }
    if (process.env.MINI_CLAUDE_TIMEOUT) {
      this.config.ai.timeout = parseInt(process.env.MINI_CLAUDE_TIMEOUT);
    }
    
    // UI配置
    if (process.env.MINI_CLAUDE_THEME) {
      this.config.ui.theme = process.env.MINI_CLAUDE_THEME;
    }
    if (process.env.MINI_CLAUDE_VERBOSE) {
      this.config.ui.verbose = process.env.MINI_CLAUDE_VERBOSE === 'true';
    }
    
    // 日志配置
    if (process.env.MINI_CLAUDE_LOG_LEVEL) {
      this.config.logging.level = process.env.MINI_CLAUDE_LOG_LEVEL;
    }
  }

  /**
   * 获取配置值
   * @param {string} path - 配置路径，如 'ai.timeout'
   * @param {*} defaultValue - 默认值
   * @returns {*} 配置值
   */
  get(path, defaultValue = undefined) {
    const keys = path.split('.');
    let value = this.config;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    
    return value;
  }

  /**
   * 设置配置值
   * @param {string} path - 配置路径，如 'ai.timeout'
   * @param {*} value - 配置值
   * @returns {boolean} 是否设置成功
   */
  set(path, value) {
    try {
      const keys = path.split('.');
      let target = this.config;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in target) || typeof target[key] !== 'object') {
          target[key] = {};
        }
        target = target[key];
      }
      
      target[keys[keys.length - 1]] = value;
      return true;
    } catch (error) {
      console.error('Failed to set config value:', error.message);
      return false;
    }
  }

  /**
   * 重置配置为默认值
   */
  reset() {
    this.config = { ...this.defaultConfig };
  }

  /**
   * 验证配置有效性
   * @returns {Array} 验证错误列表
   */
  validate() {
    const errors = [];
    
    // 验证超时值
    if (this.config.ai.timeout < 1000 || this.config.ai.timeout > 300000) {
      errors.push('AI timeout must be between 1000ms and 300000ms');
    }
    
    // 验证记忆配置
    if (this.config.memory.maxHistory < 1 || this.config.memory.maxHistory > 1000) {
      errors.push('Memory maxHistory must be between 1 and 1000');
    }
    
    // 验证主题
    const validThemes = ['auto', 'light', 'dark'];
    if (!validThemes.includes(this.config.ui.theme)) {
      errors.push(`UI theme must be one of: ${validThemes.join(', ')}`);
    }
    
    // 验证日志级别
    const validLogLevels = ['debug', 'info', 'warn', 'error'];
    if (!validLogLevels.includes(this.config.logging.level)) {
      errors.push(`Log level must be one of: ${validLogLevels.join(', ')}`);
    }
    
    return errors;
  }

  /**
   * 获取所有配置
   * @returns {Object} 完整配置对象
   */
  getAll() {
    return { ...this.config };
  }

  /**
   * 获取配置摘要
   * @returns {Object} 配置摘要
   */
  getSummary() {
    return {
      ai: {
        configured: !!this.config.ai.apiKey,
        model: this.config.ai.model,
        streaming: this.config.ai.streaming
      },
      memory: {
        maxHistory: this.config.memory.maxHistory,
        maxSnippets: this.config.memory.maxSnippets
      },
      ui: {
        theme: this.config.ui.theme,
        verbose: this.config.ui.verbose
      },
      performance: {
        cacheEnabled: this.config.performance.enableCache,
        metricsEnabled: this.config.performance.enableMetrics
      }
    };
  }

  /**
   * 导出配置到文件
   * @param {string} filePath - 导出文件路径
   * @returns {Promise<boolean>} 是否导出成功
   */
  async exportConfig(filePath) {
    try {
      await fs.writeJson(filePath, this.config, { spaces: 2 });
      return true;
    } catch (error) {
      console.error('Failed to export config:', error.message);
      return false;
    }
  }

  /**
   * 从文件导入配置
   * @param {string} filePath - 导入文件路径
   * @returns {Promise<boolean>} 是否导入成功
   */
  async importConfig(filePath) {
    try {
      const importedConfig = await fs.readJson(filePath);
      this.config = this._mergeConfig(this.defaultConfig, importedConfig);
      
      const errors = this.validate();
      if (errors.length > 0) {
        console.warn('Config validation warnings:', errors);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import config:', error.message);
      return false;
    }
  }

  /**
   * 获取配置文件路径
   * @returns {string} 配置文件路径
   */
  getConfigPath() {
    return this.configFile;
  }

  /**
   * 检查配置是否已修改
   * @returns {boolean} 是否已修改
   */
  isModified() {
    try {
      const defaultConfigString = JSON.stringify(this.defaultConfig, null, 2);
      const currentConfigString = JSON.stringify(this.config, null, 2);
      return defaultConfigString !== currentConfigString;
    } catch (error) {
      return true;
    }
  }
}

module.exports = ConfigManager;
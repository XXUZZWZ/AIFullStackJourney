const { spawn, exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class CommandTool {
  constructor() {
    this.name = 'Command';
  }

  /**
   * 执行命令并返回结果
   */
  async run(command, options = {}) {
    const {
      cwd = process.cwd(),
      timeout = 30000,
      env = process.env
    } = options;

    try {
      const result = await execAsync(command, {
        cwd,
        timeout,
        env: { ...env, ...options.env },
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });

      return {
        success: true,
        stdout: result.stdout,
        stderr: result.stderr,
        command,
        cwd
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        code: error.code,
        command,
        cwd
      };
    }
  }

  /**
   * 运行交互式命令
   */
  async runInteractive(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const {
        cwd = process.cwd(),
        env = process.env
      } = options;

      const child = spawn(command, args, {
        cwd,
        env: { ...env, ...options.env },
        stdio: 'inherit'
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            code,
            command: `${command} ${args.join(' ')}`
          });
        } else {
          resolve({
            success: false,
            code,
            error: `Command exited with code ${code}`,
            command: `${command} ${args.join(' ')}`
          });
        }
      });

      child.on('error', (error) => {
        resolve({
          success: false,
          error: error.message,
          command: `${command} ${args.join(' ')}`
        });
      });
    });
  }

  /**
   * 检查命令是否存在
   */
  async commandExists(command) {
    try {
      const result = await this.run(`which ${command}`);
      return {
        success: true,
        exists: result.success && result.stdout.trim() !== ''
      };
    } catch (error) {
      return {
        success: true,
        exists: false
      };
    }
  }

  /**
   * Git 相关操作
   */
  async git(subcommand, options = {}) {
    return await this.run(`git ${subcommand}`, options);
  }

  /**
   * NPM 相关操作
   */
  async npm(subcommand, options = {}) {
    return await this.run(`npm ${subcommand}`, options);
  }

  /**
   * 获取系统信息
   */
  async getSystemInfo() {
    try {
      const [os, arch, node, npm] = await Promise.all([
        this.run('uname -s'),
        this.run('uname -m'),
        this.run('node --version'),
        this.run('npm --version')
      ]);

      return {
        success: true,
        system: {
          os: os.success ? os.stdout.trim() : 'unknown',
          arch: arch.success ? arch.stdout.trim() : 'unknown',
          node: node.success ? node.stdout.trim() : 'unknown',
          npm: npm.success ? npm.stdout.trim() : 'unknown'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 批量执行命令
   */
  async runBatch(commands, options = {}) {
    const results = [];
    const { continueOnError = false } = options;

    for (const command of commands) {
      const result = await this.run(command, options);
      results.push(result);

      if (!result.success && !continueOnError) {
        break;
      }
    }

    return {
      success: results.every(r => r.success) || continueOnError,
      results
    };
  }
}

module.exports = CommandTool;
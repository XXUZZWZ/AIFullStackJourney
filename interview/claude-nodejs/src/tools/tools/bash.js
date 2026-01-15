/**
 * Bash Tool
 * Executes shell commands
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { BaseTool } from './base.js';

const execAsync = promisify(exec);

// Dangerous commands that should be blocked
const DANGEROUS_COMMANDS = [
  'rm -rf /',
  'rm -rf /*',
  'mkfs',
  'dd if=/dev/zero',
  ':(){:|:&};:', // fork bomb
  'chmod 000 /',
  'chown -R root',
  '> /dev/sda',
  'format c:',
];

export class BashTool extends BaseTool {
  constructor() {
    super('bash', 'Execute shell commands in the current directory', {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'Shell command to execute'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds (default: 120000)'
        }
      },
      required: ['command']
    });

    // Track background processes
    this.backgroundProcesses = new Map();
  }

  validate(input) {
    const baseValidation = super.validate(input);
    if (!baseValidation.valid) {
      return baseValidation;
    }

    // Check for dangerous commands
    const cmd = input.command.toLowerCase();
    for (const dangerous of DANGEROUS_COMMANDS) {
      if (cmd.includes(dangerous.toLowerCase())) {
        return {
          valid: false,
          error: `Dangerous command blocked: ${dangerous}`
        };
      }
    }

    return { valid: true };
  }

  async execute(input) {
    const timeout = input.timeout || 120000;
    const command = input.command;

    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout,
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
        cwd: process.cwd(),
        env: { ...process.env }
      });

      const output = stdout || stderr || '';

      return {
        output: output,
        metadata: {
          command: command,
          exitCode: 0
        }
      };
    } catch (error) {
      // Command failed but might have output
      const output = error.stdout || error.stderr || error.message;

      return {
        success: error.killed ? false : true, // Don't fail if timeout
        output: output,
        metadata: {
          command: command,
          exitCode: error.code || 1,
          timedOut: error.killed
        }
      };
    }
  }

  /**
   * Execute a command in the background
   * @param {string} command - Command to execute
   * @returns {string} Process ID
   */
  async executeBackground(command) {
    const childProcess = exec(command, {
      cwd: process.cwd(),
      env: { ...process.env }
    });

    const pid = Date.now().toString();
    this.backgroundProcesses.set(pid, childProcess);

    // Collect output
    let output = '';
    childProcess.stdout?.on('data', (data) => {
      output += data.toString();
    });
    childProcess.stderr?.on('data', (data) => {
      output += data.toString();
    });

    // Clean up on exit
    childProcess.on('exit', () => {
      this.backgroundProcesses.delete(pid);
    });

    return pid;
  }

  /**
   * Get output from a background process
   * @param {string} pid - Process ID
   * @returns {object} Process status and output
   */
  getBackgroundProcessStatus(pid) {
    const proc = this.backgroundProcesses.get(pid);
    if (!proc) {
      return { exists: false };
    }
    return {
      exists: true,
      pid: proc.pid,
      exitCode: proc.exitCode
    };
  }

  /**
   * Kill a background process
   * @param {string} pid - Process ID
   */
  killBackgroundProcess(pid) {
    const proc = this.backgroundProcesses.get(pid);
    if (proc) {
      proc.kill();
      this.backgroundProcesses.delete(pid);
      return true;
    }
    return false;
  }
}

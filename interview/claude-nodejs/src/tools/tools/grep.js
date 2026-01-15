/**
 * Grep Tool
 * Searches for patterns in files using ripgrep-style syntax
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { BaseTool } from './base.js';

const execAsync = promisify(exec);

export class GrepTool extends BaseTool {
  constructor() {
    super('grep', 'Search for text patterns in files', {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'Search pattern (supports regex)'
        },
        path: {
          type: 'string',
          description: 'Directory to search in (default: current directory)'
        },
        glob: {
          type: 'string',
          description: 'File pattern to filter (e.g., "*.js")'
        },
        ignoreCase: {
          type: 'boolean',
          description: 'Case-insensitive search (default: false)'
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of results (default: unlimited)'
        }
      },
      required: ['pattern']
    });
  }

  async execute(input) {
    const searchPath = input.path || process.cwd();
    const pattern = input.pattern.replace(/"/g, '\\"');

    // Build ripgrep command (or fallback to grep)
    let cmd = `rg "${pattern}" "${searchPath}"`;

    if (input.glob) {
      cmd += ` --glob "${input.glob}"`;
    }

    if (input.ignoreCase) {
      cmd += ' -i';
    }

    if (input.maxResults) {
      cmd += ` --max-count ${input.maxResults}`;
    }

    // Add line numbers and no-heading
    cmd += ' -N --line-number';

    try {
      const { stdout } = await execAsync(cmd, {
        timeout: 30000,
        maxBuffer: 1024 * 1024 * 10
      });

      return {
        output: stdout,
        metadata: {
          pattern: input.pattern,
          path: searchPath,
          matches: stdout.split('\n').filter(l => l).length
        }
      };
    } catch (error) {
      // If rg not found, try grep
      if (error.stderr?.includes('not found')) {
        return this.fallbackGrep(input);
      }

      // No matches is not an error
      if (error.code === 1) {
        return {
          output: 'No matches found',
          metadata: {
            pattern: input.pattern,
            path: searchPath,
            matches: 0
          }
        };
      }

      throw new Error(`Grep error: ${error.message}`);
    }
  }

  async fallbackGrep(input) {
    const searchPath = input.path || process.cwd();
    let cmd = `grep -rn "${input.pattern.replace(/"/g, '\\"')}" "${searchPath}"`;

    if (input.glob) {
      cmd += ` --include="${input.glob}"`;
    }

    if (input.ignoreCase) {
      cmd += ' -i';
    }

    try {
      const { stdout } = await execAsync(cmd, {
        timeout: 30000,
        maxBuffer: 1024 * 1024 * 10
      });

      return {
        output: stdout,
        metadata: {
          pattern: input.pattern,
          path: searchPath
        }
      };
    } catch (error) {
      return {
        output: 'No matches found or grep not available',
        metadata: { error: error.message }
      };
    }
  }
}

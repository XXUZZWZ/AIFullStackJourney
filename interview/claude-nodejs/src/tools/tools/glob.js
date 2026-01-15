/**
 * Glob Tool
 * Finds files matching a pattern
 */

import { glob } from 'glob';
import path from 'node:path';
import { BaseTool } from './base.js';

export class GlobTool extends BaseTool {
  constructor() {
    super('glob', 'Find files by pattern (e.g., "**/*.js")', {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'Glob pattern (e.g., "**/*.js", "src/**/*.ts")'
        },
        path: {
          type: 'string',
          description: 'Base directory to search (default: current directory)'
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
    const maxResults = input.maxResults || Infinity;

    try {
      const files = await glob(input.pattern, {
        cwd: searchPath,
        windowsPathsNoEscape: true,
        maxResults: maxResults
      });

      // Convert to absolute paths
      const absolutePaths = files.map(f => path.resolve(searchPath, f));

      // Sort by modification time (most recent first)
      const withStats = await Promise.all(
        absolutePaths.map(async f => {
          try {
            const stats = await import('node:fs/promises').then(fs =>
              fs.stat(f)
            );
            return { path: f, mtime: stats.mtime };
          } catch {
            return { path: f, mtime: new Date(0) };
          }
        })
      );

      withStats.sort((a, b) => b.mtime - a.mtime);

      const output = withStats.map(f => f.path).join('\n');

      return {
        output: output || 'No files found',
        metadata: {
          pattern: input.pattern,
          path: searchPath,
          count: files.length
        }
      };
    } catch (error) {
      throw new Error(`Glob error: ${error.message}`);
    }
  }
}

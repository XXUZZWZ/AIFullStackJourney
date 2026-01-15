/**
 * Read Tool
 * Reads file contents from the filesystem
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { BaseTool } from './base.js';

export class ReadTool extends BaseTool {
  constructor() {
    super('read', 'Read the contents of a file', {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Absolute or relative path to the file'
        },
        offset: {
          type: 'number',
          description: 'Line number to start reading from (1-based, optional)'
        },
        limit: {
          type: 'number',
          description: 'Number of lines to read (optional)'
        }
      },
      required: ['path']
    });
  }

  async execute(input) {
    let filePath = input.path;

    // Convert to absolute path if relative
    if (!path.isAbsolute(filePath)) {
      filePath = path.resolve(process.cwd(), filePath);
    }

    try {
      // Check if file exists
      await fs.access(filePath);

      let content = await fs.readFile(filePath, 'utf-8');

      // Handle line-based reading with offset/limit
      if (input.offset || input.limit) {
        const lines = content.split('\n');
        const offset = (input.offset || 1) - 1;
        const limit = input.limit || lines.length - offset;

        content = lines
          .slice(offset, offset + limit)
          .map((line, i) => `${String(offset + i + 1).padStart(6, ' ')}\t${line}`)
          .join('\n');
      }

      return {
        output: content,
        metadata: {
          path: filePath,
          size: content.length
        }
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`File not found: ${filePath}`);
      }
      if (error.code === 'EACCES') {
        throw new Error(`Permission denied: ${filePath}`);
      }
      throw error;
    }
  }
}

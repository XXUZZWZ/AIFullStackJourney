/**
 * Write Tool
 * Writes or creates files with content
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { BaseTool } from './base.js';

export class WriteTool extends BaseTool {
  constructor() {
    super('write', 'Write content to a file (overwrites existing)', {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Absolute or relative path to the file'
        },
        content: {
          type: 'string',
          description: 'Content to write to the file'
        }
      },
      required: ['path', 'content']
    });
  }

  async execute(input) {
    let filePath = input.path;

    // Convert to absolute path if relative
    if (!path.isAbsolute(filePath)) {
      filePath = path.resolve(process.cwd(), filePath);
    }

    try {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      // Write file
      await fs.writeFile(filePath, input.content, 'utf-8');

      return {
        output: `File written: ${filePath}`,
        metadata: {
          path: filePath,
          bytesWritten: Buffer.byteLength(input.content, 'utf-8')
        }
      };
    } catch (error) {
      if (error.code === 'EACCES') {
        throw new Error(`Permission denied: ${filePath}`);
      }
      throw error;
    }
  }
}

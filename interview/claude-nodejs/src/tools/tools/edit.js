/**
 * Edit Tool
 * Edits specific parts of a file using string replacement
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { BaseTool } from './base.js';

export class EditTool extends BaseTool {
  constructor() {
    super('edit', 'Edit a file by replacing text (must read file first)', {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Absolute or relative path to the file'
        },
        oldText: {
          type: 'string',
          description: 'Text to replace'
        },
        newText: {
          type: 'string',
          description: 'Replacement text'
        },
        replaceAll: {
          type: 'boolean',
          description: 'Replace all occurrences (default: false)'
        }
      },
      required: ['path', 'oldText', 'newText']
    });
  }

  async execute(input) {
    let filePath = input.path;

    // Convert to absolute path if relative
    if (!path.isAbsolute(filePath)) {
      filePath = path.resolve(process.cwd(), filePath);
    }

    try {
      // Read current content
      const content = await fs.readFile(filePath, 'utf-8');

      // Check if oldText exists
      if (!content.includes(input.oldText)) {
        throw new Error('oldText not found in file');
      }

      // Perform replacement
      let newContent;
      if (input.replaceAll) {
        newContent = content.split(input.oldText).join(input.newText);
      } else {
        const index = content.indexOf(input.oldText);
        newContent =
          content.substring(0, index) +
          input.newText +
          content.substring(index + input.oldText.length);
      }

      // Write back
      await fs.writeFile(filePath, newContent, 'utf-8');

      return {
        output: `File edited: ${filePath}`,
        metadata: {
          path: filePath,
          replacements: input.replaceAll ? 'all' : 1
        }
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`File not found: ${filePath}`);
      }
      throw error;
    }
  }
}

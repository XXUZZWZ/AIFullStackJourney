/**
 * Tool Manager
 * Manages and executes available tools for the AI assistant
 */

import { ReadTool } from './tools/read.js';
import { WriteTool } from './tools/write.js';
import { EditTool } from './tools/edit.js';
import { BashTool } from './tools/bash.js';
import { GrepTool } from './tools/grep.js';
import { GlobTool } from './tools/glob.js';

export class ToolManager {
  constructor() {
    this.tools = {
      read: new ReadTool(),
      write: new WriteTool(),
      edit: new EditTool(),
      bash: new BashTool(),
      grep: new GrepTool(),
      glob: new GlobTool()
    };
  }

  /**
   * Execute a tool
   * @param {string} name - Tool name
   * @param {object} input - Tool input parameters
   * @returns {object} Tool execution result
   */
  async execute(name, input = {}) {
    const tool = this.tools[name];

    if (!tool) {
      return {
        success: false,
        error: `Tool '${name}' not found`
      };
    }

    try {
      // Validate input
      const validation = tool.validate(input);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Execute tool
      const result = await tool.execute(input);

      return {
        success: true,
        ...result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get tool schemas for Claude API
   * @returns {Array} Tool schemas
   */
  getToolSchemas() {
    return Object.values(this.tools).map(tool => tool.schema);
  }

  /**
   * Get list of available tool names
   * @returns {Array} Tool names
   */
  getToolNames() {
    return Object.keys(this.tools);
  }

  /**
   * Register a new tool
   * @param {string} name - Tool name
   * @param {object} tool - Tool instance
   */
  register(name, tool) {
    this.tools[name] = tool;
  }
}

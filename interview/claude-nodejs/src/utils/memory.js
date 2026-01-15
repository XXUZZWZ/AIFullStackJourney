/**
 * Memory Manager
 * Handles persistent memory stored in CLAUDE.md
 * This file acts as long-term memory for the AI assistant
 */

import fs from 'node:fs';
import path from 'node:path';

const MEMORY_FILE = 'CLAUDE.md';

export class MemoryManager {
  constructor() {
    this.memoryPath = path.join(process.cwd(), MEMORY_FILE);
  }

  /**
   * Check if CLAUDE.md exists
   */
  exists() {
    return fs.existsSync(this.memoryPath);
  }

  /**
   * Read CLAUDE.md content
   */
  read() {
    if (!this.exists()) {
      return null;
    }
    try {
      return fs.readFileSync(this.memoryPath, 'utf-8');
    } catch (error) {
      console.error(`Error reading memory file: ${error.message}`);
      return null;
    }
  }

  /**
   * Write to CLAUDE.md
   */
  write(content) {
    try {
      fs.writeFileSync(this.memoryPath, content, 'utf-8');
      return true;
    } catch (error) {
      console.error(`Error writing memory file: ${error.message}`);
      return false;
    }
  }

  /**
   * Initialize CLAUDE.md with template
   */
  initialize(customContent = '') {
    const template = `# Claude Memory File

This file stores important context and memories that should persist across conversations.

## Project Overview

<!-- Add project description here -->

## Key Information

<!-- Add important information here -->

## Recent Decisions

<!-- Document recent decisions and their rationale -->

## Technical Notes

<!-- Add technical notes and conventions -->

${customContent}
`;

    if (this.write(template)) {
      return template;
    }
    return null;
  }

  /**
   * Get memory as system prompt prefix
   * This will be prepended to the system prompt
   */
  getMemoryPrompt() {
    const content = this.read();
    if (!content) {
      return '';
    }

    return `
═══════════════════════════════════════════════════════
IMPORTANT CONTEXT FROM CLAUDE.md
═══════════════════════════════════════════════════════

${content}

═══════════════════════════════════════════════════════
`;
  }

  /**
   * Append to memory
   */
  append(section, content) {
    let current = this.read();

    if (!current) {
      current = this.initialize();
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const entry = `\n## ${section} (${timestamp})\n\n${content}\n`;

    return this.write(current + entry);
  }

  /**
   * Clear memory
   */
  clear() {
    if (this.exists()) {
      try {
        fs.unlinkSync(this.memoryPath);
        return true;
      } catch (error) {
        console.error(`Error clearing memory: ${error.message}`);
        return false;
      }
    }
    return true;
  }
}

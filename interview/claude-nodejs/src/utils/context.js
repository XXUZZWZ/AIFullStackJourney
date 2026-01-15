/**
 * Context Manager
 *
 * Manages conversation history and acts as the single source of truth
 * The model is stateless - this class maintains all conversation state
 */

import { cleanOldPersistedOutputs, isPersistedOutput } from './output-manager.js';

export class ContextManager {
  constructor(maxMessages = 200) {
    this.messages = [];
    this.maxMessages = maxMessages;
    this.tokensUsed = 0;
  }

  /**
   * Add a user message
   */
  addUserMessage(content) {
    this.addMessage('user', content);
  }

  /**
   * Add an assistant message
   */
  addAssistantMessage(content) {
    this.addMessage('assistant', content);
  }

  /**
   * Add a message to the conversation
   */
  addMessage(role, content) {
    this.messages.push({
      role,
      content
    });

    this.trimIfNeeded();
  }

  /**
   * Add tool results as a user message
   * This is how the model sees tool execution results
   */
  addToolResults(toolResults) {
    if (!toolResults || toolResults.length === 0) {
      return;
    }

    // Add as a user message with tool_result blocks
    this.messages.push({
      role: 'user',
      content: toolResults
    });

    this.trimIfNeeded();
  }

  /**
   * Add a single tool result (for backward compatibility)
   */
  addToolResult(toolUseId, result) {
    const content = typeof result === 'string'
      ? result
      : JSON.stringify(result, null, 2);

    this.addToolResults([{
      type: 'tool_result',
      tool_use_id: toolUseId,
      content: content
    }]);
  }

  /**
   * Get all messages
   */
  getMessages() {
    return [...this.messages];
  }

  /**
   * Get cleaned messages (with old outputs removed)
   * This should be called before sending to API
   */
  getCleanedMessages(keepLast = 3) {
    return cleanOldPersistedOutputs(this.messages, keepLast);
  }

  /**
   * Clear all messages
   */
  clear() {
    this.messages = [];
    this.tokensUsed = 0;
  }

  /**
   * Get conversation statistics
   */
  getStats() {
    const persistedCount = this.messages.filter(m => {
      const content = m?.content;
      if (typeof content === 'string') {
        return isPersistedOutput(content);
      }
      if (Array.isArray(content)) {
        return content.some(b =>
          b?.type === 'tool_result' && isPersistedOutput(b.content)
        );
      }
      return false;
    }).length;

    return {
      messageCount: this.messages.length,
      tokensUsed: this.tokensUsed,
      persistedOutputs: persistedCount,
      estimatedTokens: this.estimateTotalTokens()
    };
  }

  /**
   * Keep message count under limit
   */
  trimIfNeeded() {
    while (this.messages.length > this.maxMessages) {
      // Remove oldest message, but try to keep system message if present
      this.messages.shift();
    }
  }

  /**
   * Estimate token count (rough approximation)
   */
  estimateTokens(text) {
    if (typeof text !== 'string') {
      text = JSON.stringify(text);
    }
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Estimate total tokens in conversation
   */
  estimateTotalTokens() {
    let total = 0;
    for (const message of this.messages) {
      const content = message?.content;
      if (typeof content === 'string') {
        total += this.estimateTokens(content);
      } else if (Array.isArray(content)) {
        for (const block of content) {
          if (block?.text) {
            total += this.estimateTokens(block.text);
          } else if (block?.content) {
            total += this.estimateTokens(block.content);
          }
        }
      }
    }
    return total;
  }

  /**
   * Get recent messages (for summary/context window management)
   */
  getRecent(count = 10) {
    return this.messages.slice(-count);
  }

  /**
   * Export conversation history
   */
  export() {
    return JSON.stringify(this.messages, null, 2);
  }

  /**
   * Import conversation history
   */
  import(json) {
    try {
      const messages = JSON.parse(json);
      if (Array.isArray(messages)) {
        this.messages = messages;
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /**
   * Create a summary of recent conversation
   * Useful for context window compression
   */
  summarizeRecent() {
    const recent = this.getRecent(5);
    let summary = '';

    for (const msg of recent) {
      const role = msg?.role || 'unknown';
      const content = msg?.content || '';

      if (typeof content === 'string') {
        summary += `${role}: ${content.slice(0, 100)}...\n`;
      } else if (Array.isArray(content)) {
        summary += `${role}: [${content.length} blocks]\n`;
      }
    }

    return summary;
  }
}

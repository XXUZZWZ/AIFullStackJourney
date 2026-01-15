/**
 * Output Manager
 *
 * Manages large outputs to prevent context window overflow
 * Inspired by Claude Code's approach to handling persisted outputs
 */

import { OUTPUT_CONFIG } from '../config/constants.js';

const PERSISTED_OUTPUT_START = '<persisted-output>';
const PERSISTED_OUTPUT_END = '</persisted-output>';

/**
 * Check if content is a persisted output
 */
export function isPersistedOutput(content) {
  if (typeof content !== 'string') return false;
  return content.includes(PERSISTED_OUTPUT_START);
}

/**
 * Wrap large content in persisted output format
 * If content is small, return as-is
 */
export function wrapPersistedOutput(content) {
  if (typeof content !== 'string') {
    content = String(content);
  }

  // If already persisted, return as-is
  if (isPersistedOutput(content)) {
    return content;
  }

  // If content is small enough, return as-is
  if (content.length <= OUTPUT_CONFIG.THRESHOLD) {
    return content;
  }

  // Content is large - create a persisted output with preview
  const preview = content.slice(0, OUTPUT_CONFIG.PREVIEW_SIZE);
  const truncatedSuffix = content.length > OUTPUT_CONFIG.PREVIEW_SIZE ? '...' : '';

  return `${PERSISTED_OUTPUT_START}
Preview:
${preview}${truncatedSuffix}
${PERSISTED_OUTPUT_END}`;
}

/**
 * Extract preview from persisted output
 */
export function extractPreview(content) {
  if (!isPersistedOutput(content)) {
    return content;
  }

  const startMatch = content.match(/<persisted-output>\s*Preview:\s*/);
  const endMatch = content.match(/<\/persisted-output>/);

  if (!startMatch || !endMatch) {
    return content;
  }

  const startIndex = startMatch.index + startMatch[0].length;
  const endIndex = endMatch.index;

  return content.slice(startIndex, endIndex).replace(/\.\.\.$/, '');
}

/**
 * Clean old persisted outputs from messages
 * Keep only the most recent N persisted outputs
 */
export function cleanOldPersistedOutputs(messages, keepLast = OUTPUT_CONFIG.KEEP_LAST) {
  if (!Array.isArray(messages)) {
    return messages;
  }

  // Find all persisted output positions (in reverse order)
  const persistedPositions = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const content = message?.content;

    if (typeof content === 'string' && isPersistedOutput(content)) {
      persistedPositions.push(i);
    } else if (Array.isArray(content)) {
      for (const block of content) {
        if (block?.type === 'tool_result' &&
            typeof block?.content === 'string' &&
            isPersistedOutput(block.content)) {
          persistedPositions.push({ messageIndex: i, blockIndex: content.indexOf(block) });
        }
      }
    }
  }

  // Keep only the most recent ones
  const toRemove = persistedPositions.slice(keepLast);

  // Create a copy of messages to modify
  const cleaned = JSON.parse(JSON.stringify(messages));

  // Remove old persisted outputs (replace with empty/minimal)
  for (const pos of toRemove) {
    if (typeof pos === 'number') {
      // Simple string content
      cleaned[pos].content = '[Previous output removed from context]';
    } else {
      // Nested tool_result
      const { messageIndex, blockIndex } = pos;
      if (cleaned[messageIndex]?.content?.[blockIndex]) {
        cleaned[messageIndex].content[blockIndex].content =
          '[Previous output removed from context]';
      }
    }
  }

  return cleaned;
}

/**
 * Estimate if content should be persisted
 */
export function shouldPersist(content) {
  if (typeof content !== 'string') {
    content = String(content);
  }
  return content.length > OUTPUT_CONFIG.THRESHOLD;
}

/**
 * Get content size in bytes
 */
export function getContentSize(content) {
  if (typeof content === 'string') {
    return Buffer.byteLength(content, 'utf-8');
  }
  if (content && typeof content === 'object') {
    return Buffer.byteLength(JSON.stringify(content), 'utf-8');
  }
  return 0;
}

/**
 * Count persisted outputs in messages
 */
export function countPersistedOutputs(messages) {
  let count = 0;
  for (const message of messages) {
    const content = message?.content;
    if (typeof content === 'string' && isPersistedOutput(content)) {
      count++;
    } else if (Array.isArray(content)) {
      for (const block of content) {
        if (block?.type === 'tool_result' &&
            typeof block?.content === 'string' &&
            isPersistedOutput(block.content)) {
          count++;
        }
      }
    }
  }
  return count;
}

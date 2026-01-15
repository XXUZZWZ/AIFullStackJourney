/**
 * Configuration Constants
 */

// API Configuration
export const API_CONFIG = {
  MODEL: 'glm-4.7',
  MAX_TOKENS: 20000,
  DEFAULT_TIMEOUT: 120000,  // 2 minutes
};

// Loop Configuration
export const LOOP_CONFIG = {
  MAX_TURNS: 100,
  MAX_RETRIES: 4,
  BASE_RETRY_DELAY: 1000,  // 1 second
};

// Output Management
export const OUTPUT_CONFIG = {
  THRESHOLD: 400000,  // 400KB - trigger persist
  PREVIEW_SIZE: 2000,  // 2KB - preview size
  KEEP_LAST: 3,  // Keep last 3 persisted outputs
};

// Tool Categories
export const TOOL_CATEGORIES = {
  READONLY: ['read', 'glob', 'grep', 'ls'],
  WRITING: ['write', 'edit', 'bash'],
};

// Retryable Errors
export const RETRYABLE_ERRORS = [
  'overloaded_error',
  'rate_limit_error',
  'api_error',
  'timeout',
];

// Cache Configuration
export const CACHE_CONFIG = {
  ENABLED: false,  // Disabled for compatibility with 智谱 AI
  BREAKPOINTS: 4,  // Max cache breakpoints
  MIN_TOKENS: 1024,  // Minimum tokens for caching
};

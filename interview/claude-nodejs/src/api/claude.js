/**
 * Claude API Client - Streaming Implementation
 * Handles communication with Anthropic's Claude API using true streaming
 */

import Anthropic from '@anthropic-ai/sdk';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  API_CONFIG,
  LOOP_CONFIG,
  CACHE_CONFIG,
  RETRYABLE_ERRORS
} from '../config/constants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class ClaudeClient {
  constructor() {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY not found. Please set it in .env file or environment variable.'
      );
    }

    const baseUrl = this.getBaseUrl();

    this.client = new Anthropic({
      apiKey: apiKey,
      baseURL: baseUrl || undefined,
      dangerouslyAllowBrowser: false,
      maxRetries: 0  // We handle retries ourselves
    });

    this.model = API_CONFIG.MODEL;
    this.maxTokens = API_CONFIG.MAX_TOKENS;
    this.baseUrl = baseUrl;
  }

  getApiKey() {
    // Check .env file FIRST (higher priority for local development)
    const envPaths = [
      path.join(process.cwd(), '.env'),
      path.join(__dirname, '../../.env'),
      path.join(process.cwd(), 'claude-nodejs', '.env')
    ];

    for (const envPath of envPaths) {
      try {
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf-8');
          const match = envContent.match(/ANTHROPIC_API_KEY=(.+)/);
          if (match) {
            return match[1].trim().replace(/^["']|["']$/g, '');
          }
        }
      } catch (e) {
        // Continue
      }
    }

    // Fall back to environment variable
    if (process.env.ANTHROPIC_API_KEY) {
      return process.env.ANTHROPIC_API_KEY;
    }

    return null;
  }

  getBaseUrl() {
    // Check .env file FIRST (higher priority for local development)
    const envPaths = [
      path.join(process.cwd(), '.env'),
      path.join(__dirname, '../../.env'),
      path.join(process.cwd(), 'claude-nodejs', '.env')
    ];

    for (const envPath of envPaths) {
      try {
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf-8');
          const match = envContent.match(/ANTHROPIC_BASE_URL=(.+)/);
          if (match) {
            return match[1].trim().replace(/^["']|["']$/g, '');
          }
        }
      } catch (e) {
        // Continue
      }
    }

    // Fall back to environment variable
    if (process.env.ANTHROPIC_BASE_URL) {
      return process.env.ANTHROPIC_BASE_URL;
    }

    return null;  // Use default
  }

  /**
   * Check if an error is retryable
   */
  isRetryable(error) {
    const errorType = error?.error?.type || error?.type;
    return RETRYABLE_ERRORS.includes(errorType);
  }

  /**
   * Sleep for a specified duration
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Execute operation with exponential backoff retry
   */
  async withRetry(operation, retryCount = 0) {
    try {
      return await operation();
    } catch (error) {
      if (this.isRetryable(error) && retryCount < LOOP_CONFIG.MAX_RETRIES) {
        const delay = LOOP_CONFIG.BASE_RETRY_DELAY * Math.pow(2, retryCount);
        console.log(chalk.yellow(`Retrying after ${delay}ms... (${retryCount + 1}/${LOOP_CONFIG.MAX_RETRIES})`));
        await this.sleep(delay);
        return this.withRetry(operation, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Build request parameters with optional caching
   */
  buildRequestParams(messages, tools, systemPrompt) {
    const params = {
      model: this.model,
      max_tokens: this.maxTokens,
      messages: messages,
      tools: tools || []
    };

    // Add system prompt with cache control
    if (CACHE_CONFIG.ENABLED) {
      params.system = [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' }
        }
      ];

      // Add cache control to last message
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        params.messages = [
          ...messages.slice(0, -1),
          {
            ...lastMessage,
            content: this.addCacheControlToContent(lastMessage.content)
          }
        ];
      }
    } else {
      params.system = systemPrompt;
    }

    return params;
  }

  /**
   * Add cache control to message content
   */
  addCacheControlToContent(content) {
    if (typeof content === 'string') {
      return content;
    }

    if (Array.isArray(content)) {
      // Add cache_control to the last text block
      for (let i = content.length - 1; i >= 0; i--) {
        if (content[i].type === 'text') {
          content[i] = {
            ...content[i],
            cache_control: { type: 'ephemeral' }
          };
          break;
        }
      }
      return content;
    }

    return content;
  }

  /**
   * Stream a response from Claude API
   * Processes SSE events and returns structured response
   */
  async stream(messages, tools = [], systemPrompt) {
    const params = this.buildRequestParams(messages, tools, systemPrompt);

    return await this.withRetry(async () => {
      const stream = await this.client.messages.create(params);

      // The SDK's create() returns a promise, not a stream
      // For true streaming, we need to use the stream() method
      // But for now, let's process the response structure
      return this.processResponse(stream);
    });
  }

  /**
   * Process API response into structured format
   */
  processResponse(response) {
    const result = {
      content: [],
      stopReason: response.stop_reason,
      stopSequence: response.stop_sequence,
      usage: response.usage
    };

    // Process content blocks
    for (const block of response.content) {
      if (block.type === 'text') {
        result.content.push({
          type: 'text',
          text: block.text
        });
      } else if (block.type === 'tool_use') {
        result.content.push({
          type: 'tool_use',
          id: block.id,
          name: block.name,
          input: block.input
        });
      }
    }

    return result;
  }

  /**
   * True streaming implementation using SSE
   * This yields events as they arrive
   */
  async *streamEvents(messages, tools = [], systemPrompt) {
    const params = this.buildRequestParams(messages, tools, systemPrompt);

    let retryCount = 0;
    while (retryCount <= LOOP_CONFIG.MAX_RETRIES) {
      try {
        const stream = this.client.messages.stream(params);

        for await (const event of stream) {
          switch (event.type) {
            case 'message_start':
              yield { type: 'message_start', message: event.message };
              break;

            case 'content_block_start':
              yield {
                type: 'content_block_start',
                index: event.index,
                contentBlock: event.content_block
              };
              break;

            case 'content_block_delta':
              yield {
                type: 'content_block_delta',
                index: event.index,
                delta: event.delta
              };
              break;

            case 'content_block_stop':
              yield {
                type: 'content_block_stop',
                index: event.index
              };
              break;

            case 'message_delta':
              yield {
                type: 'message_delta',
                delta: event.delta,
                usage: event.usage
              };
              break;

            case 'message_stop':
              yield {
                type: 'message_stop',
                stopReason: event.stop_reason
              };
              break;

            case 'error':
              throw event.error;
          }
        }

        // Success - exit retry loop
        return;

      } catch (error) {
        if (this.isRetryable(error) && retryCount < LOOP_CONFIG.MAX_RETRIES) {
          const delay = LOOP_CONFIG.BASE_RETRY_DELAY * Math.pow(2, retryCount);
          await this.sleep(delay);
          retryCount++;
          continue;
        }
        throw error;
      }
    }
  }

  /**
   * Get the system prompt
   */
  getSystemPrompt() {
    return `You are Claude Code, an AI programming assistant that helps users with software engineering tasks.

## Core Principles

1. **Be concise and direct** - Get to the point quickly
2. **Read before writing** - Always understand existing code before suggesting changes
3. **Use tools effectively** - Leverage available tools to gather information
4. **Think step by step** - Break down complex tasks
5. **Be honest** - If you're unsure, say so

## Available Tools

- **read**: Read file contents
- **write**: Write or create files
- **edit**: Edit specific parts of a file
- **bash**: Execute shell commands
- **grep**: Search for patterns in files
- **glob**: Find files by pattern

## Tool Usage Guidelines

- Use \`read\` before suggesting any code changes
- Use \`grep\` or \`glob\` to find relevant files
- Use \`bash\` for running commands (git, npm, tests, etc.)
- Always verify the current state before making changes

## Code Style

- Prefer clear, readable code over clever code
- Add comments for complex logic only
- Follow existing project conventions
- Don't over-engineer simple tasks

## Safety

- Never generate malicious code
- Warn about potential security issues
- Don't expose sensitive information
- Validate user inputs when handling external data

Remember: You're here to help the user be more productive. Focus on solving their actual needs.`;
  }
}

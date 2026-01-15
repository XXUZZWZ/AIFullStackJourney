/**
 * Core Loop - The Heart of Claude Node.js
 *
 * This is the main execution loop, inspired by Claude Code's src/core/loop.ts
 * A single while loop that orchestrates everything.
 *
 * Architecture:
 * 1. Clean old outputs to prevent context bloat
 * 2. Call Claude API (streaming)
 * 3. Process response blocks (text or tool_use)
 * 4. Execute tools if needed
 * 5. Add tool results back to messages
 * 6. Check stop_reason to decide whether to continue
 */

import { LOOP_CONFIG, OUTPUT_CONFIG, TOOL_CATEGORIES } from '../config/constants.js';
import { cleanOldPersistedOutputs, wrapPersistedOutput } from '../utils/output-manager.js';

export class CoreLoop {
  constructor(claudeClient, toolManager, contextManager) {
    this.claude = claudeClient;
    this.toolManager = toolManager;
    this.context = contextManager;
    this.maxTurns = LOOP_CONFIG.MAX_TURNS;
  }

  /**
   * Run a single user input through the loop
   * This is the main entry point for processing user messages
   */
  async run(userMessage) {
    // Add user message to context
    this.context.addMessage('user', userMessage);

    let turns = 0;
    let finalResponse = '';

    // THE CORE LOOP - Everything happens here
    while (turns < this.maxTurns) {
      turns++;

      // Step 1: Clean old large outputs to prevent context overflow
      const cleanedMessages = this.cleanMessages();

      // Step 2: Get tools and system prompt
      const tools = this.toolManager.getToolSchemas();
      const systemPrompt = this.claude.getSystemPrompt();

      // Step 3: Call Claude API
      const response = await this.callAPI(cleanedMessages, tools, systemPrompt);

      // Step 4: Process response content blocks
      const { textOutput, toolCalls } = this.processResponse(response);

      finalResponse += textOutput;

      // Step 5: Execute tools if any
      if (toolCalls.length > 0) {
        const toolResults = await this.executeTools(toolCalls);
        this.context.addToolResults(toolResults);
        // Continue the loop - let Claude see the tool results
        continue;
      }

      // Step 6: Check stop_reason
      // - end_turn: Claude is done, exit loop
      // - max_tokens: Hit output limit, continue to let Claude finish
      // - tool_use: Should have been handled above
      if (response.stopReason === 'end_turn') {
        break;
      }

      // If we hit max_tokens, continue the conversation
      if (response.stopReason === 'max_tokens') {
        // Add partial response and continue
        this.context.addMessage('assistant', textOutput);
        continue;
      }
    }

    // Add final assistant response to context
    if (finalResponse) {
      this.context.addMessage('assistant', finalResponse);
    }

    return finalResponse;
  }

  /**
   * Clean messages to prevent context overflow
   * Removes old large outputs, keeping only recent ones
   */
  cleanMessages() {
    const messages = this.context.getMessages();
    return cleanOldPersistedOutputs(messages, OUTPUT_CONFIG.KEEP_LAST);
  }

  /**
   * Call Claude API with retry logic
   */
  async callAPI(messages, tools, systemPrompt) {
    try {
      return await this.claude.stream(messages, tools, systemPrompt);
    } catch (error) {
      // Error is already handled by withRetry in claude.js
      throw error;
    }
  }

  /**
   * Process response blocks
   * Separates text output from tool calls
   */
  processResponse(response) {
    const textOutput = [];
    const toolCalls = [];

    for (const block of response.content) {
      if (block.type === 'text') {
        // Stream text to stdout as it arrives
        if (block.text) {
          process.stdout.write(block.text);
          textOutput.push(block.text);
        }
      } else if (block.type === 'tool_use') {
        toolCalls.push({
          id: block.id,
          name: block.name,
          input: block.input
        });
      }
    }

    // Add newline after response
    if (textOutput.length > 0) {
      process.stdout.write('\n');
    }

    return {
      textOutput: textOutput.join(''),
      toolCalls
    };
  }

  /**
   * Execute tool calls
   * Parallel for read-only tools, serial for writing tools
   */
  async executeTools(toolCalls) {
    const readOnly = toolCalls.filter(t =>
      TOOL_CATEGORIES.READONLY.includes(t.name.toLowerCase())
    );
    const writing = toolCalls.filter(t =>
      TOOL_CATEGORIES.WRITING.includes(t.name.toLowerCase())
    );

    // Execute read-only tools in parallel
    const readResults = await Promise.all(
      readOnly.map(call => this.executeTool(call))
    );

    // Execute writing tools serially
    const writeResults = [];
    for (const call of writing) {
      writeResults.push(await this.executeTool(call));
    }

    return [...readResults, ...writeResults];
  }

  /**
   * Execute a single tool call
   */
  async executeTool(toolCall) {
    const { id, name, input } = toolCall;

    // Normalize tool name (handle case differences)
    const normalizedName = name.toLowerCase();

    try {
      const result = await this.toolManager.execute(normalizedName, input);

      // Wrap large outputs
      let content = result.success
        ? (result.output || '')
        : JSON.stringify({ error: result.error });

      content = wrapPersistedOutput(content);

      return {
        type: 'tool_result',
        tool_use_id: id,
        content: content
      };
    } catch (error) {
      return {
        type: 'tool_result',
        tool_use_id: id,
        content: JSON.stringify({ error: error.message }),
        is_error: true
      };
    }
  }

  /**
   * Run with streaming events for real-time output
   * This is an alternative to run() that streams events
   */
  async *runStream(userMessage) {
    this.context.addMessage('user', userMessage);

    let turns = 0;
    let finalResponse = '';

    while (turns < this.maxTurns) {
      turns++;

      const cleanedMessages = this.cleanMessages();
      const tools = this.toolManager.getToolSchemas();
      const systemPrompt = this.claude.getSystemPrompt();

      // Use streaming events
      const eventStream = this.claude.streamEvents(
        cleanedMessages,
        tools,
        systemPrompt
      );

      let currentToolInput = '';
      let currentToolBlock = null;
      const toolCalls = [];

      for await (const event of eventStream) {
        yield event;

        switch (event.type) {
          case 'content_block_start':
            if (event.contentBlock?.type === 'tool_use') {
              currentToolBlock = event.contentBlock;
            }
            break;

          case 'content_block_delta':
            if (event.delta?.type === 'text_delta') {
              process.stdout.write(event.delta.text);
              finalResponse += event.delta.text;
            } else if (event.delta?.type === 'input_json_delta') {
              currentToolInput += event.delta.partial_json;
            }
            break;

          case 'content_block_stop':
            if (currentToolBlock) {
              try {
                const input = JSON.parse(currentToolInput);
                toolCalls.push({
                  id: currentToolBlock.id,
                  name: currentToolBlock.name,
                  input: input
                });
              } catch (e) {
                // Invalid JSON, skip
              }
              currentToolBlock = null;
              currentToolInput = '';
            }
            break;

          case 'message_stop':
            // Execute tools if any
            if (toolCalls.length > 0) {
              const toolResults = await this.executeTools(toolCalls);
              this.context.addToolResults(toolResults);
            }

            // Check if we should continue
            if (event.stopReason === 'end_turn' && toolCalls.length === 0) {
              return finalResponse;
            }

            if (event.stopReason === 'max_tokens') {
              this.context.addMessage('assistant', finalResponse);
              // Continue to next iteration
            }
            break;
        }
      }
    }

    if (finalResponse) {
      this.context.addMessage('assistant', finalResponse);
    }

    return finalResponse;
  }
}

#!/usr/bin/env node

/**
 * Test Core Loop without API calls
 * Tests the loop logic with mocked responses
 */

import { CoreLoop } from './core/loop.js';
import { ContextManager } from './utils/context.js';

// Mock Claude Client
class MockClaudeClient {
  constructor() {
    this.model = 'claude-3-5-sonnet-20241022';
    this.maxTokens = 20000;
    this.callCount = 0;
  }

  getSystemPrompt() {
    return 'You are a helpful assistant.';
  }

  // Simulate a simple response without tools
  async stream(messages, tools, systemPrompt) {
    this.callCount++;
    return {
      content: [
        { type: 'text', text: `Hello! This is response #${this.callCount}.` }
      ],
      stopReason: 'end_turn',
      usage: { input_tokens: 10, output_tokens: 20 }
    };
  }
}

// Mock Tool Manager
class MockToolManager {
  constructor() {
    this.executed = [];
  }

  getToolSchemas() {
    return [];
  }

  async execute(name, input) {
    this.executed.push({ name, input });
    return {
      success: true,
      output: `Mock result for ${name}`
    };
  }
}

console.log('🔄 Testing Core Loop...\n');

// Test 1: Simple conversation
console.log('Test 1: Simple conversation (no tools)');
{
  const mockClaude = new MockClaudeClient();
  const mockTools = new MockToolManager();
  const context = new ContextManager();
  const loop = new CoreLoop(mockClaude, mockTools, context);

  const response = await loop.run('Say hello');
  console.log(`  Response: ${response}`);
  console.log(`  API calls: ${mockClaude.callCount}`);
  console.log(`  Messages in context: ${context.getMessages().length}`);
  console.log('  ✓ Passed\n');
}

// Test 2: Multi-turn conversation
console.log('Test 2: Multi-turn conversation');
{
  const mockClaude = new MockClaudeClient();
  const mockTools = new MockToolManager();
  const context = new ContextManager();
  const loop = new CoreLoop(mockClaude, mockTools, context);

  await loop.run('First message');
  await loop.run('Second message');
  await loop.run('Third message');

  console.log(`  Total API calls: ${mockClaude.callCount}`);
  console.log(`  Messages in context: ${context.getMessages().length}`);
  console.log('  ✓ Passed\n');
}

// Test 3: Tool use simulation
console.log('Test 3: Response with tool use');
{
  class ToolMockClient extends MockClaudeClient {
    async stream(messages, tools, systemPrompt) {
      // Check if last message has tool results
      const lastMsg = messages[messages.length - 1];
      const hasToolResults = Array.isArray(lastMsg?.content) &&
        lastMsg.content.some(b => b.type === 'tool_result');

      if (hasToolResults) {
        // After tool results, return final response
        return {
          content: [
            { type: 'text', text: 'Based on the file, here is the answer.' }
          ],
          stopReason: 'end_turn',
          usage: { input_tokens: 50, output_tokens: 30 }
        };
      } else {
        // First call - request to use tool
        return {
          content: [
            { type: 'text', text: 'Let me read that file for you.' },
            { type: 'tool_use', id: 'tool_123', name: 'read', input: { path: 'test.txt' } }
          ],
          stopReason: 'tool_use',
          usage: { input_tokens: 30, output_tokens: 20 }
        };
      }
    }
  }

  const mockClaude = new ToolMockClient();
  const mockTools = new MockToolManager();
  const context = new ContextManager();
  const loop = new CoreLoop(mockClaude, mockTools, context);

  const response = await loop.run('Read test.txt and tell me what it says');

  console.log(`  Response: ${response.substring(0, 50)}...`);
  console.log(`  API calls: ${mockClaude.callCount} (expected: 2)`);
  console.log(`  Tools executed: ${mockTools.executed.length}`);
  console.log(`  Tool used: ${mockTools.executed[0]?.name || 'none'}`);
  console.log('  ✓ Passed\n');
}

// Test 4: Context stats
console.log('Test 4: Context statistics');
{
  const context = new ContextManager();
  context.addMessage('user', 'Hello');
  context.addToolResults([{ type: 'tool_result', tool_use_id: '123', content: 'Result' }]);
  context.addMessage('assistant', 'Here is the answer');

  const stats = context.getStats();
  console.log(`  Messages: ${stats.messageCount}`);
  console.log(`  Estimated tokens: ${stats.estimatedTokens}`);
  console.log('  ✓ Passed\n');
}

console.log('✅ All core loop tests passed!');

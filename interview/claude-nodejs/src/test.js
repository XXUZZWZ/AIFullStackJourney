#!/usr/bin/env node

/**
 * Simple Test Suite for Claude Node.js
 * Tests core functionality without requiring API calls
 */

import { ContextManager } from './utils/context.js';
import { cleanOldPersistedOutputs, wrapPersistedOutput, isPersistedOutput } from './utils/output-manager.js';
import { TOOL_CATEGORIES, OUTPUT_CONFIG } from './config/constants.js';

console.log('🧪 Running Claude Node.js Tests...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Test 1: Context Manager - add messages
test('ContextManager adds messages', () => {
  const ctx = new ContextManager();
  ctx.addMessage('user', 'Hello');
  const messages = ctx.getMessages();
  assert(messages.length === 1, 'Should have 1 message');
  assert(messages[0].role === 'user', 'Role should be user');
  assert(messages[0].content === 'Hello', 'Content should match');
});

// Test 2: Context Manager - add tool results
test('ContextManager adds tool results', () => {
  const ctx = new ContextManager();
  ctx.addToolResults([
    { type: 'tool_result', tool_use_id: '123', content: 'result' }
  ]);
  const messages = ctx.getMessages();
  assert(messages.length === 1, 'Should have 1 message');
  assert(messages[0].role === 'user', 'Tool results added as user message');
  assert(Array.isArray(messages[0].content), 'Content should be array');
});

// Test 3: Context Manager - trim
test('ContextManager trims old messages', () => {
  const ctx = new ContextManager(5); // max 5 messages
  for (let i = 0; i < 10; i++) {
    ctx.addMessage('user', `message ${i}`);
  }
  const messages = ctx.getMessages();
  assert(messages.length === 5, 'Should trim to max 5');
  assert(messages[0].content === 'message 5', 'Oldest messages removed');
});

// Test 4: Context Manager - stats
test('ContextManager returns stats', () => {
  const ctx = new ContextManager();
  ctx.addMessage('user', 'Hello world');
  const stats = ctx.getStats();
  assert(stats.messageCount === 1, 'Should count messages');
  assert(stats.estimatedTokens > 0, 'Should estimate tokens');
});

// Test 5: Output Manager - small content not persisted
test('OutputManager keeps small content as-is', () => {
  const small = 'x'.repeat(100);
  const wrapped = wrapPersistedOutput(small);
  assert(wrapped === small, 'Small content should not be wrapped');
  assert(!isPersistedOutput(wrapped), 'Should not be marked as persisted');
});

// Test 6: Output Manager - large content is persisted
test('OutputManager wraps large content', () => {
  const large = 'x'.repeat(OUTPUT_CONFIG.THRESHOLD + 1);
  const wrapped = wrapPersistedOutput(large);
  assert(isPersistedOutput(wrapped), 'Should be marked as persisted');
  assert(wrapped.includes('<persisted-output>'), 'Should have wrapper tags');
  assert(wrapped.includes('Preview:'), 'Should have preview section');
});

// Test 7: Output Manager - clean old persisted outputs
test('OutputManager cleans old persisted outputs', () => {
  const messages = [
    { role: 'user', content: 'normal message' },
    { role: 'user', content: '<persisted-output>old output</persisted-output>' },
    { role: 'user', content: '<persisted-output>recent output</persisted-output>' },
    { role: 'user', content: '<persisted-output>newest output</persisted-output>' },
  ];
  const cleaned = cleanOldPersistedOutputs(messages, 2);
  // Should keep last 2 persisted outputs
  const persisted = cleaned.filter(m => isPersistedOutput(m.content));
  assert(persisted.length === 2, 'Should keep only last 2 persisted outputs');
});

// Test 8: Tool categories
test('Tool categories are defined', () => {
  assert(TOOL_CATEGORIES.READONLY.length > 0, 'Should have readonly tools');
  assert(TOOL_CATEGORIES.WRITING.length > 0, 'Should have writing tools');
  assert(TOOL_CATEGORIES.READONLY.includes('read'), 'read should be readonly');
  assert(TOOL_CATEGORIES.WRITING.includes('bash'), 'bash should be writing');
});

// Test 9: Constants are defined
test('Configuration constants are set', () => {
  assert(OUTPUT_CONFIG.THRESHOLD === 400000, 'Threshold should be 400KB');
  assert(OUTPUT_CONFIG.PREVIEW_SIZE === 2000, 'Preview should be 2KB');
  assert(OUTPUT_CONFIG.KEEP_LAST === 3, 'Should keep last 3 outputs');
});

// Test 10: Context import/export
test('ContextManager import/export works', () => {
  const ctx = new ContextManager();
  ctx.addMessage('user', 'test message');
  const exported = ctx.export();
  const ctx2 = new ContextManager();
  const success = ctx2.import(exported);
  assert(success, 'Import should succeed');
  assert(ctx2.getMessages().length === 1, 'Should import 1 message');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests passed: ${passed}`);
console.log(`Tests failed: ${failed}`);
console.log('='.repeat(50));

if (failed === 0) {
  console.log('\n✓ All tests passed!\n');
  process.exit(0);
} else {
  console.log(`\n✗ ${failed} test(s) failed\n`);
  process.exit(1);
}

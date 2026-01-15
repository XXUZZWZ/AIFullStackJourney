#!/usr/bin/env node

/**
 * Claude Node.js - AI CLI Assistant
 *
 * A Node.js implementation of an AI coding assistant
 * Powered by Claude's core loop architecture
 */

import readline from 'node:readline';
import { stdin, stdout } from 'node:process';
import chalk from 'chalk';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { ClaudeClient } from './api/claude.js';
import { ToolManager } from './tools/tool-manager.js';
import { ContextManager } from './utils/context.js';
import { CoreLoop } from './core/loop.js';

class ClaudeCLI {
  constructor() {
    this.rl = readline.createInterface({
      input: stdin,
      output: stdout,
      prompt: chalk.cyan('claude» '),
      completer: this.completer.bind(this)
    });

    // Initialize core components
    this.claude = new ClaudeClient();
    this.toolManager = new ToolManager();
    this.context = new ContextManager();

    // The core loop - heart of the system
    this.loop = new CoreLoop(this.claude, this.toolManager, this.context);

    // CLI commands
    this.commands = {
      '/help': { desc: 'Show this help message', fn: this.showHelp.bind(this) },
      '/clear': { desc: 'Clear conversation history', fn: this.clearHistory.bind(this) },
      '/exit': { desc: 'Exit the program', fn: this.exit.bind(this) },
      '/status': { desc: 'Show current status', fn: this.showStatus.bind(this) },
      '/read': { desc: 'Read a file: /read <path>', fn: this.readFile.bind(this) },
      '/ls': { desc: 'List directory: /ls [path]', fn: this.listDir.bind(this) },
      '/search': { desc: 'Search in files: /search <pattern> [path]', fn: this.searchFiles.bind(this) },
      '/run': { desc: 'Run shell command: /run <command>', fn: this.runCommand.bind(this) },
      '/cost': { desc: 'Show token usage estimate', fn: this.showCost.bind(this) }
    };

    this.commandsList = Object.keys(this.commands);
  }

  completer(line) {
    const hits = this.commandsList.filter(c => c.startsWith(line));
    return [hits.length ? hits : this.commandsList, line];
  }

  async showHelp() {
    console.log(chalk.bold('\n📋 Available Commands:\n'));
    for (const [cmd, info] of Object.entries(this.commands)) {
      console.log(`  ${chalk.yellow(cmd.padEnd(12))} ${info.desc}`);
    }
    console.log(chalk.gray('\nTip: You can also just type your message directly!\n'));
    console.log(chalk.gray('The assistant will use tools automatically as needed.\n'));
  }

  async clearHistory() {
    this.context.clear();
    console.log(chalk.green('✓ Conversation history cleared'));
  }

  async showStatus() {
    const stats = this.context.getStats();
    console.log(chalk.bold('\n📊 Current Status:\n'));
    console.log(`  Messages: ${chalk.cyan(stats.messageCount)}`);
    console.log(`  Estimated Tokens: ${chalk.cyan(stats.estimatedTokens.toLocaleString())}`);
    console.log(`  Persisted Outputs: ${chalk.cyan(stats.persistedOutputs)}`);
    console.log(`  Current Directory: ${chalk.cyan(process.cwd())}`);
    console.log(`  Model: ${chalk.cyan(this.claude.model)}`);
    console.log('');
  }

  async showCost() {
    const stats = this.context.getStats();
    // Rough cost estimation (Sonnet pricing as of 2024)
    const inputCost = (stats.estimatedTokens / 1000000) * 3;  // $3 per million
    const outputCost = (stats.estimatedTokens / 1000000) * 15; // $15 per million
    const totalCost = inputCost + outputCost;

    console.log(chalk.bold('\n💰 Token Usage Estimate:\n'));
    console.log(`  Estimated Tokens: ${chalk.cyan(stats.estimatedTokens.toLocaleString())}`);
    console.log(`  Input (~$3/M): ${chalk.green('$' + inputCost.toFixed(4))}`);
    console.log(`  Output (~$15/M): ${chalk.green('$' + outputCost.toFixed(4))}`);
    console.log(`  ${chalk.bold('Total: ' + chalk.yellow('$' + totalCost.toFixed(4)))}`);
    console.log(chalk.gray('\nNote: With prompt caching, actual costs may be much lower.\n'));
  }

  async readFile(args) {
    if (!args) {
      console.log(chalk.red('Error: Please provide a file path'));
      return;
    }
    const result = await this.toolManager.execute('read', { path: args });
    this.displayToolResult(result);
  }

  async listDir(args) {
    const dir = args || '.';
    const result = await this.toolManager.execute('bash', { command: `ls -la "${dir}"` });
    this.displayToolResult(result);
  }

  async searchFiles(args) {
    if (!args) {
      console.log(chalk.red('Error: Please provide a search pattern'));
      return;
    }
    const parts = args.split(' ');
    const pattern = parts[0];
    const searchPath = parts[1] || '.';
    const result = await this.toolManager.execute('grep', { pattern, path: searchPath });
    this.displayToolResult(result);
  }

  async runCommand(args) {
    if (!args) {
      console.log(chalk.red('Error: Please provide a command'));
      return;
    }
    console.log(chalk.gray(`\nRunning: ${args}\n`));
    const result = await this.toolManager.execute('bash', { command: args });
    this.displayToolResult(result);
  }

  displayToolResult(result) {
    if (result.success === false) {
      console.log(chalk.red(`✗ Error: ${result.error}`));
      return;
    }
    if (result.output) {
      console.log(result.output);
    }
    console.log(chalk.green('✓ Done'));
  }

  parseCommand(input) {
    const trimmed = input.trim();
    if (trimmed.startsWith('/')) {
      const parts = trimmed.split(' ');
      const cmd = parts[0];
      const args = parts.slice(1).join(' ');
      return { type: 'command', cmd, args };
    }
    return { type: 'message', content: trimmed };
  }

  async exit() {
    console.log(chalk.yellow('\nGoodbye! 👋\n'));
    this.rl.close();
    process.exit(0);
  }

  showWelcome() {
    console.log(chalk.cyan.bold(`
╔═══════════════════════════════════════════════════════╗
║     Claude Node.js - AI CLI Assistant v2.0           ║
║              Core Loop Architecture                  ║
╚═══════════════════════════════════════════════════════╝
    `));
    console.log(chalk.gray('Type /help for available commands'));
    console.log(chalk.gray('Or just start talking!\n'));
  }

  /**
   * Process user message through the core loop
   * This is the main entry point for AI interaction
   */
  async processMessage(userMessage) {
    try {
      await this.loop.run(userMessage);
    } catch (error) {
      console.log(chalk.red(`\nError: ${error.message}`));

      // Add error to context so model can try to recover
      this.context.addMessage('assistant', `[Error: ${error.message}]`);
    }
  }

  start() {
    this.showWelcome();

    this.rl.prompt();

    this.rl.on('line', async (input) => {
      if (!input.trim()) {
        this.rl.prompt();
        return;
      }

      const parsed = this.parseCommand(input);

      if (parsed.type === 'command') {
        const command = this.commands[parsed.cmd];
        if (command) {
          try {
            await command.fn(parsed.args);
          } catch (error) {
            console.log(chalk.red(`Error: ${error.message}`));
          }
        } else {
          console.log(chalk.red(`Unknown command: ${parsed.cmd}`));
          console.log(chalk.gray('Type /help for available commands'));
        }
      } else {
        // Process through the core loop
        await this.processMessage(parsed.content);
      }

      this.rl.prompt();
    });

    this.rl.on('close', () => {
      this.exit();
    });

    // Handle Ctrl+C
    this.rl.on('SIGINT', () => {
      console.log(chalk.yellow('\n\nType /exit to quit, or /clear to reset conversation\n'));
      this.rl.prompt();
    });
  }
}

// Start the CLI
const cli = new ClaudeCLI();
cli.start();

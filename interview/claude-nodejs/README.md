# Claude Node.js

A Node.js implementation of an AI CLI assistant powered by Anthropic's Claude API.

Inspired by Claude Code, this is a lightweight alternative that demonstrates how to build an AI coding assistant from scratch.

## Features

- **Interactive REPL** - Chat with Claude in your terminal
- **File Operations** - Read, write, and edit files
- **Search Tools** - Grep and glob for finding code
- **Shell Integration** - Execute terminal commands
- **Tool Calling** - Claude can use tools autonomously
- **Context Management** - Maintains conversation history

## Installation

```bash
cd claude-nodejs
npm install
```

## Configuration

Copy `.env.example` to `.env` and add your Anthropic API key:

```bash
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=sk-ant-...
```

Or set the environment variable:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

## Usage

Start the CLI:

```bash
npm start
```

### Commands

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/clear` | Clear conversation history |
| `/exit` | Exit the program |
| `/status` | Show current status |
| `/read <path>` | Read a file |
| `/ls [path]` | List directory |
| `/search <pattern> [path]` | Search in files |
| `/run <command>` | Run shell command |
| `/write <path> <content>` | Write to file |

### AI-Powered Tool Use

Just describe what you want to do, and Claude will use the appropriate tools:

```
You: Read the package.json file
Claude: [reads file using read tool]

You: Find all JavaScript files in src/
Claude: [uses glob tool to find files]

You: Run the tests
Claude: [uses bash tool to run npm test]
```

## Architecture

```
claude-nodejs/
├── src/
│   ├── index.js          # Main CLI entry point
│   ├── api/
│   │   └── claude.js     # Claude API client
│   ├── tools/
│   │   ├── tool-manager.js  # Tool registry and executor
│   │   └── tools/
│   │       ├── base.js   # Base tool class
│   │       ├── read.js   # File reading
│   │       ├── write.js  # File writing
│   │       ├── edit.js   # File editing
│   │       ├── bash.js   # Shell commands
│   │       ├── grep.js   # Text search
│   │       └── glob.js   # File patterns
│   └── utils/
│       └── context.js    # Conversation context manager
```

## Available Tools

| Tool | Description |
|------|-------------|
| `read` | Read file contents with optional line range |
| `write` | Write or overwrite files |
| `edit` | Replace specific text in files |
| `bash` | Execute shell commands (with safety checks) |
| `grep` | Search for patterns using ripgrep |
| `glob` | Find files matching patterns |

## System Prompt

The assistant uses a carefully crafted system prompt that:

- Emphasizes reading before writing
- Encourages tool use for information gathering
- Promotes concise, direct communication
- Includes safety guidelines

## Example Session

```
╔═══════════════════════════════════════════════════════╗
║     Claude Node.js - AI CLI Assistant v1.0.0          ║
╚═══════════════════════════════════════════════════════╝

Type /help for available commands
Or just start talking!

» What files are in this directory?
🔧 Executing: glob
* (10 files found)

» Read the package.json
{
  "name": "claude-nodejs",
  "version": "1.0.0",
  ...
}

» /run npm install
Installing dependencies...
✓ Done
```

## Extending

Add a new tool by extending `BaseTool`:

```javascript
import { BaseTool } from './base.js';

export class MyTool extends BaseTool {
  constructor() {
    super('my_tool', 'Description of what it does', {
      type: 'object',
      properties: {
        param: { type: 'string', description: 'Parameter' }
      },
      required: ['param']
    });
  }

  async execute(input) {
    // Your tool logic here
    return { output: 'Result' };
  }
}
```

Then register it in `tool-manager.js`:

```javascript
import { MyTool } from './tools/my-tool.js';

// In constructor
this.tools.my_tool = new MyTool();
```

## License

MIT

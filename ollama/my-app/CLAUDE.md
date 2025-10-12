# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application that provides a chat interface for interacting with local LLM models via Ollama. The app uses the App Router architecture and features a real-time chat UI with Tailwind CSS styling.

## Core Architecture

**Frontend Structure:**
- `app/page.tsx` - Main chat interface with message state management
- `app/layout.tsx` - Root layout with font configuration
- `app/globals.css` - Global styles and Tailwind setup

**Backend API:**
- `app/api/chat/route.ts` - Next.js API route that proxies requests to Ollama
- Handles POST requests to `/api/chat` and forwards to Ollama's chat endpoint

**Type Definitions:**
- `types/chat.ts` - TypeScript interfaces for Message, ChatRequest, and ChatResponse

**Integration Flow:**
1. User submits message in frontend
2. Frontend calls `/api/chat` with message history
3. API route forwards to Ollama (`http://localhost:11434/api/chat`)
4. Ollama response is returned to frontend and displayed

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build application with Turbopack
npm run build

# Start production server
npm start
```

## Environment Configuration

The application uses these environment variables (optional, with defaults):

- `OLLAMA_URL` - Ollama API endpoint (default: `http://localhost:11434/api/chat`)
- `MODEL_NAME` - Model to use (default: `deepseek-r1:1.5b`)

Create `.env.local` to override defaults.

## Ollama Setup Requirements

Before running the application:

1. Install Ollama from https://ollama.com/
2. Pull and run a model: `ollama run deepseek-r1:1.5b`
3. Verify Ollama is running: `curl http://localhost:11434/api/tags`

## Key Dependencies

- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling framework with PostCSS plugin

## Code Patterns

- Uses client-side components (`'use client'`) for interactive chat UI
- State management with React hooks (useState for messages and loading states)
- Error handling in both frontend and API routes
- TypeScript throughout with strict configuration
- Path alias `@/*` maps to project root

## Testing & Quality

No specific test commands are configured. When adding tests, update this file with the appropriate commands.
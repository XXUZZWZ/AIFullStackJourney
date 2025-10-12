# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PhoneGPT is a Next.js-based RAG (Retrieval-Augmented Generation) application that provides intelligent answers about smartphones using OpenAI embeddings and Supabase vector database.

## Architecture

### Core Components

- **Frontend**: Next.js 15 with React 19, using the App Router
- **AI Integration**: Uses `@ai-sdk/react` and `@ai-sdk/openai` for chat functionality and embeddings
- **Vector Database**: Supabase with pgvector for storing and searching document embeddings
- **Web Scraping**: LangChain with Puppeteer and Cheerio for content extraction
- **UI**: shadcn/ui components with Tailwind CSS

### Key Files

- `app/page.tsx` - Main chat interface using `useChat` hook
- `app/api/chat/route.ts` - API endpoint handling chat requests with RAG pipeline
- `seed.ts` - Data ingestion script for scraping and vectorizing web content
- `setUp.sql` - Database schema for vector storage and similarity search
- `components/ChatInput/ChatInput.tsx` - Chat input component
- `components/ChatOutput/ChatOutput.tsx` - Chat output with markdown rendering

### RAG Pipeline Flow

1. User submits a question through `ChatInput`
2. `route.ts` generates embeddings for the user's question
3. Supabase `get_relevant_chunks` function retrieves similar content using vector similarity
4. Context is injected into the prompt for GPT-4o-mini
5. Streamed response is displayed in `ChatOutput` with markdown support

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle with Turbopack
- `npm start` - Start production server
- `npm run seed` - Run data ingestion to populate vector database

## Environment Setup

Required environment variables:
- `OPENAI_API_KEY` - OpenAI API key
- `OPENAI_API_BASE_URL` - OpenAI base URL (optional)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase service role key

## Database Setup

1. Run the SQL commands in `setUp.sql` in your Supabase SQL editor
2. This creates the `chunks` table with vector support and similarity search function
3. Run `npm run seed` to populate the database with smartphone data

## Key Dependencies

- **AI/ML**: `ai`, `@ai-sdk/openai`, `@ai-sdk/react` for LLM integration
- **Vector DB**: `@supabase/supabase-js` for vector storage and search
- **Scraping**: `langchain`, `@langchain/community`, `puppeteer` for content extraction
- **UI**: `shadcn`, `tailwindcss`, `react-markdown` for interface components

## Development Notes

- The application uses Turbopack for faster builds and development
- Web scraping in `seed.ts` has fallback mechanisms: Puppeteer → Cheerio → fetch
- Vector embeddings use OpenAI's `text-embedding-3-small` model (1536 dimensions)
- Similarity search uses cosine similarity with configurable threshold (default 0.7)
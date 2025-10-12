# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project that implements a **conditional tree rendering system**. The core purpose is to create a reusable, recursive tree component that can dynamically render any hierarchical data structure based on conditions, with complete separation of logic and presentation.

## Key Architecture

### Core Components

**TreeNode Interface** (`src/NodeDate.ts`)
- Generic interface `TreeNode<T>` that defines the tree structure
- Each node contains:
  - `id`: Unique identifier
  - `condition`: Optional function to determine if node should render
  - `render`: Function that returns the visual representation
  - `children`: Optional array of child nodes for recursion

**ConditionalTree Component** (`src/ConditionalTree.tsx`)
- Main component responsible for recursive tree rendering
- Takes generic data and TreeNode configuration
- Currently incomplete - needs implementation

**App Component** (`src/App.tsx`)
- Demonstrates usage with a sample tree structure
- Defines `MyData` interface with `type` and `value` properties
- Shows conditional rendering based on data type and value thresholds

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Tech Stack

- React 19.1.0
- TypeScript 5.8.3
- Vite 6.3.5 (build tool)
- ESLint with typescript-eslint and react-hooks plugins

## Project Pattern

The codebase follows a **data-driven rendering pattern**:
1. Define a data interface (e.g., `MyData`)
2. Create a tree configuration using `TreeNode<T>[]` with conditions and render functions
3. Pass data through the tree structure
4. Each node evaluates its condition and recursively processes children

This allows for highly flexible, reusable tree structures where the same component can handle different data types and rendering logic without modification.

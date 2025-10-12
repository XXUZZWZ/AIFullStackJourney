# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "今天吃点啥？" (What to Eat Today?) - a food recommendation web application built with vanilla JavaScript, HTML, and CSS. The project is a single-page application that helps users solve the daily dilemma of "what should I eat" through random recommendations and AI assistance.

## Project Structure

- `index.html` - Main HTML file with the complete UI structure
- `index.css` - All CSS styles for the application (17KB styling file)
- `index.js` - Core JavaScript functionality (26KB main script)
- `readme.md` - Project documentation in Chinese

## Architecture

### Core Components

1. **Food Database**: Array of 200+ food items with categories (中式, 西式, 日式, 韩式, 东南亚式, etc.)
2. **Random Recommendation Engine**: JavaScript-based random selection with filtering
3. **AI Chat Assistant**: Integration with language models (DeepSeek/OpenAI APIs)
4. **Wishlist Management**: localStorage-based persistence for user's "want to eat" list
5. **Filtering System**: Category-based food filtering functionality

### Key Features

- Random food recommendations from 200+ items
- AI-powered personalized suggestions
- Food type filtering (Chinese, Western, Japanese, Korean, Southeast Asian)
- Wishlist functionality with local storage
- Food sharing capabilities
- Responsive design with animations

## Development Guidelines

### No Build Process
This is a vanilla JavaScript project with no build tools or package managers. All files are served directly to the browser.

### File Organization
- All code is contained in three main files (HTML, CSS, JS)
- External dependencies loaded via CDN (Font Awesome icons)
- No module system - all JavaScript is in global scope

### AI Integration
The project integrates with language model APIs for the AI assistant feature. API configurations are handled in the JavaScript file.

### Data Management
- Food data is stored as a JavaScript array in `index.js`
- User preferences saved to localStorage
- No backend database required

### Styling Approach
- Modern CSS with flexbox and animations
- Chinese typography optimizations
- Mobile-responsive design
- Icon integration via Font Awesome CDN

## Development Commands

Since this is a vanilla HTML/CSS/JS project:

- **Local Development**: Open `index.html` in a web browser or serve via local HTTP server
- **Testing**: Manual testing in browser - no automated test suite
- **Deployment**: Copy files to any static web hosting service

## Code Conventions

- Chinese language for food names and UI text
- Camelcase for JavaScript variables and functions
- CSS classes use kebab-case
- Comments and documentation in Chinese
- ES6+ JavaScript features used throughout

## External Dependencies

- Font Awesome 5.15.4 (via CDN)
- Language model API (DeepSeek or OpenAI) for AI features
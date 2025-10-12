# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an algorithm implementation directory focused on linked list cycle detection (环形链表). The codebase contains a JavaScript implementation of the Floyd's cycle detection algorithm.

## Key Files

- `1.js` - Contains the `hasCycle` function that detects cycles in linked lists using a flag-based approach
- `readme.md` - Chinese documentation explaining the algorithm concept

## Algorithm Implementation

The `hasCycle` function in `1.js:1-10` implements cycle detection by:
- Iterating through the linked list
- Marking visited nodes with a `flag` property
- Returning `true` if a node with the flag is encountered (indicating a cycle)
- Returning `false` if the end of the list is reached

## Development Notes

- This is a standalone algorithm implementation with no dependencies
- The code uses a simple flag-based approach rather than the more common two-pointer (Floyd's) algorithm
- No build system or testing framework is currently configured
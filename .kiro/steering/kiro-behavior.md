# Kiro AI Behavior

## How Kiro Should Work in This Project

This steering file tells Kiro how to behave when helping with this project.

## General Rules

- Always read existing files before editing them — never overwrite working code without understanding it first
- Preserve all existing functionality when making UI or style changes
- Do not introduce new dependencies without checking `tech-stack.md` first
- Keep changes minimal and focused — only change what is necessary
- Never add features that were not requested

## Code Changes

- Match the existing code style (CommonJS on server, ES modules on client, plain CSS)
- Do not convert files to TypeScript
- Do not add test files unless explicitly asked
- When editing CSS, update `client/src/index.css` — do not create separate CSS files
- When editing components, preserve all existing props, event handlers, and logic

## File Writing on Windows

- This project runs on **Windows with PowerShell**
- When writing files via PowerShell, always use `[System.IO.File]::WriteAllText(path, content, UTF8)` to avoid encoding issues
- Never use PowerShell heredoc `@'...'@` for files containing curly braces — use string arrays joined with `` `n `` instead
- `&&` is not a valid command separator in PowerShell — use `;` instead

## State Architecture

All chat state lives in `App.jsx`:
- `messages` — array of `{ id, role: 'user'|'bot', content }` for UI rendering
- `history` — array of `{ role: 'user'|'model', parts: [{ text }] }` sent to backend
- `isLoading` — boolean, true while waiting for API response
- `errorMessage` — string or null, shown in ErrorBanner
- `inputKey` — integer, incremented to remount MessageInput (clears textarea on success, preserves on error)

Do not move state out of `App.jsx` without a strong reason.

## UI/UX Principles

- Dark theme using CSS custom properties defined in `:root`
- Accent color: `#7c6af7` (purple)
- Bot responses render Markdown via `react-markdown`
- Message input is a textarea that auto-resizes up to 5 lines
- Enter sends, Shift+Enter inserts newline
- All animations use `fadeUp` keyframe (subtle, fast)
- Do not add neon glows, heavy gradients, or sci-fi effects

## When Asked to Redesign the UI

- Never remove the empty state (`EmptyState.jsx`) or suggestion chips
- Never remove the error banner functionality
- Never remove the loading indicator
- Always preserve the composer area structure (textarea + send button)
- Always keep the header with the Nova AI brand and clear button

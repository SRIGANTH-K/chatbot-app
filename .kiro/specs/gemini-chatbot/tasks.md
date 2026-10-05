# Implementation Plan: gemini-chatbot

## Overview

Build a minimal ChatGPT-style chatbot with a React frontend and a Node.js/Express backend that proxies to the Google Gemini API.

---

## Tasks

- [x] 1. Scaffold the project structure
  - Create `chatbot-app/` root with `client/` and `server/` sub-directories
  - Add `.gitignore` (excludes `node_modules/`, `.env`, `dist/`) and a `README.md` with setup instructions
  - _Requirements: 6.1_

- [x] 2. Build the Express backend server
  - Create `server/index.js`: load `.env`, validate `GEMINI_API_KEY` (log named variable and exit 1 if absent), configure CORS, listen on port 3001
  - Install `express`, `dotenv`, `cors`, `@google/generative-ai` via `npm init` inside `server/`
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 3. Build the Gemini client service
  - Create `server/services/geminiClient.js`: instantiate `GoogleGenerativeAI`, export `getChatReply(message, history)` using `model.startChat({ history })` then `chat.sendMessage(message)`
  - _Requirements: 1.2, 1.3, 3.3_

- [x] 4. Build the chat route
  - Create `server/routes/chat.js` and register it in `index.js`; validate `message` is a non-empty string (→ 400), call `getChatReply`, return `{ reply }` on success, map Gemini errors to 502
  - Add global error middleware in `index.js` that logs the full error and returns `500 { error: 'Internal server error' }` without leaking details
  - _Requirements: 1.3, 5.1, 5.5, 6.5_

- [x] 5. Build the frontend API utility
  - Bootstrap the Vite+React project in `client/` and configure the `/api` proxy to `http://localhost:3001` in `vite.config.js`
  - Create `client/src/api/chatApi.js`: export `sendMessage(message, history, signal)` that POSTs `{ message, history }` to `/api/chat` with an `AbortController` signal, throws on non-OK, returns `reply`
  - _Requirements: 1.1, 1.7, 5.2, 7.1_

- [x] 6. Build the UI components
  - Create `MessageBubble.jsx` (right-aligned user, left-aligned bot, distinct CSS classes), `LoadingIndicator.jsx` (animated dots, `aria-live="polite"`), `ErrorBanner.jsx` (`<div role="alert">`, hidden when `message` is null), `ChatWindow.jsx` (scrollable list with auto-scroll on new messages), and `MessageInput.jsx` (auto-resize textarea, Enter to send, Shift+Enter for newline, 2000-char limit, disabled while loading)
  - Create `client/src/hooks/useAutoResize.js` for the textarea height hook (max 5 lines)
  - _Requirements: 1.5, 2.1, 2.2, 2.3, 2.4, 5.2, 5.3, 7.1, 7.2, 7.3, 7.4, 7.6_

- [x] 7. Wire everything together in `App.jsx`
  - Own `messages`, `history`, `isLoading`, `errorMessage` state; implement `handleSend` (append user message, call `sendMessage` with 30s `AbortController` timeout, append bot reply or set error, update history, preserve input on error) and `handleClear` (reset all state, return focus to input)
  - Implement history management inline: map `'bot'→'model'` for `HistoryEntry`, enforce 100-entry cap with oldest-first eviction; disable Clear button while loading or when messages is empty; place focus on `MessageInput` on mount
  - _Requirements: 1.1, 1.4, 1.5, 1.6, 1.7, 3.1, 3.2, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 5.2, 5.4, 5.6, 7.5_

- [x] 8. Add CSS styling
  - Create `client/src/index.css` with a base reset and clean typography
  - Style user and bot bubbles with distinct backgrounds and alignment (not color alone); add layout styles for the full-height chat window and fixed input row
  - _Requirements: 7.1, 7.4_

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2"] },
    { "id": 2, "tasks": ["3"] },
    { "id": 3, "tasks": ["4", "5"] },
    { "id": 4, "tasks": ["6"] },
    { "id": 5, "tasks": ["7"] },
    { "id": 6, "tasks": ["8"] }
  ]
}
```

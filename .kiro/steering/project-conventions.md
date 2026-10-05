# Project Conventions

## Project Overview

This is a minimal ChatGPT-style chatbot called **Nova AI** built with:
- **Frontend**: React (Vite) in `client/`
- **Backend**: Node.js + Express in `server/`
- **AI**: Groq API (`openai/gpt-oss-120b` model) via `groq-sdk`

## File Structure

```
chatbot-app/
├── client/                        # React (Vite) frontend
│   └── src/
│       ├── api/chatApi.js         # fetch wrapper with AbortController
│       ├── components/
│       │   ├── App.jsx            # root component, owns all state
│       │   ├── ChatWindow.jsx     # scrollable message list
│       │   ├── MessageBubble.jsx  # single chat message
│       │   ├── MessageInput.jsx   # textarea + send button
│       │   ├── LoadingIndicator.jsx
│       │   ├── ErrorBanner.jsx
│       │   └── EmptyState.jsx     # shown when no messages
│       ├── hooks/useAutoResize.js # textarea auto-resize
│       └── index.css              # all styles (no CSS Modules)
└── server/
    ├── index.js                   # Express entry, env validation
    ├── routes/chat.js             # POST /api/chat
    ├── services/geminiClient.js   # Groq SDK wrapper
    └── .env                       # GROQ_API_KEY (never commit)
```

## Naming Conventions

- **Components**: PascalCase — `MessageBubble.jsx`, `ChatWindow.jsx`
- **Hooks**: camelCase prefixed with `use` — `useAutoResize.js`
- **Utilities/API**: camelCase — `chatApi.js`, `historyUtils.js`
- **CSS classes**: BEM-like kebab-case — `.msg-bubble`, `.msg-bubble--user`, `.composer__input`
- **Variables**: camelCase — `inputText`, `isLoading`, `errorMessage`
- **Constants**: SCREAMING_SNAKE_CASE — `MAX_CHARS`, `MAX_HISTORY`

## Code Style

- Use `'use strict'` at the top of all server-side JS files
- Use CommonJS (`require`/`module.exports`) in the server
- Use ES modules (`import`/`export`) in the client
- No TypeScript — plain JavaScript throughout
- No CSS Modules — all styles in `client/src/index.css`
- Keep components small and focused — one responsibility per file
- Add comments only where they clarify non-obvious logic

## Git Rules

- Never commit `.env` files
- `.env` is listed in `.gitignore`
- Use `.env.example` to document required environment variables

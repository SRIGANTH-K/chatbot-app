# Build and Run Instructions

## Prerequisites

- Node.js v18 or later
- npm v9 or later
- A Groq API key (free at https://console.groq.com/keys)

## Environment Setup

Create `server/.env` with your Groq API key:

```
GROQ_API_KEY=gsk_your_key_here
```

The server will refuse to start and log an error if `GROQ_API_KEY` is missing or empty.

## Install Dependencies

```powershell
# Backend
cd server
npm install

# Frontend (new terminal)
cd client
npm install
```

## Running the App (Development)

You need **two terminals running simultaneously**.

**Terminal 1 — Backend (port 3001)**
```powershell
cd server
node index.js
```

Expected output:
```
Server listening on http://localhost:3001
```

**Terminal 2 — Frontend (port 5173)**
```powershell
cd client
npm run dev
```

Then open http://localhost:5173 in your browser.

## How the Proxy Works

The Vite dev server proxies all `/api/*` requests to `http://localhost:3001`.
This means the frontend calls `/api/chat` and Vite forwards it to Express automatically — no CORS issues.

## Production Build

```powershell
cd client
npm run build
```

Output goes to `client/dist/`. The backend can serve these static files or they can be deployed to any static host.

## Common Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| Server exits immediately | `GROQ_API_KEY` missing in `.env` | Add key to `server/.env` |
| `404 /api/chat` in browser | Backend not running | Start `node index.js` in `server/` |
| Port 5173 already in use | Another Vite instance running | Vite will auto-pick 5174 — that's fine |
| `API key not valid` error | Wrong or expired Groq key | Get a new key at console.groq.com/keys |
| Model not found error | Model ID changed or not on free plan | Check approved models in `tech-stack.md` |

## Key Files Reference

| File | Purpose |
|------|---------|
| `server/.env` | API key — never commit |
| `server/.env.example` | Template showing required variables |
| `server/index.js` | Express server entry point |
| `server/routes/chat.js` | `POST /api/chat` handler |
| `server/services/geminiClient.js` | Groq SDK wrapper + system prompt |
| `client/vite.config.js` | Vite config with `/api` proxy |
| `client/src/App.jsx` | Root component, owns all state |
| `client/src/index.css` | All CSS styles |

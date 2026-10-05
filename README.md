# Gemini Chatbot

A minimal ChatGPT-style chatbot built with React (Vite) on the frontend and Node.js/Express on the backend. The backend securely proxies requests to the Google Gemini API so the API key is never exposed to the browser.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later (bundled with Node.js)
- A Google Gemini API key (see below)

---

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **Create API key** and copy the generated key.

---

## Configuration

Create a `.env` file inside the `server/` directory:

```bash
# server/.env
GEMINI_API_KEY=your_api_key_here
```

> **Important:** The `.env` file is git-ignored and must never be committed. The server will refuse to start if `GEMINI_API_KEY` is absent or empty.

---

## Install Dependencies

Install dependencies for both the backend and the frontend:

```bash
# Backend
cd server
npm install

# Frontend (open a new terminal tab)
cd client
npm install
```

---

## Running the Application

You need two terminal windows running simultaneously.

**Terminal 1 — Backend (port 3001)**

```bash
cd server
node index.js
```

You should see:

```
Server listening on port 3001
```

**Terminal 2 — Frontend (port 5173)**

```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to start chatting.

---

## Project Structure

```
chatbot-app/
├── client/          # React (Vite) frontend
├── server/          # Node.js / Express backend
├── .gitignore
└── README.md
```

---

## How It Works

1. The React app sends `POST /api/chat` with the user's message and session history.
2. The Vite dev server proxies `/api` requests to `http://localhost:3001`.
3. The Express backend validates the request, calls the Gemini API via the official SDK, and returns the response text.
4. Conversation history is held in React state and reset on page reload or when the user clicks **Clear chat**.

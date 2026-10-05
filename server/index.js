'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

// ---------------------------------------------------------------------------
// Validate required environment variables before doing anything else.
// Requirement 6.2, 6.3 — refuse to start if GROQ_API_KEY is missing.
// ---------------------------------------------------------------------------
const key = process.env.GROQ_API_KEY;
if (!key) {
  console.error('Missing required environment variable: GROQ_API_KEY');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// Allow requests from the Vite dev server (localhost:5173) and the same
// origin when the frontend is served statically from the backend.
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Chat route — implemented in task 4.
const chatRouter = require('./routes/chat');
app.use('/api/chat', chatRouter);

// ---------------------------------------------------------------------------
// Global error-handling middleware (must have 4 parameters so Express
// recognises it as an error handler).
// Requirement 5.5 — log full error, respond with generic 500 message.
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[Unhandled]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

module.exports = app; // exported for testing purposes


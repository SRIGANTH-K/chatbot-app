'use strict';

// ---------------------------------------------------------------------------
// POST /api/chat
// ---------------------------------------------------------------------------

const express = require('express');
const { getChatReply } = require('../services/geminiClient');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'message is required' });
  }

  // Convert frontend history format to Groq format.
  // Frontend sends: { role: 'user'|'model', parts: [{text}] }
  // Groq expects:   { role: 'user'|'assistant', content: string }
  const safeHistory = Array.isArray(history)
    ? history.map((entry) => ({
        role: entry.role === 'model' ? 'assistant' : entry.role,
        content: Array.isArray(entry.parts)
          ? entry.parts.map((p) => p.text).join('')
          : entry.content || '',
      }))
    : [];

  try {
    const reply = await getChatReply(message, safeHistory);
    return res.status(200).json({ reply });
  } catch (err) {
    const errMsg = err?.message || 'API returned an unexpected error.';
    if (err?.status || err?.statusCode || err?.code) {
      return res.status(502).json({ error: errMsg });
    }
    return next(err);
  }
});

module.exports = router;

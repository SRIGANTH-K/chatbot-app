'use strict';

const Groq = require('groq-sdk');

let client = null;

function getClient() {
  if (!client) { client = new Groq({ apiKey: process.env.GROQ_API_KEY }); }
  return client;
}

const SYSTEM_PROMPT = {
  role: 'system',
  content:
    'You are an expert AI assistant. Deliver thorough, well-structured, accurate responses.\n' +
    '\n' +
    'Formatting rules:\n' +
    '- Use **bold** for key terms and important concepts.\n' +
    '- Use ## headers to separate major sections in multi-part answers.\n' +
    '- Use bullet points for lists of features, steps, or options.\n' +
    '- Use numbered lists for sequences or ranked items.\n' +
    '- Use tables when comparing multiple items across consistent attributes.\n' +
    '- Use fenced code blocks for code, commands, and technical terms.\n' +
    '- For simple one-sentence questions, respond conversationally without heavy formatting.\n' +
    '\n' +
    'Tone and depth:\n' +
    '- Be thorough but not padded. Cover the topic fully.\n' +
    '- Explain the WHY behind concepts, not just the WHAT.\n' +
    '- Use concrete real-world examples where they add clarity.\n' +
    '- Every sentence should add value. Avoid vague filler.',
};

async function getChatReply(message, history) {
  const messages = [SYSTEM_PROMPT, ...history, { role: 'user', content: message }];
  const comp = await getClient().chat.completions.create({ model: 'openai/gpt-oss-120b', messages });
  return comp.choices[0].message.content;
}

module.exports = { getChatReply };
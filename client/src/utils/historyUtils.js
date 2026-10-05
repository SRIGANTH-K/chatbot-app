// Pure utility functions extracted from App.jsx for testing.
// Feature: gemini-chatbot

export const MAX_HISTORY = 100;
export const MAX_CHARS   = 2000;

/**
 * Convert a UI role + content into a HistoryEntry (Groq/Gemini format).
 * Maps 'bot' -> 'model' to match the API contract.
 */
export function buildHistoryEntry(role, content) {
  return {
    role: role === 'bot' ? 'model' : role,
    parts: [{ text: content }],
  };
}

/**
 * Append a user + bot pair to the history array.
 * Evicts the oldest entry when the 100-entry cap is exceeded.
 */
export function appendHistoryPair(prev, userText, botText) {
  const next = [
    ...prev,
    buildHistoryEntry('user', userText),
    buildHistoryEntry('bot',  botText),
  ];
  while (next.length > MAX_HISTORY) next.shift();
  return next;
}

/**
 * Returns true when the message is valid for sending:
 * - at least one non-whitespace character
 * - does not exceed MAX_CHARS
 */
export function isValidMessage(text) {
  return typeof text === 'string' &&
    text.trim().length > 0 &&
    text.length <= MAX_CHARS;
}

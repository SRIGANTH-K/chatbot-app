/**
 * Sends a chat message to the backend and returns the Gemini reply.
 *
 * @param {string} message - The user's message text.
 * @param {Array<{role: string, parts: Array<{text: string}>}>} history - Session history in Gemini SDK format.
 * @param {AbortSignal} signal - AbortController signal for timeout cancellation.
 * @returns {Promise<string>} The reply text from the Gemini API.
 * @throws {Error} If the request fails or the server returns a non-OK status.
 */
export async function sendMessage(message, history, signal) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
    signal,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Request failed');
  }

  const { reply } = await response.json();
  return reply;
}

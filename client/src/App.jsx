import { useState, useCallback } from 'react';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import ErrorBanner from './components/ErrorBanner';
import EmptyState from './components/EmptyState';
import { sendMessage } from './api/chatApi';

const MAX_HISTORY = 100;

function buildHistoryEntry(role, content) {
  return {
    role: role === 'bot' ? 'model' : role,
    parts: [{ text: content }],
  };
}

function appendHistoryPair(prev, userText, botText) {
  const next = [...prev, buildHistoryEntry('user', userText), buildHistoryEntry('bot', botText)];
  while (next.length > MAX_HISTORY) next.shift();
  return next;
}

function App() {
  const [messages,     setMessages]     = useState([]);
  const [history,      setHistory]      = useState([]);
  const [isLoading,    setIsLoading]    = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [inputKey,     setInputKey]     = useState(0);

  const handleSend = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setErrorMessage(null);

    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 30_000);

    try {
      const reply = await sendMessage(trimmed, history, controller.signal);
      const botMsg = { id: crypto.randomUUID(), role: 'bot', content: reply };
      setMessages((prev) => [...prev, botMsg]);
      setHistory((prev) => appendHistoryPair(prev, trimmed, reply));
      setInputKey((k) => k + 1);
    } catch (err) {
      if (err.name === 'AbortError') {
        setErrorMessage('Request timed out. Please try again.');
      } else {
        setErrorMessage(err.message || 'Something went wrong.');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, [history, isLoading]);

  const handleClear = useCallback(() => {
    setMessages([]);
    setHistory([]);
    setErrorMessage(null);
    setInputKey((k) => k + 1);
  }, []);

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__logo" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="app-header__title">Nova AI</span>
          <span className="app-header__badge">Beta</span>
        </div>
        <button
          className="clear-button"
          onClick={handleClear}
          disabled={isLoading || messages.length === 0}
          aria-label="Clear chat"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          New chat
        </button>
      </header>

      {/* Conversation area */}
      <main className="app-main">
        {isEmpty ? (
          <EmptyState onSuggestion={handleSend} />
        ) : (
          <ChatWindow messages={messages} isLoading={isLoading} />
        )}
      </main>

      {/* Bottom composer */}
      <div className="composer-area">
        <ErrorBanner message={errorMessage} />
        <MessageInput key={inputKey} onSend={handleSend} isLoading={isLoading} />
        <p className="composer-hint">Nova can make mistakes. Verify important info.</p>
      </div>
    </div>
  );
}

export default App;

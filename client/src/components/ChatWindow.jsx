import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

/**
 * Scrollable message list container.
 *
 * Props:
 *   messages   — Message[] ({ id, role, content })
 *   isLoading  — boolean; shows LoadingIndicator when true
 *
 * Auto-scrolls to the bottom whenever messages changes or isLoading changes,
 * so the latest message (or the loading indicator) is always visible.
 */
function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div className="chat-window" aria-label="Conversation">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
      ))}

      {isLoading && <LoadingIndicator />}

      {/* Invisible anchor that we scroll into view */}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;

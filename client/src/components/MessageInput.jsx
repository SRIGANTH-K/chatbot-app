import { useState } from 'react';
import { useAutoResize } from '../hooks/useAutoResize';

const MAX_CHARS = 2000;

function MessageInput({ onSend, isLoading }) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useAutoResize(inputText, 5);

  const isOverLimit = inputText.length > MAX_CHARS;
  const canSend = !isLoading && inputText.trim().length > 0 && !isOverLimit;

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isLoading || inputText.trim().length === 0) return;
      onSend(inputText);
    }
  }

  return (
    <div className="composer">
      <div className="composer__inner">
        <textarea
          ref={textareaRef}
          className="composer__input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Message Nova AI..."
          rows={1}
          maxLength={MAX_CHARS + 1}
          aria-label="Message input"
          autoFocus
        />
        <button
          className={"composer__send" + (canSend ? ' composer__send--active' : '')}
          onClick={() => canSend && onSend(inputText)}
          disabled={!canSend}
          aria-label="Send message"
        >
          {isLoading ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
      {isOverLimit && (
        <p className="composer__limit-warning">{inputText.length}/{MAX_CHARS} characters</p>
      )}
    </div>
  );
}

export default MessageInput;
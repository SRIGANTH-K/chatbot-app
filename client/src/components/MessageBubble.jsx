import ReactMarkdown from 'react-markdown';

function MessageBubble({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={"msg-row " + (isUser ? 'msg-row--user' : 'msg-row--bot')}>
      {!isUser && (
        <div className="msg-avatar msg-avatar--bot" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      <div className={"msg-bubble " + (isUser ? 'msg-bubble--user' : 'msg-bubble--bot')}>
        {isUser ? (
          <span className="msg-text">{content}</span>
        ) : (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
      </div>
      {isUser && (
        <div className="msg-avatar msg-avatar--user" aria-hidden="true">U</div>
      )}
    </div>
  );
}

export default MessageBubble;
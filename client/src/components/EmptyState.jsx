const SUGGESTIONS = [
  'Explain quantum computing simply',
  'Write a Python script to sort a list',
  'What are REST API best practices?',
  'Help me debug my JavaScript code',
];

function EmptyState({ onSuggestion }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 className="empty-state__heading">How can I help you today?</h2>
      <p className="empty-state__sub">Ask me anything about code, concepts, writing, or analysis.</p>
      <div className="empty-state__suggestions">
        {SUGGESTIONS.map((s) => (
          <button key={s} className="suggestion-chip" onClick={() => onSuggestion(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmptyState;
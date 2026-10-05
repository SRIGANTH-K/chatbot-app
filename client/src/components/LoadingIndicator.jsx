function LoadingIndicator() {
  return (
    <div className="msg-row msg-row--bot" aria-live="polite" aria-label="Loading response">
      <div className="msg-avatar msg-avatar--bot" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="msg-bubble msg-bubble--bot loading-bubble">
        <span className="loading-dot" />
        <span className="loading-dot" />
        <span className="loading-dot" />
      </div>
    </div>
  );
}

export default LoadingIndicator;
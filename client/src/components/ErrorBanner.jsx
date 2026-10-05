function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="error-banner">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{flexShrink:0,marginTop:'1px'}}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      {message}
    </div>
  );
}

export default ErrorBanner;

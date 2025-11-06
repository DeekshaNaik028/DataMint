import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1>
          <div className="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18"></path>
              <path d="M18 17V9"></path>
              <path d="M13 17V5"></path>
              <path d="M8 17v-3"></path>
            </svg>
          </div>
          Data Analytics Platform
        </h1>
        <p>AI-Powered Insights | ML Predictions | Interactive Analytics</p>
      </div>
    </header>
  );
}

export default Header;
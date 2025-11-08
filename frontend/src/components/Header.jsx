import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1>
          <div className="header-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
              {/* Mint Leaf */}
              <path d="M16 6 C13 6, 10 9, 10 13 C10 17, 13 20, 16 20 C19 20, 22 17, 22 13 C22 9, 19 6, 16 6Z" fill="rgba(255,255,255,0.2)"/>
              {/* Chart Line */}
              <path d="M6 24 L10 20 L16 22 L22 16 L26 20" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <circle cx="6" cy="24" r="2" fill="white"/>
              <circle cx="10" cy="20" r="2" fill="white"/>
              <circle cx="16" cy="22" r="2" fill="white"/>
              <circle cx="22" cy="16" r="2" fill="white"/>
              <circle cx="26" cy="20" r="2" fill="white"/>
            </svg>
          </div>
          DataMint
        </h1>
        <p>AI-Powered Insights | ML Predictions | Interactive Analytics</p>
      </div>
    </header>
  );
}

export default Header;
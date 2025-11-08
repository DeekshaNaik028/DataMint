import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

function AIInsights() {
  const [insights, setInsights] = useState([]);
  const { loading, error, handleRequest, analyticsAPI } = useData();
  const { dataLoaded } = useDataContext();

  useEffect(() => {
    if (dataLoaded) {
      loadInsights();
    }
  }, [dataLoaded]);

  const loadInsights = async () => {
    try {
      const result = await handleRequest(() => analyticsAPI.getInsights());
      setInsights(result);
    } catch (err) {
      console.error('Failed to load insights:', err);
    }
  };

  const getIconForInsight = (emoji) => {
    const iconMap = {
      '💰': (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path>
        </svg>
      ),
      '👥': (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
          <path d="M16 3.13a4 4 0 010 7.75"></path>
        </svg>
      ),
      '📦': (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      '✅': (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      '🔍': (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
        </svg>
      ),
      '🌍': (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
        </svg>
      )
    };
    return iconMap[emoji] || iconMap['🔍'];
  };

  if (!dataLoaded) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </div>
          <h2>AI-Powered Insights</h2>
        </div>
        <div className="alert alert-info">
          Load and clean data to generate AI insights
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </div>
          <h2>AI-Powered Insights</h2>
        </div>
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: '#64748b' }}>
            Analyzing data patterns...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
          </svg>
        </div>
        <h2>AI-Powered Insights</h2>
      </div>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Automated business insights generated from your data analysis
      </p>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {insights.length === 0 ? (
        <div className="alert alert-warning">
          No insights generated. Try loading more data or cleaning your dataset.
        </div>
      ) : (
        <div className="insights-list">
          {insights.map((insight, idx) => (
            <div key={idx} className="insight-item">
              <div className="insight-icon-wrapper">
                {getIconForInsight(insight.icon)}
              </div>
              <div className="insight-content">
                <p className="insight-text">{insight.text}</p>
                <div className="insight-confidence">
                  <strong>Confidence:</strong> {insight.confidence}%
                  <div className="confidence-bar">
                    <div
                      className="confidence-fill"
                      style={{
                        width: `${insight.confidence}%`,
                        background: insight.confidence > 80 ? '#10b981' : '#f59e0b',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
        <strong>How it works:</strong> Our AI analyzes data patterns, distributions, 
        correlations, and quality metrics to generate actionable business insights automatically.
      </div>
    </div>
  );
}

export default AIInsights;
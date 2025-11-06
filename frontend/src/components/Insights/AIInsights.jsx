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

  if (!dataLoaded) {
    return (
      <div className="card">
        <h2>💡 AI-Powered Insights</h2>
        <div className="alert alert-info">
          Load and clean data to generate AI insights
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <h2>💡 AI-Powered Insights</h2>
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
      <h2>💡 AI-Powered Insights</h2>
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
              <div className="insight-icon">{insight.icon}</div>
              <div className="insight-content">
                <p className="insight-text">{insight.text}</p>
                <div className="insight-confidence">
                  <strong>Confidence:</strong> {insight.confidence}%
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      background: '#e2e8f0',
                      borderRadius: '2px',
                      marginTop: '0.3rem',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${insight.confidence}%`,
                        height: '100%',
                        background: insight.confidence > 80 ? '#10b981' : '#f59e0b',
                        borderRadius: '2px',
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
        <strong>ℹ️ How it works:</strong> Our AI analyzes data patterns, distributions, 
        correlations, and quality metrics to generate actionable business insights automatically.
      </div>
    </div>
  );
}

export default AIInsights;
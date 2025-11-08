import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const { loading, error, handleRequest, mlAPI } = useData();
  const { dataLoaded } = useDataContext();

  useEffect(() => {
    if (dataLoaded) {
      loadRecommendations();
    }
  }, [dataLoaded]);

  const loadRecommendations = async () => {
    try {
      const result = await handleRequest(() => mlAPI.getRecommendations());
      setRecommendations(result);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    }
  };

  const getIconForRecommendation = (emoji) => {
    const iconMap = {
      '💰': (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path>
        </svg>
      ),
      '📊': (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
      '🔍': (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
        </svg>
      ),
      '📈': (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      )
    };
    return iconMap[emoji] || iconMap['📊'];
  };

  if (!dataLoaded) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </div>
          <h2>ML Recommendations</h2>
        </div>
        <div className="alert alert-info">
          Load data first to generate recommendations
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
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </div>
          <h2>ML Recommendations</h2>
        </div>
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: '#64748b' }}>
            Generating recommendations...
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
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
        </div>
        <h2>ML Recommendations</h2>
      </div>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Data-driven business recommendations powered by machine learning
      </p>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {recommendations.length === 0 ? (
        <div className="alert alert-warning">
          No recommendations available. Try loading more data.
        </div>
      ) : (
        <div className="grid-2">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '12px',
                border: '2px solid #cbd5e1',
              }}
            >
              <div style={{ 
                width: '56px', 
                height: '56px', 
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                {getIconForRecommendation(rec.icon)}
              </div>
              <h3 style={{ marginBottom: '0.8rem', color: '#1e293b' }}>
                {rec.title}
              </h3>
              <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1rem' }}>
                {rec.detail}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
                  Confidence:
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '6px',
                    background: '#e2e8f0',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${rec.confidence}%`,
                      height: '100%',
                      background: rec.confidence > 85
                        ? '#10b981'
                        : rec.confidence > 70
                        ? '#667eea'
                        : '#f59e0b',
                      borderRadius: '3px',
                    }}
                  ></div>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>
                  {rec.confidence}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="alert alert-success" style={{ marginTop: '1.5rem' }}>
        <strong>Pro Tip:</strong> These recommendations are generated by analyzing patterns 
        in your data including revenue trends, customer segments, product performance, and data quality. 
        Prioritize actions with higher confidence scores.
      </div>
    </div>
  );
}

export default Recommendations;
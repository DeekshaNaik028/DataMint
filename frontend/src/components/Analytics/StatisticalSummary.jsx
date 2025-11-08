import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

function StatisticalSummary() {
  const [summary, setSummary] = useState([]);
  const { loading, error, handleRequest, analyticsAPI } = useData();
  const { dataLoaded } = useDataContext();

  useEffect(() => {
    if (dataLoaded) {
      loadSummary();
    }
  }, [dataLoaded]);

  const loadSummary = async () => {
    try {
      const result = await handleRequest(() => analyticsAPI.getSummary());
      setSummary(result);
    } catch (err) {
      console.error('Failed to load summary:', err);
    }
  };

  if (!dataLoaded) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </div>
          <h2>Statistical Summary</h2>
        </div>
        <div className="alert alert-info">
          <span className="alert-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </span>
          Load data first to view statistical summary
        </div>
      </div>
    );
  }

  if (loading || summary.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </div>
          <h2>Statistical Summary</h2>
        </div>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
        </div>
        <h2>Statistical Summary</h2>
      </div>
      
      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Mean</th>
              <th>Median</th>
              <th>Std Dev</th>
              <th>Min</th>
              <th>Max</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((stat) => (
              <tr key={stat.field}>
                <td><strong>{stat.field}</strong></td>
                <td>{stat.mean.toFixed(2)}</td>
                <td>{stat.median.toFixed(2)}</td>
                <td>{stat.std.toFixed(2)}</td>
                <td>{stat.min.toFixed(2)}</td>
                <td>{stat.max.toFixed(2)}</td>
                <td>{stat.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StatisticalSummary;
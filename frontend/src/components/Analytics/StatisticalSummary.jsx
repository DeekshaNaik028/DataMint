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
        <h2>📈 Statistical Summary</h2>
        <div className="alert alert-info">
          Load data first to view statistical summary
        </div>
      </div>
    );
  }

  if (loading || summary.length === 0) {
    return (
      <div className="card">
        <h2>📈 Statistical Summary</h2>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>📈 Statistical Summary</h2>
      
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
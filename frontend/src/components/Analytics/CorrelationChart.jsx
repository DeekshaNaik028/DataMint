import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

function CorrelationChart() {
  const [correlation, setCorrelation] = useState(null);
  const { loading, error, handleRequest, analyticsAPI } = useData();
  const { dataLoaded } = useDataContext();

  useEffect(() => {
    if (dataLoaded) {
      loadCorrelation();
    }
  }, [dataLoaded]);

  const loadCorrelation = async () => {
    try {
      const result = await handleRequest(() => analyticsAPI.getCorrelation());
      setCorrelation(result);
    } catch (err) {
      console.error('Failed to load correlation:', err);
    }
  };

  const getCorrelationColor = (value) => {
    const intensity = Math.abs(value);
    if (value > 0) {
      return `rgba(16, 185, 129, ${intensity})`;
    } else {
      return `rgba(239, 68, 68, ${intensity})`;
    }
  };

  if (!dataLoaded) {
    return (
      <div className="card">
        <h2>🔗 Correlation Matrix</h2>
        <div className="alert alert-info">
          Load data first to view correlations
        </div>
      </div>
    );
  }

  if (loading || !correlation) {
    return (
      <div className="card">
        <h2>🔗 Correlation Matrix</h2>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (correlation.error) {
    return (
      <div className="card">
        <h2>🔗 Correlation Matrix</h2>
        <div className="alert alert-warning">{correlation.error}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>🔗 Correlation Matrix</h2>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ minWidth: '100%' }}>
          <thead>
            <tr>
              <th></th>
              {correlation.columns.map((col) => (
                <th key={col} style={{ minWidth: '80px' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {correlation.values.map((row, i) => (
              <tr key={i}>
                <td><strong>{correlation.columns[i]}</strong></td>
                {row.map((value, j) => (
                  <td
                    key={j}
                    style={{
                      background: getCorrelationColor(value),
                      textAlign: 'center',
                      fontWeight: '600',
                      color: Math.abs(value) > 0.5 ? 'white' : '#333',
                    }}
                  >
                    {value.toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
        <p>
          <span style={{ display: 'inline-block', width: '15px', height: '15px', background: 'rgba(16, 185, 129, 0.8)', marginRight: '5px' }}></span>
          Positive correlation
          <span style={{ display: 'inline-block', width: '15px', height: '15px', background: 'rgba(239, 68, 68, 0.8)', marginLeft: '15px', marginRight: '5px' }}></span>
          Negative correlation
        </p>
      </div>
    </div>
  );
}

export default CorrelationChart;
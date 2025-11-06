import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

function AnomalyDetection() {
  const [threshold, setThreshold] = useState(2.5);
  const [anomalies, setAnomalies] = useState(null);
  const { loading, error, handleRequest, mlAPI } = useData();
  const { dataLoaded } = useDataContext();

  const handleDetect = async () => {
    try {
      const result = await handleRequest(() => mlAPI.detectAnomalies(threshold));
      setAnomalies(result);
    } catch (err) {
      alert(`Detection failed: ${err.message}`);
    }
  };

  if (!dataLoaded) {
    return (
      <div className="card">
        <h2>🔍 Anomaly Detection</h2>
        <div className="alert alert-info">
          Load data first to detect anomalies
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>🔍 Anomaly Detection</h2>

      <div className="form-group">
        <label>Z-Score Threshold</label>
        <input
          type="number"
          className="form-control"
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value) || 2.5)}
          step="0.1"
          min="1"
          max="5"
        />
        <small style={{ color: '#64748b', marginTop: '0.3rem', display: 'block' }}>
          Higher threshold = fewer anomalies (recommended: 2.5-3.0)
        </small>
      </div>

      <button className="btn btn-primary" onClick={handleDetect} disabled={loading}>
        {loading ? 'Detecting...' : '🔍 Detect Anomalies'}
      </button>

      {error && (
        <div className="alert alert-error" style={{ marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {anomalies && (
        <>
          <div className="metric-card" style={{ marginTop: '1.5rem', textAlign: 'left' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {anomalies.anomaly_count === 0 ? '✅' : '⚠️'}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.3rem' }}>
              {anomalies.anomaly_count}
            </div>
            <div style={{ opacity: 0.95 }}>
              {anomalies.anomaly_count === 0
                ? 'No anomalies detected'
                : `Anomal${anomalies.anomaly_count === 1 ? 'y' : 'ies'} detected`}
            </div>
          </div>

          {anomalies.anomalies.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3>Detected Anomalies</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Value</th>
                      <th>Mean</th>
                      <th>Z-Score</th>
                      <th>Index</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anomalies.anomalies.map((anomaly, idx) => (
                      <tr key={idx}>
                        <td><strong>{anomaly.field}</strong></td>
                        <td>{anomaly.value.toFixed(2)}</td>
                        <td>{anomaly.mean.toFixed(2)}</td>
                        <td>
                          <span
                            style={{
                              padding: '0.2rem 0.5rem',
                              background: '#fee2e2',
                              color: '#991b1b',
                              borderRadius: '4px',
                              fontWeight: '600',
                            }}
                          >
                            {anomaly.zScore.toFixed(2)}
                          </span>
                        </td>
                        <td>Row {anomaly.index}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {anomalies.anomaly_count > 5 && (
                <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                  Showing first 5 anomalies per column. Total: {anomalies.anomaly_count}
                </p>
              )}
            </div>
          )}

          <div className="alert alert-info" style={{ marginTop: '1rem' }}>
            <strong>ℹ️ Method:</strong> Z-score statistical analysis. Values with |Z| &gt; {threshold} 
            are flagged as anomalies. Useful for detecting outliers and data quality issues.
          </div>
        </>
      )}
    </div>
  );
}

export default AnomalyDetection;
import React from 'react';
import { useDataContext } from '../../context/DataContext';

function CleaningResults() {
  const { cleaningResults } = useDataContext();

  if (!cleaningResults) {
    return null;
  }

  return (
    <div className="card">
      <h2>✅ Cleaning Results</h2>

      <div className="alert alert-success">
        <strong>Success!</strong> Data has been cleaned and is ready for analysis.
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{cleaningResults.missing_found}</div>
          <div className="metric-label">Missing Values Found</div>
        </div>

        <div className="metric-card success">
          <div className="metric-value">{cleaningResults.missing_filled}</div>
          <div className="metric-label">Values Filled</div>
        </div>

        <div className="metric-card warning">
          <div className="metric-value">{cleaningResults.duplicates_removed}</div>
          <div className="metric-label">Duplicates Removed</div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{cleaningResults.final_rows}</div>
          <div className="metric-label">Final Row Count</div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
        <p style={{ margin: 0, color: '#475569' }}>
          <strong>Strategy Used:</strong> {cleaningResults.strategy_used} | 
          <strong> Final Dimensions:</strong> {cleaningResults.final_rows} rows × {cleaningResults.final_columns} columns
        </p>
      </div>
    </div>
  );
}

export default CleaningResults;
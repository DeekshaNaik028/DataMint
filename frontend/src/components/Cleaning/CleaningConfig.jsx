import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

function CleaningConfig() {
  const [strategy, setStrategy] = useState('mean');
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [standardize, setStandardize] = useState(true);
  const { loading, error, handleRequest, cleaningAPI } = useData();
  const { dataLoaded, updateCleaningResults } = useDataContext();

  const handleClean = async () => {
    try {
      const result = await handleRequest(() =>
        cleaningAPI.cleanData({
          strategy,
          remove_duplicates: removeDuplicates,
          standardize_data: standardize,
        })
      );
      updateCleaningResults(result);
      alert('Data cleaned successfully!');
    } catch (err) {
      alert(`Cleaning failed: ${err.message}`);
    }
  };

  if (!dataLoaded) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"></path>
          </svg>
        </div>
        <h2>Cleaning Configuration</h2>
      </div>

      <div className="form-group">
        <label>Missing Value Strategy</label>
        <select
          className="form-control"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
        >
          <option value="mean">Mean Imputation</option>
          <option value="median">Median Imputation</option>
          <option value="mode">Mode (Most Frequent)</option>
          <option value="interpolation">Linear Interpolation</option>
          <option value="ml">ML-Based Prediction</option>
          <option value="remove">Remove Rows</option>
        </select>
        <small style={{ color: '#64748b', marginTop: '0.3rem', display: 'block' }}>
          {strategy === 'mean' && 'Fill missing values with column average (numeric only)'}
          {strategy === 'median' && 'Fill with middle value (better for outliers)'}
          {strategy === 'mode' && 'Fill with most frequent value (good for categorical)'}
          {strategy === 'interpolation' && 'Estimate values based on neighbors (time series)'}
          {strategy === 'ml' && 'Use ML models to predict missing values'}
          {strategy === 'remove' && 'Delete rows with missing values'}
        </small>
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={removeDuplicates}
            onChange={(e) => setRemoveDuplicates(e.target.checked)}
          />
          Remove Duplicate Rows
        </label>
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={standardize}
            onChange={(e) => setStandardize(e.target.checked)}
          />
          Standardize Data (trim whitespace, fix types)
        </label>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <button
        className="btn btn-success"
        onClick={handleClean}
        disabled={loading}
      >
        <span className="btn-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
        {loading ? 'Cleaning...' : 'Clean Data'}
      </button>
    </div>
  );
}

export default CleaningConfig;
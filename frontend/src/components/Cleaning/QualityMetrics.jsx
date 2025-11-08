import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

function QualityMetrics() {
  const [metrics, setMetrics] = useState(null);
  const { loading, error, handleRequest, cleaningAPI } = useData();
  const { dataLoaded, updateQualityMetrics } = useDataContext();

  useEffect(() => {
    if (dataLoaded) {
      loadQualityMetrics();
    }
  }, [dataLoaded]);

  const loadQualityMetrics = async () => {
    try {
      const result = await handleRequest(() => cleaningAPI.assessQuality());
      setMetrics(result);
      updateQualityMetrics(result);
    } catch (err) {
      console.error('Failed to load quality metrics:', err);
    }
  };

  if (!dataLoaded) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>
          </div>
          <h2>Data Quality Assessment</h2>
        </div>
        <div className="alert alert-info">
          <span className="alert-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </span>
          Load data first to assess quality
        </div>
      </div>
    );
  }

  if (loading || !metrics) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>
          </div>
          <h2>Data Quality Assessment</h2>
        </div>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const getQualityClass = (score) => {
    if (score === 'Good') return 'success';
    if (score === 'Fair') return 'warning';
    return 'danger';
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
          </svg>
        </div>
        <h2>Data Quality Assessment</h2>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="metric-value">{metrics.completeness}%</div>
          <div className="metric-label">Completeness</div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div className="metric-value">{metrics.missing_count}</div>
          <div className="metric-label">Missing Values</div>
        </div>

        <div className="metric-card danger">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div className="metric-value">{metrics.duplicate_count}</div>
          <div className="metric-label">Duplicates</div>
        </div>

        <div className={`metric-card ${getQualityClass(metrics.quality_score)}`}>
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div className="metric-value">{metrics.quality_score}</div>
          <div className="metric-label">Quality Score</div>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginTop: '1rem' }}>
        <strong>Analysis:</strong> {metrics.missing_count > 0
          ? `Found ${metrics.missing_count} missing values out of ${metrics.total_cells} total cells. `
          : 'No missing values detected. '}
        {metrics.duplicate_count > 0
          ? `${metrics.duplicate_count} duplicate rows detected.`
          : 'No duplicates found.'}
      </div>
    </div>
  );
}

export default QualityMetrics;
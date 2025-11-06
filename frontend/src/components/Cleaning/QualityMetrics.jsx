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
        <h2>📊 Data Quality Assessment</h2>
        <div className="alert alert-info">
          Load data first to assess quality
        </div>
      </div>
    );
  }

  if (loading || !metrics) {
    return (
      <div className="card">
        <h2>📊 Data Quality Assessment</h2>
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
      <h2>📊 Data Quality Assessment</h2>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{metrics.completeness}%</div>
          <div className="metric-label">Completeness</div>
        </div>

        <div className="metric-card warning">
          <div className="metric-value">{metrics.missing_count}</div>
          <div className="metric-label">Missing Values</div>
        </div>

        <div className="metric-card danger">
          <div className="metric-value">{metrics.duplicate_count}</div>
          <div className="metric-label">Duplicates</div>
        </div>

        <div className={`metric-card ${getQualityClass(metrics.quality_score)}`}>
          <div className="metric-value">{metrics.quality_score}</div>
          <div className="metric-label">Quality Score</div>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginTop: '1rem' }}>
        <strong>ℹ️ Analysis:</strong> {metrics.missing_count > 0
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
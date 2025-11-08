import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

ChartJS.register(ArcElement, Tooltip, Legend);

function CustomerSegmentation() {
  const [nClusters, setNClusters] = useState(4);
  const [segmentation, setSegmentation] = useState(null);
  const { loading, error, handleRequest, mlAPI } = useData();
  const { dataLoaded } = useDataContext();

  const handleSegment = async () => {
    try {
      const result = await handleRequest(() => mlAPI.segmentCustomers(nClusters));
      setSegmentation(result);
    } catch (err) {
      alert(`Segmentation failed: ${err.message}`);
    }
  };

  if (!dataLoaded) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
              <path d="M16 3.13a4 4 0 010 7.75"></path>
            </svg>
          </div>
          <h2>Customer Segmentation</h2>
        </div>
        <div className="alert alert-info">
          Load data first to perform segmentation
        </div>
      </div>
    );
  }

  const chartData = segmentation
    ? {
        labels: segmentation.labels,
        datasets: [
          {
            data: segmentation.segments,
            backgroundColor: [
              'rgba(102, 126, 234, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
              'rgba(102, 126, 234, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(239, 68, 68, 1)',
            ],
            borderWidth: 2,
          },
        ],
      }
    : null;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
            <path d="M16 3.13a4 4 0 010 7.75"></path>
          </svg>
        </div>
        <h2>Customer Segmentation</h2>
      </div>

      <div className="form-group">
        <label>Number of Segments</label>
        <input
          type="number"
          className="form-control"
          value={nClusters}
          onChange={(e) => setNClusters(Math.max(2, Math.min(10, parseInt(e.target.value) || 4)))}
          min="2"
          max="10"
        />
      </div>

      <button className="btn btn-primary" onClick={handleSegment} disabled={loading}>
        <span className="btn-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
        </span>
        {loading ? 'Segmenting...' : 'Segment Customers'}
      </button>

      {error && (
        <div className="alert alert-error" style={{ marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {segmentation && (
        <>
          <div className="chart-container" style={{ marginTop: '1.5rem' }}>
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: 'bottom' },
                  title: { display: true, text: 'Customer Segments Distribution' },
                },
              }}
            />
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            {segmentation.labels.map((label, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.8rem',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                }}
              >
                <span>
                  <strong>{label}</strong>
                </span>
                <span>
                  {segmentation.segments[idx]} customers ({segmentation.percentages[idx]}%)
                </span>
              </div>
            ))}
          </div>

          <div className="alert alert-info" style={{ marginTop: '1rem' }}>
            <strong>Algorithm:</strong> {segmentation.algorithm} clustering based on numeric features. 
            Identified {segmentation.labels.length} distinct customer segments.
          </div>
        </>
      )}
    </div>
  );
}

export default CustomerSegmentation;

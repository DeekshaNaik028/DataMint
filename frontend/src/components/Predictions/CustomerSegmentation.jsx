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
        <h2>👥 Customer Segmentation</h2>
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
      <h2>👥 Customer Segmentation</h2>

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
        {loading ? 'Segmenting...' : '🎯 Segment Customers'}
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
            <strong>ℹ️ Algorithm:</strong> {segmentation.algorithm} clustering based on numeric features. 
            Identified {segmentation.labels.length} distinct customer segments.
          </div>
        </>
      )}
    </div>
  );
}

export default CustomerSegmentation;
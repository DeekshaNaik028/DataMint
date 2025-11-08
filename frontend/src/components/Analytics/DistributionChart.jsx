import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DistributionChart() {
  const [column, setColumn] = useState('');
  const [columns, setColumns] = useState([]);
  const [chartData, setChartData] = useState(null);
  const { loading, handleRequest, analyticsAPI } = useData();
  const { dataLoaded } = useDataContext();

  useEffect(() => {
    if (dataLoaded) {
      loadColumns();
    }
  }, [dataLoaded]);

  const loadColumns = async () => {
    try {
      const summary = await handleRequest(() => analyticsAPI.getSummary());
      const cols = summary.map(s => s.field);
      setColumns(cols);
      if (cols.length > 0) {
        setColumn(cols[0]);
        loadDistribution(cols[0]);
      }
    } catch (err) {
      console.error('Failed to load columns:', err);
    }
  };

  const loadDistribution = async (col) => {
    try {
      const result = await handleRequest(() => analyticsAPI.getDistribution(col, 10));
      setChartData({
        labels: result.labels,
        datasets: [
          {
            label: `${result.column} Distribution`,
            data: result.values,
            backgroundColor: 'rgba(5, 88, 100, 0.6)',
            borderColor: 'rgba(5, 88, 100, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (err) {
      console.error('Failed to load distribution:', err);
    }
  };

  const handleColumnChange = (e) => {
    const newColumn = e.target.value;
    setColumn(newColumn);
    loadDistribution(newColumn);
  };

  if (!dataLoaded || columns.length === 0) {
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
          <h2>Distribution Analysis</h2>
        </div>
        <div className="alert alert-info">
          <span className="alert-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </span>
          No numeric columns available for distribution analysis
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
        <h2>Distribution Analysis</h2>
      </div>

      <div className="form-group">
        <label>Select Column</label>
        <select className="form-control" value={column} onChange={handleColumnChange}>
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {loading || !chartData ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="chart-container">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: true, text: `${column} Distribution` },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default DistributionChart;
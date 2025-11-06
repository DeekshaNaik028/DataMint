import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function TrendChart() {
  const [dateCol, setDateCol] = useState('date');
  const [valueCol, setValueCol] = useState('');
  const [chartData, setChartData] = useState(null);
  const [columns, setColumns] = useState([]);
  const { loading, handleRequest, analyticsAPI, dataAPI } = useData();
  const { dataLoaded } = useDataContext();

  useEffect(() => {
    if (dataLoaded) {
      loadColumns();
    }
  }, [dataLoaded]);

  const loadColumns = async () => {
    try {
      const preview = await handleRequest(() => dataAPI.getPreview(1));
      if (preview.data.length > 0) {
        const allCols = Object.keys(preview.data[0]);
        setColumns(allCols);
        
        // Try to find date column
        const dateColumn = allCols.find(col => col.toLowerCase().includes('date'));
        if (dateColumn) setDateCol(dateColumn);
        
        // Try to find value column
        const valueColumn = allCols.find(col => 
          col.toLowerCase().includes('revenue') || 
          col.toLowerCase().includes('sales') ||
          col.toLowerCase().includes('price')
        );
        if (valueColumn) {
          setValueCol(valueColumn);
          loadTrend(dateColumn || allCols[0], valueColumn);
        }
      }
    } catch (err) {
      console.error('Failed to load columns:', err);
    }
  };

  const loadTrend = async (dCol, vCol) => {
    try {
      const result = await handleRequest(() => analyticsAPI.getTrend(dCol, vCol));
      setChartData({
        labels: result.labels,
        datasets: [
          {
            label: vCol,
            data: result.values,
            borderColor: 'rgba(102, 126, 234, 1)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      });
    } catch (err) {
      console.error('Failed to load trend:', err);
    }
  };

  const handleAnalyze = () => {
    if (dateCol && valueCol) {
      loadTrend(dateCol, valueCol);
    }
  };

  if (!dataLoaded) {
    return (
      <div className="card">
        <h2>📈 Time Series Trend</h2>
        <div className="alert alert-info">
          Load data first to view trends
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>📈 Time Series Trend</h2>

      <div className="grid-2">
        <div className="form-group">
          <label>Date Column</label>
          <select className="form-control" value={dateCol} onChange={(e) => setDateCol(e.target.value)}>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Value Column</label>
          <select className="form-control" value={valueCol} onChange={(e) => setValueCol(e.target.value)}>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading || !dateCol || !valueCol}>
        📊 Analyze Trend
      </button>

      {loading || !chartData ? (
        chartData === null ? null : (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )
      ) : (
        <div className="chart-container" style={{ marginTop: '1.5rem' }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true, position: 'top' },
                title: { display: true, text: 'Time Series Trend Analysis' },
              },
              scales: {
                y: { beginAtZero: false },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default TrendChart;
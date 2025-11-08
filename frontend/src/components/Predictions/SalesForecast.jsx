// SalesForecast.jsx - Updated
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function SalesForecast() {
  const [periods, setPeriods] = useState(6);
  const [forecast, setForecast] = useState(null);
  const { loading, error, handleRequest, mlAPI } = useData();
  const { dataLoaded } = useDataContext();

  const handleForecast = async () => {
    try {
      const result = await handleRequest(() => mlAPI.forecastSales(periods));
      setForecast(result);
    } catch (err) {
      alert(`Forecast failed: ${err.message}`);
    }
  };

  if (!dataLoaded) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </div>
          <h2>Sales Forecast</h2>
        </div>
        <div className="alert alert-info">
          Load data first to generate forecasts
        </div>
      </div>
    );
  }

  const chartData = forecast
    ? {
        labels: forecast.labels,
        datasets: [
          {
            label: 'Historical',
            data: [...forecast.historical, ...Array(forecast.forecast.length).fill(null)],
            borderColor: 'rgba(102, 126, 234, 1)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Forecast',
            data: [...Array(forecast.historical.length).fill(null), ...forecast.forecast],
            borderColor: 'rgba(239, 68, 68, 1)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderDash: [5, 5],
            tension: 0.4,
            fill: true,
          },
        ],
      }
    : null;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
        </div>
        <h2>Sales Forecast</h2>
      </div>

      <div className="form-group">
        <label>Forecast Periods (months)</label>
        <input
          type="number"
          className="form-control"
          value={periods}
          onChange={(e) => setPeriods(Math.max(1, Math.min(12, parseInt(e.target.value) || 6)))}
          min="1"
          max="12"
        />
      </div>

      <button className="btn btn-primary" onClick={handleForecast} disabled={loading}>
        <span className="btn-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
        </span>
        {loading ? 'Forecasting...' : 'Generate Forecast'}
      </button>

      {error && (
        <div className="alert alert-error" style={{ marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {forecast && (
        <>
          <div className="chart-container" style={{ marginTop: '1.5rem' }}>
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: 'top' },
                  title: { display: true, text: 'Sales Forecast Analysis' },
                },
              }}
            />
          </div>

          <div className="metrics-grid" style={{ marginTop: '1.5rem' }}>
            <div className="metric-card">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path>
                </svg>
              </div>
              <div className="metric-value">{forecast.metrics.avg_historical.toFixed(2)}</div>
              <div className="metric-label">Avg Historical</div>
            </div>

            <div className="metric-card success">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </div>
              <div className="metric-value">{forecast.metrics.avg_forecast.toFixed(2)}</div>
              <div className="metric-label">Avg Forecast</div>
            </div>

            <div className={`metric-card ${forecast.metrics.growth_rate >= 0 ? 'success' : 'danger'}`}>
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {forecast.metrics.growth_rate >= 0 ? (
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  ) : (
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                  )}
                </svg>
              </div>
              <div className="metric-value">{forecast.metrics.growth_rate.toFixed(1)}%</div>
              <div className="metric-label">Growth Rate</div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="metric-value">{forecast.metrics.periods}</div>
              <div className="metric-label">Periods Ahead</div>
            </div>
          </div>

          <div className="alert alert-info" style={{ marginTop: '1rem' }}>
            <strong>Method:</strong> Linear regression trend analysis with time series decomposition. 
            Growth rate: {forecast.metrics.growth_rate >= 0 ? 'Upward' : 'Downward'} trend detected.
          </div>
        </>
      )}
    </div>
  );
}

export default SalesForecast;
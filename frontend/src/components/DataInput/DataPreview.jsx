import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

function DataPreview() {
  const [preview, setPreview] = useState(null);
  const { loading, handleRequest, dataAPI } = useData();
  const { dataLoaded } = useDataContext();

  useEffect(() => {
    if (dataLoaded) {
      loadPreview();
    }
  }, [dataLoaded]);

  const loadPreview = async () => {
    try {
      const result = await handleRequest(() => dataAPI.getPreview(5));
      setPreview(result);
    } catch (err) {
      console.error('Failed to load preview:', err);
    }
  };

  if (!dataLoaded) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-header-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <h2>Data Preview</h2>
        </div>
        <div className="alert alert-info">
          <span className="alert-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </span>
          <div>
            <strong>No Data Loaded</strong>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
              Upload a CSV file or connect to a database to preview your data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !preview) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-header-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <h2>Data Preview</h2>
        </div>
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem' }}>Loading preview...</p>
        </div>
      </div>
    );
  }

  const headers = preview.data.length > 0 ? Object.keys(preview.data[0]) : [];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <h2>Data Preview</h2>
      </div>
      
      <div className="flex-between" style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--light-gray)', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span style={{ color: 'var(--dark)', fontWeight: '500' }}>
            Showing first 5 rows
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="badge badge-primary">
            {preview.total_rows} rows total
          </span>
          {preview.has_cleaned && (
            <span className="badge badge-success">
              Cleaned version available
            </span>
          )}
        </div>
      </div>

      {preview.data.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.data.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center', color: 'var(--gray)', fontWeight: '500' }}>
                    {idx + 1}
                  </td>
                  {headers.map((header) => (
                    <td key={header}>
                      {row[header] !== null && row[header] !== undefined
                        ? String(row[header])
                        : <span style={{ color: 'var(--gray)', fontStyle: 'italic' }}>null</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-warning">
          <span className="alert-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </span>
          <div>
            <strong>No Data Available</strong>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
              The dataset appears to be empty
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataPreview;
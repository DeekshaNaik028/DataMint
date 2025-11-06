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
        <h2>👀 Data Preview</h2>
        <div className="alert alert-info">
          Upload a file or connect to a database to see data preview
        </div>
      </div>
    );
  }

  if (loading || !preview) {
    return (
      <div className="card">
        <h2>👀 Data Preview</h2>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const headers = preview.data.length > 0 ? Object.keys(preview.data[0]) : [];

  return (
    <div className="card">
      <h2>👀 Data Preview</h2>
      <p style={{ color: '#64748b', marginBottom: '1rem' }}>
        Showing first 5 rows of {preview.total_rows} total rows
        {preview.has_cleaned && ' (cleaned data available)'}
      </p>

      {preview.data.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.data.map((row, idx) => (
                <tr key={idx}>
                  {headers.map((header) => (
                    <td key={header}>
                      {row[header] !== null && row[header] !== undefined
                        ? String(row[header])
                        : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-warning">No data to display</div>
      )}
    </div>
  );
}

export default DataPreview;
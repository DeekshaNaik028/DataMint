import React, { useState, useRef } from 'react';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

function FileUpload() {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { loading, error, handleRequest, dataAPI } = useData();
  const { updateDataInfo } = useDataContext();

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
    } else {
      alert('Please upload a CSV file');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await handleRequest(() => dataAPI.uploadFile(selectedFile));
      updateDataInfo(result);
      alert(`Successfully loaded ${result.rows} rows!`);
      setSelectedFile(null);
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    }
  };

  const handleGenerateSample = async (type) => {
    try {
      const result = await handleRequest(() => dataAPI.generateSampleData(type, 500));
      updateDataInfo(result);
      alert(`Generated ${result.rows} ${type} records!`);
    } catch (err) {
      alert(`Generation failed: ${err.message}`);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <h2>Upload Data</h2>
      </div>
      
      <div
        className={`file-upload-area ${dragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <div className="file-upload-icon">
          {selectedFile ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          )}
        </div>
        {selectedFile ? (
          <div>
            <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--dark)' }}>
              {selectedFile.name}
            </p>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--dark)' }}>
              Drag and drop your CSV file here
            </p>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
              or click to browse files
            </p>
          </div>
        )}
      </div>

      {selectedFile && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-success"
            onClick={handleUpload}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                Uploading...
              </>
            ) : (
              <>
                <span className="btn-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                Upload File
              </>
            )}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedFile(null)}
            disabled={loading}
          >
            <span className="btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </span>
            Clear
          </button>
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ marginTop: '1rem' }}>
          <span className="alert-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </span>
          {error}
        </div>
      )}

      <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid var(--border)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Generate Sample Data
        </h3>
        <p style={{ color: 'var(--gray)', marginBottom: '1rem', fontSize: '0.95rem' }}>
          Quick start with pre-generated datasets for testing and exploration
        </p>
        <div className="grid-3">
          <button
            className="btn btn-secondary"
            onClick={() => handleGenerateSample('sales')}
            disabled={loading}
            style={{ flexDirection: 'column', padding: '1.25rem' }}
          >
            <span className="btn-icon" style={{ width: '32px', height: '32px', marginBottom: '0.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </span>
            <strong>Sales Data</strong>
            <small style={{ marginTop: '0.25rem', opacity: 0.7 }}>500 records</small>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleGenerateSample('customers')}
            disabled={loading}
            style={{ flexDirection: 'column', padding: '1.25rem' }}
          >
            <span className="btn-icon" style={{ width: '32px', height: '32px', marginBottom: '0.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </span>
            <strong>Customer Data</strong>
            <small style={{ marginTop: '0.25rem', opacity: 0.7 }}>500 records</small>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleGenerateSample('inventory')}
            disabled={loading}
            style={{ flexDirection: 'column', padding: '1.25rem' }}
          >
            <span className="btn-icon" style={{ width: '32px', height: '32px', marginBottom: '0.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </span>
            <strong>Inventory Data</strong>
            <small style={{ marginTop: '0.25rem', opacity: 0.7 }}>500 records</small>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
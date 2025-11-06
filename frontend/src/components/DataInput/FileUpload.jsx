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
      <h2>📤 Upload Data</h2>
      
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
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
        {selectedFile ? (
          <div>
            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{selectedFile.name}</p>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
              Drag & drop your CSV file here
            </p>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              or click to browse
            </p>
          </div>
        )}
      </div>

      {selectedFile && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? 'Uploading...' : '✅ Upload File'}
          </button>
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ marginTop: '1rem' }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>🎲 Or Generate Sample Data</h3>
        <div className="flex gap-2" style={{ marginTop: '1rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={() => handleGenerateSample('sales')}
            disabled={loading}
          >
            💰 Sales Data
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleGenerateSample('customers')}
            disabled={loading}
          >
            👥 Customer Data
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleGenerateSample('inventory')}
            disabled={loading}
          >
            📦 Inventory Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
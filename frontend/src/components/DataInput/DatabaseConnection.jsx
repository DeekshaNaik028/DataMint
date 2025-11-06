import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

function DatabaseConnection() {
  const [dbType, setDbType] = useState('mysql');
  const [connectionString, setConnectionString] = useState('');
  const [tableName, setTableName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { loading, error, handleRequest, dataAPI } = useData();
  const { updateDataInfo } = useDataContext();

  const handleConnect = async (e) => {
    e.preventDefault();
    
    try {
      const result = await handleRequest(() =>
        dataAPI.connectDatabase({
          db_type: dbType,
          connection_string: connectionString,
          table_name: tableName,
        })
      );
      updateDataInfo(result);
      alert(`Connected successfully! Loaded ${result.rows} rows.`);
      setShowForm(false);
    } catch (err) {
      alert(`Connection failed: ${err.message}`);
    }
  };

  return (
    <div className="card">
      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🔌 Database Connection</h2>
        <button
          className="btn btn-secondary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✖️ Cancel' : '➕ Connect Database'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleConnect} style={{ marginTop: '1.5rem' }}>
          <div className="form-group">
            <label>Database Type</label>
            <select
              className="form-control"
              value={dbType}
              onChange={(e) => setDbType(e.target.value)}
            >
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="mongodb">MongoDB</option>
              <option value="sqlite">SQLite</option>
            </select>
          </div>

          <div className="form-group">
            <label>Connection String</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., user:password@localhost:3306/dbname"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Table Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., sales_data"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Connecting...' : '🔗 Connect'}
          </button>
        </form>
      )}

      <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
        <strong>ℹ️ Note:</strong> Database connections are simulated in this demo. In production, 
        configure proper database credentials and connection pools.
      </div>
    </div>
  );
}

export default DatabaseConnection;
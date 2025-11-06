import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { useDataContext } from '../../context/DataContext';

function DatabaseConnection() {
  const [dbType, setDbType] = useState('mysql');
  const [connectionType, setConnectionType] = useState('local');
  const [showForm, setShowForm] = useState(false);
  
  // Local connection
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('3306');
  const [database, setDatabase] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Cloud connection
  const [connectionString, setConnectionString] = useState('');
  
  const [tableName, setTableName] = useState('');
  const { loading, error, handleRequest, dataAPI } = useData();
  const { updateDataInfo } = useDataContext();

  const handleConnect = async (e) => {
    e.preventDefault();
    
    let finalConnectionString = '';
    
    if (connectionType === 'local') {
      // Build connection string from local parameters
      if (dbType === 'mysql') {
        finalConnectionString = `mysql+pymysql://${username}:${password}@${host}:${port}/${database}`;
      } else if (dbType === 'postgresql') {
        finalConnectionString = `postgresql://${username}:${password}@${host}:${port}/${database}`;
      } else if (dbType === 'sqlite') {
        finalConnectionString = `sqlite:///${database}.db`;
      } else if (dbType === 'mongodb') {
        finalConnectionString = `mongodb://${username}:${password}@${host}:${port}/${database}`;
      }
    } else {
      finalConnectionString = connectionString;
    }
    
    try {
      const result = await handleRequest(() =>
        dataAPI.connectDatabase({
          db_type: dbType,
          connection_string: finalConnectionString,
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

  const defaultPorts = {
    mysql: '3306',
    postgresql: '5432',
    mongodb: '27017',
    sqlite: ''
  };

  const handleDbTypeChange = (type) => {
    setDbType(type);
    setPort(defaultPorts[type] || '');
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
        </div>
        <h2>Database Connection</h2>
      </div>

      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <p style={{ color: 'var(--gray)', margin: 0 }}>
          Connect to your local or cloud database
        </p>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <span className="btn-icon">
            {showForm ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            )}
          </span>
          {showForm ? 'Cancel' : 'New Connection'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleConnect} style={{ marginTop: '1.5rem' }}>
          {/* Connection Type Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              className={`btn ${connectionType === 'local' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setConnectionType('local')}
              style={{ flex: 1 }}
            >
              <span className="btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </span>
              Local Database
            </button>
            <button
              type="button"
              className={`btn ${connectionType === 'cloud' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setConnectionType('cloud')}
              style={{ flex: 1 }}
            >
              <span className="btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                </svg>
              </span>
              Cloud Database
            </button>
          </div>

          {/* Database Type */}
          <div className="form-group">
            <label>Database Type</label>
            <select
              className="form-control"
              value={dbType}
              onChange={(e) => handleDbTypeChange(e.target.value)}
            >
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="mongodb">MongoDB</option>
              <option value="sqlite">SQLite</option>
            </select>
          </div>

          {connectionType === 'local' ? (
            <>
              {/* Local Connection Fields */}
              {dbType !== 'sqlite' && (
                <>
                  <div className="grid-2">
                    <div className="form-group">
                      <label>Host</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="localhost or IP address"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Port</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={defaultPorts[dbType]}
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Database Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="my_database"
                      value={database}
                      onChange={(e) => setDatabase(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="db_user"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {dbType === 'sqlite' && (
                <div className="form-group">
                  <label>Database File Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="mydatabase (without .db extension)"
                    value={database}
                    onChange={(e) => setDatabase(e.target.value)}
                    required
                  />
                  <small style={{ color: 'var(--gray)', marginTop: '0.3rem', display: 'block' }}>
                    File will be created in the backend directory
                  </small>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Cloud Connection String */}
              <div className="form-group">
                <label>Connection String</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="mysql://user:pass@host:port/db or postgresql://user:pass@host:port/db"
                  value={connectionString}
                  onChange={(e) => setConnectionString(e.target.value)}
                  required
                  style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                />
                <small style={{ color: 'var(--gray)', marginTop: '0.3rem', display: 'block' }}>
                  Examples:<br/>
                  • MySQL: mysql+pymysql://user:pass@host:3306/dbname<br/>
                  • PostgreSQL: postgresql://user:pass@host:5432/dbname<br/>
                  • MongoDB: mongodb://user:pass@host:27017/dbname
                </small>
              </div>
            </>
          )}

          {/* Table Name */}
          {dbType !== 'mongodb' && (
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
          )}

          {dbType === 'mongodb' && (
            <div className="form-group">
              <label>Collection Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., sales_collection"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                required
              />
            </div>
          )}

          {error && (
            <div className="alert alert-error">
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

          <button
            type="submit"
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                Connecting...
              </>
            ) : (
              <>
                <span className="btn-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                Connect to Database
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default DatabaseConnection;
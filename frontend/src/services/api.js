import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Data Management APIs
export const dataAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/data/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  connectDatabase: (data) => api.post('/api/data/connect', data),
  
  generateSampleData: (type, size = 500) => 
    api.get(`/api/data/generate/${type}`, { params: { size } }),
  
  getPreview: (limit = 5) => 
    api.get('/api/data/preview', { params: { limit } }),
  
  getRawData: () => api.get('/api/data/raw'),
  
  getCleanedData: () => api.get('/api/data/cleaned'),
};

// Data Cleaning APIs
export const cleaningAPI = {
  assessQuality: () => api.get('/api/cleaning/quality'),
  
  cleanData: (config) => api.post('/api/cleaning/clean', config),
  
  detectOutliers: (threshold = 3.0) => 
    api.get('/api/cleaning/outliers', { params: { threshold } }),
};

// Analytics APIs
export const analyticsAPI = {
  getSummary: () => api.get('/api/analytics/summary'),
  
  getDistribution: (column, bins = 10) => 
    api.get('/api/analytics/distribution', { params: { column, bins } }),
  
  getCorrelation: () => api.get('/api/analytics/correlation'),
  
  getTrend: (dateCol, valueCol) => 
    api.get('/api/analytics/trend', { params: { date_col: dateCol, value_col: valueCol } }),
  
  getCategoricalDistribution: (column) => 
    api.get('/api/analytics/categorical', { params: { column } }),
  
  getInsights: () => api.get('/api/analytics/insights'),
};

// Machine Learning APIs
export const mlAPI = {
  forecastSales: (periods = 6) => 
    api.post('/api/ml/forecast', { periods }),
  
  segmentCustomers: (nClusters = 4) => 
    api.post('/api/ml/segment', { n_clusters: nClusters }),
  
  detectAnomalies: (threshold = 2.5) => 
    api.get('/api/ml/anomalies', { params: { threshold } }),
  
  getRecommendations: () => api.get('/api/ml/recommendations'),
};

export default api;
import { useState, useCallback } from 'react';
import { dataAPI, cleaningAPI, analyticsAPI, mlAPI } from '../services/api';

export const useData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    loading,
    error,
    handleRequest,
    dataAPI,
    cleaningAPI,
    analyticsAPI,
    mlAPI,
  };
};
import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataInfo, setDataInfo] = useState(null);
  const [cleanedData, setCleanedData] = useState(false);
  const [qualityMetrics, setQualityMetrics] = useState(null);
  const [cleaningResults, setCleaningResults] = useState(null);

  const updateDataInfo = (info) => {
    setDataInfo(info);
    setDataLoaded(true);
  };

  const updateQualityMetrics = (metrics) => {
    setQualityMetrics(metrics);
  };

  const updateCleaningResults = (results) => {
    setCleaningResults(results);
    setCleanedData(true);
  };

  const resetData = () => {
    setDataLoaded(false);
    setDataInfo(null);
    setCleanedData(false);
    setQualityMetrics(null);
    setCleaningResults(null);
  };

  const value = {
    dataLoaded,
    dataInfo,
    cleanedData,
    qualityMetrics,
    cleaningResults,
    updateDataInfo,
    updateQualityMetrics,
    updateCleaningResults,
    resetData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
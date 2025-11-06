import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Tabs from './components/Tabs';
import FileUpload from './components/DataInput/FileUpload';
import DatabaseConnection from './components/DataInput/DatabaseConnection';
import DataPreview from './components/DataInput/DataPreview';
import QualityMetrics from './components/Cleaning/QualityMetrics';
import CleaningConfig from './components/Cleaning/CleaningConfig';
import CleaningResults from './components/Cleaning/CleaningResults';
import StatisticalSummary from './components/Analytics/StatisticalSummary';
import DistributionChart from './components/Analytics/DistributionChart';
import CorrelationChart from './components/Analytics/CorrelationChart';
import TrendChart from './components/Analytics/TrendChart';
import AIInsights from './components/Insights/AIInsights';
import SalesForecast from './components/Predictions/SalesForecast';
import CustomerSegmentation from './components/Predictions/CustomerSegmentation';
import AnomalyDetection from './components/Predictions/AnomalyDetection';
import Recommendations from './components/Predictions/Recommendations';

function App() {
  const [activeTab, setActiveTab] = useState('data');

  const renderContent = () => {
    switch (activeTab) {
      case 'data':
        return (
          <div>
            <FileUpload />
            <DatabaseConnection />
            <DataPreview />
          </div>
        );
      case 'cleaning':
        return (
          <div>
            <QualityMetrics />
            <CleaningConfig />
            <CleaningResults />
          </div>
        );
      case 'analytics':
        return (
          <div>
            <StatisticalSummary />
            <div className="grid-2">
              <DistributionChart />
              <CorrelationChart />
            </div>
            <TrendChart />
          </div>
        );
      case 'insights':
        return <AIInsights />;
      case 'predictions':
        return (
          <div>
            <SalesForecast />
            <div className="grid-2">
              <CustomerSegmentation />
              <AnomalyDetection />
            </div>
            <Recommendations />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DataProvider>
      <div className="app">
        <Header />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="content">{renderContent()}</div>
      </div>
    </DataProvider>
  );
}

export default App;
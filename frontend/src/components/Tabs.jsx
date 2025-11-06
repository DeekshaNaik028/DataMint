import React from 'react';

const tabs = [
  { id: 'data', label: '📁 Data Input' },
  { id: 'cleaning', label: '🧹 Data Cleaning' },
  { id: 'analytics', label: '📊 Analytics' },
  { id: 'insights', label: '💡 AI Insights' },
  { id: 'predictions', label: '🔮 ML Predictions' },
];

function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
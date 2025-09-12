import React from 'react';
import './ScenarioSelector.css';

const ScenarioSelector = ({ selectedScenario, onScenarioChange }) => {
  const scenarios = [
    { 
      value: 'base', 
      label: 'Base Scenario', 
      description: 'Conservative baseline projections',
      icon: '📊',
      badge: '1'
    },
    { 
      value: 'upside', 
      label: 'Upside Scenario', 
      description: 'Optimistic growth projections',
      icon: '📈',
      badge: '2'
    },
    { 
      value: 'downside', 
      label: 'Downside Scenario', 
      description: 'Conservative risk projections',
      icon: '📉',
      badge: '3'
    }
  ];

  return (
    <div className="scenario-selector">
      <div className="scenario-header">
        <h3>Business Scenario</h3>
        <p>Choose a scenario to view financial projections</p>
      </div>
      <div className="scenario-buttons">
        {scenarios.map((scenario) => (
          <button
            key={scenario.value}
            className={`scenario-button ${selectedScenario === scenario.value ? 'active' : ''}`}
            onClick={() => onScenarioChange(scenario.value)}
          >
            <div className="scenario-icon">{scenario.icon}</div>
            <div className="scenario-content">
              <div className="scenario-header-row">
                <div className="scenario-label">{scenario.label}</div>
                <div className="scenario-badge">{scenario.badge}</div>
              </div>
              <div className="scenario-description">{scenario.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScenarioSelector;

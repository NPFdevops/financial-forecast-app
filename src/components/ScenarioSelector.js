import React from 'react';
import './ScenarioSelector.css';

const ScenarioSelector = ({ selectedScenario, onScenarioChange }) => {
  const scenarios = [
    { value: 'base', label: 'Base (1)', description: 'Conservative baseline scenario' },
    { value: 'upside', label: 'Upside (2)', description: 'Optimistic growth scenario' },
    { value: 'downside', label: 'Downside (3)', description: 'Conservative downside scenario' }
  ];

  return (
    <div className="scenario-selector">
      <h3>Select Scenario</h3>
      <div className="scenario-buttons">
        {scenarios.map((scenario) => (
          <button
            key={scenario.value}
            className={`scenario-button ${selectedScenario === scenario.value ? 'active' : ''}`}
            onClick={() => onScenarioChange(scenario.value)}
          >
            <div className="scenario-label">{scenario.label}</div>
            <div className="scenario-description">{scenario.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScenarioSelector;

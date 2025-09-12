import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = ({ 
  isOpen, 
  onClose, 
  baseAssumptions, 
  onUpdateAssumptions,
  scenarioMultipliers,
  onUpdateMultipliers,
  onResetToDefaults 
}) => {
  const [activeTab, setActiveTab] = useState('assumptions');
  const [editedAssumptions, setEditedAssumptions] = useState(baseAssumptions);
  const [editedMultipliers, setEditedMultipliers] = useState(scenarioMultipliers);

  // Update local state when props change (when data is loaded from localStorage)
  useEffect(() => {
    setEditedAssumptions(baseAssumptions);
    setEditedMultipliers(scenarioMultipliers);
  }, [baseAssumptions, scenarioMultipliers]);

  const handleAssumptionChange = (category, key, year, value) => {
    const newAssumptions = { ...editedAssumptions };
    if (year) {
      if (key) {
        // For nested structures like costs.marketingSpend
        if (!newAssumptions[category][key]) {
          newAssumptions[category][key] = {};
        }
        newAssumptions[category][key][year] = parseFloat(value) || 0;
      } else {
        // For direct year-based structures like trafficSessions
        if (!newAssumptions[category]) {
          newAssumptions[category] = {};
        }
        newAssumptions[category][year] = parseFloat(value) || 0;
      }
    } else {
      if (key) {
        newAssumptions[category][key] = parseFloat(value) || 0;
      } else {
        newAssumptions[category] = parseFloat(value) || 0;
      }
    }
    setEditedAssumptions(newAssumptions);
  };

  const handleMultiplierChange = (multiplierKey, scenario, value) => {
    const newMultipliers = { ...editedMultipliers };
    newMultipliers[multiplierKey][scenario] = parseFloat(value) || 0;
    setEditedMultipliers(newMultipliers);
  };

  const handleSave = () => {
    onUpdateAssumptions(editedAssumptions);
    onUpdateMultipliers(editedMultipliers);
    onClose();
  };

  const handleReset = () => {
    // Reset to current saved values (from localStorage or props)
    setEditedAssumptions(baseAssumptions);
    setEditedMultipliers(scenarioMultipliers);
  };

  const handleResetToOriginalDefaults = () => {
    if (window.confirm('This will reset ALL data to the original default values and cannot be undone. Are you sure?')) {
      onResetToDefaults();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <div className="header-title">
            <h2>Financial Model Admin Panel</h2>
            <div className="data-status">
              {localStorage.getItem('financialForecastAssumptions') ? (
                <span className="status-indicator custom">📄 Custom Data Active</span>
              ) : (
                <span className="status-indicator default">🏭 Factory Defaults</span>
              )}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'assumptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('assumptions')}
          >
            Base Assumptions
          </button>
          <button 
            className={`tab ${activeTab === 'multipliers' ? 'active' : ''}`}
            onClick={() => setActiveTab('multipliers')}
          >
            Scenario Multipliers
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'assumptions' && (
            <div className="assumptions-editor">
              <h3>Market & Traffic Assumptions</h3>
              <div className="assumption-group">
                <label>Global NFT market volume ($/year):</label>
                {[2026, 2027, 2028].map(year => (
                  <div key={year} className="year-input">
                    <span>{year}:</span>
                    <input
                      type="number"
                      value={editedAssumptions.trafficSessions[year]}
                      onChange={(e) => handleAssumptionChange('trafficSessions', null, year, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="assumption-group">
                <label>Market Share Acquired:</label>
                {[2026, 2027, 2028].map(year => (
                  <div key={year} className="year-input">
                    <span>{year}:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={editedAssumptions.walletConnectionRate[year]}
                      onChange={(e) => handleAssumptionChange('walletConnectionRate', null, year, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="assumption-group">
                <label>Average Fee:</label>
                {[2026, 2027, 2028].map(year => (
                  <div key={year} className="year-input">
                    <span>{year}:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={editedAssumptions.paidConversionRate[year]}
                      onChange={(e) => handleAssumptionChange('paidConversionRate', null, year, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="assumption-group">
                <label>B2C ARPU ($/month):</label>
                {[2026, 2027, 2028].map(year => (
                  <div key={year} className="year-input">
                    <span>{year}:</span>
                    <input
                      type="number"
                      value={editedAssumptions.b2cArpu[year]}
                      onChange={(e) => handleAssumptionChange('b2cArpu', null, year, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <h3>Cost Assumptions</h3>
              <div className="assumption-group">
                <label>Marketing Spend ($/month):</label>
                {[2026, 2027, 2028].map(year => (
                  <div key={year} className="year-input">
                    <span>{year}:</span>
                    <input
                      type="number"
                      value={editedAssumptions.costs.marketingSpend[year]}
                      onChange={(e) => handleAssumptionChange('costs', 'marketingSpend', year, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="assumption-group">
                <label>Hosting Cost per User ($/month):</label>
                {[2026, 2027, 2028].map(year => (
                  <div key={year} className="year-input">
                    <span>{year}:</span>
                    <input
                      type="number"
                      value={editedAssumptions.costs.hostingCostPerUser[year]}
                      onChange={(e) => handleAssumptionChange('costs', 'hostingCostPerUser', year, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="assumption-group">
                <label>General & Administrative ($/month):</label>
                {[2026, 2027, 2028].map(year => (
                  <div key={year} className="year-input">
                    <span>{year}:</span>
                    <input
                      type="number"
                      value={editedAssumptions.costs.gaFixed[year]}
                      onChange={(e) => handleAssumptionChange('costs', 'gaFixed', year, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <h3>B2B/API Client Assumptions</h3>
              {Object.keys(editedAssumptions.b2bClients).map(tier => {
                const tierLabels = {
                  tierD: 'Tier D (Free)',
                  tierC: 'Tier C (Basic)', 
                  tierB: 'Tier B (Pro)',
                  tierA: 'Tier A (Enterprise)',
                  tierAPlus: 'Tier A+ (Premium)'
                };
                return (
                  <div key={tier} className="b2b-tier-group">
                    <h4>{tierLabels[tier]}</h4>
                    <div className="tier-inputs">
                      <div className="tier-section">
                        <label>Client Count:</label>
                        <div className="year-inputs-row">
                          {[2026, 2027, 2028].map(year => (
                            <div key={year} className="year-input-inline">
                              <span>{year}:</span>
                              <input
                                type="number"
                                value={editedAssumptions.b2bClients[tier][year]}
                                onChange={(e) => handleAssumptionChange('b2bClients', tier, year, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="tier-section">
                        <label>Monthly Price ($):</label>
                        <div className="year-inputs-row">
                          {[2026, 2027, 2028].map(year => (
                            <div key={year} className="year-input-inline">
                              <span>{year}:</span>
                              <input
                                type="number"
                                value={editedAssumptions.b2bPricing[tier][year]}
                                onChange={(e) => handleAssumptionChange('b2bPricing', tier, year, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <h3>Headcount by Department</h3>
              {Object.keys(editedAssumptions.headcount).map(role => {
                const roleLabels = {
                  engineering: 'Engineering',
                  dataML: 'Data & ML',
                  productDesign: 'Product & Design', 
                  sales: 'Sales',
                  marketing: 'Marketing',
                  opsFinance: 'Operations & Finance'
                };
                return (
                  <div key={role} className="headcount-group">
                    <h4>{roleLabels[role]}</h4>
                    <div className="headcount-inputs">
                      <div className="headcount-section">
                        <label>Headcount (FTE):</label>
                        <div className="year-inputs-row">
                          {[2026, 2027, 2028].map(year => (
                            <div key={year} className="year-input-inline">
                              <span>{year}:</span>
                              <input
                                type="number"
                                value={editedAssumptions.headcount[role][year]}
                                onChange={(e) => handleAssumptionChange('headcount', role, year, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="headcount-section">
                        <label>Monthly Salary ($):</label>
                        <div className="year-inputs-row">
                          {[2026, 2027, 2028].map(year => (
                            <div key={year} className="year-input-inline">
                              <span>{year}:</span>
                              <input
                                type="number"
                                value={editedAssumptions.salariesMonthly[role][year]}
                                onChange={(e) => handleAssumptionChange('salariesMonthly', role, year, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'multipliers' && (
            <div className="multipliers-editor">
              <h3>Scenario Multipliers</h3>
              <div className="multipliers-table">
                <table>
                  <thead>
                    <tr>
                      <th>Multiplier</th>
                      <th>Base</th>
                      <th>Upside</th>
                      <th>Downside</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(editedMultipliers).map(([key, values]) => (
                      <tr key={key}>
                        <td className="multiplier-label">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            value={values.base}
                            onChange={(e) => handleMultiplierChange(key, 'base', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            value={values.upside}
                            onChange={(e) => handleMultiplierChange(key, 'upside', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            value={values.downside}
                            onChange={(e) => handleMultiplierChange(key, 'downside', e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="admin-actions">
          <div className="left-actions">
            <button className="reset-original-btn" onClick={handleResetToOriginalDefaults}>
              🔄 Reset to Factory Defaults
            </button>
            <button className="reset-btn" onClick={handleReset}>
              ↶ Reset Current Changes
            </button>
          </div>
          <div className="action-group">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button className="save-btn" onClick={handleSave}>💾 Save & Persist</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

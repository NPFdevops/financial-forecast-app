import React, { useState } from 'react';
import './AdminPanel.css';

const AdminPanel = ({ 
  isOpen, 
  onClose, 
  baseAssumptions, 
  onUpdateAssumptions,
  scenarioMultipliers,
  onUpdateMultipliers 
}) => {
  const [activeTab, setActiveTab] = useState('assumptions');
  const [editedAssumptions, setEditedAssumptions] = useState(baseAssumptions);
  const [editedMultipliers, setEditedMultipliers] = useState(scenarioMultipliers);

  const handleAssumptionChange = (category, key, year, value) => {
    const newAssumptions = { ...editedAssumptions };
    if (year) {
      newAssumptions[category][key][year] = parseFloat(value) || 0;
    } else {
      newAssumptions[category][key] = parseFloat(value) || 0;
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
    setEditedAssumptions(baseAssumptions);
    setEditedMultipliers(scenarioMultipliers);
  };

  if (!isOpen) return null;

  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <h2>Financial Model Admin Panel</h2>
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
                <label>Traffic Sessions by Year:</label>
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
                <label>Wallet Connection Rate:</label>
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
                <label>Paid Conversion Rate:</label>
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
          <button className="reset-btn" onClick={handleReset}>Reset to Default</button>
          <div className="action-group">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

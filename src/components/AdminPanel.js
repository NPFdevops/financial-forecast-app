import React, { useState } from 'react';
import './AdminPanel.css';
import {
  useScenarioData,
  useEditableAssumptions,
  useEditableB2B,
  useEditableCosts,
  useEditableHeadcount,
  useEditableScenarios
} from '../hooks/useFinancialModel';
import {
  LoadingSpinner,
  SavingIndicator,
  ErrorMessage,
  DataWrapper
} from './LoadingComponents';
import { isSupabaseConfigured } from '../services/supabase';

const AdminPanel = ({ 
  isOpen, 
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('assumptions');
  const [selectedScenario, setSelectedScenario] = useState('Base');
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Add local state to manage form data
  const [localScenarioData, setLocalScenarioData] = useState(null);

  // Load data from Supabase
  const { data: scenarioData, scenarios, loading, error, refresh } = useScenarioData(selectedScenario);

  // Sync local state with fetched data
  React.useEffect(() => {
    if (scenarioData) {
      setLocalScenarioData(JSON.parse(JSON.stringify(scenarioData)));
    }
  }, [scenarioData]);
  
  // Editing hooks for different data types
  const assumptionsEditor = useEditableAssumptions();
  const b2bEditor = useEditableB2B();
  const costsEditor = useEditableCosts();
  const headcountEditor = useEditableHeadcount();
  const scenariosEditor = useEditableScenarios();
  
  // Loading and error states
  const isUpdating = assumptionsEditor.loading || b2bEditor.loading || costsEditor.loading || 
                     headcountEditor.loading || scenariosEditor.loading;
  
  const updateError = assumptionsEditor.error || b2bEditor.error || costsEditor.error || 
                      headcountEditor.error || scenariosEditor.error;

  // Handlers that update local state instead of Supabase directly
  const handleAssumptionChange = (assumptionType, year, value) => {
    setLocalScenarioData(prevData => {
      const newData = { ...prevData };
      newData.baseAssumptions[assumptionType][year] = parseFloat(value) || 0;
      return newData;
    });
  };
  
  const handleCostChange = (costType, year, value) => {
    setLocalScenarioData(prevData => {
      const newData = { ...prevData };
      newData.costs[costType][year] = parseFloat(value) || 0;
      return newData;
    });
  };
  
  const handleB2BClientChange = (tierName, year, value) => {
    setLocalScenarioData(prevData => {
      const newData = { ...prevData };
      newData.b2bClients[tierName][year] = parseInt(value) || 0;
      return newData;
    });
  };
  
  const handleB2BPricingChange = (tierName, year, value) => {
    setLocalScenarioData(prevData => {
      const newData = { ...prevData };
      newData.b2bPricing[tierName][year] = parseFloat(value) || 0;
      return newData;
    });
  };
  
  const handleHeadcountChange = (roleName, year, value) => {
    setLocalScenarioData(prevData => {
      const newData = { ...prevData };
      newData.headcount[roleName][year] = parseInt(value) || 0;
      return newData;
    });
  };
  
  const handleSalaryChange = (roleName, year, value) => {
    setLocalScenarioData(prevData => {
      const newData = { ...prevData };
      newData.salaries[roleName][year] = parseFloat(value) || 0;
      return newData;
    });
  };

  const handleMultiplierChange = (multiplierType, scenario, value) => {
    setLocalScenarioData(prevData => {
      const newData = { ...prevData };
      newData.multipliers[multiplierType] = parseFloat(value) || 0;
      return newData;
    });
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // This is a simplified example. In a real app, you'd want to be more sophisticated
      // about tracking dirty state and only updating what's changed.
      for (const year of [2026, 2027, 2028]) {
        for (const key in localScenarioData.baseAssumptions) {
          await assumptionsEditor.updateAssumption(key, year, localScenarioData.baseAssumptions[key][year]);
        }
        for (const key in localScenarioData.costs) {
          await costsEditor.updateCost(key, year, localScenarioData.costs[key][year]);
        }
        for (const key in localScenarioData.b2bClients) {
          await b2bEditor.updateClientCount(key, year, localScenarioData.b2bClients[key][year]);
        }
        for (const key in localScenarioData.b2bPricing) {
          await b2bEditor.updatePricing(key, year, localScenarioData.b2bPricing[key][year]);
        }
        for (const key in localScenarioData.headcount) {
          await headcountEditor.updateHeadcount(key, year, localScenarioData.headcount[key][year]);
        }
        for (const key in localScenarioData.salaries) {
          await headcountEditor.updateSalary(key, year, localScenarioData.salaries[key][year]);
        }
      }

      const scenarioObj = scenarios.find(s => s.name.toLowerCase() === selectedScenario.toLowerCase());
      if (scenarioObj) {
        for (const key in localScenarioData.multipliers) {
          await scenariosEditor.updateMultiplier(scenarioObj.id, key, localScenarioData.multipliers[key]);
        }
      }

      setLastSaved(new Date());
      await refresh();
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
    setIsSaving(false);
  };

  const handleRefresh = async () => {
    await refresh();
  };
  
  const handleResetToOriginalDefaults = async () => {
    if (window.confirm('This will reset ALL data to the original default values and cannot be undone. Are you sure?')) {
      try {
        // This would require implementing a reset functionality in the service layer
        console.log('Reset to defaults functionality would be implemented here');
        alert('Reset to defaults feature is not yet implemented for database mode.');
      } catch (error) {
        console.error('Failed to reset to defaults:', error);
      }
    }
  };

  if (!isOpen) return null;

  // Show setup instructions if Supabase is not configured
  if (!isSupabaseConfigured) {
    return (
      <div className="admin-overlay">
        <div className="admin-panel">
          <div className="admin-header">
            <div className="header-title">
              <h2>Supabase Setup Required</h2>
            </div>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="admin-content">
            <div className="supabase-setup-message">
              <div className="setup-icon">🚀</div>
              <h3>Database Configuration Required</h3>
              <p>The AdminPanel requires Supabase configuration to function properly.</p>
              
              <div className="setup-steps">
                <h4>For Local Development:</h4>
                <ol>
                  <li>
                    <strong>Create Supabase Project:</strong>
                    <br />Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a> and create a new project
                  </li>
                  <li>
                    <strong>Get Your Credentials:</strong>
                    <br />In your project dashboard, go to Settings → API
                    <br />Copy the "Project URL" and "anon public" key
                  </li>
                  <li>
                    <strong>Update .env File:</strong>
                    <br />Copy <code>.env.template</code> to <code>.env</code> and fill in your credentials:
                    <pre>
{`REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here`}
                    </pre>
                  </li>
                  <li>
                    <strong>Install Database Schema:</strong>
                    <br />In Supabase SQL Editor, run the contents of <code>src/database/schema-fixed.sql</code>
                  </li>
                </ol>
                
                <h4>For Vercel Deployment:</h4>
                <ol>
                  <li>
                    <strong>Add Environment Variables:</strong>
                    <br />In Vercel Dashboard → Project Settings → Environment Variables
                    <br />Add <code>REACT_APP_SUPABASE_URL</code> and <code>REACT_APP_SUPABASE_ANON_KEY</code>
                  </li>
                  <li>
                    <strong>Redeploy:</strong>
                    <br />Trigger a new deployment after adding the environment variables
                  </li>
                </ol>
              </div>
              
              <div className="setup-help">
                <h4>Need Help?</h4>
                <ul>
                  <li>📚 Full setup guide: <code>SUPABASE_SETUP.md</code></li>
                  <li>🔧 Integration guide: <code>ADMIN_PANEL_INTEGRATION.md</code></li>
                  <li>📊 Status report: <code>INTEGRATION_STATUS.md</code></li>
                </ul>
              </div>
              
              <div className="setup-note">
                <p><strong>Note:</strong> The AdminPanel will work normally once Supabase is configured. All your financial modeling data will be stored in the database instead of localStorage.</p>
              </div>
            </div>
          </div>
          <div className="admin-actions">
            <div className="action-group">
              <button className="cancel-btn" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <div className="header-title">
            <h2>Financial Model Admin Panel</h2>
            <div className="data-status">
              <span className="status-indicator database">🗄️ Supabase Database</span>
              <SavingIndicator 
                isSaving={isUpdating}
                lastSaved={lastSaved}
                error={updateError}
              />
            </div>
          </div>
          <div className="header-controls">
            <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
              {loading ? <LoadingSpinner size="small" /> : '🔄'}
            </button>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        <DataWrapper 
          loading={loading}
          error={error}
          data={scenarioData}
          onRetry={handleRefresh}
          loadingComponent={<div style={{padding: '2rem', textAlign: 'center'}}><LoadingSpinner size="large" /><p>Loading financial data...</p></div>}
        >
          {!localScenarioData ? (
            <div style={{padding: '2rem', textAlign: 'center'}}><LoadingSpinner size="large" /><p>Initializing editor...</p></div>
          ) : (
            <>
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
                            value={localScenarioData.baseAssumptions.global_nft_market_volume?.[year] || 0}
                            onChange={(e) => handleAssumptionChange('global_nft_market_volume', year, e.target.value)}
                            disabled={isUpdating}
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
                            value={localScenarioData.baseAssumptions.wallet_connection_rate?.[year] || 0}
                            onChange={(e) => handleAssumptionChange('wallet_connection_rate', year, e.target.value)}
                            disabled={isUpdating}
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
                            value={localScenarioData.baseAssumptions.avg_fee?.[year] || 0}
                            onChange={(e) => handleAssumptionChange('avg_fee', year, e.target.value)}
                            disabled={isUpdating}
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
                            value={localScenarioData.baseAssumptions.b2c_arpu?.[year] || 0}
                            onChange={(e) => handleAssumptionChange('b2c_arpu', year, e.target.value)}
                            disabled={isUpdating}
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
                            value={localScenarioData.costs.marketing_spend?.[year] || 0}
                            onChange={(e) => handleCostChange('marketing_spend', year, e.target.value)}
                            disabled={isUpdating}
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
                            value={localScenarioData.costs.hosting_cost_per_user?.[year] || 0}
                            onChange={(e) => handleCostChange('hosting_cost_per_user', year, e.target.value)}
                            disabled={isUpdating}
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
                            value={localScenarioData.costs.ga_fixed?.[year] || 0}
                            onChange={(e) => handleCostChange('ga_fixed', year, e.target.value)}
                            disabled={isUpdating}
                          />
                        </div>
                      ))}
                    </div>

                    <h3>B2B/API Client Assumptions</h3>
                    {scenarioData.b2bClients && Object.keys(scenarioData.b2bClients).map(tier => {
                      const tierLabels = {
                        tier_d: 'Tier D (Free)',
                        tier_c: 'Tier C (Basic)', 
                        tier_b: 'Tier B (Pro)',
                        tier_a: 'Tier A (Enterprise)',
                        tier_a_plus: 'Tier A+ (Premium)'
                      };
                      return (
                        <div key={tier} className="b2b-tier-group">
                          <h4>{tierLabels[tier] || tier}</h4>
                          <div className="tier-inputs">
                            <div className="tier-section">
                              <label>Client Count:</label>
                              <div className="year-inputs-row">
                                {[2026, 2027, 2028].map(year => (
                                  <div key={year} className="year-input-inline">
                                    <span>{year}:</span>
                                    <input
                                      type="number"
                                      value={localScenarioData.b2bClients[tier]?.[year] || 0}
                                      onChange={(e) => handleB2BClientChange(tier, year, e.target.value)}
                                      disabled={isUpdating}
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
                                      value={localScenarioData.b2bPricing?.[tier]?.[year] || 0}
                                      onChange={(e) => handleB2BPricingChange(tier, year, e.target.value)}
                                      disabled={isUpdating}
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
                    {scenarioData.headcount && Object.keys(scenarioData.headcount).map(role => {
                      const roleLabels = {
                        engineering: 'Engineering',
                        data_ml: 'Data & ML',
                        product_design: 'Product & Design', 
                        sales: 'Sales',
                        marketing: 'Marketing',
                        ops_finance: 'Operations & Finance'
                      };
                      return (
                        <div key={role} className="headcount-group">
                          <h4>{roleLabels[role] || role}</h4>
                          <div className="headcount-inputs">
                            <div className="headcount-section">
                              <label>Headcount (FTE):</label>
                              <div className="year-inputs-row">
                                {[2026, 2027, 2028].map(year => (
                                  <div key={year} className="year-input-inline">
                                    <span>{year}:</span>
                                    <input
                                      type="number"
                                      value={localScenarioData.headcount[role]?.[year] || 0}
                                      onChange={(e) => handleHeadcountChange(role, year, e.target.value)}
                                      disabled={isUpdating}
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
                                      value={localScenarioData.salaries?.[role]?.[year] || 0}
                                      onChange={(e) => handleSalaryChange(role, year, e.target.value)}
                                      disabled={isUpdating}
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

                {activeTab === 'multipliers' && localScenarioData.multipliers && (
                  <div className="multipliers-editor">
                    <h3>Scenario Multipliers</h3>
                    <p className="multiplier-description">
                      These multipliers are applied to base assumptions for different scenarios.
                    </p>
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
                          {Object.entries({
                            traffic_multiplier: 'Global NFT Market Volume Multiplier',
                            paid_conversion_multiplier: 'Average Fee Multiplier',
                            b2c_arpu_multiplier: 'B2C ARPU Multiplier',
                            b2b_clients_multiplier: 'B2B Clients Multiplier',
                            b2b_price_multiplier: 'B2B Price Multiplier',
                            marketing_spend_multiplier: 'Marketing Spend Multiplier',
                            hosting_cost_multiplier: 'Hosting Cost Multiplier',
                            ga_multiplier: 'G&A Multiplier'
                          }).map(([key, label]) => (
                            <tr key={key}>
                              <td className="multiplier-label">{label}</td>
                              <td>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={localScenarioData.multipliers[key] || 1.0}
                                  onChange={(e) => handleMultiplierChange(key, 'base', e.target.value)}
                                  disabled={isUpdating}
                                  readOnly={selectedScenario !== 'Base'}
                                  title={selectedScenario !== 'Base' ? 'Switch to Base scenario to edit' : ''}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={1.0} 
                                  disabled
                                  placeholder="Switch to Upside scenario"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={1.0}
                                  disabled
                                  placeholder="Switch to Downside scenario"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="scenario-switcher">
                        <label>Edit multipliers for scenario:</label>
                        <select 
                          value={selectedScenario}
                          onChange={(e) => setSelectedScenario(e.target.value)}
                          disabled={isUpdating}
                        >
                          {scenarios.map(scenario => (
                            <option key={scenario.id} value={scenario.name}>
                              {scenario.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DataWrapper>

        <div className="admin-actions">
          <div className="left-actions">
            <button className="reset-original-btn" onClick={handleResetToOriginalDefaults}>
              🔄 Reset to Factory Defaults
            </button>
            <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
              {loading ? <LoadingSpinner size="small" /> : '🔄 Refresh'}
            </button>
          </div>
          <div className="action-group">
            <button className="cancel-btn" onClick={onClose}>Close</button>
            <button className="save-btn" onClick={handleSave} disabled={isSaving || isUpdating}>
              {isSaving ? <LoadingSpinner size="small" /> : '💾 Save Changes'}
            </button>
          </div>
          {updateError && (
            <div className="error-display">
              <ErrorMessage 
                error={updateError} 
                showRetry={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

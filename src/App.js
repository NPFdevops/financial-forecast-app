import React, { useState, useEffect } from 'react';
import './App.css';
import { scenarioMultipliers, baseAssumptions } from './data/financialModel';
import ScenarioSelector from './components/ScenarioSelector';
import ExecutiveSummary from './components/ExecutiveSummary';
import AssumptionsTable from './components/AssumptionsTable';
import B2BAssumptionsTable from './components/B2BAssumptionsTable';
import CostBreakdownTable from './components/CostBreakdownTable';
import HeadcountSalaryTable from './components/HeadcountSalaryTable';
import PLTable from './components/PLTable';
import CashFlowTable from './components/CashFlowTable';
import FinancialCharts from './components/FinancialCharts';
import AdminPanel from './components/AdminPanel';
import PDFExport from './components/PDFExport';

function App() {
  const [selectedScenario, setSelectedScenario] = useState('base');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('executive-summary');
  
  // Initialize state with data from localStorage or defaults
  const [currentAssumptions, setCurrentAssumptions] = useState(() => {
    try {
      const savedAssumptions = localStorage.getItem('financialForecastAssumptions');
      return savedAssumptions ? JSON.parse(savedAssumptions) : baseAssumptions;
    } catch (error) {
      console.error('Error loading assumptions from localStorage:', error);
      return baseAssumptions;
    }
  });
  
  const [currentMultipliers, setCurrentMultipliers] = useState(() => {
    try {
      const savedMultipliers = localStorage.getItem('financialForecastMultipliers');
      return savedMultipliers ? JSON.parse(savedMultipliers) : scenarioMultipliers;
    } catch (error) {
      console.error('Error loading multipliers from localStorage:', error);
      return scenarioMultipliers;
    }
  });
  
  const [financialData, setFinancialData] = useState(null);

  // Recalculate financial data when scenario, assumptions, or multipliers change
  useEffect(() => {
    const calculateFinancialsWithCustomData = (scenario, assumptions, multipliers) => {
      const multiplierValues = Object.keys(multipliers).reduce((acc, key) => {
        acc[key] = multipliers[key][scenario];
        return acc;
      }, {});

      const results = {};
      
      [2026, 2027, 2028].forEach(year => {
        // Apply multipliers to current assumptions
        const adjustedTraffic = assumptions.trafficSessions[year] * multiplierValues.trafficMultiplier;
        const adjustedConversionRate = assumptions.paidConversionRate[year] * multiplierValues.paidConversionMultiplier;
        const adjustedArpu = assumptions.b2cArpu[year] * multiplierValues.b2cArpuMultiplier;
        
        // B2C Revenue calculation
        const activePaidUsers = adjustedTraffic * assumptions.walletConnectionRate[year] * adjustedConversionRate;
        const b2cRevenue = activePaidUsers * adjustedArpu * 12;
        
        // B2B Revenue calculation
        let b2bRevenue = 0;
        Object.keys(assumptions.b2bClients).forEach(tier => {
          const clients = assumptions.b2bClients[tier][year] * multiplierValues.b2bClientsMultiplier;
          const pricing = assumptions.b2bPricing[tier][year] * multiplierValues.b2bPriceMultiplier;
          b2bRevenue += clients * pricing * 12;
        });
        
        const totalRevenue = b2cRevenue + b2bRevenue;
        
        // Costs calculation
        const hostingCost = assumptions.costs.hostingCostPerUser[year] * multiplierValues.hostingCostMultiplier * 12;
        const grossMargin = totalRevenue - hostingCost;
        
        // Operating expenses
        let totalSalaries = 0;
        Object.keys(assumptions.headcount).forEach(role => {
          const headcount = assumptions.headcount[role][year];
          const salary = assumptions.salariesMonthly[role][year];
          totalSalaries += headcount * salary * 12;
        });
        
        const marketingCost = assumptions.costs.marketingSpend[year] * multiplierValues.marketingSpendMultiplier * 12;
        const gaCost = assumptions.costs.gaFixed[year] * multiplierValues.gaMultiplier * 12;
        
        const totalOpex = totalSalaries + marketingCost + gaCost;
        const ebitda = grossMargin - totalOpex;
        
        results[year] = {
          activePaidUsers: Math.round(activePaidUsers),
          b2cRevenue: Math.round(b2cRevenue),
          b2bRevenue: Math.round(b2bRevenue),
          totalRevenue: Math.round(totalRevenue),
          hostingCost: Math.round(hostingCost),
          grossMargin: Math.round(grossMargin),
          salaries: Math.round(totalSalaries),
          marketing: Math.round(marketingCost),
          ga: Math.round(gaCost),
          totalOpex: Math.round(totalOpex),
          ebitda: Math.round(ebitda)
        };
      });
      
      return results;
    };

    const newFinancialData = calculateFinancialsWithCustomData(selectedScenario, currentAssumptions, currentMultipliers);
    setFinancialData(newFinancialData);
  }, [selectedScenario, currentAssumptions, currentMultipliers]);

  const handleUpdateAssumptions = (newAssumptions) => {
    setCurrentAssumptions(newAssumptions);
    // Save to localStorage for persistence
    try {
      localStorage.setItem('financialForecastAssumptions', JSON.stringify(newAssumptions));
      console.log('Assumptions saved to localStorage');
    } catch (error) {
      console.error('Error saving assumptions to localStorage:', error);
    }
  };

  const handleUpdateMultipliers = (newMultipliers) => {
    setCurrentMultipliers(newMultipliers);
    // Save to localStorage for persistence
    try {
      localStorage.setItem('financialForecastMultipliers', JSON.stringify(newMultipliers));
      console.log('Multipliers saved to localStorage');
    } catch (error) {
      console.error('Error saving multipliers to localStorage:', error);
    }
  };

  // Function to reset all data to original defaults
  const handleResetToDefaults = () => {
    setCurrentAssumptions(baseAssumptions);
    setCurrentMultipliers(scenarioMultipliers);
    // Clear localStorage
    try {
      localStorage.removeItem('financialForecastAssumptions');
      localStorage.removeItem('financialForecastMultipliers');
      console.log('Data reset to defaults and localStorage cleared');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  if (!financialData) {
    return (
      <div className="App">
        <div className="dashboard-container">
          <div className="dashboard-content" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '1.25rem', color: 'var(--primary-500)', fontWeight: '600'}}>Loading financial data...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { id: 'executive-summary', label: 'Overview', icon: '📊' },
    { id: 'assumptions', label: 'Assumptions', icon: '⚙️' },
    { id: 'pnl', label: 'P&L Statement', icon: '💰' },
    { id: 'cashflow', label: 'Cash Flow', icon: '💸' },
    { id: 'scenarios', label: 'Scenarios', icon: '📈' },
    { id: 'export', label: 'Export PDF', icon: '📄' }
  ];

  const getPageTitle = () => {
    const currentPage = navigationItems.find(item => item.id === activeTab);
    return currentPage ? currentPage.label : 'Dashboard';
  };

  return (
    <div className="App">
      {/* Mobile Restriction */}
      <div className="mobile-restriction">
        <div className="mobile-message">
          <h2>💻 Desktop Required</h2>
          <p>This financial dashboard is optimized for desktop viewing.</p>
          <p>Please access from a desktop or laptop computer for the best experience.</p>
        </div>
      </div>

      {/* Desktop Dashboard */}
      <div className="desktop-content">
        <div className="dashboard-container">
          {/* Sidebar Navigation */}
          <nav className="dashboard-sidebar">
            <div className="sidebar-header">
              <div className="sidebar-logo">
                <div className="sidebar-logo-icon">💼</div>
                <span>Financial Forecast</span>
              </div>
            </div>
            
            <div className="sidebar-nav">
              <div className="nav-section">
                <div className="nav-section-title">Dashboard</div>
                {navigationItems.map(item => (
                  <button
                    key={item.id}
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="dashboard-main">
            {/* Header */}
            <header className="dashboard-header">
              <div className="header-left">
                <h1 className="page-title">{getPageTitle()}</h1>
              </div>
              
              <div className="header-right">
                {localStorage.getItem('financialForecastAssumptions') && (
                  <div className="persistence-note">
                    <span>💾</span>
                    <span>Custom Data Active</span>
                  </div>
                )}
                
                <button 
                  className="admin-btn" 
                  onClick={() => setIsAdminOpen(true)}
                  title="Edit Model Parameters"
                >
                  <span>⚙️</span>
                  <span>Edit Model</span>
                </button>
              </div>
            </header>

            {/* Content Area */}
            <main className="dashboard-content">
              {/* Scenario Selector */}
              <ScenarioSelector 
                selectedScenario={selectedScenario}
                onScenarioChange={setSelectedScenario}
              />

              {/* Page Content */}
              {activeTab === 'executive-summary' && (
                <ExecutiveSummary 
                  selectedScenario={selectedScenario}
                  financialData={financialData}
                />
              )}

              {activeTab === 'assumptions' && (
                <div className="assumptions-page">
                  {/* Scenario Multipliers Section */}
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title">
                        <span>⚙️</span>
                        Scenario Multipliers
                      </h2>
                      <p className="card-subtitle">Adjust scenario-specific multipliers to create different business scenarios</p>
                    </div>
                    <div className="card-content">
                      <AssumptionsTable 
                        selectedScenario={selectedScenario}
                        multipliers={currentMultipliers}
                      />
                    </div>
                  </div>
                  
                  {/* Base Assumptions Title */}
                  <div className="assumptions-section-header">
                    <h2 className="section-title">Base Assumptions</h2>
                    <p className="section-description">These are the fundamental business assumptions that serve as the foundation for all scenarios</p>
                  </div>
                  
                  {/* B2B Business Assumptions */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <span>🏢</span>
                        B2B Business Assumptions
                      </h3>
                      <p className="card-subtitle">Customer acquisition, pricing, and revenue assumptions for B2B clients</p>
                    </div>
                    <div className="card-content">
                      <B2BAssumptionsTable baseAssumptions={currentAssumptions} />
                    </div>
                  </div>
                  
                  {/* Cost Structure */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <span>💸</span>
                        Cost Structure & Operations
                      </h3>
                      <p className="card-subtitle">Operating costs, hosting expenses, and business overhead assumptions</p>
                    </div>
                    <div className="card-content">
                      <CostBreakdownTable baseAssumptions={currentAssumptions} />
                    </div>
                  </div>
                  
                  {/* Team & Compensation */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <span>👥</span>
                        Team & Compensation
                      </h3>
                      <p className="card-subtitle">Headcount planning and salary assumptions across all team functions</p>
                    </div>
                    <div className="card-content">
                      <HeadcountSalaryTable baseAssumptions={currentAssumptions} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pnl' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">
                      <span>💰</span>
                      Profit & Loss Statement
                    </h2>
                    <p className="card-subtitle">Revenue, costs, and profitability projections</p>
                  </div>
                  <div className="card-content">
                    <PLTable 
                      selectedScenario={selectedScenario}
                      financialData={financialData}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'cashflow' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">
                      <span>💸</span>
                      Cash Flow & Runway Analysis
                    </h2>
                    <p className="card-subtitle">Cash flow projections and runway calculations</p>
                  </div>
                  <div className="card-content">
                    <CashFlowTable 
                      selectedScenario={selectedScenario}
                      financialData={financialData}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'scenarios' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">
                      <span>📈</span>
                      Scenario Comparison & Analysis
                    </h2>
                    <p className="card-subtitle">Visualize and compare different business scenarios</p>
                  </div>
                  <div className="card-content">
                    <FinancialCharts 
                      selectedScenario={selectedScenario}
                      financialData={financialData}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'export' && (
                <PDFExport 
                  financialData={financialData}
                  currentAssumptions={currentAssumptions}
                  currentMultipliers={currentMultipliers}
                  selectedScenario={selectedScenario}
                />
              )}
            </main>
          </div>
        </div>
      </div>

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        baseAssumptions={currentAssumptions}
        scenarioMultipliers={currentMultipliers}
        onUpdateAssumptions={handleUpdateAssumptions}
        onUpdateMultipliers={handleUpdateMultipliers}
        onResetToDefaults={handleResetToDefaults}
      />
    </div>
  );
}

export default App;

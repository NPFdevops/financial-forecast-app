import React, { useState, useMemo } from 'react';
import './App.css';
import { useScenarioData } from './hooks/useFinancialModel';
import { scenarioMultipliers, baseAssumptions } from './data/financialModel';
import ScenarioSelector from './components/ScenarioSelector';
import ExecutiveSummary from './components/ExecutiveSummary';
import AssumptionsTable from './components/AssumptionsTable';
// Importing only the components that are actually used
import PLTable from './components/PLTable';
import CashFlowTable from './components/CashFlowTable';
import FinancialCharts from './components/FinancialCharts';
import AdminPanel from './components/AdminPanel';
import PDFExport from './components/PDFExport';

function App() {
  const [selectedScenario, setSelectedScenario] = useState('Base');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('executive-summary');
  
  // Use the useScenarioData hook to fetch and calculate financial data
  const { calculations, loading, error, refresh } = useScenarioData(selectedScenario);
  
  // Map the calculations to the format expected by the components
  const financialData = useMemo(() => {
    if (!calculations) return null;
    
    const result = {};
    Object.entries(calculations).forEach(([year, metrics]) => {
      result[year] = {
        activePaidUsers: metrics.activePaidUsers,
        b2cRevenue: metrics.b2cRevenue,
        b2bRevenue: metrics.b2bRevenue,
        totalRevenue: metrics.totalRevenue,
        hostingCost: metrics.hostingCost,
        grossMargin: metrics.grossMargin,
        salaries: metrics.salaries,
        marketing: metrics.marketing,
        ga: metrics.ga,
        totalOpex: metrics.totalOpex,
        ebitda: metrics.ebitda
      };
    });
    return result;
  }, [calculations]);

  const toggleAdminPanel = () => {
    setIsAdminOpen(!isAdminOpen);
  };

  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
  };
  
  // Refresh data when admin panel is closed
  const handleAdminClose = () => {
    setIsAdminOpen(false);
    refresh();
  };

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

  if (loading) {
    return <div className="loading">Loading financial data...</div>;
  }

  if (error) {
    return <div className="error">Error loading financial data: {error}</div>;
  }

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
                <button 
                  className="admin-btn" 
                  onClick={toggleAdminPanel}
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
                onScenarioChange={handleScenarioChange}
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
                  <AssumptionsTable 
                    selectedScenario={selectedScenario.toLowerCase()} 
                    multipliers={scenarioMultipliers} 
                  />
                </div>
              )}

              {activeTab === 'pnl' && (
                <PLTable 
                  selectedScenario={selectedScenario.toLowerCase()}
                  financialData={financialData} 
                />
              )}

              {activeTab === 'cashflow' && (
                <CashFlowTable 
                  selectedScenario={selectedScenario.toLowerCase()}
                  financialData={financialData} 
                />
              )}

              {activeTab === 'scenarios' && (
                <FinancialCharts 
                  selectedScenario={selectedScenario.toLowerCase()}
                  financialData={financialData} 
                />
              )}

              {activeTab === 'export' && (
                <PDFExport 
                  financialData={financialData}
                  currentAssumptions={baseAssumptions}
                  currentMultipliers={scenarioMultipliers}
                  selectedScenario={selectedScenario.toLowerCase()}
                />
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Admin Panel */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={handleAdminClose}
      />
    </div>
  );
}

export default App;

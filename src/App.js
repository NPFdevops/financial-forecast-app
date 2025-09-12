import React, { useState, useEffect } from 'react';
import './App.css';
import { scenarioMultipliers, baseAssumptions } from './data/financialModel';
import ScenarioSelector from './components/ScenarioSelector';
import ExecutiveSummary from './components/ExecutiveSummary';
import AssumptionsTable from './components/AssumptionsTable';
import PLTable from './components/PLTable';
import CashFlowTable from './components/CashFlowTable';
import FinancialCharts from './components/FinancialCharts';
import AdminPanel from './components/AdminPanel';

function App() {
  const [selectedScenario, setSelectedScenario] = useState('base');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentAssumptions, setCurrentAssumptions] = useState(baseAssumptions);
  const [currentMultipliers, setCurrentMultipliers] = useState(scenarioMultipliers);
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
  };

  const handleUpdateMultipliers = (newMultipliers) => {
    setCurrentMultipliers(newMultipliers);
  };

  if (!financialData) {
    return (
      <div className="App">
        <div className="loading">Loading financial data...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>Financial Forecast Dashboard</h1>
          <button 
            className="admin-btn" 
            onClick={() => setIsAdminOpen(true)}
            title="Open Admin Panel"
          >
            ⚙️ Edit Model
          </button>
        </div>
        <ScenarioSelector 
          selectedScenario={selectedScenario}
          onScenarioChange={setSelectedScenario}
        />
      </header>
      
      <main className="App-main">
        <ExecutiveSummary 
          selectedScenario={selectedScenario}
          financialData={financialData}
        />
        
        <section className="assumptions-section">
          <h2>Scenario Assumptions</h2>
          <AssumptionsTable 
            selectedScenario={selectedScenario}
            multipliers={currentMultipliers}
          />
        </section>
        
        <section className="charts-section">
          <FinancialCharts 
            selectedScenario={selectedScenario}
            financialData={financialData}
          />
        </section>
        
        <section className="pl-section">
          <h2>P&L Statement</h2>
          <PLTable 
            selectedScenario={selectedScenario}
            financialData={financialData}
          />
        </section>
        
        <section className="cashflow-section">
          <h2>Cash Flow & Runway</h2>
          <CashFlowTable 
            selectedScenario={selectedScenario}
            financialData={financialData}
          />
        </section>
      </main>

      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        baseAssumptions={currentAssumptions}
        scenarioMultipliers={currentMultipliers}
        onUpdateAssumptions={handleUpdateAssumptions}
        onUpdateMultipliers={handleUpdateMultipliers}
      />
    </div>
  );
}

export default App;

import React from 'react';
import './ExecutiveSummary.css';
import { baseAssumptions } from '../data/financialModel';
import InfoTooltip from './InfoTooltip';
import { calculationDefinitions } from '../data/calculationDefinitions';

const ExecutiveSummary = ({ selectedScenario, financialData }) => {
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const calculateCashAndRunway = () => {
    const years = [2026, 2027, 2028];
    const cashData = {};
    
    years.forEach(year => {
      const ebitda = financialData[year].ebitda;
      const monthlyBurn = Math.abs(ebitda) / 12;
      
      cashData[year] = {
        yearEndCash: year === 2026 ? 
          baseAssumptions.cashFlow.startingCash + baseAssumptions.cashFlow.plannedRaises[year] + ebitda :
          (cashData[year - 1]?.yearEndCash || 0) + baseAssumptions.cashFlow.plannedRaises[year] + ebitda,
        runwayMonths: ebitda >= 0 ? '∞' : Math.max(0, Math.floor(
          ((year === 2026 ? baseAssumptions.cashFlow.startingCash : cashData[year - 1]?.yearEndCash || 0) + 
           baseAssumptions.cashFlow.plannedRaises[year]) / monthlyBurn
        ))
      };
    });
    
    return cashData;
  };

  const cashFlowData = calculateCashAndRunway();
  const scenarioName = selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1);
  const scenarioNumber = selectedScenario === 'base' ? '1' : selectedScenario === 'upside' ? '2' : '3';

  return (
    <div className="executive-summary">
      <div className="summary-header">
        <h2>Executive Summary</h2>
        <div className="scenario-indicator">
          <span className="scenario-label">Selected Scenario:</span>
          <span className={`scenario-badge ${selectedScenario}`}>
            {scenarioNumber} - {scenarioName}
          </span>
        </div>
      </div>
      
      <div className="summary-content">
        <div className="summary-table">
          <table>
            <thead>
              <tr>
                <th>Key Outputs (Selected Scenario)</th>
                <th>2026</th>
                <th>2027</th>
                <th>2028</th>
              </tr>
            </thead>
            <tbody>
              <tr className="revenue-section">
                <td>
                  <strong>Revenue (Total)</strong>
                  <InfoTooltip {...calculationDefinitions.totalRevenue} />
                </td>
                {[2026, 2027, 2028].map(year => (
                  <td key={year}><strong>{formatCurrency(financialData[year].totalRevenue)}</strong></td>
                ))}
              </tr>
              <tr className="revenue-breakdown">
                <td>
                  - B2C Revenue
                  <InfoTooltip {...calculationDefinitions.b2cRevenue} />
                </td>
                {[2026, 2027, 2028].map(year => (
                  <td key={year}>{formatCurrency(financialData[year].b2cRevenue)}</td>
                ))}
              </tr>
              <tr className="revenue-breakdown">
                <td>
                  - B2B/API Revenue
                  <InfoTooltip {...calculationDefinitions.b2bRevenue} />
                </td>
                {[2026, 2027, 2028].map(year => (
                  <td key={year}>{formatCurrency(financialData[year].b2bRevenue)}</td>
                ))}
              </tr>
              <tr className="gross-margin">
                <td>
                  <strong>Gross Margin</strong>
                  <InfoTooltip {...calculationDefinitions.grossMargin} />
                </td>
                {[2026, 2027, 2028].map(year => (
                  <td key={year}><strong>{formatCurrency(financialData[year].grossMargin)}</strong></td>
                ))}
              </tr>
              <tr className="opex">
                <td>
                  <strong>Opex (Salaries + Marketing + G&A)</strong>
                  <InfoTooltip {...calculationDefinitions.totalOpex} />
                </td>
                {[2026, 2027, 2028].map(year => (
                  <td key={year}><strong>{formatCurrency(financialData[year].totalOpex)}</strong></td>
                ))}
              </tr>
              <tr className="ebitda">
                <td>
                  <strong>EBITDA</strong>
                  <InfoTooltip {...calculationDefinitions.ebitda} />
                </td>
                {[2026, 2027, 2028].map(year => (
                  <td key={year} className={financialData[year].ebitda >= 0 ? 'positive' : 'negative'}>
                    <strong>{formatCurrency(financialData[year].ebitda)}</strong>
                  </td>
                ))}
              </tr>
              <tr className="year-end-cash">
                <td>
                  <strong>Year-end Cash</strong>
                  <InfoTooltip {...calculationDefinitions.yearEndCash} />
                </td>
                {[2026, 2027, 2028].map(year => (
                  <td key={year} className={cashFlowData[year].yearEndCash >= 0 ? 'positive' : 'negative'}>
                    <strong>{formatCurrency(cashFlowData[year].yearEndCash)}</strong>
                  </td>
                ))}
              </tr>
              <tr className="runway">
                <td>
                  <strong>Runway (months)</strong>
                  <InfoTooltip {...calculationDefinitions.runway} />
                </td>
                {[2026, 2027, 2028].map(year => (
                  <td key={year} className={typeof cashFlowData[year].runwayMonths === 'string' || cashFlowData[year].runwayMonths > 12 ? 'positive' : 'warning'}>
                    <strong>{typeof cashFlowData[year].runwayMonths === 'string' ? cashFlowData[year].runwayMonths : `${cashFlowData[year].runwayMonths}m`}</strong>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;

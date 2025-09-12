import React from 'react';
import './CashFlowTable.css';
import { baseAssumptions } from '../data/financialModel';
import InfoTooltip from './InfoTooltip';
import { calculationDefinitions } from '../data/calculationDefinitions';

const CashFlowTable = ({ selectedScenario, financialData }) => {
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  // Calculate cash flow and runway based on EBITDA and assumptions
  const calculateCashFlow = () => {
    const years = [2026, 2027, 2028];
    const cashData = {};
    
    years.forEach(year => {
      const ebitda = financialData[year].ebitda;
      const monthlyBurn = Math.abs(ebitda) / 12; // Monthly burn rate
      
      cashData[year] = {
        startingCash: year === 2026 ? baseAssumptions.cashFlow.startingCash : cashData[year - 1]?.yearEndCash || 0,
        equityRaises: baseAssumptions.cashFlow.plannedRaises[year],
        ebitda: ebitda,
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

  const cashFlowData = calculateCashFlow();

  return (
    <div className="cashflow-table">
      <table>
        <thead>
          <tr>
            <th>Cash Flow & Runway</th>
            <th>2026</th>
            <th>2027</th>
            <th>2028</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Starting Cash</td>
            <td>{formatCurrency(cashFlowData[2026].startingCash)}</td>
            <td>{formatCurrency(cashFlowData[2027].startingCash)}</td>
            <td>{formatCurrency(cashFlowData[2028].startingCash)}</td>
          </tr>
          <tr>
            <td>Equity Raises</td>
            <td>{formatCurrency(cashFlowData[2026].equityRaises)}</td>
            <td>{formatCurrency(cashFlowData[2027].equityRaises)}</td>
            <td>{formatCurrency(cashFlowData[2028].equityRaises)}</td>
          </tr>
          <tr className="year-end-cash">
            <td>
              <strong>Year-end Cash (Base)</strong>
              <InfoTooltip {...calculationDefinitions.yearEndCash} />
            </td>
            <td className={cashFlowData[2026].yearEndCash >= 0 ? 'positive' : 'negative'}>
              <strong>{formatCurrency(cashFlowData[2026].yearEndCash)}</strong>
            </td>
            <td className={cashFlowData[2027].yearEndCash >= 0 ? 'positive' : 'negative'}>
              <strong>{formatCurrency(cashFlowData[2027].yearEndCash)}</strong>
            </td>
            <td className={cashFlowData[2028].yearEndCash >= 0 ? 'positive' : 'negative'}>
              <strong>{formatCurrency(cashFlowData[2028].yearEndCash)}</strong>
            </td>
          </tr>
          <tr className="runway">
            <td>
              <strong>Runway (months @ avg monthly burn)</strong>
              <InfoTooltip {...calculationDefinitions.runway} />
            </td>
            <td className={typeof cashFlowData[2026].runwayMonths === 'string' || cashFlowData[2026].runwayMonths > 12 ? 'positive' : 'warning'}>
              <strong>{typeof cashFlowData[2026].runwayMonths === 'string' ? cashFlowData[2026].runwayMonths : `${cashFlowData[2026].runwayMonths} months`}</strong>
            </td>
            <td className={typeof cashFlowData[2027].runwayMonths === 'string' || cashFlowData[2027].runwayMonths > 12 ? 'positive' : 'warning'}>
              <strong>{typeof cashFlowData[2027].runwayMonths === 'string' ? cashFlowData[2027].runwayMonths : `${cashFlowData[2027].runwayMonths} months`}</strong>
            </td>
            <td className={typeof cashFlowData[2028].runwayMonths === 'string' || cashFlowData[2028].runwayMonths > 12 ? 'positive' : 'warning'}>
              <strong>{typeof cashFlowData[2028].runwayMonths === 'string' ? cashFlowData[2028].runwayMonths : `${cashFlowData[2028].runwayMonths} months`}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div className="scenario-note">
        <p><strong>Note:</strong> Cash flow projections are based on EBITDA from the selected {selectedScenario} scenario. 
        Runway calculations assume average monthly burn rate based on annual EBITDA.</p>
      </div>
    </div>
  );
};

export default CashFlowTable;

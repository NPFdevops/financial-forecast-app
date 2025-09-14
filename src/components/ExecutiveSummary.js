import React from 'react';
import './ExecutiveSummary.css';
import { baseAssumptions } from '../data/financialModel';
import InfoTooltip from './InfoTooltip';
import { calculationDefinitions } from '../data/calculationDefinitions';

const ExecutiveSummary = ({ selectedScenario, financialData }) => {
  // Handle loading or missing data
  if (!financialData) {
    return <div className="loading">Loading financial data...</div>;
  }
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
      // Safely access financial data with null checks
      const yearData = financialData[year];
      if (!yearData) return;
      
      const ebitda = yearData.ebitda || 0;
      const monthlyBurn = Math.abs(ebitda) / 12 || 1; // Avoid division by zero
      
      cashData[year] = {
        yearEndCash: year === 2026 ? 
          (baseAssumptions?.cashFlow?.startingCash || 0) + (baseAssumptions?.cashFlow?.plannedRaises?.[year] || 0) + ebitda :
          (cashData[year - 1]?.yearEndCash || 0) + (baseAssumptions?.cashFlow?.plannedRaises?.[year] || 0) + ebitda,
        runwayMonths: ebitda >= 0 ? '∞' : Math.max(0, Math.floor(
          ((year === 2026 ? (baseAssumptions?.cashFlow?.startingCash || 0) : cashData[year - 1]?.yearEndCash || 0) + 
           (baseAssumptions?.cashFlow?.plannedRaises?.[year] || 0)) / monthlyBurn
        ))
      };
    });
    
    return cashData;
  };

  const cashFlowData = calculateCashAndRunway();
  const scenarioName = selectedScenario?.charAt(0)?.toUpperCase() + selectedScenario?.slice(1) || 'Scenario';
  const scenarioNumber = selectedScenario === 'base' ? '1' : selectedScenario === 'upside' ? '2' : '3';

  // Calculate year-over-year growth
  const calculateGrowth = (currentYear, previousYear, metric) => {
    if (!financialData?.[previousYear] || !financialData?.[currentYear]) return null;
    const current = financialData[currentYear]?.[metric];
    const previous = financialData[previousYear]?.[metric];
    if (previous === 0 || previous === undefined || current === undefined) return null;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  // Get latest year metrics for overview cards
  const latestYear = 2028;
  const metrics = [
    {
      label: 'Total Revenue',
      value: formatCurrency(financialData[latestYear].totalRevenue),
      change: calculateGrowth(latestYear, 2027, 'totalRevenue'),
      icon: '💰',
      color: 'primary'
    },
    {
      label: 'Gross Margin',
      value: formatCurrency(financialData[latestYear].grossMargin),
      change: calculateGrowth(latestYear, 2027, 'grossMargin'),
      icon: '📈',
      color: 'success'
    },
    {
      label: 'EBITDA',
      value: formatCurrency(financialData[latestYear].ebitda),
      change: calculateGrowth(latestYear, 2027, 'ebitda'),
      icon: financialData[latestYear].ebitda >= 0 ? '✅' : '❌',
      color: financialData[latestYear].ebitda >= 0 ? 'success' : 'error'
    },
    {
      label: 'Cash Runway',
      value: typeof cashFlowData[latestYear].runwayMonths === 'string' ? 
        cashFlowData[latestYear].runwayMonths : 
        `${cashFlowData[latestYear].runwayMonths}m`,
      change: null,
      icon: '💸',
      color: typeof cashFlowData[latestYear].runwayMonths === 'string' || 
             cashFlowData[latestYear].runwayMonths > 12 ? 'success' : 'warning'
    }
  ];

  return (
    <div className="executive-summary">
      <div className="content-header">
        <div>
          <h1 className="content-title">Executive Summary</h1>
          <p className="content-description">
            Key financial metrics and projections for the {scenarioName} scenario
          </p>
        </div>
        <div className={`badge badge-${selectedScenario === 'upside' ? 'success' : selectedScenario === 'downside' ? 'warning' : 'primary'}`}>
          Scenario {scenarioNumber}: {scenarioName}
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-4">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{metric.icon}</span>
              {metric.change !== null && (
                <div className={`metric-change ${metric.change >= 0 ? 'positive' : 'negative'}`}>
                  <span>{metric.change >= 0 ? '↑' : '↓'}</span>
                  <span>{Math.abs(metric.change).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Detailed Financial Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span>📁</span>
            Detailed Financial Projections
          </h2>
          <p className="card-subtitle">Three-year financial forecast breakdown</p>
        </div>
        <div className="card-content">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>2026</th>
                  <th>2027</th>
                  <th>2028</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Total Revenue</strong>
                    <InfoTooltip {...calculationDefinitions.totalRevenue} />
                  </td>
                  {[2026, 2027, 2028].map(year => (
                    <td key={year}><strong>{formatCurrency(financialData[year].totalRevenue)}</strong></td>
                  ))}
                </tr>
                <tr>
                  <td>
                      • B2C Revenue
                    <InfoTooltip {...calculationDefinitions.b2cRevenue} />
                  </td>
                  {[2026, 2027, 2028].map(year => (
                    <td key={year}>{formatCurrency(financialData[year].b2cRevenue)}</td>
                  ))}
                </tr>
                <tr>
                  <td>
                      • B2B/API Revenue
                    <InfoTooltip {...calculationDefinitions.b2bRevenue} />
                  </td>
                  {[2026, 2027, 2028].map(year => (
                    <td key={year}>{formatCurrency(financialData[year].b2bRevenue)}</td>
                  ))}
                </tr>
                <tr>
                  <td>
                    <strong>Gross Margin</strong>
                    <InfoTooltip {...calculationDefinitions.grossMargin} />
                  </td>
                  {[2026, 2027, 2028].map(year => (
                    <td key={year}><strong>{formatCurrency(financialData[year].grossMargin)}</strong></td>
                  ))}
                </tr>
                <tr>
                  <td>
                    <strong>Total OpEx</strong>
                    <InfoTooltip {...calculationDefinitions.totalOpex} />
                  </td>
                  {[2026, 2027, 2028].map(year => (
                    <td key={year}><strong>{formatCurrency(financialData[year].totalOpex)}</strong></td>
                  ))}
                </tr>
                <tr>
                  <td>
                    <strong>EBITDA</strong>
                    <InfoTooltip {...calculationDefinitions.ebitda} />
                  </td>
                  {[2026, 2027, 2028].map(year => (
                    <td key={year} className={`status-${financialData[year].ebitda >= 0 ? 'positive' : 'negative'}`}>
                      <strong>{formatCurrency(financialData[year].ebitda)}</strong>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>
                    <strong>Year-end Cash</strong>
                    <InfoTooltip {...calculationDefinitions.yearEndCash} />
                  </td>
                  {[2026, 2027, 2028].map(year => (
                    <td key={year} className={`status-${cashFlowData[year].yearEndCash >= 0 ? 'positive' : 'negative'}`}>
                      <strong>{formatCurrency(cashFlowData[year].yearEndCash)}</strong>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>
                    <strong>Runway (months)</strong>
                    <InfoTooltip {...calculationDefinitions.runway} />
                  </td>
                  {[2026, 2027, 2028].map(year => (
                    <td key={year} className={`status-${typeof cashFlowData[year].runwayMonths === 'string' || cashFlowData[year].runwayMonths > 12 ? 'positive' : 'warning'}`}>
                      <strong>{typeof cashFlowData[year].runwayMonths === 'string' ? cashFlowData[year].runwayMonths : `${cashFlowData[year].runwayMonths}m`}</strong>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;

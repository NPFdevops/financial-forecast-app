import React from 'react';
import './AssumptionsTable.css';
import InfoTooltip from './InfoTooltip';
import { calculationDefinitions } from '../data/calculationDefinitions';
import useMarketData from '../hooks/useMarketData';

const AssumptionsTable = ({ selectedScenario, multipliers }) => {
  const { marketData, loading, error } = useMarketData();
  
  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  // Format currency in millions
  const formatCurrency = (value) => {
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  // Format percentage with 1 decimal
  const formatPercent = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Years for the table
  const years = [2026, 2027, 2028];

  const multiplierRows = [
    { key: 'trafficMultiplier', label: 'Market Volume multiplier', tooltip: calculationDefinitions.trafficMultiplier },
    { key: 'regConversionMultiplier', label: 'Reg. conversion multiplier' },
    { key: 'paidConversionMultiplier', label: 'Market Share multiplier', tooltip: calculationDefinitions.paidConversionMultiplier },
    { key: 'b2cArpuMultiplier', label: 'B2C ARPU multiplier', tooltip: calculationDefinitions.b2cArpuMultiplier },
    { key: 'b2bClientsMultiplier', label: 'B2B clients multiplier', tooltip: calculationDefinitions.b2bClientsMultiplier },
    { key: 'b2bPriceMultiplier', label: 'B2B price multiplier' },
    { key: 'marketingSpendMultiplier', label: 'Marketing spend multiplier' },
    { key: 'hostingCostMultiplier', label: 'Hosting cost per user multiplier', tooltip: calculationDefinitions.hostingCostMultiplier },
    { key: 'gaMultiplier', label: 'G&A multiplier' }
  ];

  return (
    <div className="assumptions-table">
      <h3>Market Data</h3>
      {loading ? (
        <div className="loading">Loading market data...</div>
      ) : error ? (
        <div className="error">Error loading market data: {error}</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Metric</th>
                {years.map(year => (
                  <th key={year}>{year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="assumption-label">Global NFT Market Volume</td>
                {years.map(year => (
                  <td key={`volume-${year}`}>
                    {marketData.globalNftMarketVolume[year] ? formatCurrency(marketData.globalNftMarketVolume[year]) : 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="assumption-label">Market Share</td>
                {years.map(year => (
                  <td key={`share-${year}`}>
                    {marketData.marketShare[year] ? formatPercent(marketData.marketShare[year]) : 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="assumption-label">Average Fee</td>
                {years.map(year => (
                  <td key={`fee-${year}`}>
                    {marketData.avgFee[year] ? formatPercent(marketData.avgFee[year]) : 'N/A'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <h3>Scenario Multipliers</h3>
      <div className="table-container">
        <table className="table">
        <thead>
          <tr>
            <th>Scenarios</th>
            <th>Base (1)</th>
            <th>Upside (2)</th>
            <th>Downside (3)</th>
          </tr>
        </thead>
        <tbody>
          {multiplierRows.map((row) => (
            <tr key={row.key} className={selectedScenario === 'base' ? 'base-selected' : selectedScenario === 'upside' ? 'upside-selected' : 'downside-selected'}>
              <td className="assumption-label">
                {row.label}
                {row.tooltip && <InfoTooltip {...row.tooltip} />}
              </td>
              <td className={selectedScenario === 'base' ? 'selected-cell' : ''}>
                {formatPercentage(multipliers[row.key].base)}
              </td>
              <td className={selectedScenario === 'upside' ? 'selected-cell' : ''}>
                {formatPercentage(multipliers[row.key].upside)}
              </td>
              <td className={selectedScenario === 'downside' ? 'selected-cell' : ''}>
                {formatPercentage(multipliers[row.key].downside)}
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssumptionsTable;

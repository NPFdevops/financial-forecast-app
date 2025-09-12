import React from 'react';
import './AssumptionsTable.css';
import InfoTooltip from './InfoTooltip';
import { calculationDefinitions } from '../data/calculationDefinitions';

const AssumptionsTable = ({ selectedScenario, multipliers }) => {
  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(0)}%`;
  };


  const multiplierRows = [
    { key: 'trafficMultiplier', label: 'Traffic multiplier', tooltip: calculationDefinitions.trafficMultiplier },
    { key: 'regConversionMultiplier', label: 'Reg. conversion multiplier' },
    { key: 'paidConversionMultiplier', label: 'Paid conversion multiplier', tooltip: calculationDefinitions.paidConversionMultiplier },
    { key: 'b2cArpuMultiplier', label: 'B2C ARPU multiplier', tooltip: calculationDefinitions.b2cArpuMultiplier },
    { key: 'b2bClientsMultiplier', label: 'B2B clients multiplier', tooltip: calculationDefinitions.b2bClientsMultiplier },
    { key: 'b2bPriceMultiplier', label: 'B2B price multiplier' },
    { key: 'marketingSpendMultiplier', label: 'Marketing spend multiplier' },
    { key: 'hostingCostMultiplier', label: 'Hosting cost per user multiplier', tooltip: calculationDefinitions.hostingCostMultiplier },
    { key: 'gaMultiplier', label: 'G&A multiplier' }
  ];

  return (
    <div className="assumptions-table">
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

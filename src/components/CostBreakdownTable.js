import React from 'react';
import './CostBreakdownTable.css';

const CostBreakdownTable = ({ baseAssumptions }) => {
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const costCategories = [
    {
      key: 'marketingSpend',
      label: 'Marketing Spend',
      description: 'Monthly marketing and advertising expenses',
      data: baseAssumptions.costs.marketingSpend
    },
    {
      key: 'hostingCostPerUser',
      label: 'Hosting Cost per User',
      description: 'Monthly hosting and infrastructure costs per active user',
      data: baseAssumptions.costs.hostingCostPerUser
    },
    {
      key: 'gaFixed',
      label: 'General & Administrative',
      description: 'Monthly fixed G&A expenses (legal, accounting, etc.)',
      data: baseAssumptions.costs.gaFixed
    }
  ];

  return (
    <div className="cost-breakdown-table">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Cost Category</th>
              <th>2026 (Monthly)</th>
              <th>2027 (Monthly)</th>
              <th>2028 (Monthly)</th>
              <th>2028 Annual</th>
            </tr>
          </thead>
          <tbody>
            {costCategories.map((category) => (
              <tr key={category.key}>
                <td className="category-label">
                  <div className="category-name">
                    <strong>{category.label}</strong>
                  </div>
                  <div className="category-description">
                    {category.description}
                  </div>
                </td>
                <td className="cost-cell">
                  {formatCurrency(category.data[2026])}
                </td>
                <td className="cost-cell">
                  {formatCurrency(category.data[2027])}
                </td>
                <td className="cost-cell">
                  {formatCurrency(category.data[2028])}
                </td>
                <td className="cost-cell annual-cost">
                  <strong>{formatCurrency(category.data[2028] * 12)}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="cost-summary">
        <div className="summary-row">
          <span className="summary-label">Total Monthly Costs (2028):</span>
          <span className="summary-value">
            {formatCurrency(
              baseAssumptions.costs.marketingSpend[2028] + 
              baseAssumptions.costs.hostingCostPerUser[2028] + 
              baseAssumptions.costs.gaFixed[2028]
            )}
          </span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Total Annual Costs (2028):</span>
          <span className="summary-value total">
            <strong>
              {formatCurrency(
                (baseAssumptions.costs.marketingSpend[2028] + 
                 baseAssumptions.costs.hostingCostPerUser[2028] + 
                 baseAssumptions.costs.gaFixed[2028]) * 12
              )}
            </strong>
          </span>
        </div>
      </div>
      
      <div className="table-note">
        <p><strong>Note:</strong> All costs are baseline assumptions before scenario multipliers are applied. 
        Actual costs in financial projections vary based on selected scenario multipliers.</p>
      </div>
    </div>
  );
};

export default CostBreakdownTable;
import React from 'react';
import './B2BAssumptionsTable.css';

const B2BAssumptionsTable = ({ baseAssumptions }) => {
  const formatCurrency = (value) => {
    if (value === 0) return '$0';
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const tierLabels = {
    tierD: 'Tier D (Free)',
    tierC: 'Tier C (Basic)',
    tierB: 'Tier B (Pro)',
    tierA: 'Tier A (Enterprise)',
    tierAPlus: 'Tier A+ (Premium)'
  };

  return (
    <div className="b2b-assumptions-table">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Tier</th>
              <th>2026 Clients</th>
              <th>2027 Clients</th>
              <th>2028 Clients</th>
              <th>Monthly Price</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(baseAssumptions.b2bClients).map((tier) => (
              <tr key={tier}>
                <td className="tier-label">
                  <strong>{tierLabels[tier]}</strong>
                </td>
                <td>{baseAssumptions.b2bClients[tier][2026].toLocaleString()}</td>
                <td>{baseAssumptions.b2bClients[tier][2027].toLocaleString()}</td>
                <td>{baseAssumptions.b2bClients[tier][2028].toLocaleString()}</td>
                <td className="price-cell">
                  {formatCurrency(baseAssumptions.b2bPricing[tier][2026])}
                  {baseAssumptions.b2bPricing[tier][2027] !== baseAssumptions.b2bPricing[tier][2026] && (
                    <div className="price-evolution">
                      <small>
                        {formatCurrency(baseAssumptions.b2bPricing[tier][2027])} → {formatCurrency(baseAssumptions.b2bPricing[tier][2028])}
                      </small>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="table-note">
        <p><strong>Note:</strong> Client counts represent projected number of active subscribers per tier. 
        Pricing shows monthly subscription fees (annual contracts calculated as monthly × 12).</p>
      </div>
    </div>
  );
};

export default B2BAssumptionsTable;
import React from 'react';
import './PLTable.css';
import InfoTooltip from './InfoTooltip';
import { calculationDefinitions } from '../data/calculationDefinitions';

const PLTable = ({ selectedScenario, financialData }) => {
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  const years = [2026, 2027, 2028];

  return (
    <div className="pl-table">
      <table>
        <thead>
          <tr>
            <th>P&L by Scenario ({selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)})</th>
            <th>2026</th>
            <th>2027</th>
            <th>2028</th>
          </tr>
        </thead>
        <tbody>
          <tr className="revenue-section">
            <td className="section-header">
              Active paid users (B2C) (in Volume)
              <InfoTooltip {...calculationDefinitions.activePaidUsers} />
            </td>
            {years.map(year => (
              <td key={year}>{formatNumber(financialData[year].activePaidUsers)}</td>
            ))}
          </tr>
          <tr>
            <td>
              B2C Revenue ($/year)
              <InfoTooltip {...calculationDefinitions.b2cRevenue} />
            </td>
            {years.map(year => (
              <td key={year}>{formatCurrency(financialData[year].b2cRevenue)}</td>
            ))}
          </tr>
          <tr>
            <td>
              B2B/API Revenue ($/year)
              <InfoTooltip {...calculationDefinitions.b2bRevenue} />
            </td>
            {years.map(year => (
              <td key={year}>{formatCurrency(financialData[year].b2bRevenue)}</td>
            ))}
          </tr>
          <tr className="total-revenue">
            <td>
              <strong>Total Revenue ($/year)</strong>
              <InfoTooltip {...calculationDefinitions.totalRevenue} />
            </td>
            {years.map(year => (
              <td key={year}><strong>{formatCurrency(financialData[year].totalRevenue)}</strong></td>
            ))}
          </tr>
          <tr className="spacer">
            <td colSpan="4"></td>
          </tr>
          <tr>
            <td>COGS — Hosting ($/year)</td>
            {years.map(year => (
              <td key={year}>{formatCurrency(financialData[year].hostingCost)}</td>
            ))}
          </tr>
          <tr className="gross-margin">
            <td>
              <strong>Gross Margin ($/year)</strong>
              <InfoTooltip {...calculationDefinitions.grossMargin} />
            </td>
            {years.map(year => (
              <td key={year}><strong>{formatCurrency(financialData[year].grossMargin)}</strong></td>
            ))}
          </tr>
          <tr className="spacer">
            <td colSpan="4"></td>
          </tr>
          <tr>
            <td>Salaries ($/year)</td>
            {years.map(year => (
              <td key={year}>{formatCurrency(financialData[year].salaries)}</td>
            ))}
          </tr>
          <tr>
            <td>Marketing ($/year)</td>
            {years.map(year => (
              <td key={year}>{formatCurrency(financialData[year].marketing)}</td>
            ))}
          </tr>
          <tr>
            <td>G&A ($/year)</td>
            {years.map(year => (
              <td key={year}>{formatCurrency(financialData[year].ga)}</td>
            ))}
          </tr>
          <tr className="total-opex">
            <td>
              <strong>Opex Total ($/year)</strong>
              <InfoTooltip {...calculationDefinitions.totalOpex} />
            </td>
            {years.map(year => (
              <td key={year}><strong>{formatCurrency(financialData[year].totalOpex)}</strong></td>
            ))}
          </tr>
          <tr className="spacer">
            <td colSpan="4"></td>
          </tr>
          <tr className="ebitda">
            <td>
              <strong>EBITDA ($/year)</strong>
              <InfoTooltip {...calculationDefinitions.ebitda} />
            </td>
            {years.map(year => (
              <td key={year} className={financialData[year].ebitda >= 0 ? 'positive' : 'negative'}>
                <strong>{formatCurrency(financialData[year].ebitda)}</strong>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PLTable;

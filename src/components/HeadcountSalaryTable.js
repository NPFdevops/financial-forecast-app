import React from 'react';
import './HeadcountSalaryTable.css';

const HeadcountSalaryTable = ({ baseAssumptions }) => {
  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const roleLabels = {
    engineering: 'Engineering',
    dataML: 'Data & ML',
    productDesign: 'Product & Design',
    sales: 'Sales',
    marketing: 'Marketing',
    opsFinance: 'Operations & Finance'
  };

  const calculateTotalAnnualCost = (role, year) => {
    const headcount = baseAssumptions.headcount[role][year];
    const salary = baseAssumptions.salariesMonthly[role][year];
    return headcount * salary * 12;
  };

  const calculateYearTotals = (year) => {
    let totalHeadcount = 0;
    let totalMonthlyCost = 0;
    
    Object.keys(baseAssumptions.headcount).forEach(role => {
      const headcount = baseAssumptions.headcount[role][year];
      const salary = baseAssumptions.salariesMonthly[role][year];
      totalHeadcount += headcount;
      totalMonthlyCost += headcount * salary;
    });
    
    return { totalHeadcount, totalMonthlyCost };
  };

  return (
    <div className="headcount-salary-table">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Department</th>
              <th>2026 FTE</th>
              <th>2027 FTE</th>
              <th>2028 FTE</th>
              <th>Monthly Salary (2028)</th>
              <th>Annual Cost (2028)</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(baseAssumptions.headcount).map((role) => (
              <tr key={role}>
                <td className="role-label">
                  <strong>{roleLabels[role]}</strong>
                </td>
                <td className="headcount-cell">
                  {baseAssumptions.headcount[role][2026]}
                </td>
                <td className="headcount-cell">
                  {baseAssumptions.headcount[role][2027]}
                </td>
                <td className="headcount-cell">
                  {baseAssumptions.headcount[role][2028]}
                </td>
                <td className="salary-cell">
                  {formatCurrency(baseAssumptions.salariesMonthly[role][2028])}
                </td>
                <td className="annual-cost-cell">
                  <strong>
                    {formatCurrency(calculateTotalAnnualCost(role, 2028))}
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="headcount-summary">
        <div className="summary-grid">
          {[2026, 2027, 2028].map(year => {
            const totals = calculateYearTotals(year);
            return (
              <div key={year} className="year-summary">
                <h4>{year} Totals</h4>
                <div className="summary-item">
                  <span className="summary-label">Total FTE:</span>
                  <span className="summary-value">
                    <strong>{totals.totalHeadcount}</strong>
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Monthly Cost:</span>
                  <span className="summary-value">
                    {formatCurrency(totals.totalMonthlyCost)}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Annual Cost:</span>
                  <span className="summary-value annual-highlight">
                    <strong>{formatCurrency(totals.totalMonthlyCost * 12)}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="table-note">
        <p><strong>Note:</strong> FTE = Full-Time Equivalent employees. Salaries shown are monthly base salaries per employee. 
        Annual costs calculated as: Headcount × Monthly Salary × 12 months.</p>
      </div>
    </div>
  );
};

export default HeadcountSalaryTable;
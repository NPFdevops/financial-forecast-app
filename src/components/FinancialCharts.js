import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './FinancialCharts.css';

const FinancialCharts = ({ selectedScenario, financialData }) => {
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatTooltipCurrency = (value, name, props) => {
    return [formatCurrency(value), name];
  };

  // Prepare data for charts
  const chartData = [2026, 2027, 2028].map(year => ({
    year: year.toString(),
    'Total Revenue': financialData[year].totalRevenue,
    'B2C Revenue': financialData[year].b2cRevenue,
    'B2B Revenue': financialData[year].b2bRevenue,
    'Gross Margin': financialData[year].grossMargin,
    'EBITDA': financialData[year].ebitda,
    'Total Opex': financialData[year].totalOpex
  }));

  const scenarioName = selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1);

  return (
    <div className="financial-charts">
      <div className="charts-header">
        <h2>Financial Projections - {scenarioName} Scenario</h2>
        <p>Visual analysis of key financial metrics over time</p>
      </div>

      <div className="charts-grid">
        {/* Revenue Growth Chart */}
        <div className="chart-container">
          <h3>Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e5e9" />
              <XAxis 
                dataKey="year" 
                stroke="#6c757d"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="#6c757d"
                fontSize={12}
                fontWeight={500}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={formatTooltipCurrency}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Total Revenue" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#667eea', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="B2C Revenue" 
                stroke="#28a745" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#28a745', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="B2B Revenue" 
                stroke="#ffc107" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#ffc107', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* EBITDA Progression */}
        <div className="chart-container">
          <h3>EBITDA Progression</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e5e9" />
              <XAxis 
                dataKey="year" 
                stroke="#6c757d"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="#6c757d"
                fontSize={12}
                fontWeight={500}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={formatTooltipCurrency}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="EBITDA" 
                fill="#764ba2"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue vs Costs */}
        <div className="chart-container wide">
          <h3>Revenue vs Operating Expenses</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e5e9" />
              <XAxis 
                dataKey="year" 
                stroke="#6c757d"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="#6c757d"
                fontSize={12}
                fontWeight={500}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={formatTooltipCurrency}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="Gross Margin" 
                fill="#28a745"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Total Opex" 
                fill="#dc3545"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Summary Chart */}
        <div className="chart-container">
          <h3>Financial Summary</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e5e9" />
              <XAxis 
                dataKey="year" 
                stroke="#6c757d"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="#6c757d"
                fontSize={12}
                fontWeight={500}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={formatTooltipCurrency}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Gross Margin" 
                stroke="#17a2b8" 
                strokeWidth={3}
                dot={{ fill: '#17a2b8', strokeWidth: 2, r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="EBITDA" 
                stroke="#6f42c1" 
                strokeWidth={3}
                dot={{ fill: '#6f42c1', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialCharts;

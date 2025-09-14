// Calculation definitions for financial concepts
export const calculationDefinitions = {
  // Executive Summary
  totalRevenue: {
    title: 'Total Revenue',
    formula: 'B2C Revenue + B2B/API Revenue',
    description: 'Combined revenue from both consumer transactions and business API clients.',
    variables: [
      { name: 'B2C Revenue', description: 'Revenue from individual consumer transactions' },
      { name: 'B2B/API Revenue', description: 'Revenue from business clients across all tiers' }
    ]
  },

  b2cRevenue: {
    title: 'B2C Revenue',
    formula: 'Total Market Volume × Market Share Captured × Avg. Fee Charged',
    description: 'Annual revenue from consumer transactions based on market size and share.',
    variables: [
      { name: 'Total Market Volume', description: 'The total value of transactions in the market' },
      { name: 'Market Share Captured', description: 'The percentage of the market volume captured by the platform' },
      { name: 'Avg. Fee Charged', description: 'The average fee charged per transaction' }
    ]
  },

  b2bRevenue: {
    title: 'B2B/API Revenue',
    formula: 'Σ (Clients per Tier × Price per Tier × 12 months × B2B Multipliers)\n\nFor each tier: D, C, B, A, A+',
    description: 'Annual revenue from business clients across different pricing tiers.',
    variables: [
      { name: 'Tier D', description: 'Free tier (Lead generation)' },
      { name: 'Tier C', description: 'Basic API access ($588/month)' },
      { name: 'Tier B', description: 'Professional API ($2,388/month)' },
      { name: 'Tier A', description: 'Enterprise API ($7,188/month)' },
      { name: 'Tier A+', description: 'Premium Enterprise ($143,988/month)' },
      { name: 'B2B Clients Multiplier', description: 'Scenario-based client count adjustment' },
      { name: 'B2B Price Multiplier', description: 'Scenario-based pricing adjustment' }
    ]
  },

  activePaidUsers: {
    title: 'Active Paid Users (B2C)',
    formula: 'Traffic Sessions × Wallet Connection Rate × Paid Conversion Rate',
    description: 'Number of paying consumer subscribers.',
    variables: [
      { name: 'Traffic Sessions', description: 'Number of user sessions on the platform' },
      { name: 'Wallet Connection Rate', description: 'Percentage of sessions where a user connects their wallet' },
      { name: 'Paid Conversion Rate', description: 'Percentage of connected users who become paid subscribers' }
    ]
  },

  grossMargin: {
    title: 'Gross Margin',
    formula: 'Total Revenue - COGS (Hosting Costs)\n\nWhere:\nCOGS = Hosting Cost per User × Active Users × 12 × Hosting Multiplier',
    description: 'Revenue remaining after direct costs of service delivery.',
    variables: [
      { name: 'Total Revenue', description: 'Combined B2C and B2B revenue' },
      { name: 'Hosting Cost per User', description: 'Monthly infrastructure cost per active user' },
      { name: 'Hosting Multiplier', description: 'Scenario-based hosting cost adjustment' }
    ]
  },

  totalOpex: {
    title: 'Operating Expenses (Opex)',
    formula: 'Salaries + Marketing + G&A\n\nWhere:\nSalaries = Σ (Headcount × Monthly Salary × 12)\nMarketing = Monthly Spend × 12 × Marketing Multiplier\nG&A = Monthly Fixed Costs × 12 × G&A Multiplier',
    description: 'Total operating expenses including personnel, marketing, and administrative costs.',
    variables: [
      { name: 'Headcount', description: 'Employees by function (Engineering, Sales, etc.)' },
      { name: 'Monthly Salary', description: 'Average salary per role per month' },
      { name: 'Marketing Spend', description: 'Monthly marketing budget' },
      { name: 'G&A Fixed Costs', description: 'General & Administrative expenses' },
      { name: 'Marketing Multiplier', description: 'Scenario-based marketing spend adjustment' },
      { name: 'G&A Multiplier', description: 'Scenario-based G&A cost adjustment' }
    ]
  },

  ebitda: {
    title: 'EBITDA',
    formula: 'Gross Margin - Operating Expenses (Opex)\n\nEBITDA = Earnings Before Interest, Taxes, Depreciation, and Amortization',
    description: 'Core profitability metric showing operational performance before financial and accounting adjustments.',
    variables: [
      { name: 'Gross Margin', description: 'Revenue minus direct costs (hosting)' },
      { name: 'Operating Expenses', description: 'Salaries + Marketing + G&A costs' }
    ]
  },

  yearEndCash: {
    title: 'Year-end Cash',
    formula: 'Starting Cash + Equity Raises + EBITDA\n\n(Previous Year Cash + Current Year Funding + Current Year EBITDA)',
    description: 'Cash position at the end of each year including operations and funding.',
    variables: [
      { name: 'Starting Cash', description: 'Cash balance at beginning of year' },
      { name: 'Equity Raises', description: 'Planned funding rounds for the year' },
      { name: 'EBITDA', description: 'Annual earnings (positive adds cash, negative burns cash)' }
    ]
  },

  runway: {
    title: 'Runway (months)',
    formula: 'IF EBITDA ≥ 0: ∞ (infinite)\nIF EBITDA < 0: (Available Cash) ÷ (|EBITDA| ÷ 12)\n\nAvailable Cash = Starting Cash + Planned Raises',
    description: 'Months of operation possible at current burn rate before running out of cash.',
    variables: [
      { name: 'Available Cash', description: 'Starting cash plus any planned funding' },
      { name: 'Monthly Burn', description: 'Negative EBITDA divided by 12 months' },
      { name: 'EBITDA', description: 'If positive, runway is infinite (profitable)' }
    ]
  },

  // Scenario Multipliers

  b2cAvgFeeMultiplier: {
    title: 'B2C Avg. Fee Multiplier',
    formula: 'Base Avg. Fee × Multiplier = Adjusted Avg. Fee',
    description: 'Adjusts the average B2C transaction fee for different scenarios.',
    variables: [
      { name: 'Base Avg. Fee', description: 'Baseline average transaction fee' },
      { name: 'Multiplier', description: 'Scenario-based adjustment' }
    ]
  },

  b2bClientsMultiplier: {
    title: 'B2B Clients Multiplier',
    formula: 'Base Client Count × Clients Multiplier = Adjusted Clients',
    description: 'Adjusts B2B client acquisition for different market scenarios.',
    variables: [
      { name: 'Base Client Count', description: 'Baseline B2B clients by tier' },
      { name: 'Multiplier', description: 'Scenario-based client growth adjustment' }
    ]
  },

  hostingCostMultiplier: {
    title: 'Hosting Cost Multiplier',
    formula: 'Base Hosting Cost × Cost Multiplier = Adjusted Cost',
    description: 'Adjusts infrastructure costs for different usage patterns and scaling scenarios.',
    variables: [
      { name: 'Base Hosting Cost', description: 'Baseline monthly cost per user' },
      { name: 'Multiplier', description: 'Scenario-based cost efficiency adjustment' }
    ]
  }
};

export default calculationDefinitions;

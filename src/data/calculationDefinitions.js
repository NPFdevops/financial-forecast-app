// Calculation definitions for financial concepts
export const calculationDefinitions = {
  // Executive Summary
  totalRevenue: {
    title: 'Total Revenue',
    formula: 'B2C Revenue + B2B/API Revenue',
    description: 'Combined revenue from both consumer subscriptions and business API clients.',
    variables: [
      { name: 'B2C Revenue', description: 'Revenue from individual consumer subscriptions' },
      { name: 'B2B/API Revenue', description: 'Revenue from business clients across all tiers' }
    ]
  },

  b2cRevenue: {
    title: 'B2C Revenue',
    formula: 'Active Paid Users × B2C ARPU × 12 months\n\nWhere:\nActive Paid Users = Traffic × Wallet Connection Rate × Paid Conversion Rate × Traffic Multiplier × Paid Conversion Multiplier',
    description: 'Annual revenue from consumer subscriptions based on user acquisition and pricing.',
    variables: [
      { name: 'Traffic', description: 'Monthly website/app sessions' },
      { name: 'Wallet Connection Rate', description: 'Percentage of visitors who connect wallets' },
      { name: 'Paid Conversion Rate', description: 'Percentage of connected users who subscribe' },
      { name: 'B2C ARPU', description: 'Average Revenue Per User (monthly subscription)' },
      { name: 'Traffic Multiplier', description: 'Scenario-based adjustment to traffic' },
      { name: 'Paid Conversion Multiplier', description: 'Scenario-based conversion adjustment' }
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
    formula: 'Traffic Sessions × Wallet Connection Rate × Paid Conversion Rate × Scenario Multipliers',
    description: 'Number of paying consumer subscribers based on traffic conversion funnel.',
    variables: [
      { name: 'Traffic Sessions', description: 'Monthly website/app visitors' },
      { name: 'Wallet Connection Rate', description: 'Users who connect crypto wallets (%)' },
      { name: 'Paid Conversion Rate', description: 'Connected users who subscribe (%)' },
      { name: 'Traffic Multiplier', description: 'Scenario adjustment for traffic volume' },
      { name: 'Conversion Multiplier', description: 'Scenario adjustment for conversion rates' }
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
  trafficMultiplier: {
    title: 'Traffic Multiplier',
    formula: 'Base Traffic × Traffic Multiplier = Adjusted Traffic',
    description: 'Adjusts base traffic assumptions for different scenarios (Base=100%, Upside=120%, Downside=80%).',
    variables: [
      { name: 'Base Traffic', description: 'Baseline monthly sessions assumption' },
      { name: 'Multiplier', description: 'Scenario-specific adjustment factor' }
    ]
  },

  paidConversionMultiplier: {
    title: 'Paid Conversion Multiplier',
    formula: 'Base Conversion Rate × Conversion Multiplier = Adjusted Rate',
    description: 'Adjusts conversion rates for different market conditions and scenarios.',
    variables: [
      { name: 'Base Conversion Rate', description: 'Baseline paid subscription conversion' },
      { name: 'Multiplier', description: 'Scenario-based conversion adjustment' }
    ]
  },

  b2cArpuMultiplier: {
    title: 'B2C ARPU Multiplier',
    formula: 'Base ARPU × ARPU Multiplier = Adjusted ARPU',
    description: 'Adjusts average revenue per user for pricing power in different scenarios.',
    variables: [
      { name: 'Base ARPU', description: 'Baseline monthly subscription price' },
      { name: 'Multiplier', description: 'Scenario-based pricing adjustment' }
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
